/** @type {import('next').NextConfig} */
const nextConfig = {
  // O motor 3D/GSAP é imperativo (WebGL + DOM). O StrictMode do dev montaria
  // tudo duas vezes (dois contextos WebGL e dois loaders), então fica desligado.
  reactStrictMode: false,
};

export default nextConfig;
