const GITHUB_LOGIN = "CUSTcoding";
const CACHE_SECONDS = 3600;

export const dynamic = "force-dynamic";

async function getAuthenticatedCommitCount(token: string): Promise<number | null> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
          }
        }
      }`,
      variables: {
        login: GITHUB_LOGIN,
        from: "2008-01-01T00:00:00Z",
        to: new Date().toISOString(),
      },
    }),
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) return null;

  const result = await response.json();
  const count = result?.data?.user?.contributionsCollection?.totalCommitContributions;
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

async function getPublicCommitCount(): Promise<number | null> {
  const url = new URL("https://api.github.com/search/commits");
  url.searchParams.set("q", `author:${GITHUB_LOGIN}`);
  url.searchParams.set("per_page", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) return null;

  const result = await response.json();
  const count = result?.total_count;
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  let count: number | null = null;

  if (token) {
    try {
      count = await getAuthenticatedCommitCount(token);
    } catch {
      count = null;
    }
  }

  if (count === null) {
    try {
      count = await getPublicCommitCount();
    } catch {
      count = null;
    }
  }

  if (count === null) {
    return Response.json({ error: "GitHub commit count is temporarily unavailable." }, { status: 502 });
  }

  return Response.json({ count }, { headers: { "Cache-Control": "private, no-store" } });
}