/* ====================================================
   SCRIPT.JS — Portfólio Eliane Alves Leandro
   Todas as interações do site comentadas para fácil edição
   ==================================================== */

/* ====================================================
   1. UTILITÁRIO: ESPERAR O DOM CARREGAR
   Tudo dentro desta função só roda depois que a página
   terminar de carregar — boa prática!
   ==================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------
     2. ANO ATUAL NO RODAPÉ
     Atualiza automaticamente sem precisar editar o HTML
     -------------------------------------------------- */
  const spanAno = document.getElementById('ano-atual');
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------
     3. TEMA CLARO / ESCURO
     Salva a preferência do usuário no localStorage
     -------------------------------------------------- */
  const btnTema    = document.getElementById('btn-tema');
  const iconeTema  = btnTema ? btnTema.querySelector('.icone-tema') : null;
  const body       = document.body;

  // Ícones para cada modo
  const ICONE_CLARO  = '&#9788;';  // Sol
  const ICONE_ESCURO = '&#9790;';  // Lua

  // Verifica se o usuário já escolheu um tema antes
  const temaSalvo = localStorage.getItem('tema-eliane');
  if (temaSalvo === 'escuro') {
    body.classList.add('dark-mode');
    if (iconeTema) iconeTema.innerHTML = ICONE_CLARO;
  }

  // Alterna o tema ao clicar no botão
  if (btnTema) {
    btnTema.addEventListener('click', function () {
      const estaEscuro = body.classList.toggle('dark-mode');

      // Atualiza o ícone e salva a preferência
      if (iconeTema) {
        iconeTema.innerHTML = estaEscuro ? ICONE_CLARO : ICONE_ESCURO;
      }
      localStorage.setItem('tema-eliane', estaEscuro ? 'escuro' : 'claro');
    });
  }


  /* --------------------------------------------------
     4. MENU MOBILE (HAMBÚRGUER)
     Abre e fecha o menu em telas pequenas
     -------------------------------------------------- */
  const btnMenu   = document.getElementById('btn-menu');
  const navLinks  = document.getElementById('nav-links');

  // Cria overlay para fechar o menu ao clicar fora
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function abrirMenu() {
    navLinks.classList.add('aberto');
    btnMenu.classList.add('aberto');
    btnMenu.setAttribute('aria-expanded', 'true');
    overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden'; // Impede scroll do fundo
  }

  function fecharMenu() {
    navLinks.classList.remove('aberto');
    btnMenu.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('ativo');
    document.body.style.overflow = '';
  }

  if (btnMenu) {
    btnMenu.addEventListener('click', function () {
      const estaAberto = navLinks.classList.contains('aberto');
      estaAberto ? fecharMenu() : abrirMenu();
    });
  }

  // Fecha o menu ao clicar no overlay
  overlay.addEventListener('click', fecharMenu);

  // Fecha o menu ao clicar em um link de navegação
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });
  }

  // Fecha o menu ao pressionar Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharMenu();
  });


  /* --------------------------------------------------
     5. HEADER — MUDA ESTILO AO ROLAR
     Adiciona fundo sólido quando o usuário rola a página
     -------------------------------------------------- */
  const cabecalho = document.getElementById('cabecalho');

  function atualizarHeader() {
    if (window.scrollY > 60) {
      cabecalho.classList.add('scrollado');
    } else {
      cabecalho.classList.remove('scrollado');
    }
  }

  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader(); // Chama uma vez ao carregar


  /* --------------------------------------------------
     6. LINK DE NAVEGAÇÃO ATIVO
     Destaca o link correspondente à seção visível
     -------------------------------------------------- */
  const secoes    = document.querySelectorAll('section[id]');
  const linksNav  = document.querySelectorAll('.nav-link');

  function atualizarLinkAtivo() {
    let secaoAtual = '';
    const offset = 120; // Margem do topo

    secoes.forEach(function (secao) {
      const topo = secao.offsetTop - offset;
      if (window.scrollY >= topo) {
        secaoAtual = secao.getAttribute('id');
      }
    });

    linksNav.forEach(function (link) {
      link.classList.remove('ativo');
      if (link.getAttribute('href') === '#' + secaoAtual) {
        link.classList.add('ativo');
      }
    });
  }

  window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });


  /* --------------------------------------------------
     7. BOTÃO VOLTAR AO TOPO
     Aparece após rolar 400px e leva ao topo ao clicar
     -------------------------------------------------- */
  const btnTopo = document.getElementById('btn-topo');

  function atualizarBtnTopo() {
    if (window.scrollY > 400) {
      btnTopo.classList.add('visivel');
    } else {
      btnTopo.classList.remove('visivel');
    }
  }

  if (btnTopo) {
    window.addEventListener('scroll', atualizarBtnTopo, { passive: true });

    btnTopo.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* --------------------------------------------------
     8. TEXTO ANIMADO NO HERO (efeito de digitação)
     Alterna entre frases com efeito de máquina de escrever
     -------------------------------------------------- */
  const elementoTexto = document.getElementById('texto-animado');

  // Lista de frases para alternar — edite à vontade!
  const frases = [
    'transforma marcas.',
    'conta histórias.',
    'conecta pessoas.',
    'inspira escolhas.',
    'cria experiências.',
  ];

  let indiceFrase    = 0;  // Qual frase está sendo exibida
  let indiceChar     = 0;  // Qual caractere está sendo digitado
  let apagando       = false;
  let pausando       = false;

  const VELOCIDADE_DIGITAR = 80;   // ms por caractere ao digitar
  const VELOCIDADE_APAGAR  = 40;   // ms por caractere ao apagar
  const PAUSA_FRASE        = 2000; // ms de pausa após digitar a frase completa
  const PAUSA_APAGADO      = 400;  // ms de pausa após apagar tudo

  function animarTexto() {
    if (!elementoTexto) return;

    const fraseAtual = frases[indiceFrase];

    if (pausando) {
      pausando = false;
      setTimeout(animarTexto, apagando ? PAUSA_APAGADO : PAUSA_FRASE);
      return;
    }

    if (!apagando) {
      // Digitando
      elementoTexto.textContent = fraseAtual.substring(0, indiceChar + 1);
      indiceChar++;

      if (indiceChar === fraseAtual.length) {
        // Terminou de digitar — pausa antes de apagar
        apagando = true;
        pausando = true;
        setTimeout(animarTexto, PAUSA_FRASE);
      } else {
        setTimeout(animarTexto, VELOCIDADE_DIGITAR);
      }
    } else {
      // Apagando
      elementoTexto.textContent = fraseAtual.substring(0, indiceChar - 1);
      indiceChar--;

      if (indiceChar === 0) {
        // Terminou de apagar — passa para próxima frase
        apagando = false;
        pausando = true;
        indiceFrase = (indiceFrase + 1) % frases.length;
        setTimeout(animarTexto, PAUSA_APAGADO);
      } else {
        setTimeout(animarTexto, VELOCIDADE_APAGAR);
      }
    }
  }

  // Inicia a animação após um pequeno delay
  setTimeout(animarTexto, 800);


  /* --------------------------------------------------
     9. ANIMAÇÕES AO ROLAR (Intersection Observer)
     Elementos aparecem com animação quando ficam visíveis
     -------------------------------------------------- */
  const elementosAnimados = document.querySelectorAll(
    '.fade-in, .slide-up, .slide-left, .slide-right'
  );

  // Intersection Observer: observa quando os elementos entram na tela
  const observadorAnimacao = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');

          // Para de observar após animar (melhora performance)
          observadorAnimacao.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.15,    // Elemento precisa estar 15% visível
      rootMargin: '0px 0px -50px 0px', // Margem de ativação
    }
  );

  elementosAnimados.forEach(function (el) {
    observadorAnimacao.observe(el);
  });

  // O hero já começa visível (não precisa de scroll)
  const heroConteudo = document.querySelector('.hero-conteudo');
  if (heroConteudo) {
    setTimeout(function () {
      heroConteudo.classList.add('visivel');
    }, 200);
  }


  /* --------------------------------------------------
     10. BARRAS DE PROGRESSO DAS HABILIDADES
     Anima as barras quando a seção fica visível
     -------------------------------------------------- */
  const barras = document.querySelectorAll('.barra-progresso');

  const observadorBarras = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          const barra = entrada.target;
          const progresso = barra.getAttribute('data-progresso');

          // Pequeno delay para a animação ficar mais suave
          setTimeout(function () {
            barra.style.width = progresso + '%';
          }, 300);

          observadorBarras.unobserve(barra);
        }
      });
    },
    { threshold: 0.5 }
  );

  barras.forEach(function (barra) {
    observadorBarras.observe(barra);
  });


  /* --------------------------------------------------
     11. FILTRO DE PROJETOS
     Mostra/oculta cards conforme a categoria selecionada
     -------------------------------------------------- */
  const filtrosBtns  = document.querySelectorAll('.filtro-btn');
  const projetoCards = document.querySelectorAll('.projeto-card');

  filtrosBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filtro = btn.getAttribute('data-filtro');

      // Atualiza o botão ativo
      filtrosBtns.forEach(function (b) { b.classList.remove('ativo'); });
      btn.classList.add('ativo');

      // Filtra os cards
      projetoCards.forEach(function (card) {
        const categorias = card.getAttribute('data-categoria') || '';

        if (filtro === 'todos' || categorias.includes(filtro)) {
          // Mostra o card com animação suave
          card.classList.remove('oculto');
          card.style.animation = 'aparecer-card 0.4s ease forwards';
        } else {
          // Oculta o card
          card.classList.add('oculto');
        }
      });
    });
  });

  // Adiciona a animação de aparecer ao CSS dinamicamente
  const estiloFiltro = document.createElement('style');
  estiloFiltro.textContent = `
    @keyframes aparecer-card {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(estiloFiltro);


  /* --------------------------------------------------
     12. MODAL DE PROJETO
     Abre um modal com mais detalhes ao clicar em "Ver mais"
     -------------------------------------------------- */
  const modal          = document.getElementById('modal-projeto');
  const modalOverlay   = document.getElementById('modal-overlay');
  const modalFechar    = document.getElementById('modal-fechar');
  const modalTitulo    = document.getElementById('modal-titulo');
  const modalTexto     = document.getElementById('modal-texto');
  const modalTagsEl    = document.getElementById('modal-tags');

  // Dados extras de cada projeto (indexados pelo título)
  const dadosProjetos = {
    'Linha Qualitá': {
      descricao: 'O projeto de redesign da linha Qualitá envolveu pesquisa de mercado, análise de concorrentes e desenvolvimento de uma nova linguagem visual que mantivesse a tradição da marca enquanto modernizava sua comunicação. Foram criadas embalagens para mais de 20 produtos, com foco em hierarquia visual, legibilidade e apelo no ponto de venda.',
      tags: ['Embalagem', 'Branding', 'Pesquisa de Mercado', 'Identidade Visual'],
    },
    'Taeq Natural': {
      descricao: 'A linha Taeq Natural demandou uma abordagem sustentável e contemporânea. O projeto explorou materiais eco-friendly, paleta de cores inspirada na natureza e tipografia orgânica. O resultado foi uma família de embalagens coesa que comunica saúde, naturalidade e responsabilidade ambiental.',
      tags: ['Embalagem', 'Sustentabilidade', 'Natureza', 'Orgânico'],
    },
    'Club des Sommeliers': {
      descricao: 'Os rótulos para a linha Club des Sommeliers foram desenvolvidos com inspiração na cultura europeia do vinho. Cada rótulo conta uma história visual única, com ilustrações autorais, tipografia clássica e acabamentos especiais que elevam a percepção de valor do produto.',
      tags: ['Rótulo', 'Vinho', 'Premium', 'Ilustração', 'Tipografia'],
    },
    'Ever — Identidade Visual': {
      descricao: 'O projeto Ever foi um trabalho completo de construção de marca, iniciando pela pesquisa de usuário e benchmarking, passando pela definição de posicionamento e tom de voz, até a criação do sistema visual completo: logo, paleta, tipografia, ícones e aplicações.',
      tags: ['Branding', 'UX Research', 'Identidade Visual', 'Sistema de Design'],
    },
    'UX em Cosméticos': {
      descricao: 'Pesquisa qualitativa e quantitativa sobre a experiência de compra de cosméticos criativos. O projeto incluiu entrevistas em profundidade, mapeamento de jornada do usuário, análise de pontos de dor e oportunidades de design, culminando em recomendações estratégicas para o desenvolvimento de novos produtos.',
      tags: ['UX Research', 'Entrevistas', 'Jornada do Usuário', 'Cosméticos'],
    },
    'Food Branding': {
      descricao: 'Projeto de branding para uma linha de alimentos artesanais que une tradição e modernidade. A identidade visual foi construída em torno de elementos que evocam autenticidade, sabor e cuidado artesanal, com aplicações em embalagens, rótulos e materiais de comunicação.',
      tags: ['Branding', 'Alimentos', 'Artesanal', 'Identidade Visual'],
    },
  };

  // Abre o modal ao clicar em "Ver mais"
  document.querySelectorAll('.btn-ver-mais').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card   = btn.closest('.projeto-card');
      const titulo = card.querySelector('.projeto-titulo').textContent;
      const dados  = dadosProjetos[titulo];

      if (!dados) return;

      // Preenche o modal com os dados do projeto
      modalTitulo.textContent = titulo;
      modalTexto.textContent  = dados.descricao;

      // Cria as tags do modal
      modalTagsEl.innerHTML = '';
      dados.tags.forEach(function (tag) {
        const span = document.createElement('span');
        span.className   = 'tag';
        span.textContent = tag;
        modalTagsEl.appendChild(span);
      });

      // Exibe o modal
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      // Foca no botão de fechar (acessibilidade)
      setTimeout(function () { modalFechar.focus(); }, 100);
    });
  });

  // Fecha o modal
  function fecharModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (modalFechar)  modalFechar.addEventListener('click', fecharModal);
  if (modalOverlay) modalOverlay.addEventListener('click', fecharModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      fecharModal();
    }
  });


  /* --------------------------------------------------
     13. FORMULÁRIO DE CONTATO
     Validação e feedback visual ao enviar
     -------------------------------------------------- */
  const formContato = document.getElementById('form-contato');
  const feedback    = document.getElementById('form-feedback');

  if (formContato) {
    formContato.addEventListener('submit', function (e) {
      e.preventDefault(); // Impede o envio real (sem backend)

      const nome     = document.getElementById('nome').value.trim();
      const email    = document.getElementById('email').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();

      // Validação simples dos campos obrigatórios
      if (!nome || !email || !mensagem) {
        mostrarFeedback('Por favor, preencha todos os campos obrigatórios.', 'erro');
        return;
      }

      // Validação básica do formato de e-mail
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        mostrarFeedback('Por favor, insira um e-mail válido.', 'erro');
        return;
      }

      // Simula envio bem-sucedido (substitua por fetch() para envio real)
      const btnSubmit = formContato.querySelector('[type="submit"]');
      btnSubmit.disabled    = true;
      btnSubmit.textContent = 'Enviando...';

      setTimeout(function () {
        mostrarFeedback(
          '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.',
          'sucesso'
        );
        formContato.reset();
        btnSubmit.disabled    = false;
        btnSubmit.innerHTML   = 'Enviar Mensagem <span aria-hidden="true">&#10148;</span>';
      }, 1500);
    });
  }

  // Exibe o feedback do formulário
  function mostrarFeedback(mensagem, tipo) {
    if (!feedback) return;

    feedback.textContent = mensagem;
    feedback.className   = 'form-feedback ' + tipo;

    // Remove o feedback após 5 segundos
    setTimeout(function () {
      feedback.className   = 'form-feedback';
      feedback.textContent = '';
    }, 5000);
  }


  /* --------------------------------------------------
     14. EFEITO PARALLAX SUAVE NO HERO
     As formas do fundo se movem levemente ao rolar
     -------------------------------------------------- */
  const formas = document.querySelectorAll('.forma');

  function atualizarParallax() {
    const scrollY = window.scrollY;

    formas.forEach(function (forma, i) {
      // Cada forma se move em velocidade diferente
      const velocidade = 0.05 + i * 0.03;
      const deslocamento = scrollY * velocidade;
      forma.style.transform = 'translateY(' + deslocamento + 'px)';
    });
  }

  // Só ativa o parallax em telas maiores (performance em mobile)
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', atualizarParallax, { passive: true });
  }


  /* --------------------------------------------------
     15. EFEITO DE HOVER NOS CARDS DE PROJETO (tilt 3D)
     Os cards inclinam levemente ao passar o mouse
     -------------------------------------------------- */
  const cardsComTilt = document.querySelectorAll('.projeto-card, .habilidade-card');

  cardsComTilt.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      // Só ativa em telas maiores
      if (window.innerWidth < 768) return;

      const rect     = card.getBoundingClientRect();
      const centroX  = rect.left + rect.width / 2;
      const centroY  = rect.top  + rect.height / 2;
      const deltaX   = (e.clientX - centroX) / (rect.width / 2);
      const deltaY   = (e.clientY - centroY) / (rect.height / 2);

      // Limita a inclinação máxima a 6 graus
      const rotX = -deltaY * 6;
      const rotY =  deltaX * 6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });


  /* --------------------------------------------------
     16. CONTADOR ANIMADO NAS ESTATÍSTICAS
     Os números sobem gradualmente quando ficam visíveis
     -------------------------------------------------- */
  const statsNums = document.querySelectorAll('.stat-numero');

  const observadorStats = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;

        const el    = entrada.target;
        const texto = el.textContent;

        // Extrai o número do texto (ignora símbolos como + e %)
        const num = parseInt(texto.replace(/[^0-9]/g, ''), 10);
        if (isNaN(num)) return; // Ignora "∞" e outros não-numéricos

        const sufixo = texto.replace(/[0-9]/g, ''); // Ex: "+", "%"
        let atual    = 0;
        const duracao = 1200; // ms
        const passos  = 40;
        const intervalo = duracao / passos;
        const incremento = num / passos;

        const timer = setInterval(function () {
          atual += incremento;
          if (atual >= num) {
            atual = num;
            clearInterval(timer);
          }
          el.textContent = Math.floor(atual) + sufixo;
        }, intervalo);

        observadorStats.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statsNums.forEach(function (el) {
    observadorStats.observe(el);
  });


  /* --------------------------------------------------
     FIM DO SCRIPT
     Todas as funcionalidades foram inicializadas!
     -------------------------------------------------- */
  console.log('✨ Portfólio da Eliane carregado com sucesso!');

}); // Fim do DOMContentLoaded
