// @ts-nocheck
/* eslint-disable */
// Portado de script.js (site original) para módulo TypeScript.
// Lógica e valores mantidos; só mudou a embalagem (módulos, estado partilhado).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { engine } from "./state";
import { setupModelControlsDirect } from "./controls";

/** Cena 3D (monitor retro), PC em chamas, explosão, tela do monitor e scroll cinemático. */
export function initScene(): () => void {
  const cleanups: Array<() => void> = [];
  let stopped = false;
  let loopId = 0;

  gsap.registerPlugin(ScrollTrigger);

  // Cabeçalho que some no scroll - integrado com scroll do modelo
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header");

    gsap.registerPlugin(ScrollTrigger);


    // 1) BACKDROP (shader simples)
    const bgCanvas = document.getElementById("hero-canvas");
    const fxCanvas = document.getElementById("fx-canvas");

    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Background shader removido - usando CSS background

    // 2D FX scanlines
    function renderFX() {
      if (!fxCanvas) return;
      const ctx = fxCanvas.getContext("2d");
      const w = (fxCanvas.width = innerWidth * devicePixelRatio);
      const h = (fxCanvas.height = innerHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.08;
      for (let y = 0; y < h; y += 3 * devicePixelRatio) {
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(0, y, w, 1 * devicePixelRatio);
      }
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#2a7cff";
      ctx.fillRect(0, 0, w, 2 * devicePixelRatio);
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(0, h - 2 * devicePixelRatio, w, 2 * devicePixelRatio);
    }
    renderFX();

    // 2) CENA DO MODELO - Configuração otimizada para PERFORMANCE
    let modelRenderer,
      modelScene,
      modelCamera,
      model = null,
      modelLoaded = false,
      modelExplosionTriggered = false,
      modelExplosionActive = false, // Se a explosão está em andamento
      fireLight = null, // luz do fogo sobre o monitor
      pendingExplosion = false;


    async function initModel3D() {

      modelRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });

      modelRenderer.setPixelRatio(1);
      engine.modelRenderer = modelRenderer;
      modelRenderer.setSize(innerWidth, innerHeight);

      // Configurações OTIMIZADAS para performance
      modelRenderer.shadowMap.enabled = false; // Desabilitar sombras para performance
      modelRenderer.outputColorSpace = THREE.SRGBColorSpace;
      modelRenderer.toneMapping = THREE.NoToneMapping; // Sem tone mapping para performance
      modelRenderer.powerPreference = "high-performance";

      const modelWrapper = document.getElementById("model-wrapper");

      if (modelWrapper) {
        modelWrapper.appendChild(modelRenderer.domElement);
        modelRenderer.domElement.style.opacity = "0";
      } else {
        console.error("Model wrapper não encontrado!");
        return;
      }

      modelScene = new THREE.Scene();
      modelCamera = new THREE.PerspectiveCamera(
        75,
        innerWidth / innerHeight,
        0.1,
        1000
      );
      modelCamera.position.set(0, 0, 10);
      engine.modelCamera = modelCamera;

      // Iluminação OTIMIZADA (sem sombras)
      const ambientLight = new THREE.AmbientLight(0x606060, 1.5);
      modelScene.add(ambientLight);

      // Luz direcional simples (sem sombras)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(0, 5, 10);
      modelScene.add(dirLight);

      // Luz cyberpunk (sem sombras)
      const cyberpunkLight = new THREE.PointLight(0x00e5ff, 1.0, 50);
      cyberpunkLight.position.set(0, 5, 5);
      modelScene.add(cyberpunkLight);

      // Luz de preenchimento
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight.position.set(0, 0, 5);
      modelScene.add(fillLight);

      // Luz do fogo: existe desde o início (com intensidade 0) para não
      // mudar a contagem de luzes depois e forçar recompilação dos shaders
      fireLight = new THREE.PointLight(0x00ff95, 0, 80, 1);
      modelScene.add(fireLight);

      // GLB loader otimizado para carregamento rápido
      const draco = new DRACOLoader();
      draco.setDecoderPath(
        "https://unpkg.com/three@0.161.0/examples/jsm/libs/draco/"
      );
      draco.setWorkerLimit(2); // Aumentar workers para carregamento mais rápido
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(draco);

      // Texturas em WebP; no celular, versão com texturas de 512px (~4,6 MB
      // contra ~7 MB). O original, com PNG/JPEG, fica em backups/.
      const modelUrl =
        window.innerWidth <= 768 ? "/retro_computer.mobile.glb" : "/retro_computer.glb";

      gltfLoader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;

          // posicionar com valores da imagem
          model.scale.set(1.0, 1.0, 1.0);

          // Center the model first
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Then apply the desired position
          model.position.set(0, -11.3, -8.4);
          model.rotation.set(0.3, 0.6, 0.0);

          // Configuração para qualidade visual
          // Configurações OTIMIZADAS para performance
          model.traverse((o) => {
            if (o.isMesh && o.material) {
              // Configurações básicas
              o.material.transparent = false;
              o.material.side = THREE.FrontSide; // Apenas frente para performance

              // Texturas com configurações otimizadas
              if (o.material.map) {
                o.material.map.generateMipmaps = true;
                o.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                o.material.map.anisotropy = 2; // Reduzido de 4 para 2
              }

              // Desabilitar normal maps para performance (opcional)
              // o.material.normalMap = null;

              // Propriedades PBR simplificadas
              o.material.roughness = 0.8;
              o.material.metalness = 0.2;

              // Efeito emissive cyberpunk (mantido)
              o.material.emissive = new THREE.Color(0x001133);
              o.material.emissiveIntensity = 0.4;

              // Sem sombras para performance
              o.castShadow = false;
              o.receiveShadow = false;
              o.frustumCulled = true;
            }
          });

          modelScene.add(model);
          modelLoaded = true;
          engine.model = model;
          engine.modelLoaded = true;

          if (pendingExplosion && !modelExplosionActive) {
            triggerModelExplosion();
          }

          // Pixel ratio conservador para performance
          modelRenderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          modelRenderer.setSize(innerWidth, innerHeight);
          // Garante que os listeners do painel sejam conectados após o modelo existir
          try {
            setTimeout(setupModelControlsDirect, 0);
          } catch (_) {}

          // Aplicar posição inicial imediatamente
          applyInitialPosition();

          // Configurar animação de scroll
          setupScrollAnimation();

          // Skill tree na tela do monitor (desktop)
          try {
            setupMonitorScreen();
          } catch (err) {
            console.warn("Tela do monitor indisponível:", err);
          }

          // PC em chamas: fogo sobre o monitor e a tela com a história
          try {
            setupBurningPc();
          } catch (err) {
            console.warn("PC em chamas indisponível:", err);
          }

          // Preparar a explosão com folga, fora do quadro do disparo
          const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 800));
          idle(() => warmUpExplosion(), { timeout: 3000 });

          // Forçar renderização inicial
          modelRenderer.render(modelScene, modelCamera);
          try {
            gsap.to(modelRenderer.domElement, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
          } catch (_) {}
        },
        undefined,
        (err) => console.error("GLB load error:", err)
      );

    }

    // ============================================
    // EXPLOSÃO / REMONTAGEM
    // Mesmo movimento da versão original (direção aleatória de 15–30
    // unidades, giro caótico, 1.8–2.2s em power2.out; volta em 1.2–1.5s
    // com power2.inOut), mas guiado por um único relógio (explosion.time)
    // em vez de três tweens por peça. Os materiais nunca são clonados nem
    // trocados para transparentes (isso compilava shaders no quadro do
    // disparo): as peças somem encolhendo, com a mesma curva do fade antigo,
    // e o fogo continua visível por cima.
    // ============================================
    const explosion = {
      state: "idle", // idle | exploding | exploded | assembling
      time: 0,
      tween: null,
      parts: [],
      prepared: false,
      size: 1,
      origin: null, // centro da tela do monitor, no espaço do modelo
      visible: 1, // 1 = peças inteiras, 0 = encolhidas
      visibleFrom: 1,
      finalFrameDrawn: false,
    };

    const easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
    const easeInOutQuad = (x) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

    function prepareExplosion() {
      if (explosion.prepared || !model) return;
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      explosion.size = box.getSize(new THREE.Vector3()).length();

      // A explosão nasce na tela do monitor, não no meio do modelo inteiro
      const screen = locateScreen();
      if (screen) {
        explosion.origin = screen.found.corners
          .reduce((acc, p) => acc.add(p), new THREE.Vector3())
          .multiplyScalar(0.25);
      } else {
        const center = box.getCenter(new THREE.Vector3());
        center.y += box.getSize(new THREE.Vector3()).y * 0.15;
        explosion.origin = model.worldToLocal(center);
      }

      model.traverse((mesh) => {
        if (!mesh.isMesh || mesh.userData.noExplode) return;
        explosion.parts.push({
          mesh,
          basePos: mesh.position.clone(),
          baseRot: mesh.rotation.clone(),
          baseScale: mesh.scale.clone(),
          dir: new THREE.Vector3(),
          spin: new THREE.Vector3(),
          duration: 2,
          backDuration: 1.3,
          k: 0, // quanto a peça já se afastou (0 = no lugar, 1 = no destino)
          kFrom: 0,
        });
      });
      explosion.prepared = true;
    }

    // Sorteia um novo destino a cada explosão, como antes
    function randomizeParts() {
      for (const part of explosion.parts) {
        part.dir
          .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize()
          .multiplyScalar(15 + Math.random() * 15);
        part.spin.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
        part.duration = 1.8 + Math.random() * 0.4;
        part.backDuration = 1.2 + Math.random() * 0.3;
      }
    }

    function placePart(part, scale) {
      const { mesh, basePos, baseRot, baseScale, dir, spin, k } = part;
      mesh.position.set(
        basePos.x + dir.x * k,
        basePos.y + dir.y * k,
        basePos.z + dir.z * k
      );
      mesh.rotation.set(
        baseRot.x + spin.x * k,
        baseRot.y + spin.y * k,
        baseRot.z + spin.z * k
      );
      mesh.scale.set(baseScale.x * scale, baseScale.y * scale, baseScale.z * scale);
    }

    function applyExploding() {
      const time = explosion.time;
      // Curva do fade antigo: começa em 0.2s, dura ~1.6s, power2.in
      const fade = Math.min(1, Math.max(0, (time - 0.2) / 1.6));
      explosion.visible = explosion.visibleFrom * (1 - fade * fade);
      const scale = Math.max(0.001, explosion.visible);
      for (const part of explosion.parts) {
        const local = Math.min(1, time / part.duration);
        part.k = part.kFrom + (1 - part.kFrom) * easeOutQuad(local);
        placePart(part, scale);
      }
    }

    function applyAssembling() {
      const time = explosion.time;
      // Volta a aparecer em ~0.8s, power2.out
      explosion.visible =
        explosion.visibleFrom +
        (1 - explosion.visibleFrom) * easeOutQuad(Math.min(1, time / 0.8));
      const scale = Math.max(0.001, explosion.visible);
      for (const part of explosion.parts) {
        const local = Math.min(1, time / part.backDuration);
        part.k = part.kFrom * (1 - easeInOutQuad(local));
        placePart(part, scale);
      }
    }

    // Deixa tudo pronto logo depois do carregamento, fora do quadro do disparo
    function warmUpExplosion() {
      try {
        prepareExplosion();
        ensureExplosionFx();
        // Os efeitos ficam sempre na cena, só que vazios. compile() apenas
        // dispara a compilação: o link do shader termina no primeiro render
        // que usa o programa. Com os efeitos já na cena, esse custo cai num
        // quadro qualquer depois do carregamento, e não no quadro do disparo.
        if (modelRenderer.compileAsync) {
          modelRenderer.compileAsync(modelScene, modelCamera).catch(() => {});
        } else {
          modelRenderer.compile(modelScene, modelCamera);
        }
      } catch (err) {
        console.warn("Pré-aquecimento da explosão falhou (safe):", err);
      }
    }

    // Antes de explodir, o sistema entra em sobrecarga por um instante:
    // a tela pisca SOBRECARGA, o fogo volta com tudo e o PC treme.
    const OVERLOAD_MS = 850;
    function triggerModelExplosion() {
      if (!model) return;
      if (["overload", "exploding", "exploded"].includes(explosion.state)) return;
      modelExplosionTriggered = true;
      modelExplosionActive = true;
      setMonitorActive(false);
      // no meio da remontagem explode direto, sem repetir a sobrecarga
      if (explosion.state === "assembling") {
        detonateModel();
        return;
      }
      explosion.state = "overload";
      explosion.overloadStart = performance.now();
      if (explosion.overloadCall) explosion.overloadCall.kill();
      explosion.overloadCall = gsap.delayedCall(OVERLOAD_MS / 1000, detonateModel);
    }

    function detonateModel() {
      explosion.overloadCall = null;
      prepareExplosion();
      // Com o modelo inteiro, sorteia novos destinos; se a remontagem ainda
      // estava no meio, as peças voltam a se afastar pelo mesmo caminho.
      if (explosion.state !== "assembling") randomizeParts();

      for (const part of explosion.parts) part.kFrom = part.k;
      explosion.visibleFrom = explosion.visible;
      explosion.state = "exploding";
      explosion.finalFrameDrawn = false;
      explosion.time = 0;
      spawnExplosionFx();

      if (explosion.tween) explosion.tween.kill();
      explosion.tween = gsap.to(explosion, {
        time: 2.2,
        duration: 2.2,
        ease: "none",
        onUpdate: applyExploding,
        onComplete: () => {
          explosion.state = "exploded";
        },
      });
    }

    function reverseModelExplosion() {
      // voltou antes de explodir: só cancela a sobrecarga
      if (explosion.state === "overload") {
        if (explosion.overloadCall) explosion.overloadCall.kill();
        explosion.overloadCall = null;
        explosion.state = "idle";
        modelExplosionActive = false;
        modelExplosionTriggered = false;
        return;
      }
      if (!model || !explosion.prepared) return;
      if (explosion.state === "idle" || explosion.state === "assembling") return;

      clearExplosionFx();
      for (const part of explosion.parts) part.kFrom = part.k;
      explosion.state = "assembling";
      updateModelOnScroll();
      explosion.visibleFrom = explosion.visible;
      explosion.time = 0;

      if (explosion.tween) explosion.tween.kill();
      explosion.tween = gsap.to(explosion, {
        time: 1.5,
        duration: 1.5,
        ease: "none",
        onUpdate: applyAssembling,
        onComplete: () => {
          explosion.state = "idle";
          modelExplosionActive = false;
          modelExplosionTriggered = false;
        },
      });
    }

    // --- Fogo: clarão + bola de fogo + brasas + fumaça ---
    // Três nuvens de pontos com um shader próprio (tamanho, cor e giro por
    // partícula). Tudo é criado uma vez e reaproveitado entre explosões.
    const FX_VERTEX = `
      attribute float aSize;
      attribute float aRot;
      attribute vec4 aColor;
      uniform float uHalfHeight;
      uniform float uMaxSize;
      varying vec4 vColor;
      varying float vRot;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = min(aSize * projectionMatrix[1][1] * uHalfHeight / -mv.z, uMaxSize);
        vColor = aColor;
        vRot = aRot;
      }
    `;
    const FX_FRAGMENT = `
      uniform sampler2D uMap;
      varying vec4 vColor;
      varying float vRot;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float c = cos(vRot);
        float s = sin(vRot);
        p = mat2(c, -s, s, c) * p + 0.5;
        vec4 tex = texture2D(uMap, p);
        float a = tex.a * vColor.a;
        if (a < 0.004) discard;
        gl_FragColor = vec4(vColor.rgb * tex.rgb, a);
      }
    `;

    const explosionFx = {
      fire: null,
      smoke: null,
      embers: null,
      active: false,
      elapsed: 0,
      origin: new THREE.Vector3(),
      viewDir: new THREE.Vector3(),
    };

    function canvasTexture(size, draw) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      draw(canvas.getContext("2d"), size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    }

    // Labareda: vários "gomos" sobrepostos, para não parecer uma bola lisa
    function puffTexture() {
      return canvasTexture(128, (ctx, s) => {
        const blob = (x, y, r, a) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(0.5, `rgba(255,255,255,${a * 0.45})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, s, s);
        };
        blob(s / 2, s / 2, s * 0.42, 0.9);
        for (let i = 0; i < 9; i++) {
          const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.5;
          const dist = s * (0.08 + Math.random() * 0.14);
          blob(
            s / 2 + Math.cos(angle) * dist,
            s / 2 + Math.sin(angle) * dist,
            s * (0.14 + Math.random() * 0.12),
            0.35 + Math.random() * 0.3
          );
        }
        // textura granulada, some nas bordas
        ctx.globalCompositeOperation = "destination-out";
        for (let i = 0; i < 260; i++) {
          ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.22})`;
          const r = Math.random() * s * 0.035 + 1;
          ctx.beginPath();
          ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    function glowTexture() {
      return canvasTexture(32, (ctx, s) => {
        const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.45, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      });
    }

    function createFxCloud(count, map, blending, renderOrder) {
      const geometry = new THREE.BufferGeometry();
      const attr = (itemSize) => {
        const a = new THREE.BufferAttribute(new Float32Array(count * itemSize), itemSize);
        a.setUsage(THREE.DynamicDrawUsage);
        return a;
      };
      geometry.setAttribute("position", attr(3));
      geometry.setAttribute("aSize", attr(1));
      geometry.setAttribute("aRot", attr(1));
      geometry.setAttribute("aColor", attr(4));
      geometry.setDrawRange(0, 0);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: map },
          uHalfHeight: { value: 450 },
          uMaxSize: { value: 300 },
        },
        vertexShader: FX_VERTEX,
        fragmentShader: FX_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      points.renderOrder = renderOrder;
      points.userData = {
        count,
        velocity: new Float32Array(count * 3),
        age: new Float32Array(count),
        life: new Float32Array(count),
        delay: new Float32Array(count),
        size0: new Float32Array(count),
        size1: new Float32Array(count),
        spin: new Float32Array(count),
        flash: new Uint8Array(count),
      };
      modelScene.add(points);
      return points;
    }

    function ensureExplosionFx() {
      if (explosionFx.fire || !modelScene) return;
      const puff = puffTexture();
      explosionFx.smoke = createFxCloud(32, puff, THREE.NormalBlending, 9);
      explosionFx.fire = createFxCloud(44, puff, THREE.AdditiveBlending, 10);
      explosionFx.embers = createFxCloud(90, glowTexture(), THREE.AdditiveBlending, 11);
    }

    const randomDir = (out) => {
      out.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      if (out.lengthSq() < 1e-6) out.set(0, 1, 0);
      return out.normalize();
    };

    function seedCloud(cloud, setup) {
      const d = cloud.userData;
      const pos = cloud.geometry.attributes.position.array;
      const rot = cloud.geometry.attributes.aRot.array;
      const col = cloud.geometry.attributes.aColor.array;
      const dir = new THREE.Vector3();
      for (let i = 0; i < d.count; i++) {
        const p = setup(i, randomDir(dir));
        // quase nada vem na direção da câmera: evita labaredas gigantes na tela
        const view = explosionFx.viewDir;
        p.velocity.addScaledVector(view, -p.velocity.dot(view) * 0.85);
        p.offset.addScaledVector(view, -p.offset.dot(view) * 0.85);
        pos[i * 3] = explosionFx.origin.x + p.offset.x;
        pos[i * 3 + 1] = explosionFx.origin.y + p.offset.y;
        pos[i * 3 + 2] = explosionFx.origin.z + p.offset.z;
        d.velocity[i * 3] = p.velocity.x;
        d.velocity[i * 3 + 1] = p.velocity.y;
        d.velocity[i * 3 + 2] = p.velocity.z;
        d.age[i] = 0;
        d.life[i] = p.life;
        d.delay[i] = p.delay;
        d.size0[i] = p.size0;
        d.size1[i] = p.size1;
        d.spin[i] = (Math.random() - 0.5) * 2.4;
        d.flash[i] = p.flash ? 1 : 0;
        rot[i] = Math.random() * Math.PI * 2;
        col[i * 4 + 3] = 0;
      }
      for (const name of ["position", "aRot", "aColor"]) {
        cloud.geometry.attributes[name].needsUpdate = true;
      }
      cloud.geometry.setDrawRange(0, d.count);
    }

    function spawnExplosionFx() {
      if (!modelScene || !model) return;
      ensureExplosionFx();
      const S = explosion.size || 10;

      model.updateMatrixWorld(true);
      explosionFx.origin.copy(explosion.origin);
      model.localToWorld(explosionFx.origin);
      modelCamera.getWorldDirection(explosionFx.viewDir);

      const halfHeight = modelRenderer.getDrawingBufferSize(new THREE.Vector2()).y / 2;
      for (const cloud of [explosionFx.fire, explosionFx.smoke, explosionFx.embers]) {
        cloud.material.uniforms.uHalfHeight.value = halfHeight;
        cloud.material.uniforms.uMaxSize.value = halfHeight * 0.55;
      }

      const v = () => new THREE.Vector3();
      // Bola de fogo: os 4 primeiros são o clarão inicial
      seedCloud(explosionFx.fire, (i, dir) => {
        if (i < 4) {
          return {
            offset: v(),
            velocity: v(),
            life: 0.14 + i * 0.03,
            delay: 0,
            size0: S * 0.12,
            size1: S * 0.24,
            flash: true,
          };
        }
        const speed = S * (0.07 + Math.random() * 0.2);
        return {
          offset: dir.clone().multiplyScalar(S * 0.03 * Math.random()),
          velocity: dir.clone().multiplyScalar(speed).add(v().set(0, S * 0.08, 0)),
          life: 0.6 + Math.random() * 0.5,
          delay: Math.random() * 0.1,
          size0: S * (0.04 + Math.random() * 0.02),
          size1: S * (0.09 + Math.random() * 0.05),
        };
      });
      // Fumaça: entra depois do fogo, sobe e se espalha
      seedCloud(explosionFx.smoke, (i, dir) => ({
        offset: dir.clone().multiplyScalar(S * 0.08 * Math.random()),
        velocity: dir
          .clone()
          .multiplyScalar(S * (0.06 + Math.random() * 0.14))
          .add(v().set(0, S * 0.12, 0)),
        life: 1.2 + Math.random() * 0.6,
        delay: 0.12 + Math.random() * 0.3,
        size0: S * 0.06,
        size1: S * (0.13 + Math.random() * 0.05),
      }));
      // Brasas: rápidas, caem com a gravidade
      seedCloud(explosionFx.embers, (i, dir) => ({
        offset: dir.clone().multiplyScalar(S * 0.05 * Math.random()),
        velocity: dir
          .clone()
          .multiplyScalar(S * (0.35 + Math.random() * 0.8))
          .add(v().set(0, S * 0.22, 0)),
        life: 0.6 + Math.random() * 1.0,
        delay: Math.random() * 0.1,
        size0: S * (0.0022 + Math.random() * 0.0016),
        size1: S * 0.001,
      }));

      explosionFx.elapsed = 0;
      explosionFx.active = true;
    }

    // Cor do fogo pela idade: branco-menta → verde → verde-azulado escuro (plasma)
    const FIRE_RAMP = [
      [0.0, 0.78, 1.0, 0.86],
      [0.15, 0.1, 1.0, 0.58],
      [0.4, 0.04, 0.78, 0.52],
      [0.7, 0.02, 0.34, 0.4],
      [1.0, 0.01, 0.12, 0.14],
    ];
    function fireColor(t, out) {
      for (let i = 1; i < FIRE_RAMP.length; i++) {
        if (t <= FIRE_RAMP[i][0]) {
          const a = FIRE_RAMP[i - 1];
          const b = FIRE_RAMP[i];
          const f = (t - a[0]) / (b[0] - a[0]);
          out[0] = a[1] + (b[1] - a[1]) * f;
          out[1] = a[2] + (b[2] - a[2]) * f;
          out[2] = a[3] + (b[3] - a[3]) * f;
          return out;
        }
      }
      const last = FIRE_RAMP[FIRE_RAMP.length - 1];
      out[0] = last[1];
      out[1] = last[2];
      out[2] = last[3];
      return out;
    }

    const fxColor = [0, 0, 0];

    function stepCloud(cloud, dt, { drag, gravity, color }) {
      const d = cloud.userData;
      const attrs = cloud.geometry.attributes;
      const pos = attrs.position.array;
      const size = attrs.aSize.array;
      const rot = attrs.aRot.array;
      const col = attrs.aColor.array;
      const damping = Math.exp(-drag * dt);
      let alive = false;

      for (let i = 0; i < d.count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;
        if (d.delay[i] > 0) {
          d.delay[i] -= dt;
          alive = true;
          continue;
        }
        d.age[i] += dt;
        const t = d.age[i] / d.life[i];
        if (t >= 1) {
          col[i4 + 3] = 0;
          continue;
        }
        alive = true;
        d.velocity[i3] *= damping;
        d.velocity[i3 + 1] = d.velocity[i3 + 1] * damping + gravity * dt;
        d.velocity[i3 + 2] *= damping;
        pos[i3] += d.velocity[i3] * dt;
        pos[i3 + 1] += d.velocity[i3 + 1] * dt;
        pos[i3 + 2] += d.velocity[i3 + 2] * dt;
        rot[i] += d.spin[i] * dt;

        const grow = 1 - (1 - t) * (1 - t) * (1 - t); // expande rápido e assenta
        size[i] = d.size0[i] + (d.size1[i] - d.size0[i]) * grow;
        const alpha = color(t, fxColor, d.flash[i]);
        col[i4] = fxColor[0];
        col[i4 + 1] = fxColor[1];
        col[i4 + 2] = fxColor[2];
        col[i4 + 3] = alpha;
      }
      attrs.position.needsUpdate = true;
      attrs.aSize.needsUpdate = true;
      attrs.aRot.needsUpdate = true;
      attrs.aColor.needsUpdate = true;
      return alive;
    }

    function updateExplosionFx(dt) {
      if (!explosionFx.active) return;
      explosionFx.elapsed += dt;
      const S = explosion.size || 10;

      const fireAlive = stepCloud(explosionFx.fire, dt, {
        drag: 3.4,
        gravity: S * 0.06, // o ar quente sobe
        color: (t, out, flash) => {
          if (flash) {
            out[0] = 1;
            out[1] = 0.85;
            out[2] = 0.6;
            return 0.55 * (1 - t) * (1 - t);
          }
          fireColor(t, out);
          const fadeIn = Math.min(1, t / 0.06);
          return fadeIn * Math.pow(1 - t, 1.4) * 0.5;
        },
      });
      const smokeAlive = stepCloud(explosionFx.smoke, dt, {
        drag: 1.3,
        gravity: S * 0.08,
        color: (t, out) => {
          const shade = 0.07 + t * 0.09;
          out[0] = shade;
          out[1] = shade * 0.95;
          out[2] = shade * 0.9;
          return 0.62 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.8);
        },
      });
      const embersAlive = stepCloud(explosionFx.embers, dt, {
        drag: 0.9,
        gravity: -S * 0.9,
        color: (t, out) => {
          out[0] = 1;
          out[1] = 0.78 - t * 0.5;
          out[2] = 0.35 - t * 0.3;
          return 1 - t * t;
        },
      });

      if (!fireAlive && !smokeAlive && !embersAlive) clearExplosionFx();
    }

    function clearExplosionFx() {
      for (const cloud of [explosionFx.fire, explosionFx.smoke, explosionFx.embers]) {
        if (cloud) cloud.geometry.setDrawRange(0, 0);
      }
      explosionFx.active = false;
    }

    // ============================================
    // SKILL TREE NA TELA DO MONITOR
    // Os quatro cantos da tela saem da UV do material "Display"; a cada
    // quadro eles são projetados e a skill tree (DOM) recebe um matrix3d
    // que a encaixa na perspectiva do monitor. Os botões seguem clicáveis.
    // ============================================
    const monitor = {
      ready: false,
      active: false,
      corners: null, // [TL, TR, BR, BL] no espaço do modelo
      overlay: null,
      inner: null,
      section: null,
      displayMaterial: null,
      baseEmissive: null,
      baseEmissiveIntensity: 0,
      width: 1000,
      height: 750,
      lastTransform: "",
    };
    const monitorScratch = new THREE.Vector3();

    function findScreenCorners(mesh) {
      const geometry = mesh.geometry;
      const pos = geometry.attributes.position;
      const uv = geometry.attributes.uv;
      if (!pos || !uv) return null;

      // A tela grande ocupa a ilha da esquerda da textura (u < ~0.75);
      // as telinhas menores ficam à direita e são ignoradas.
      const U_LIMIT = 0.745;
      let umin = Infinity, umax = -Infinity, vmin = Infinity, vmax = -Infinity;
      for (let i = 0; i < uv.count; i++) {
        const u = uv.getX(i);
        const v = uv.getY(i);
        if (u > U_LIMIT) continue;
        umin = Math.min(umin, u); umax = Math.max(umax, u);
        vmin = Math.min(vmin, v); vmax = Math.max(vmax, v);
      }
      if (!isFinite(umin)) return null;

      // A tela tem cantos arredondados e é abaulada, então os cantos do
      // retângulo de UV não existem na malha. O retângulo sai do ponto médio
      // de cada borda (vértices com u/v no extremo), o que o mantém simétrico.
      const ur = umax - umin;
      const vr = vmax - vmin;
      const edge = (test) => {
        const sum = new THREE.Vector3();
        let n = 0;
        for (let i = 0; i < uv.count; i++) {
          const u = uv.getX(i);
          const v = uv.getY(i);
          if (u > U_LIMIT || !test(u, v)) continue;
          sum.x += pos.getX(i);
          sum.y += pos.getY(i);
          sum.z += pos.getZ(i);
          n++;
        }
        return n ? sum.multiplyScalar(1 / n) : null;
      };
      const midV = (v) => v > vmin + vr * 0.2 && v < vmax - vr * 0.2;
      const midU = (u) => u > umin + ur * 0.2 && u < umax - ur * 0.2;
      const edgeLeft = edge((u, v) => u < umin + ur * 0.01 && midV(v));
      const edgeRight = edge((u, v) => u > umax - ur * 0.01 && midV(v));
      const edgeBottom = edge((u, v) => v < vmin + vr * 0.01 && midU(u));
      const edgeTop = edge((u, v) => v > vmax - vr * 0.01 && midU(u));
      if (!edgeLeft || !edgeRight || !edgeBottom || !edgeTop) return null;

      const middle = new THREE.Vector3()
        .add(edgeLeft)
        .add(edgeRight)
        .add(edgeBottom)
        .add(edgeTop)
        .multiplyScalar(0.25);
      // Recuo para ficar dentro da moldura escura e dos cantos arredondados
      const halfU = edgeRight.clone().sub(edgeLeft).multiplyScalar(0.5 * (1 - 2 * 0.018));
      const halfV = edgeTop.clone().sub(edgeBottom).multiplyScalar(0.5 * (1 - 2 * 0.022));
      const at = (su, sv) =>
        middle.clone().addScaledVector(halfU, su).addScaledVector(halfV, sv);
      const local = [at(-1, -1), at(1, -1), at(1, 1), at(-1, 1)];
      if (local.some((p) => !p)) return null;

      // Levar para o espaço do modelo (Y para cima)
      model.updateMatrixWorld(true);
      const toModel = new THREE.Matrix4()
        .copy(model.matrixWorld)
        .invert()
        .multiply(mesh.matrixWorld);
      const pts = local.map((p) => p.applyMatrix4(toModel));

      const center = pts
        .reduce((acc, p) => acc.add(p), new THREE.Vector3())
        .multiplyScalar(0.25);
      const modelCenter = model.worldToLocal(
        new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
      );

      // Normal da tela apontando para fora do monitor
      const normal = new THREE.Vector3()
        .subVectors(pts[1], pts[0])
        .cross(new THREE.Vector3().subVectors(pts[3], pts[0]))
        .normalize();
      if (normal.dot(new THREE.Vector3().subVectors(center, modelCenter)) < 0) {
        normal.negate();
      }

      const up = new THREE.Vector3(0, 1, 0);
      up.sub(normal.clone().multiplyScalar(up.dot(normal))).normalize();
      const right = new THREE.Vector3().crossVectors(up, normal).normalize();

      const score = (p, su, sr) => {
        const d = new THREE.Vector3().subVectors(p, center);
        return d.dot(up) * su + d.dot(right) * sr;
      };
      const pick = (su, sr) =>
        pts.reduce((best, p) => (score(p, su, sr) > score(best, su, sr) ? p : best));

      const corners = [pick(1, -1), pick(1, 1), pick(-1, 1), pick(-1, -1)];
      // A malha do vidro continua por baixo da moldura do lado direito, então
      // a abertura visível fica um pouco à esquerda do centro da malha.
      // Sem isso sobra vidro à esquerda e a imagem invade a moldura à direita.
      const toLeft = corners[0].clone().sub(corners[1]).multiplyScalar(0.01);
      for (const p of corners) p.add(toLeft);
      const width = corners[0].distanceTo(corners[1]);
      const height = corners[0].distanceTo(corners[3]);
      return { corners, aspect: height / width, normal, up, right };
    }

    // Malha com o material "Display" e os cantos da tela (espaço do modelo)
    let screenCache;
    function locateScreen() {
      if (screenCache !== undefined) return screenCache;
      screenCache = null;
      if (!model) return null;
      model.traverse((o) => {
        if (screenCache || !o.isMesh) return;
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        if (!materials.some((m) => m && m.name === "Display")) return;
        const found = findScreenCorners(o);
        if (found) screenCache = { mesh: o, found };
      });
      return screenCache;
    }

    function setupMonitorScreen() {
      if (monitor.ready || !model) return;

      const tree = document.querySelector("#skills .cyberpunk-skill-tree");
      const section = document.getElementById("skills");
      if (!tree || !section) return;

      const screen = locateScreen();
      if (!screen) return;
      const { mesh: screenMesh, found } = screen;

      // Área de conteúdo = tela menos a barra de título e o rodapé que o
      // canvas da tela 3D desenha (mesmas medidas da cena "skill tree").
      const [TL, TR, BR, BL] = found.corners;
      const canvasH = 960 * found.aspect;
      const top = 60 / canvasH;
      const bottom = 1 - 56 / canvasH;
      const side = 0.014;
      const at = (u, v) => TL.clone().lerp(TR, u).lerp(BL.clone().lerp(BR, u), v);
      monitor.corners = [at(side, top), at(1 - side, top), at(1 - side, bottom), at(side, bottom)];
      const contentW = monitor.corners[0].distanceTo(monitor.corners[1]);
      const contentH = monitor.corners[0].distanceTo(monitor.corners[3]);
      monitor.height = Math.round(monitor.width * (contentH / contentW));
      monitor.section = section;
      monitor.displayMaterial = Array.isArray(screenMesh.material)
        ? screenMesh.material.find((m) => m.name === "Display")
        : screenMesh.material;
      monitor.baseEmissive = monitor.displayMaterial.emissive.clone();
      monitor.baseEmissiveIntensity = monitor.displayMaterial.emissiveIntensity;

      // Espaçador mantém a altura original da seção (o scroll não muda)
      const spacer = document.createElement("div");
      spacer.className = "monitor-screen__spacer";
      spacer.style.height = `${tree.getBoundingClientRect().height + 80}px`;
      tree.parentNode.insertBefore(spacer, tree);

      const overlay = document.createElement("div");
      overlay.className = "monitor-screen";
      overlay.style.width = `${monitor.width}px`;
      overlay.style.height = `${monitor.height}px`;
      const inner = document.createElement("div");
      inner.className = "monitor-screen__inner";
      inner.appendChild(tree);
      overlay.appendChild(inner);
      (document.getElementById("main-content") || document.body).appendChild(overlay);

      monitor.overlay = overlay;
      monitor.inner = inner;

      // "Seção no meio da tela" sem ler o layout a cada quadro:
      // a faixa observada é o miolo de 20% da altura da janela.
      monitor.inView = false;
      new IntersectionObserver(
        (entries) => {
          for (const entry of entries) monitor.inView = entry.isIntersecting;
        },
        { rootMargin: "-40% 0px -40% 0px" }
      ).observe(section);

      monitor.ready = true;
    }

    function quadToMatrix3d(w, h, q) {
      const [x0, y0] = q[0], [x1, y1] = q[1], [x2, y2] = q[2], [x3, y3] = q[3];
      const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
      const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
      const det = dx1 * dy2 - dx2 * dy1;
      if (Math.abs(det) < 1e-9) return null;
      const g = (dx3 * dy2 - dx2 * dy3) / det;
      const hh = (dx1 * dy3 - dx3 * dy1) / det;
      const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
      const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
      const n = (v) => v.toFixed(6);
      return `matrix3d(${n(a / w)},${n(d / w)},0,${n(g / w)},${n(b / h)},${n(e / h)},0,${n(hh / h)},0,0,1,0,${n(c)},${n(f)},0,1)`;
    }

    function setMonitorActive(on) {
      if (!monitor.ready || monitor.active === on) return;
      monitor.active = on;
      const { overlay, inner, displayMaterial } = monitor;
      gsap.killTweensOf([overlay, inner, displayMaterial]);

      if (on) {
        overlay.classList.add("is-on");
        gsap.set(inner, { clearProps: "transform" });
        // aparece depois da estática de troca de canal, com uma piscada
        gsap
          .timeline()
          .set(overlay, { opacity: 0 })
          .to(overlay, { opacity: 0.75, duration: 0.05, delay: 0.3 })
          .to(overlay, { opacity: 0.2, duration: 0.05 })
          .to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" });
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => overlay.classList.remove("is-on"),
        });
      }
    }

    // Chamado logo antes de cada render do modelo
    function updateMonitorScreen() {
      if (!monitor.ready || !model) return;

      // Durante a explosão, com a tela já desligada, não há o que projetar
      if (modelExplosionActive && !monitor.active) return;

      const inView = monitor.inView;
      const settled =
        Math.abs(model.rotation.y - targetRotation.y) < 0.08 &&
        Math.abs(model.position.x - targetPosition.x) < 0.25;
      const shouldShow = inView && settled && !modelExplosionActive;

      if (shouldShow || monitor.active) {
        model.updateMatrixWorld();
        modelCamera.updateMatrixWorld();
        const quad = monitor.corners.map((p) => {
          monitorScratch.copy(p);
          model.localToWorld(monitorScratch);
          monitorScratch.project(modelCamera);
          return [
            ((monitorScratch.x + 1) / 2) * innerWidth,
            ((1 - monitorScratch.y) / 2) * innerHeight,
            monitorScratch.z,
          ];
        });
        const visible = quad.every((q) => q[2] < 1);
        const transform = visible ? quadToMatrix3d(monitor.width, monitor.height, quad) : null;
        if (transform && transform !== monitor.lastTransform) {
          monitor.overlay.style.transform = transform;
          monitor.lastTransform = transform;
        }
        setMonitorActive(shouldShow && !!transform);
      }
    }

    // ============================================
    // O PC EM CHAMAS
    // A página conta uma história: no topo o "servidor" está pegando fogo e
    // a tela mostra ERRO 500; a cada seção o técnico (eu) conserta mais uma
    // parte, o fogo diminui e a tela muda. Na Skill Tree o sistema está
    // estável; logo depois, com poder demais, ele entra em sobrecarga e explode.
    //  - Tela: malha curva que acompanha o vidro do CRT (raycast no vidro),
    //    filha da peça da tela — voa junto na explosão. Textura = canvas.
    //  - Fogo: chamas, fumaça e brasas (mesmo shader da explosão) + luz.
    // ============================================
    const PC_STAGES = ["home", "servicos", "experiencia", "projetos", "skills", "contato"];

    const burn = {
      ready: false,
      level: 1,
      unit: 1,
      emitterLocal: new THREE.Vector3(),
      upLocal: new THREE.Vector3(0, 1, 0),
      rightLocal: new THREE.Vector3(1, 0, 0),
      normalLocal: new THREE.Vector3(0, 0, 1),
      flames: null,
      smoke: null,
      embers: null,
      acc: { flames: 0, smoke: 0, embers: 0 },
      time: 0,
    };

    const pcScreen = {
      ready: false,
      mesh: null,
      canvas: null,
      ctx: null,
      texture: null,
      overlay: null, // scanlines + vinheta pré-renderizados
      W: 960,
      H: 720,
      stage: -1,
      stageStart: 0,
      switchStart: -1,
      lastDraw: 0,
    };

    // ---------- montagem ----------
    function setupBurningPc() {
      if (burn.ready || !model) return;
      const screen = locateScreen();
      if (!screen) return;
      const { mesh, found } = screen;
      model.updateMatrixWorld(true);

      const toWorld = (p) => model.localToWorld(p.clone());
      const [wTL, wTR, wBR, wBL] = found.corners.map(toWorld);
      const normalW = found.normal.clone().transformDirection(model.matrixWorld);
      const upW = found.up.clone().transformDirection(model.matrixWorld);
      const width = wTL.distanceTo(wTR);

      buildScreenSurface(mesh, found, { wTL, wTR, wBR, wBL, normalW, width });

      // Topo da carcaça: raio de cima para baixo, atrás do vidro
      const ray = new THREE.Raycaster();
      const center = wTL.clone().add(wBR).multiplyScalar(0.5);
      const probe = center
        .clone()
        .addScaledVector(normalW, -width * 0.35)
        .addScaledVector(upW, width * 3);
      ray.set(probe, upW.clone().negate());
      const hit = ray
        .intersectObject(model, true)
        .find((h) => h.object !== pcScreen.mesh);
      const topW = hit
        ? hit.point
        : center.clone().addScaledVector(upW, width * 0.8);

      burn.emitterLocal.copy(model.worldToLocal(topW.clone()));
      burn.upLocal.copy(found.up);
      burn.rightLocal.copy(found.right);
      burn.normalLocal.copy(found.normal);
      burn.unit = width;

      const puff = puffTexture();
      burn.smoke = createFxCloud(34, puff, THREE.NormalBlending, 7);
      burn.flames = createFxCloud(160, puff, THREE.AdditiveBlending, 8);
      burn.embers = createFxCloud(60, glowTexture(), THREE.AdditiveBlending, 9);
      for (const cloud of [burn.smoke, burn.flames, burn.embers]) {
        cloud.userData.strength = new Float32Array(cloud.userData.count);
        cloud.userData.phase = new Float32Array(cloud.userData.count);
        cloud.userData.cursor = 0;
        cloud.geometry.setDrawRange(0, cloud.userData.count);
      }
      burn.ready = true;
    }

    // Eliminação de Gauss com pivô parcial (sistemas pequenos)
    function solveLinear(A, b) {
      const n = b.length;
      const M = A.map((row, i) => [...row, b[i]]);
      for (let c = 0; c < n; c++) {
        let p = c;
        for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
        if (Math.abs(M[p][c]) < 1e-12) return null;
        [M[c], M[p]] = [M[p], M[c]];
        for (let r = 0; r < n; r++) {
          if (r === c) continue;
          const k = M[r][c] / M[c][c];
          for (let k2 = c; k2 <= n; k2++) M[r][k2] -= k * M[c][k2];
        }
      }
      return M.map((row, i) => row[n] / row[i]);
    }

    function buildScreenSurface(mesh, found, { wTL, wTR, wBR, wBL, normalW, width }) {
      const NX = 18;
      const NY = 14;
      // A malha passa um pouco da área do conteúdo (some sob a moldura) para
      // não sobrar faixa de vidro escuro nas bordas. Nessa margem as UVs saem
      // de [0,1] e a textura (clamp) repete a borda do conteúdo.
      const EX = 0.025;
      const EY = 0.02;
      const gridU = (i) => (i / NX) * (1 + 2 * EX) - EX;
      const gridV = (j) => (j / NY) * (1 + 2 * EY) - EY;
      const ray = new THREE.Raycaster();
      const flat = [];
      const offsets = [];
      for (let j = 0; j <= NY; j++) {
        for (let i = 0; i <= NX; i++) {
          const u = gridU(i);
          const v = gridV(j);
          const top = wTL.clone().lerp(wTR, u);
          const p = top.lerp(wBL.clone().lerp(wBR, u), v);
          flat.push(p);
          ray.set(p.clone().addScaledVector(normalW, width * 0.5), normalW.clone().negate());
          const hit = ray.intersectObject(mesh, false)[0];
          offsets.push(hit ? hit.point.clone().sub(p).dot(normalW) : null);
        }
      }
      // O vidro do CRT é abaulado: ajusta uma superfície quadrática aos acertos
      // (1, u, v, u², v², uv). Onde o raio erra (cantos arredondados) ou acerta
      // a borda que "cai" para trás, usa a superfície ajustada — sem bicos.
      const basis = (u, v) => [1, u, v, u * u, v * v, u * v];
      const A = Array.from({ length: 6 }, () => new Array(6).fill(0));
      const b = new Array(6).fill(0);
      for (let j = 0; j <= NY; j++) {
        for (let i = 0; i <= NX; i++) {
          const o = offsets[j * (NX + 1) + i];
          if (o === null) continue;
          const f = basis(i / NX, j / NY);
          for (let r = 0; r < 6; r++) {
            b[r] += f[r] * o;
            for (let c = 0; c < 6; c++) A[r][c] += f[r] * f[c];
          }
        }
      }
      const coef = solveLinear(A, b);
      const fitted = (u, v) =>
        coef ? basis(u, v).reduce((acc, f, k) => acc + f * coef[k], 0) : 0;
      const lift = width * 0.004; // um fio à frente do vidro
      const positions = new Float32Array(flat.length * 3);
      const uvs = new Float32Array(flat.length * 2);
      for (let j = 0; j <= NY; j++) {
        for (let i = 0; i <= NX; i++) {
          const k = j * (NX + 1) + i;
          const fit = fitted(i / NX, j / NY);
          const hit = offsets[k];
          const trusted = hit !== null && Math.abs(hit - fit) < width * 0.01;
          const depth = (trusted ? hit : fit) + lift;
          const local = mesh.worldToLocal(flat[k].clone().addScaledVector(normalW, depth));
          positions.set([local.x, local.y, local.z], k * 3);
          uvs.set([gridU(i), 1 - gridV(j)], k * 2);
        }
      }
      const index = [];
      for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
          const a = j * (NX + 1) + i;
          const b = a + 1;
          const c = a + NX + 1;
          const d = c + 1;
          index.push(a, c, b, b, c, d);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      geometry.setIndex(index);
      geometry.computeBoundingSphere();

      pcScreen.W = 960;
      pcScreen.H = Math.round(960 * found.aspect);
      pcScreen.canvas = document.createElement("canvas");
      pcScreen.canvas.width = pcScreen.W;
      pcScreen.canvas.height = pcScreen.H;
      pcScreen.ctx = pcScreen.canvas.getContext("2d");
      pcScreen.texture = new THREE.CanvasTexture(pcScreen.canvas);
      pcScreen.texture.colorSpace = THREE.SRGBColorSpace;
      pcScreen.texture.generateMipmaps = false;
      pcScreen.texture.minFilter = THREE.LinearFilter;
      pcScreen.texture.anisotropy = 4;
      pcScreen.texture.wrapS = pcScreen.texture.wrapT = THREE.ClampToEdgeWrapping;
      pcScreen.overlay = buildCrtOverlay(pcScreen.W, pcScreen.H);

      const material = new THREE.MeshBasicMaterial({
        map: pcScreen.texture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
        side: THREE.DoubleSide,
      });
      const surface = new THREE.Mesh(geometry, material);
      surface.name = "pc-screen";
      surface.renderOrder = 5;
      surface.userData.noExplode = true;
      mesh.add(surface);
      pcScreen.mesh = surface;
      pcScreen.ready = true;
      drawPcScreen(performance.now(), true);
    }

    // ---------- fogo ----------
    function fireLevelForScroll() {
      const skills = document.getElementById("skills");
      if (!skills) return 0;
      const skillsTop = skills.getBoundingClientRect().top + scrollY;
      const end = Math.max(1, skillsTop - innerHeight * 0.25);
      const p = Math.min(1, Math.max(0, scrollY / end));
      return Math.pow(1 - p, 1.35);
    }

    const burnTmp = {
      emitter: new THREE.Vector3(),
      right: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      up: new THREE.Vector3(),
      p: new THREE.Vector3(),
      size: new THREE.Vector2(),
    };

    function spawnBurnParticle(cloud, kind, U, strength) {
      const d = cloud.userData;
      let i = d.cursor;
      // procura um espaço livre a partir do cursor
      for (let n = 0; n < d.count; n++) {
        const k = (d.cursor + n) % d.count;
        if (d.age[k] >= d.life[k]) {
          i = k;
          break;
        }
      }
      d.cursor = (i + 1) % d.count;

      const { emitter, right, normal, p } = burnTmp;
      const spreadR = kind === "smoke" ? 0.4 : 0.36;
      const spreadN = kind === "smoke" ? 0.3 : 0.26;
      p.copy(emitter)
        .addScaledVector(right, (Math.random() - 0.5) * U * spreadR * 2)
        .addScaledVector(normal, (Math.random() - 0.5) * U * spreadN * 2);
      const pos = cloud.geometry.attributes.position.array;
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;

      const s = 0.55 + 0.45 * strength; // fogo fraco = chamas menores
      if (kind === "flames") {
        d.velocity[i * 3] = (Math.random() - 0.5) * U * 0.12;
        d.velocity[i * 3 + 1] = U * (0.5 + Math.random() * 0.55) * s;
        d.velocity[i * 3 + 2] = (Math.random() - 0.5) * U * 0.12;
        d.life[i] = 0.6 + Math.random() * 0.6;
        d.size0[i] = U * (0.3 + Math.random() * 0.22) * s;
        d.size1[i] = U * 0.05;
      } else if (kind === "smoke") {
        d.velocity[i * 3] = (Math.random() - 0.5) * U * 0.1;
        d.velocity[i * 3 + 1] = U * (0.28 + Math.random() * 0.2);
        d.velocity[i * 3 + 2] = (Math.random() - 0.5) * U * 0.1;
        d.life[i] = 2.2 + Math.random() * 1.2;
        d.size0[i] = U * 0.3 * s;
        d.size1[i] = U * (0.95 + Math.random() * 0.4) * s;
      } else {
        d.velocity[i * 3] = (Math.random() - 0.5) * U * 0.5;
        d.velocity[i * 3 + 1] = U * (0.7 + Math.random() * 0.8);
        d.velocity[i * 3 + 2] = (Math.random() - 0.5) * U * 0.5;
        d.life[i] = 0.9 + Math.random() * 1.1;
        d.size0[i] = U * (0.022 + Math.random() * 0.018);
        d.size1[i] = U * 0.006;
      }
      d.age[i] = 0;
      d.spin[i] = (Math.random() - 0.5) * 2.2;
      d.phase[i] = Math.random() * Math.PI * 2;
      d.strength[i] = strength;
      cloud.geometry.attributes.aRot.array[i] = Math.random() * Math.PI * 2;
    }

    const burnColor = [0, 0, 0];
    function stepBurnCloud(cloud, kind, dt, U) {
      const d = cloud.userData;
      const attrs = cloud.geometry.attributes;
      const pos = attrs.position.array;
      const size = attrs.aSize.array;
      const rot = attrs.aRot.array;
      const col = attrs.aColor.array;
      const time = burn.time;
      const drag = Math.exp(-(kind === "embers" ? 0.6 : 1.4) * dt);

      for (let i = 0; i < d.count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;
        if (d.age[i] >= d.life[i]) {
          col[i4 + 3] = 0;
          continue;
        }
        d.age[i] += dt;
        const t = Math.min(1, d.age[i] / d.life[i]);

        // turbulência: as chamas "dançam" enquanto sobem
        const wobble = Math.sin(time * 6.5 + d.phase[i] + t * 5) * U * (kind === "flames" ? 0.55 : 0.25);
        d.velocity[i3] = d.velocity[i3] * drag + wobble * dt;
        d.velocity[i3 + 2] = d.velocity[i3 + 2] * drag + Math.cos(time * 5.1 + d.phase[i]) * U * 0.2 * dt;
        d.velocity[i3 + 1] =
          d.velocity[i3 + 1] * drag + (kind === "embers" ? -U * 0.25 : U * 0.35) * dt;
        pos[i3] += d.velocity[i3] * dt;
        pos[i3 + 1] += d.velocity[i3 + 1] * dt;
        pos[i3 + 2] += d.velocity[i3 + 2] * dt;
        rot[i] += d.spin[i] * dt;

        let alpha;
        if (kind === "flames") {
          // cresce rápido e afina no alto: forma de labareda
          const grow = t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82;
          size[i] = d.size1[i] + (d.size0[i] - d.size1[i]) * Math.max(0, grow);
          fireColor(Math.min(1, t * 1.15), burnColor);
          alpha = Math.min(1, t / 0.08) * Math.pow(1 - t, 1.1) * 0.7;
        } else if (kind === "smoke") {
          size[i] = d.size0[i] + (d.size1[i] - d.size0[i]) * (1 - (1 - t) * (1 - t));
          const shade = 0.06 + t * 0.07;
          burnColor[0] = shade;
          burnColor[1] = shade * 0.92;
          burnColor[2] = shade * 0.88;
          alpha = 0.42 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.9);
        } else {
          size[i] = d.size0[i] + (d.size1[i] - d.size0[i]) * t;
          burnColor[0] = 1;
          burnColor[1] = 0.75 - t * 0.45;
          burnColor[2] = 0.3 - t * 0.25;
          alpha = (1 - t * t) * (0.6 + 0.4 * Math.sin(time * 30 + d.phase[i]));
        }
        col[i4] = burnColor[0];
        col[i4 + 1] = burnColor[1];
        col[i4 + 2] = burnColor[2];
        col[i4 + 3] = alpha * (0.35 + 0.65 * d.strength[i]);
      }
      attrs.position.needsUpdate = true;
      attrs.aSize.needsUpdate = true;
      attrs.aRot.needsUpdate = true;
      attrs.aColor.needsUpdate = true;
    }

    function updateBurn(dt) {
      if (!burn.ready || !model) return;
      burn.time += dt;
      const overload = explosion.state === "overload";
      const target = overload ? 1.15 : explosion.state === "idle" ? fireLevelForScroll() : 0;
      burn.level += (target - burn.level) * Math.min(1, dt * (overload ? 7 : 2.5));
      const level = burn.level < 0.02 ? 0 : burn.level;
      const U = burn.unit;

      model.updateMatrixWorld();
      burnTmp.emitter.copy(burn.emitterLocal);
      model.localToWorld(burnTmp.emitter);
      burnTmp.right.copy(burn.rightLocal).transformDirection(model.matrixWorld);
      burnTmp.normal.copy(burn.normalLocal).transformDirection(model.matrixWorld);
      burnTmp.up.copy(burn.upLocal).transformDirection(model.matrixWorld);

      const rates = { flames: 135, smoke: 14, embers: 26 };
      for (const kind of ["flames", "smoke", "embers"]) {
        burn.acc[kind] += rates[kind] * level * dt;
        while (burn.acc[kind] >= 1) {
          burn.acc[kind] -= 1;
          spawnBurnParticle(burn[kind], kind, U, level);
        }
        stepBurnCloud(burn[kind], kind, dt, U);
      }

      const halfHeight = modelRenderer.getDrawingBufferSize(burnTmp.size).y / 2;
      for (const cloud of [burn.flames, burn.smoke, burn.embers]) {
        cloud.material.uniforms.uHalfHeight.value = halfHeight;
        cloud.material.uniforms.uMaxSize.value = halfHeight * 0.6;
      }

      if (fireLight) {
        fireLight.position.copy(burnTmp.emitter).addScaledVector(burnTmp.up, U * 0.45);
        const flicker =
          0.75 + 0.25 * Math.sin(burn.time * 17) * Math.sin(burn.time * 7.3) + Math.random() * 0.12;
        fireLight.intensity = level * 9 * flicker;
      }
    }

    // ---------- tela ----------
    function currentPcStage() {
      if (["overload", "exploding", "exploded"].includes(explosion.state)) return 6;
      let stage = 0;
      for (let i = 0; i < PC_STAGES.length; i++) {
        const el = document.getElementById(PC_STAGES[i]);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.45) stage = i;
      }
      return stage;
    }

    function buildCrtOverlay(W, H) {
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
      const v = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.72);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.75)");
      g.fillStyle = v;
      g.fillRect(0, 0, W, H);
      return c;
    }

    const PC_FONT = {
      mono: '"VT323", monospace',
      head: '"Bebas Neue", "Rajdhani", sans-serif',
    };

    function pcText(ctx, str, x, y, size, color, opts = {}) {
      ctx.font = `${opts.weight || ""} ${size}px ${opts.font || PC_FONT.mono}`;
      ctx.textAlign = opts.align || "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = opts.glow ?? 10;
      ctx.fillText(str, x, y);
      ctx.shadowBlur = 0;
    }

    function pcBar(ctx, x, y, w, h, p, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = color;
      ctx.fillRect(x + 4, y + 4, Math.max(0, (w - 8) * Math.min(1, p)), h - 8);
    }

    function pcHeader(ctx, W, S, label, color, right = "") {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, W, 52 * S);
      pcText(ctx, label, 22 * S, 38 * S, 34 * S, "#050505", { glow: 0 });
      if (right) pcText(ctx, right, W - 22 * S, 38 * S, 30 * S, "#050505", { glow: 0, align: "right" });
    }

    function pcFooter(ctx, W, H, S, text, color) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, H - 50 * S, W, 50 * S);
      pcText(ctx, text, 22 * S, H - 16 * S, 28 * S, color, { glow: 6 });
    }

    const typed = (lines, chars) => {
      const out = [];
      let left = chars;
      for (const line of lines) {
        if (left <= 0) break;
        out.push(line.slice(0, left));
        left -= line.length + 6; // pausa curta entre linhas
      }
      return out;
    };

    const tempFor = (fire) => Math.round(38 + 60 * fire);
    const blink = (time, hz = 2) => Math.floor(time * hz) % 2 === 0;

    const PC_SCENES = [
      // 0 — HERO: sistema em chamas
      (ctx, W, H, S, t, time, fire) => {
        const pulse = 0.28 + 0.1 * Math.sin(time * 9) + (Math.random() < 0.06 ? 0.25 : 0);
        ctx.fillStyle = "#1a0202";
        ctx.fillRect(0, 0, W, H);
        const g = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.7);
        g.addColorStop(0, `rgba(255,30,20,${pulse})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        pcHeader(ctx, W, S, "⚠ ALERTA CRÍTICO — PRODUÇÃO FORA DO AR", blink(time, 2.5) ? "#ff2a2a" : "#8a0c0c");
        pcText(ctx, "ERRO 500", 36 * S, 238 * S, 196 * S, "#ff3030", { font: PC_FONT.head, glow: 26 });
        pcText(ctx, "SISTEMA EM CHAMAS", 42 * S, 300 * S, 56 * S, "#ffd6c8", { font: PC_FONT.head, glow: 12 });
        // log rolando
        const logs = [
          ["[FATAL]", "db: conexão perdida (timeout 30000ms)", "#ff3b3b"],
          ["[FATAL]", "api: 502 bad gateway", "#ff3b3b"],
          ["[ERRO] ", "deploy falhou em main@4f2c1a", "#3b86ff"],
          ["[ERRO] ", "css: layout quebrado em 37 páginas", "#3b86ff"],
          ["[WARN] ", `cpu a ${tempFor(fire)}°C — ventoinha parou`, "#3bffa4"],
          ["[FATAL]", "fila de pedidos travada", "#ff3b3b"],
          ["[ERRO] ", "nó: assinatura inválida (bloco 4812)", "#3b86ff"],
          ["[WARN] ", "backup mais recente: há 412 dias", "#3bffa4"],
        ];
        const top = 330 * S;
        const bottom = H - 62 * S;
        const lineH = 38 * S;
        const scroll = time * 34 * S;
        const first = Math.floor(scroll / lineH);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, top, W, bottom - top);
        ctx.clip();
        for (let k = 0; k * lineH < bottom - top + lineH; k++) {
          const [tag, msg, color] = logs[(first + k) % logs.length];
          const y = top + k * lineH - (scroll % lineH) + lineH * 0.8;
          pcText(ctx, tag, 36 * S, y, 32 * S, color, { glow: 8 });
          pcText(ctx, msg, 150 * S, y, 32 * S, "#ffb3a6", { glow: 4 });
        }
        ctx.restore();
        pcFooter(
          ctx, W, H, S,
          blink(time, 1.6) ? "▼ ROLE A PÁGINA PARA CHAMAR O TÉCNICO" : `TEMP ${tempFor(fire)}°C   CPU 100%`,
          "#ff5a4a"
        );
      },

      // 1 — SOBRE: o técnico se conecta
      (ctx, W, H, S, t, time, fire) => {
        ctx.fillStyle = "#020913";
        ctx.fillRect(0, 0, W, H);
        pcHeader(ctx, W, S, "SUPORTE REMOTO // SESSÃO 01", "#0062ff", `${tempFor(fire)}°C`);
        const lines = [
          "> ssh cust@producao",
          "conectado: CUST CODING",
          "> whoami --stack",
          "rust · go · typescript · cripto · ia",
          "> localizacao",
          "moçambique · remoto",
          "> diagnostico --completo",
        ];
        const shown = typed(lines, Math.floor(t * 42));
        shown.forEach((line, i) => {
          const isCmd = line.startsWith(">");
          pcText(ctx, line, 34 * S, (104 + i * 44) * S, 36 * S, isCmd ? "#8affc8" : "#0062ff", { glow: 8 });
        });
        const typingDone = shown.length === lines.length && shown[shown.length - 1] === lines[lines.length - 1];
        const typedEnd = lines.reduce((a, l) => a + l.length + 6, 0) / 42;
        if (typingDone) {
          const p = Math.min(1, (t - typedEnd) / 2.4);
          pcBar(ctx, 34 * S, 430 * S, W - 68 * S, 34 * S, p, "#0062ff");
          pcText(ctx, `DIAGNÓSTICO ${Math.round(p * 100)}%`, 34 * S, 500 * S, 36 * S, "#8affc8");
          if (p >= 1) pcText(ctx, "6 falhas encontradas — iniciando reparo", 34 * S, 546 * S, 32 * S, "#0062ff");
        } else if (blink(time, 3)) {
          const last = shown.length ? shown.length - 1 : 0;
          ctx.fillStyle = "#0062ff";
          ctx.fillRect(34 * S + ctx.measureText(shown[last] || "").width + 6, (104 + last * 44 - 28) * S, 18 * S, 32 * S);
        }
        pcFooter(ctx, W, H, S, "técnico conectado · o fogo já está menor", "#0062ff");
      },

      // 2 — SERVIÇOS: correções aplicadas uma a uma
      (ctx, W, H, S, t, time, fire) => {
        ctx.fillStyle = "#02120b";
        ctx.fillRect(0, 0, W, H);
        pcHeader(ctx, W, S, "APLICANDO CORREÇÕES", "#0afc8b", `${tempFor(fire)}°C`);
        const items = [
          "backend rust & go",
          "criptografia",
          "deep learning",
          "full stack web",
          "bitcoin & nostr",
          "automação",
        ];
        let done = 0;
        items.forEach((name, i) => {
          const p = Math.min(1, Math.max(0, (t - i * 0.45) / 0.8));
          if (p >= 1) done++;
          const y = (108 + i * 72) * S;
          pcText(ctx, name, 34 * S, y + 8 * S, 34 * S, "#0afc8b", { glow: 6 });
          pcBar(ctx, 360 * S, y - 20 * S, W - 520 * S, 30 * S, p, "#0afc8b");
          const status = p >= 1 ? "[OK]" : p > 0 ? `${Math.round(p * 100)}%` : "...";
          pcText(ctx, status, W - 34 * S, y + 8 * S, 34 * S, p >= 1 ? "#39ff88" : "#0afc8b", { align: "right" });
        });
        pcFooter(ctx, W, H, S, `falhas corrigidas: ${done}/${items.length}`, "#0afc8b");
      },

      // 3 — EXPERIÊNCIA: deploy com os commits
      (ctx, W, H, S, t, time, fire) => {
        ctx.fillStyle = "#02170d";
        ctx.fillRect(0, 0, W, H);
        pcHeader(ctx, W, S, "DEPLOY EM PRODUÇÃO", "#00ff88", `${tempFor(fire)}°C`);
        const steps = ["BUILD", "TESTES", "DEPLOY"];
        steps.forEach((name, i) => {
          const x = (34 + i * 300) * S;
          const ok = t > 0.6 + i * 0.8;
          ctx.strokeStyle = "#00ff88";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, 78 * S, 270 * S, 62 * S);
          if (ok) {
            ctx.fillStyle = "rgba(0,255,136,0.18)";
            ctx.fillRect(x, 78 * S, 270 * S, 62 * S);
          }
          const spin = "|/-\\"[Math.floor(time * 10) % 4];
          pcText(ctx, `${name} ${ok ? "✓" : spin}`, x + 18 * S, 122 * S, 38 * S, ok ? "#39ff88" : "#00ff88");
        });
        const commits = [
          ["a1f93c2", "feat: validação de blocos em rust", "rust"],
          ["7c0e114", "sec: chaves protegidas com cifra forte", "cripto"],
          ["e52b9d0", "feat: serviço concorrente em go", "go"],
          ["3d8a6f1", "feat: treino de rede neural", "ia"],
          ["b4410ce", "feat: eventos assinados via nostr", "nostr"],
          ["…", "+ commits", ""],
        ];
        const visible = Math.min(commits.length, Math.floor(t / 0.35));
        for (let i = 0; i < visible; i++) {
          const [hash, msg, where] = commits[i];
          const y = (196 + i * 50) * S;
          pcText(ctx, hash, 34 * S, y, 32 * S, "#3bffa4", { glow: 4 });
          pcText(ctx, msg, 170 * S, y, 32 * S, "#bfffe1", { glow: 4 });
          if (where) pcText(ctx, `[${where}]`, W - 34 * S, y, 28 * S, "#00ff88", { align: "right" });
        }
        pcFooter(ctx, W, H, S, "0 erros · o fogo está quase apagado", "#00ff88");
      },

      // 4 — PROJETOS: agentes de IA online
      (ctx, W, H, S, t, time, fire) => {
        ctx.fillStyle = "#03130a";
        ctx.fillRect(0, 0, W, H);
        pcHeader(ctx, W, S, "PROJETOS ONLINE", "#39ff88", `${tempFor(fire)}°C`);
        const agents = [
          ["ALFRED WALLET", "carteira bitcoin"],
          ["NOSTRAPP", "identidade descentralizada"],
          ["CULTIVOLT", "iot e automação"],
        ];
        agents.forEach(([name, desc], i) => {
          const y = (98 + i * 104) * S;
          const on = t > 0.3 + i * 0.5;
          ctx.strokeStyle = "rgba(57,255,136,0.6)";
          ctx.lineWidth = 2;
          ctx.strokeRect(34 * S, y, W - 68 * S, 86 * S);
          ctx.fillStyle = on ? (blink(time + i * 0.3, 1.5) ? "#39ff88" : "#1b8a4a") : "#333";
          ctx.beginPath();
          ctx.arc(64 * S, y + 43 * S, 11 * S, 0, Math.PI * 2);
          ctx.fill();
          pcText(ctx, name, 92 * S, y + 40 * S, 40 * S, "#caffdf", { font: PC_FONT.head, glow: 8 });
          pcText(ctx, on ? desc : "iniciando...", 92 * S, y + 74 * S, 28 * S, "#39ff88", { glow: 4 });
          pcText(ctx, on ? "ONLINE" : "BOOT", W - 58 * S, y + 54 * S, 34 * S, on ? "#39ff88" : "#888", { align: "right" });
        });
        // CPU caindo
        const gx = 34 * S;
        const gy = 420 * S;
        const gw = W - 68 * S;
        const gh = Math.max(40 * S, H - 62 * S - gy - 12 * S);
        ctx.strokeStyle = "#39ff88";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= 60; x++) {
          const k = x / 60;
          const v = 0.95 - 0.6 * k + 0.08 * Math.sin(x * 1.3 + time * 4);
          const px = gx + k * gw;
          const py = gy + gh * (1 - v);
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        pcFooter(ctx, W, H, S, `cpu 42% · sistema estabilizando ${Math.round(92 + 6 * (1 - fire))}%`, "#39ff88");
      },

      // 5 — SKILL TREE: estável
      (ctx, W, H, S, t, time, fire) => {
        ctx.fillStyle = "#041a10";
        ctx.fillRect(0, 0, W, H);
        const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
        g.addColorStop(0, "rgba(0,255,136,0.12)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(0,255,136,0.06)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 48 * S) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += 48 * S) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        pcHeader(ctx, W, S, "SKILL TREE // SISTEMA ESTÁVEL", "#00ff88", `${tempFor(fire)}°C`);
        if (!monitor.ready) {
          // celular: a árvore fica no fluxo da página, a tela só comemora
          pcText(ctx, "SISTEMA ESTÁVEL", W / 2, H * 0.48, 120 * S, "#00ff88", { font: PC_FONT.head, align: "center", glow: 22 });
          pcText(ctx, "todos os serviços operacionais", W / 2, H * 0.62, 40 * S, "#8fffcb", { align: "center" });
        } else if (!pcScreen.covered) {
          pcText(ctx, `carregando skill tree${".".repeat(1 + (Math.floor(time * 3) % 3))}`, W / 2, H * 0.52, 40 * S, "#00ff88", { align: "center" });
        }
        const level = document.getElementById("skills-level")?.textContent?.trim() || "29";
        pcFooter(ctx, W, H, S, `nível ${level} · todos os serviços operacionais · 0 erros`, "#00ff88");
      },

      // 6 — CONTATO: sobrecarga (a surpresa)
      (ctx, W, H, S, t, time) => {
        const flash = blink(time, 7);
        ctx.fillStyle = flash ? "#ff1e1e" : "#fff4f0";
        ctx.fillRect(0, 0, W, H);
        const ink = flash ? "#fff4f0" : "#ff1e1e";
        const level = document.getElementById("skills-level")?.textContent?.trim() || "29";
        pcText(ctx, "⚠ SOBRECARGA", W / 2, H * 0.42, 150 * S, ink, { font: PC_FONT.head, align: "center", glow: 0 });
        pcText(ctx, `NÍVEL ${level} — PODER DEMAIS PARA UM SERVIDOR SÓ`, W / 2, H * 0.58, 38 * S, ink, { align: "center", glow: 0 });
        pcText(ctx, "afastem-se do monitor", W / 2, H * 0.7, 34 * S, ink, { align: "center", glow: 0 });
      },
    ];

    function drawPcScreen(now, force = false) {
      if (!pcScreen.ready) return;
      const stage = currentPcStage();
      if (stage !== pcScreen.stage) {
        pcScreen.switchStart = pcScreen.stage !== -1 && stage !== 6 ? now : -1;
        pcScreen.stage = stage;
        pcScreen.stageStart = now;
      }
      // Tela coberta pela skill tree interativa ou modelo desmontado: não redesenha
      const covered = monitor.active && stage === 5;
      const hidden = explosion.state === "exploded";
      const switching = pcScreen.switchStart >= 0 && now - pcScreen.switchStart < 380;
      if (!force && hidden) return;
      const interval = covered && !switching ? 250 : 66; // ~15 fps; 4 fps coberta
      if (!force && now - pcScreen.lastDraw < interval) return;
      pcScreen.covered = covered;
      pcScreen.lastDraw = now;

      const { ctx, W, H } = pcScreen;
      const S = W / 960;
      const t = (now - pcScreen.stageStart) / 1000;
      const time = now / 1000;
      const fire = burn.ready ? burn.level : 1;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      // sem recorte próprio: a moldura 3D do monitor já arredonda os cantos

      PC_SCENES[stage](ctx, W, H, S, t, time, fire);

      // troca de "canal": estática + faixa rolando
      if (switching) {
        const k = 1 - (now - pcScreen.switchStart) / 380;
        for (let i = 0; i < 90; i++) {
          const gray = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgba(${gray},${gray},${gray},${0.55 * k})`;
          ctx.fillRect(0, Math.random() * H, W, 2 + Math.random() * 10 * S);
        }
        ctx.fillStyle = `rgba(255,255,255,${0.35 * k})`;
        ctx.fillRect(0, (1 - k) * H, W, 24 * S);
      }

      // glitch de fatias quando o fogo está forte
      if (fire > 0.5 && Math.random() < fire * 0.35) {
        for (let i = 0; i < 2; i++) {
          const y = Math.random() * H;
          const h = 8 + Math.random() * 30 * S;
          const dx = (Math.random() - 0.5) * 40 * S * fire;
          ctx.drawImage(pcScreen.canvas, 0, y, W, h, dx, y, W, h);
        }
      }

      ctx.drawImage(pcScreen.overlay, 0, 0);
      // faixa clara rolando, como em CRT
      const band = ((time * 140 * S) % (H + 160 * S)) - 80 * S;
      const bg = ctx.createLinearGradient(0, band - 60 * S, 0, band + 60 * S);
      bg.addColorStop(0, "rgba(255,255,255,0)");
      bg.addColorStop(0.5, "rgba(255,255,255,0.05)");
      bg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, band - 60 * S, W, 120 * S);
      ctx.restore();

      pcScreen.texture.needsUpdate = true;
    }

    // Função para aplicar posição inicial
    // Distância da câmera no celular (tela em pé = campo horizontal estreito)
    const MOBILE_ORBIT = 15;

    function applyInitialPosition() {
      if (!model) return;

      // Ajustar posição e rotação baseado no tamanho da tela
      const isMobile = window.innerWidth <= 768;
    
      let initialPosition, initialRotation, cameraPos;
    
      if (isMobile) {
        // Mesma coreografia do desktop, com a câmera mais longe: a tela em pé
        // é estreita, então o monitor precisa de mais distância para caber.
        initialPosition = { x: 0, y: -11.3, z: -8.4 };
        initialRotation = { x: 0.3, y: 0.6, z: 0.0 };
        cameraPos = { x: 0, y: 2, z: MOBILE_ORBIT };
      } else {
        // Valores originais para desktop
        initialPosition = { x: 3.2, y: -11.3, z: -8.4 };
        initialRotation = { x: 0.3, y: 0.6, z: 0.0 };
        cameraPos = { x: 0, y: 2, z: 8 };
      }

      model.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      model.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);

      // Posição inicial da câmera
      modelCamera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
      modelCamera.lookAt(0, 0, 0);
    
      // Atualizar targets para scroll
      targetPosition = initialPosition;
      targetRotation = initialRotation;
      targetCameraPos = cameraPos;
    }

    // scroll cinemático otimizado para fluidez
    let scrollTimeout;
    let isScrolling = false;
    let rafId = null;

    function setupScrollAnimation() {
      addEventListener("scroll", onWindowScroll);
      function onWindowScroll() {
        // Marcar tempo de scroll para throttling adaptativo
        lastScrollTime = performance.now();

        // Usar requestAnimationFrame para máxima fluidez
        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          updateModelOnScroll();
          rafId = null;
        });
      }
      cleanups.push(() => removeEventListener("scroll", onWindowScroll));

      // ScrollTrigger para explosão/remontagem do modelo na seção #contato
      const contatoSection = document.getElementById("contato");
      if (contatoSection) {
        ScrollTrigger.create({
          trigger: contatoSection,
          start: "top 80%", // Dispara quando o topo da seção atinge 80% da viewport
          end: "top 20%",   // Até quando o topo atinge 20%
          onEnter: () => {
            if (model && modelLoaded) {
              triggerModelExplosion();
            } else if (!model || !modelLoaded) {
              // Modelo ainda não carregou, marcar para explodir quando carregar
              pendingExplosion = true;
            }
          },
          onLeaveBack: () => {
            if (model && modelLoaded && modelExplosionActive) {
              reverseModelExplosion();
            }
          },
          onEnterBack: () => {
            // Re-explodir se voltar para a seção contato
            if (model && modelLoaded) {
              triggerModelExplosion();
            }
          },
          // Não usar once: true para permitir múltiplas explosões/remontagens
        });
      } else {
        console.warn("Seção #contato não encontrada para configurar explosão");
      }
    }

    // Variáveis para interpolação suave
    let targetRotation = { x: 0.3, y: 0.6, z: 0.0 };
    let targetPosition = { x: 3.2, y: -11.3, z: -8.4 };
    let targetCameraPos = { x: 0, y: 2, z: 12 }; // Posição mais frontal
    try {
      window.__modelTargets = { targetRotation, targetPosition, targetCameraPos };
    } catch (_) {}
    const lerpFactor = 0.25; // Velocidade de interpolação (mais responsiva)

    // A explosão só congela o modelo enquanto as peças saem ou estão soltas;
    // na remontagem ele já acompanha o scroll (senão "pula" ao terminar).
    const isModelFrozen = () =>
      explosion.state === "exploding" || explosion.state === "exploded";

    function updateModelOnScroll() {
      if (isModelFrozen()) return;
      // Se o painel de controles do modelo estiver visível, não sobrescrever
      // os valores-alvo ajustados manualmente pelos sliders.
      try {
        const panel = document.getElementById("model-controls-panel");
        if (panel) {
          const cs = getComputedStyle(panel);
          const panelVisible =
            cs.display !== "none" && cs.visibility !== "hidden";
          if (panelVisible) {
            // Quando o painel está visível, desabilitar completamente o controle de scroll
            return;
          }
        }
      } catch (_) {}

      const max = document.documentElement.scrollHeight - innerHeight;
      const p = Math.max(0, Math.min(1, scrollY / max));

      // Controle do header (integrado para evitar múltiplos listeners)
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }
      lastScrollY = currentScrollY;

      // Atualizar modelo apenas se carregado
      if (!model) return;

      // Ajustar posições baseado no tamanho da tela
      const isMobile = window.innerWidth <= 768;
    
      // Posições definidas pelo usuário
      let initialPosition, initialRotation, finalPosition, finalRotation;
    
      if (isMobile) {
        // termina de frente para a câmera (mesma rotação final do desktop)
        initialPosition = { x: 0, y: -11.3, z: -8.4 };
        initialRotation = { x: 0.3, y: 0.6, z: 0.0 };
        finalPosition = { x: -6.4, y: -11.6, z: 0.0 };
        finalRotation = { x: 0.0, y: 4.75, z: 0.0 };
      } else {
        initialPosition = { x: 3.2, y: -11.3, z: -8.4 };
        initialRotation = { x: 0.3, y: 0.6, z: 0.0 };
        finalPosition = { x: -6.4, y: -11.6, z: 0.0 };
        finalRotation = { x: 0.0, y: 4.75, z: 0.0 };
      }

      // Calcular progresso baseado na posição da seção #skills (skill three)
      const skillsSection = document.getElementById("skills");
      let targetScrollY = isMobile ? 2800 : 3863; // Fallback diferente para mobile/desktop
      if (skillsSection) {
        // Usar offsetTop para obter a posição absoluta da seção no documento
        // Isso é mais confiável que getBoundingClientRect() que depende do scroll atual
        let element = skillsSection;
        let top = 0;
        while (element) {
          top += element.offsetTop;
          element = element.offsetParent;
        }
        targetScrollY = top;
      }
      const scrollProgress = Math.max(
        0,
        Math.min(1, currentScrollY / targetScrollY)
      );

      // Interpolar entre posição inicial e final baseado no progresso do scroll
      targetRotation.x =
        initialRotation.x +
        (finalRotation.x - initialRotation.x) * scrollProgress;
      targetRotation.y =
        initialRotation.y +
        (finalRotation.y - initialRotation.y) * scrollProgress;
      targetRotation.z =
        initialRotation.z +
        (finalRotation.z - initialRotation.z) * scrollProgress;

      targetPosition.x =
        initialPosition.x +
        (finalPosition.x - initialPosition.x) * scrollProgress;
      targetPosition.y =
        initialPosition.y +
        (finalPosition.y - initialPosition.y) * scrollProgress;
      targetPosition.z =
        initialPosition.z +
        (finalPosition.z - initialPosition.z) * scrollProgress;

      // Câmera orbital suave baseada no progresso
      // no celular a câmera se aproxima até a tela do monitor ocupar a largura
      const orbitRadius = isMobile
        ? MOBILE_ORBIT - scrollProgress * 3
        : 8 + scrollProgress * 2;
      const orbitAngle = scrollProgress * Math.PI * 1.5;

      targetCameraPos.x = Math.sin(orbitAngle) * orbitRadius;
      targetCameraPos.y = 2 + Math.sin(scrollProgress * Math.PI) * 1.5;
      targetCameraPos.z = Math.cos(orbitAngle) * orbitRadius;
    }

    // Função de interpolação suave (chamada no loop principal)
    function smoothUpdateModel() {
      if (!model || !modelLoaded) return;
      if (isModelFrozen()) return;

      // Verificar se o painel de controles está visível
      let panelVisible = false;
      try {
        const panel = document.getElementById("model-controls-panel");
        if (panel) {
          const cs = getComputedStyle(panel);
          panelVisible = cs.display !== "none" && cs.visibility !== "hidden";
        }
      } catch (_) {}

      // Se o painel estiver visível, aplicar apenas as transformações dos sliders
      if (panelVisible) {
        // Aplicar posição diretamente dos sliders (sem interpolação)
        model.position.x = targetPosition.x;
        model.position.y = targetPosition.y;
        model.position.z = targetPosition.z;

        // Aplicar rotação diretamente dos sliders (sem interpolação)
        model.rotation.x = targetRotation.x;
        model.rotation.y = targetRotation.y;
        model.rotation.z = targetRotation.z;

        // Aplicar posição da câmera diretamente (sem interpolação)
        modelCamera.position.x = targetCameraPos.x;
        modelCamera.position.y = targetCameraPos.y;
        modelCamera.position.z = targetCameraPos.z;
        modelCamera.lookAt(0, 0, 0);
      } else {
        // Interpolação suave da rotação
        model.rotation.x += (targetRotation.x - model.rotation.x) * lerpFactor;
        model.rotation.y += (targetRotation.y - model.rotation.y) * lerpFactor;
        model.rotation.z += (targetRotation.z - model.rotation.z) * lerpFactor;

        // Interpolação suave da posição
        model.position.x += (targetPosition.x - model.position.x) * lerpFactor;
        model.position.y += (targetPosition.y - model.position.y) * lerpFactor;
        model.position.z += (targetPosition.z - model.position.z) * lerpFactor;

        // Interpolação suave da câmera
        modelCamera.position.x +=
          (targetCameraPos.x - modelCamera.position.x) * lerpFactor;
        modelCamera.position.y +=
          (targetCameraPos.y - modelCamera.position.y) * lerpFactor;
        modelCamera.position.z +=
          (targetCameraPos.z - modelCamera.position.z) * lerpFactor;
        modelCamera.lookAt(0, 0, 0);
      }
    }

    // loop otimizado para fluidez máxima
    let t = 0;
    let lastModelRender = 0;
    let lastScrollTime = 0;
    const MODEL_RENDER_INTERVAL = 33; // ~30fps padrão
    const SCROLL_RENDER_INTERVAL = 8; // ~120fps durante scroll

    // O canvas do fundo (#hero-canvas) não tem nada na cena: basta limpar uma vez.
    renderer.render(scene, camera);

    let lastFrameTime = performance.now();

    function loop() {
      const frameNow = performance.now();
      const dt = Math.min(0.05, (frameNow - lastFrameTime) / 1000);
      lastFrameTime = frameNow;
      t += dt;

      // Atualizar modelo com interpolação suave
      smoothUpdateModel();

      // Fragmentos e onda de choque da explosão
      updateExplosionFx(dt);

      // Sobrecarga: o PC treme cada vez mais até explodir
      if (model && explosion.state === "overload") {
        const k = Math.min(1, (frameNow - explosion.overloadStart) / OVERLOAD_MS);
        const amp = 0.04 + 0.16 * k * k;
        model.position.x += (Math.random() - 0.5) * amp;
        model.position.y += (Math.random() - 0.5) * amp;
        model.rotation.z = (Math.random() - 0.5) * 0.05 * k;
      }

      // Fogo sobre o monitor
      updateBurn(dt);

      // Renderizar modelo apenas se carregado e com throttling adaptativo
      if (modelLoaded && modelScene && modelRenderer) {
        const timeSinceLastRender = frameNow - lastModelRender;
        const timeSinceLastScroll = frameNow - lastScrollTime;

        // Explodido e sem efeitos: o modelo está invisível, nada a desenhar
        const idleAfterExplosion =
          explosion.state === "exploded" &&
          !explosionFx.active &&
          explosion.finalFrameDrawn;

        let renderInterval = MODEL_RENDER_INTERVAL; // Padrão: 30fps
        if (timeSinceLastScroll < 200) renderInterval = SCROLL_RENDER_INTERVAL;
        if (
          explosion.state === "overload" ||
          explosion.state === "exploding" ||
          explosion.state === "assembling" ||
          explosionFx.active
        ) {
          renderInterval = 0; // quadro a quadro durante a explosão
        }

        if (!idleAfterExplosion && timeSinceLastRender >= renderInterval) {
          updateMonitorScreen();
          drawPcScreen(frameNow);
          modelRenderer.render(modelScene, modelCamera);
          lastModelRender = frameNow;
          if (explosion.state === "exploded" && !explosionFx.active) {
            explosion.finalFrameDrawn = true;
          }
        }
      }

      if (!stopped) loopId = requestAnimationFrame(loop);
    }
    loop();

  const onResize = () => {
    try {
      if (
        typeof camera === "undefined" ||
        typeof renderer === "undefined" ||
        !camera ||
        !renderer
      )
        return;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    } catch (_) {
      return;
    }
    renderFX();

    if (modelCamera) {
      modelCamera.aspect = innerWidth / innerHeight;
      modelCamera.updateProjectionMatrix();
    }
    if (modelRenderer) {
      modelRenderer.setSize(innerWidth, innerHeight);
    }
  
    // Reaplicar posição inicial quando redimensionar (especialmente mobile/desktop)
    if (model && modelLoaded) {
      applyInitialPosition();
    }
  };
  addEventListener("resize", onResize);
  cleanups.push(() => removeEventListener("resize", onResize));

  // O modelo só inicia depois de toda a cena estar declarada
  initModel3D();

  return () => {
    stopped = true;
    cancelAnimationFrame(loopId);
    cleanups.forEach((fn) => fn());
    try {
      modelRenderer?.dispose();
      modelRenderer?.domElement?.remove();
      renderer?.dispose();
    } catch (_) {}
    engine.model = null;
    engine.modelLoaded = false;
  };
}
