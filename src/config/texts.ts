/**
 * Todos os textos do portfólio. Troque aqui o conteúdo.
 * Itens marcados com TODO são exemplos/placeholders: ajuste antes de publicar.
 */
export const texts = {
  meta: {
    title: "Custódio Titosse — Software Developer · Cypherpunk · Deep Learning",
    description:
      "Custódio Titosse — Desenvolvedor de Software com interesse em tecnologias cypherpunk, criptografia, Bitcoin, sistemas descentralizados e Deep Learning.",
    lang: "pt-BR",
  },

  loading: { initializing: "INITIALIZING..." },

  navigation: {
    brand: "Custódio Titosse",
    links: {
      home: "Home",
      servicos: "Serviços",
      experiencia: "Resumo",
      projetos: "Projetos",
      skills: "Skills",
      contato: "Contato",
    },
  },

  hero: {
    kicker: "Software Developer • Cypherpunk • Deep Learning",
    title: "Construindo software e explorando criptografia",
    subtitle:
      "Sou Custódio Titosse um desenvolvedor de software, interessado na construção de sistemas, aplicações seguras e tecnologias que promovem privacidade e autonomia digital. Exploro o ecossistema cypherpunk, Bitcoin e criptografia, enquanto estudo Deep Learning e visão computacional para desenvolver sistemas inteligentes.",
    chips: [] as string[],
    ctas: [
      { label: "Ver projetos", href: "#projetos" },
      { label: "Falar comigo", href: "#contato" },
    ],  
    cv: { label: "Download CV", href: "../public/cv-custodio.pdf" },
    socials: [
      { name: "GitHub", icon: "si:github", href: "https://github.com/CUSTcoding/" },
      { name: "LinkedIn", icon: "tb:brand-linkedin", href: "https://www.linkedin.com/in/custodio-da-sara-titosse/" },
      { name: "Nostr", icon: "si:big_nostr", href: "https://primal.net/p/nprofile1qqsx2yqvc3q7zmrrtepmtsggx5rkhs6mccdnk38702zky6n9elyvcdc7sjdth" },
      { name: "X", icon: "si:x", href: "https://x.com/CustCoding" },
    ],
    // TODO: números de exemplo — troque pelos seus
    stats: [
      { value: 3, suffix: "+", label: "Anos de experiência" },
      { value: 8, suffix: "", label: "Projetos concluídos" },
      { value: 12, suffix: "", label: "Tecnologias dominadas" },
      { value: 500, suffix: "+", label: "Commits de código" },
    ],
    tagline: "Aberto a colaboração e projectos tecnológicos",
  },

  sobre: {
    title: "Sobre mim",
    description:
      "Sou desenvolvedor e arquitecto de software, com foco em Backend Engineering e arquitectura de sistemas distribuídos e escaláveis. Actuo no universo cypherpunk, com foco em criptografia, Bitcoin, privacidade digital e tecnologias descentralizadas. Desenvolvo também soluções baseadas em Deep Learning, com especialização em visão computacional.",
    cards: [
      {
        dataText: "ATIVO",
        title: "Momento",
        description:
          "Actualmente, sou Backend Developer na Source Code, trabalhando no desenvolvimento de sistemas de recolha de dados para o MISAU e a UNICEF. Sou fundador e Tech Lead da Kalhula, uma startup de soluções tecnológicas, e fundador e presidente do BitDevs Maputo, comunidade dedicada ao estudo, investigação e desenvolvimento do ecossistema Bitcoin e da criptografia.",
      },
      {
        dataText: "STACK",
        title: "Tecnologias",
        description: "Linguagens: Rust • Python • Java • Go<br>DevOps: Linux • Docker • Git • GitHub Actions • CI/CD<br>Deep Learning &amp; Computer Vision: PyTorch • OpenCV • Redes Neuronais • Processamento de Imagens<br>Criptografia &amp; Bitcoin: Nostr • Gestão de Chaves • Protocolos Bitcoin<br>Segurança: Pentest • Web Security • API Security • Vulnerability Assessment",
      },
      {
        dataText: "ONLINE",
        title: "Contato",
        description: "Email: custodiotitossetitosse@gmail.com • LinkedIn • WhatsApp • GitHub",
        phone: "+258 84 579 0023",
      },
    ],
  },

  servicos: {
    title: "Serviços",
    intro:
      "Desenvolvimento de software, tecnologias de privacidade e soluções inteligentes com foco em fundamentos, segurança e utilidade.",
    cards: [
      { dataText: "SOFTWARE", title: "Desenvolvimento de Software", description: "Desenvolvimento de aplicações e soluções de software, desde a concepção até à implementação, com foco em desempenho, escalabilidade e manutenção." },
      { dataText: "ARCH", title: "Arquitectura de Software", description: "Desenho de arquitecturas, modelação de sistemas, definição de componentes e estruturas técnicas para aplicações robustas, escaláveis e sustentáveis." },
      { dataText: "CRYPTO / BTC", title: "Criptografia & Desenvolvimento Bitcoin", description: "Desenvolvimento de soluções baseadas em criptografia e tecnologias Bitcoin, incluindo gestão de chaves, assinaturas digitais, carteiras, protocolos, integração com Bitcoin Core e sistemas orientados à privacidade e descentralização." },
      { dataText: "PENTEST", title: "Pentest & Segurança Ofensiva", description: "Análise de vulnerabilidades, testes de segurança e avaliação de aplicações, APIs e infraestruturas para identificar potenciais riscos." },
      { dataText: "DEVOPS", title: "DevOps & Infraestrutura", description: "Automação de ambientes, contentorização, integração e entrega contínua, administração Linux e gestão de infraestruturas de software." },
      { dataText: "DL / CV", title: "Deep Learning & Computer Vision", description: "Desenvolvimento e experimentação de modelos de aprendizagem profunda para reconhecimento, classificação, detecção e análise de imagens." },
    ],
  },

  // Secção "Porquê me contratar?" (abas): o id continua "experiencia" por causa da navegação e da cena 3D.
  experiencia: {
    title: "Resumo",
    intro: "Percurso profissional, áreas de estudo e tecnologias com que trabalho.",
    tabs: [
      {
        key: "experience",
        label: "Experiência",
        heading: "Experiência profissional",
        description: "Backend Developer na Source Code, fundador e Tech Lead da Kalhula e fundador e presidente do BitDevs Maputo.",
        type: "cards",
        cards: [
          { meta: "Backend Developer", title: "Source Code", place: "Sistemas de recolha de dados para o MISAU e a UNICEF" },
          { meta: "Fundador & Tech Lead", title: "Kalhula", place: "Startup de soluções tecnológicas" },
          { meta: "Fundador & Presidente", title: "BitDevs Maputo", place: "Comunidade dedicada ao ecossistema Bitcoin e à criptografia" },
          { meta: "Desenvolvimento contínuo", title: "Projectos independentes", place: "Backend, Criptografia, APIs, arquitectura de Software e Visão Computacional" },
          { meta: "Estágio • 3 meses", title: "Revista Tempo", place: "Full stack Developer  laravel PHP e React• automação de tarefas com Python e IA" },
        ],
      },
      {
        key: "education",
        label: "Estudos",
        heading: "Estudo e investigação aplicada",
        description: "Formação em desenvolvimento web, criptografia, Bitcoin, cloud e segurança informática.",
        type: "cards",
        cards: [
          { meta: "Formação de 3 anos", title: "Programação de Sistemas e Aplicações Web", place: "IICAEG — Instituto Industrial e de Computação Armando Emílio Guebuza" },
          { meta: "Estudo independente", title: "Criptografia & Bitcoin", place: "CryptoHack • Africa Free Routing • Bitcoin Coders" },
          { meta: "Formação", title: "Cloud & Pentest", place: "Empire Cybersecurity — Empire Cybersecurity" },
        ],
      },
      {
        key: "skills",
        label: "Skills",
        heading: "As minhas skills",
        description: "Ferramentas que uso no dia a dia.",
        type: "icons",
        icons: [
          { name: "Rust", icon: "si:rust" },
          { name: "Python", icon: "si:python" },
          { name: "Java", icon: "si:java" },
          { name: "Go", icon: "si:go" },
          { name: "Linux", icon: "si:linux" },
          { name: "Docker", icon: "si:docker" },
          { name: "Git", icon: "si:git" },
          { name: "GitHub Actions", icon: "si:githubactions" },
          { name: "Kubernetes", icon: "si:kubernetes" },
          { name: "Bitcoin", icon: "si:bitcoin" },
          { name: "Deep Learning", icon: "lu:brain-circuit" },
          { name: "Computer Vision", icon: "lu:scan-eye" },
        ],
      },
      {
        key: "about",
        label: "Sobre mim",
        heading: "Sobre mim",
        description: "Desenvolvimento de software, privacidade digital e sistemas inteligentes.",
        type: "info",
        // TODO: confirme/complete os dados
        info: [
          { label: "Nome", value: "Custódio Titosse" },
          { label: "Codinome", value: "Cust coding" },
          { label: "Área", value: "Software Developer" },
          { label: "Local", value: "Moçambique" },
          { label: "Foco", value: "Backend, cypherpunk, Bitcoin e Deep Learning" },
          { label: "Idiomas", value: "Português, Inglês e Espanhol" },
          { label: "Telefone", value: "84 579 0023 | 87 998 0023" },
          { label: "Email", value: "custodiotitossetitosse@gmail.com" },
        ],
      },
    ],
  },

  projetos: {
    title: "Projetos",
    intro:
      "Projectos e experiências que reflectem o meu interesse em engenharia de software, privacidade digital, criptografia e sistemas inteligentes.",
    cardLabel: "PRJ",
    cards: [
      { dataText: "ALFRED WALLET", title: "Alfred Wallet — exploração de uma carteira Bitcoin", description: "Projecto de carteira Bitcoin em desenvolvimento conceptual, com foco em arquitectura backend, integração com Bitcoin Core, Taproot, comunicação segura e privacidade. O objectivo é explorar componentes fundamentais de uma aplicação de autocustódia.", stack: "Rust • Actix Web • Bitcoin • Taproot" },
      { dataText: "NOSTRAPP", title: "NostrApp — comunicação e identidade descentralizada", description: "Projecto em desenvolvimento para explorar o protocolo Nostr, comunicação descentralizada, integração com relays e funcionalidades de identidade e interacção entre utilizadores.", stack: "Next.js • Rust • Actix Web • Nostr" },
      { dataText: "CULTIVOLT", title: "Cultivolt — exploração de IoT e automação", description: "Conceito de sistema IoT para monitorização e automação de processos agrícolas, explorando ESP32, sensores, conectividade e integração entre hardware e software.", stack: "ESP32 • C++ • IoT • Sensores" },
    ],
  },

  skills: {
    title: "Skill Tree",
    level: 29, // soma dos pontos dos atributos
    levelLabel: "NÍVEL",
    relicText: "SOFTWARE • CYPHERPUNK • DEEP LEARNING",
    circuitTexts: ["CUSTODIO TITOSSE", "SOFTWARE CYPHERPUNK", "DEEP LEARNING"],
    attributes: [
    {
      "slot": "frontend",
      "name": "SOFTWARE",
      "level": 6,
      "icon": "/build/images/body-d1fe68db.png",
      "tags": {
        "top": "8W7F1 1A1TI 21TRG",
        "bottom": "8W7F1 1A1TI"
      }
    },
    {
      "slot": "backend",
      "name": "BACKEND",
      "level": 6,
      "icon": "/build/images/reflexes-23a0a79d.png",
      "tags": {
        "top": "8W7F1 1A1TI"
      }
    },
    {
      "slot": "database",
      "name": "CRYPTOGRAPHY",
      "level": 5,
      "icon": "/build/images/tech-2d71880a.png",
      "tags": {
        "top": "8W7F1 1A1TI"
      }
    },
    {
      "slot": "devops",
      "name": "DEVOPS",
      "level": 5,
      "icon": "/build/images/cool-99bb085f.png",
      "tags": {
        "bottom": "8W7F1 1A1TI"
      }
    },
    {
      "slot": "ia",
      "name": "DEEP LEARNING",
      "level": 7,
      "icon": "/build/images/intelligence-b811d04f.png",
      "tags": {
        "bottom": "8W7F1 1A1TI"
      }
    }
  ],
    perksUi: {
      back: "TODOS OS ATRIBUTOS",
      hint: "Passe o mouse (ou toque) em um perk para ver os detalhes",
      perksLabel: "PERKS",
      levelLabel: "NÍVEL",
      interact: {
        touch: "TOQUE EM UM RAMO PARA INTERAGIR",
        mouse: "CLIQUE EM UM RAMO PARA INTERAGIR",
      },
    },
    branches: {
    "frontend": {
      "title": "WEB",
      "subtitle": "Interfaces rápidas, animadas e em 3D",
      "columns": [
        {
          "major": {
            "name": "React",
            "icon": "si:react",
            "level": "3/3",
            "desc": "Componentes, hooks e estado em apps reais."
          },
          "mid": {
            "name": "Next.js",
            "icon": "si:nextdotjs",
            "level": "3/3",
            "desc": "Rotas, SSR e landing pages rápidas.",
            "where": "Xikate"
          },
          "side": [
            {
              "name": "HTML5",
              "icon": "si:html5",
              "level": "1/1",
              "desc": "Marcação semântica desde a base."
            },
            {
              "name": "CSS",
              "icon": "si:css",
              "level": "1/1",
              "desc": "Layouts responsivos e temas com variáveis."
            }
          ]
        },
        {
          "major": {
            "name": "TypeScript",
            "icon": "si:typescript",
            "level": "3/3",
            "desc": "Tipagem forte do front ao back."
          },
          "mid": {
            "name": "Tailwind",
            "icon": "si:tailwindcss",
            "level": "2/3",
            "desc": "Interfaces consistentes com utilitários."
          },
          "side": [
            {
              "name": "Vite",
              "icon": "si:vite",
              "level": "1/1",
              "desc": "Builds e dev server rápidos."
            },
            {
              "name": "Framer Motion",
              "icon": "si:framer",
              "level": "1/1",
              "desc": "Animações declarativas em React."
            }
          ]
        },
        {
          "major": {
            "name": "Three.js",
            "icon": "si:threedotjs",
            "level": "2/3",
            "desc": "Cenas 3D e efeitos no navegador."
          },
          "mid": {
            "name": "GSAP",
            "icon": "si:greensock",
            "level": "2/3",
            "desc": "Animações e ScrollTrigger.",
            "where": "Xikate"
          },
          "side": [
            {
              "name": "Figma",
              "icon": "si:figma",
              "level": "1/1",
              "desc": "Do protótipo ao código."
            },
            {
              "name": "WebGL",
              "icon": "si:webgl",
              "level": "1/1",
              "desc": "Shaders e gráficos na GPU."
            }
          ]
        }
      ]
    },
    "backend": {
      "title": "BACKEND",
      "subtitle": "Serviços rápidos, seguros e concorrentes",
      "columns": [
        {
          "major": {
            "name": "Rust",
            "icon": "si:rust",
            "level": "3/3",
            "desc": "Sistemas seguros e rápidos, sem garbage collector.",
            "where": "NhangaChain"
          },
          "mid": {
            "name": "Concorrência",
            "icon": "lu:workflow",
            "level": "2/3",
            "desc": "Programação assíncrona e paralela."
          },
          "side": [
            {
              "name": "Segurança de memória",
              "icon": "lu:shield-check",
              "level": "1/1",
              "desc": "Ownership e borrowing na base."
            },
            {
              "name": "CLI",
              "icon": "lu:terminal",
              "level": "1/1",
              "desc": "Ferramentas de linha de comando."
            }
          ]
        },
        {
          "major": {
            "name": "Go",
            "icon": "si:go",
            "level": "3/3",
            "desc": "Serviços simples, rápidos e concorrentes."
          },
          "mid": {
            "name": "APIs",
            "icon": "lu:webhook",
            "level": "2/3",
            "desc": "APIs HTTP claras e bem documentadas."
          },
          "side": [
            {
              "name": "Goroutines",
              "icon": "lu:cpu",
              "level": "1/1",
              "desc": "Concorrência leve e previsível."
            },
            {
              "name": "Servidores",
              "icon": "lu:server",
              "level": "1/1",
              "desc": "Serviços prontos para produção."
            }
          ]
        },
        {
          "major": {
            "name": "Python",
            "icon": "si:python",
            "level": "3/3",
            "desc": "Scripts, automação e base do deep learning."
          },
          "mid": {
            "name": "Node.js",
            "icon": "si:nodedotjs",
            "level": "2/3",
            "desc": "APIs e ferramentas em JavaScript."
          },
          "side": [
            {
              "name": "Bash",
              "icon": "si:gnubash",
              "level": "1/1",
              "desc": "Automação no terminal."
            },
            {
              "name": "Linux",
              "icon": "si:linux",
              "level": "1/1",
              "desc": "Servidores e ferramentas do dia a dia."
            }
          ]
        }
      ]
    },
    "database": {
      "title": "CRIPTO",
      "subtitle": "Criptografia, blockchain e segurança",
      "columns": [
        {
          "major": {
            "name": "Criptografia",
            "icon": "lu:lock",
            "level": "3/3",
            "desc": "Cifras, hashing e assinaturas digitais."
          },
          "mid": {
            "name": "Chaves",
            "icon": "lu:key-round",
            "level": "2/3",
            "desc": "Geração, guarda e uso seguro de chaves."
          },
          "side": [
            {
              "name": "Hashing",
              "icon": "lu:hash",
              "level": "1/1",
              "desc": "Integridade e resumos criptográficos."
            },
            {
              "name": "Cifras",
              "icon": "lu:binary",
              "level": "1/1",
              "desc": "Cifras simétricas e assimétricas."
            }
          ]
        },
        {
          "major": {
            "name": "Blockchain",
            "icon": "lu:boxes",
            "level": "3/3",
            "desc": "Blockchain permissionada em Rust para registos médicos.",
            "where": "NhangaChain"
          },
          "mid": {
            "name": "Consenso",
            "icon": "lu:network",
            "level": "2/3",
            "desc": "Acordo entre nós numa rede distribuída."
          },
          "side": [
            {
              "name": "Merkle trees",
              "icon": "lu:git-merge",
              "level": "1/1",
              "desc": "Provas de integridade eficientes."
            },
            {
              "name": "Ledger",
              "icon": "lu:library-big",
              "level": "1/1",
              "desc": "Registos imutáveis e auditáveis."
            }
          ]
        },
        {
          "major": {
            "name": "Cibersegurança",
            "icon": "lu:shield-alert",
            "level": "2/3",
            "desc": "Proteção de sistemas e dados.",
            "where": "AKATSUKI"
          },
          "mid": {
            "name": "Hardening",
            "icon": "lu:shield-check",
            "level": "2/3",
            "desc": "Endurecimento de sistemas e boas práticas."
          },
          "side": [
            {
              "name": "Privacidade",
              "icon": "lu:eye-off",
              "level": "1/1",
              "desc": "Proteção de dados desde o desenho."
            },
            {
              "name": "Autenticação",
              "icon": "lu:fingerprint",
              "level": "1/1",
              "desc": "Identidade e acesso seguros."
            }
          ]
        }
      ]
    },
    "devops": {
      "title": "DEVOPS",
      "subtitle": "CI/CD, contentorização e orquestração de aplicações",
      "columns": [
        {
          "major": {
            "name": "GitHub Actions",
            "icon": "si:githubactions",
            "level": "3/3",
            "desc": "Pipelines CI/CD para testar, validar e publicar alterações automaticamente."
          },
          "mid": {
            "name": "CI/CD",
            "icon": "lu:workflow",
            "level": "2/3",
            "desc": "Integração contínua e entrega automatizada de software."
          },
          "side": [
            {
              "name": "Git",
              "icon": "si:git",
              "level": "1/1",
              "desc": "Controlo de versões para gerir alterações e colaborar em código."
            },
            {
              "name": "Workflows",
              "icon": "lu:waypoints",
              "level": "1/1",
              "desc": "Etapas automatizadas acionadas por eventos no repositório."
            }
          ]
        },
        {
          "major": {
            "name": "Docker",
            "icon": "si:docker",
            "level": "3/3",
            "desc": "Empacotamento de aplicações e dependências em containers reproduzíveis."
          },
          "mid": {
            "name": "Containers",
            "icon": "lu:boxes",
            "level": "2/3",
            "desc": "Execução isolada e consistente entre desenvolvimento e produção."
          },
          "side": [
            {
              "name": "Imagens Docker",
              "icon": "si:docker",
              "level": "1/1",
              "desc": "Imagens versionadas como base para criar containers."
            },
            {
              "name": "Compose",
              "icon": "lu:server",
              "level": "1/1",
              "desc": "Definição e execução conjunta de serviços containerizados."
            }
          ]
        },
        {
          "major": {
            "name": "Kubernetes",
            "icon": "si:kubernetes",
            "level": "2/3",
            "desc": "Orquestração de containers e gestão de aplicações em clusters."
          },
          "mid": {
            "name": "Deployments",
            "icon": "lu:rocket",
            "level": "2/3",
            "desc": "Declarar e atualizar as versões das aplicações em execução."
          },
          "side": [
            {
              "name": "Pods & Services",
              "icon": "lu:network",
              "level": "1/1",
              "desc": "Executar workloads e expô-los dentro do cluster."
            },
            {
              "name": "Scaling",
              "icon": "lu:chart-line",
              "level": "1/1",
              "desc": "Ajustar réplicas para responder à carga das aplicações."
            }
          ]
        }
      ]
    },
    "ia": {
      "title": "IA",
      "subtitle": "Deep learning e agentes",
      "columns": [
        {
          "major": {
            "name": "Deep Learning",
            "icon": "lu:brain-circuit",
            "level": "3/3",
            "desc": "Redes neurais: treino, avaliação e ajuste."
          },
          "mid": {
            "name": "Treino",
            "icon": "lu:activity",
            "level": "2/3",
            "desc": "Ciclos de treino e acompanhamento de métricas."
          },
          "side": [
            {
              "name": "Dados",
              "icon": "lu:database",
              "level": "1/1",
              "desc": "Preparação e limpeza de dados."
            },
            {
              "name": "Avaliação",
              "icon": "lu:chart-line",
              "level": "1/1",
              "desc": "Métricas e validação de modelos."
            }
          ]
        },
        {
          "major": {
            "name": "LLMs",
            "icon": "lu:message-square-text",
            "level": "2/3",
            "desc": "Modelos de linguagem aplicados a produtos."
          },
          "mid": {
            "name": "Agentes",
            "icon": "lu:bot",
            "level": "2/3",
            "desc": "Agentes que usam ferramentas e APIs.",
            "where": "Evolux"
          },
          "side": [
            {
              "name": "Prompts",
              "icon": "lu:square-terminal",
              "level": "1/1",
              "desc": "Instruções claras e testáveis."
            },
            {
              "name": "Embeddings",
              "icon": "lu:waypoints",
              "level": "1/1",
              "desc": "Busca e similaridade semântica."
            }
          ]
        },
        {
          "major": {
            "name": "IA segura",
            "icon": "lu:scan-eye",
            "level": "2/3",
            "desc": "Privacidade e robustez em sistemas de IA."
          },
          "mid": {
            "name": "Deploy",
            "icon": "lu:rocket",
            "level": "1/3",
            "desc": "Levar modelos para produção."
          },
          "side": [
            {
              "name": "GPU",
              "icon": "lu:cpu",
              "level": "1/1",
              "desc": "Treino acelerado por hardware."
            },
            {
              "name": "Notebooks",
              "icon": "lu:notebook-pen",
              "level": "1/1",
              "desc": "Experimentos rápidos e documentados."
            }
          ]
        }
      ]
    }
  },
  },

  contato: {
    title: "Vamos conversar?",
    intro: "Tem um projeto, uma vaga ou uma ideia? Mande uma mensagem.",
    form: {
      title: "Vamos trabalhar juntos",
      text: "Conte um pouco sobre o que você precisa e eu respondo.",
      fields: { name: "Nome", email: "Email", phone: "Telefone", subject: "Assunto", message: "Escreva a sua mensagem aqui." },
      servicePlaceholder: "Escolha um serviço",
      services: ["Backend (Rust / Go)", "Criptografia & segurança", "Deep learning", "Web full stack", "Bitcoin & Nostr", "Outro"],
      submit: "Enviar mensagem",
      // TODO: o formulário abre o seu app de email (mailto). Coloque o seu email real:
      mailTo: "custodiotitossetitosse@gmail.com",
    },
    info: [
      // TODO: dados de contacto reais
      { label: "Telefone", value: "+258 84 579 0023", icon: "lu:phone" },
      { label: "Email", value: "custodiotitossetitosse@gmail.com", icon: "lu:mail" },
      { label: "Local", value: "Moçambique", icon: "lu:map-pin" },
    ],
    links: {
      title: "Links",
      links: [
        { text: "GitHub", href: "#", target: "_blank", rel: "noopener" },
        { text: "LinkedIn", href: "#", target: "_blank", rel: "noopener" },
      ],
    },
    tweaks: {
      title: "Tweaks visuais",
      buttons: { skillTree: "SKILL TREE", model3D: "MODELO 3D" },
      anaglyphLabel: "Intensidade do anaglifo",
      anaglyphDescription: 'Ajuste o split RGB para mais/menos "3D".',
    },
  },

  controls: {
    skillTree: {
      title: "SKILL TREE CONTROLS",
      instructions: "Ctrl + Scroll: Redimensionar | Arrastar: Mover painéis",
      labels: {
        globalScale: "Scale Global:",
        svgScale: "Tamanho SVGs:",
        posX: "Posição X:",
        posY: "Posição Y:",
        cssValues: "Valores CSS:",
      },
      buttons: {
        reset: "RESET",
        capture: "CAPTURE POS",
        copy: "COPY VALUES",
      },
    },
    model3D: {
      title: "MODELO 3D CONTROLS",
      instructions: "Ajuste posição, rotação e escala do modelo 3D",
      labels: {
        positionX: "Position X:",
        positionY: "Position Y:",
        positionZ: "Position Z:",
        scale: "Scale:",
        rotationX: "Rotation X:",
        rotationY: "Rotation Y:",
        rotationZ: "Rotation Z:",
        modelValues: "Valores do Modelo:",
      },
      buttons: {
        reset: "RESET",
        capture: "CAPTURE POS",
        copy: "COPY VALUES",
      },
    },
  },

  footer: {
    copyright: "© {year} Cust Coding | Todos os direitos reservados.",
    social: "Encontre-me no(a)",
  },
};
