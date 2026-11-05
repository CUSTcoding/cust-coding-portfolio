# cust coding — Portfólio (Next.js + Three.js + Tailwind + TSX)

Portfólio 3D com loader "breach protocol", PC em chamas, Skill Tree no monitor e tema verde.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Onde mexer
- `src/config/texts.ts` — **todo o conteúdo** (nome, hero, serviços, projetos, skills/perks, contacto).
  Procure por `TODO`: links de redes, CV, números dos contadores, email, telefone.
- `public/theme.css` — cores (`--accent`), fonte e estilos dos componentes novos.
- `public/styles.css` — CSS base do site (já recolorido para verde/azul).
- `public/cv-*.pdf` — coloque o seu CV e aponte `hero.cv.href` para ele.

## Contador de commits do GitHub
O número de commits do Hero é carregado pela rota server-side `/api/github-commits` e atualizado no contador animado. A rota tenta usar `GITHUB_TOKEN` se estiver configurado; sem token, ou se a consulta autenticada falhar, usa a API pública do GitHub. Se ambas as consultas falharem, o Hero mantém o valor de fallback definido em `texts.hero.stats`. As respostas da API do GitHub são revalidadas a cada hora.

Para usar a consulta autenticada localmente, crie `.env.local` na raiz do projeto e adicione o token:

```env
GITHUB_TOKEN=seu_token_pessoal_do_github
```

Reinicie o servidor depois de alterar variáveis de ambiente. O token é lido apenas no servidor e não deve ter o prefixo `NEXT_PUBLIC_`. Nunca o coloque no código, em logs, no repositório ou num ficheiro `.env` commitado. Os ficheiros `.env*` são ignorados pelo Git; mantenha o `.env.local` privado.

Sem token, o GitHub fornece a contagem de commits públicos encontrados pela pesquisa de commits, que pode diferir do total de contribuições exibido no perfil. Com token, a rota consulta as contribuições da conta `CUSTcoding` através da API GraphQL.

## Estrutura
- `src/components/Portfolio.tsx` — loader → home e arranque do motor 3D
- `src/components/sections/` — Hero, Stats, Sobre, Servicos, Experiencia (abas), Projetos, Skills, Contato
- `src/components/skills/` — SkillTree e PerkView
- `src/lib/engine/` — Three.js (cena, fogo, explosão, monitor), GSAP, rail, skill tree, painéis
- `public/icons/` — ícones locais (Simple Icons, Lucide, Tabler)
