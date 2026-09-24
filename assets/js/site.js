/* Munes Bani Fawaz — portfolio. Everything content-related is rendered from assets/data/data.json. */
(() => {
  'use strict';

  const DEFAULT_CV = 'https://mrgiveitaway-tpk.github.io/C.V/';
  const PREVIEW_RATE = 4; // card previews play fast, like the old site
  const ROLES = [
    'Senior Full Stack Software Engineer',
    'Backend & API Engineer',
    'Mobile Developer · Flutter & Kotlin',
    'DevOps Engineer',
    'AI & Automation Builder',
    'Game Developer · Unity',
    'Team Lead & Mentor'
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    [].concat(children).forEach(c => c && node.append(c));
    return node;
  };
  const splitList = str => String(str || '').split('|').map(s => s.trim()).filter(Boolean);

  /* ---------- Preloader ---------- */
  const preloader = $('#preloader');
  let loaded = false;
  const hidePreloader = () => {
    if (loaded) return;
    loaded = true;
    preloader.classList.add('done');
    document.body.classList.remove('is-loading');
  };
  setTimeout(hidePreloader, 2500); // never block the page for long

  /* ---------- Static bits ---------- */
  const now = new Date();
  $('#year').textContent = now.getFullYear();
  const birth = new Date(1998, 8, 4);
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  $('#age').textContent = age;
  // Building software since 2016 (university projects onwards)
  const years = now.getFullYear() - 2016;
  $('#yearsCount').dataset.count = years;
  $('#yearsText').textContent = years;

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const links = $('#navLinks');
  const toggle = $('#navToggle');
  const toTop = $('#toTop');
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const heroCopy = $('#heroCopy');
  const heroVisual = $('#heroVisual');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    toTop.classList.toggle('show', y > 600);
    // Gentle parallax on the hero
    if (!reduceMotion && y < window.innerHeight) {
      heroCopy.style.transform = `translateY(${y * 0.18}px)`;
      heroVisual.style.transform = `translateY(${y * -0.08}px)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('a', links).forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- Cursor glow + card spotlight ---------- */
  if (finePointer && !reduceMotion) {
    const glow = $('#cursorGlow');
    let raf = 0, gx = 0, gy = 0;
    document.addEventListener('pointermove', e => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        raf = 0;
      });
      const card = e.target.closest('.spot');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('on'));
  }

  /* ---------- Typewriter ---------- */
  const typer = $('#typer');
  if (!reduceMotion) {
    let role = 0, chars = ROLES[0].length, deleting = true;
    const tick = () => {
      const text = ROLES[role];
      chars += deleting ? -1 : 1;
      typer.textContent = text.slice(0, chars);
      let delay = deleting ? 35 : 65;
      if (!deleting && chars === text.length) { deleting = true; delay = 1800; }
      else if (deleting && chars === 0) { deleting = false; role = (role + 1) % ROLES.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Canvas helpers ---------- */
  // Runs `draw` every frame only while the canvas is on screen.
  function animateWhileVisible(canvas, setup, draw) {
    const ctx = canvas.getContext('2d');
    let visible = false, frame = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setup(ctx, canvas.clientWidth, canvas.clientHeight);
    };
    const loop = () => {
      if (!visible) { frame = 0; return; }
      draw(ctx, canvas.clientWidth, canvas.clientHeight);
      frame = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    }).observe(canvas);
    window.addEventListener('resize', resize);
    resize();
  }

  if (!reduceMotion) {
    // Particle network in the hero, nudged away by the cursor
    let dots = [];
    const mouse = { x: -9999, y: -9999 };
    const hero = $('#hero');
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

    animateWhileVisible($('#particles'), (ctx, w, h) => {
      const count = Math.min(90, Math.floor((w * h) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
      }));
    }, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        const mdx = d.x - mouse.x, mdy = d.y - mouse.y, md = Math.hypot(mdx, mdy);
        if (md > 0 && md < 120) { d.x += mdx / md; d.y += mdy / md; }
      }
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.22 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    });

    // Matrix rain behind the contact card
    const glyphs = '01アイウエオカキクケコサシスセソ{}[]<>/=+*#$';
    let drops = [], last = 0;
    animateWhileVisible($('#matrix'), (ctx, w) => {
      drops = Array.from({ length: Math.ceil(w / 16) }, () => Math.random() * -40);
    }, (ctx, w, h) => {
      const t = performance.now();
      if (t - last < 55) return;
      last = t;
      ctx.fillStyle = 'rgba(10, 12, 20, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '14px "Geist Mono", monospace';
      drops.forEach((y, i) => {
        ctx.fillStyle = i % 3 ? '#22d3ee' : '#a78bfa';
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * 16, y * 16);
        drops[i] = y * 16 > h && Math.random() > 0.975 ? 0 : y + 1;
      });
    });
  }

  /* ---------- Reveal, counters ---------- */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  const reveal = nodes => nodes.forEach(n => { n.classList.add('reveal'); revealer.observe(n); });

  const counterWatcher = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      counterWatcher.unobserve(target);
      const end = Number(target.dataset.count) || 0;
      if (reduceMotion) { target.textContent = end; return; }
      const start = performance.now(), dur = 1400;
      const step = t => {
        const p = Math.min((t - start) / dur, 1);
        target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(c => counterWatcher.observe(c));

  /* Card videos are heavy: attach the source only when a card nears the screen,
     and only play while it is visible. */
  const videoWatcher = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (!target.getAttribute('src')) target.src = target.dataset.src;
        target.playbackRate = PREVIEW_RATE;
        target.play().catch(() => {});
      } else if (target.getAttribute('src')) {
        target.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  const previewVideo = src => {
    const v = el('video', { 'data-src': src, muted: '', loop: '', playsinline: '', preload: 'none' });
    v.muted = true;
    v.addEventListener('loadedmetadata', () => { v.playbackRate = PREVIEW_RATE; });
    videoWatcher.observe(v);
    return v;
  };

  /* ---------- Data ---------- */
  fetch('assets/data/data.json')
    .then(r => r.json())
    .then(render)
    .catch(err => {
      console.error('Could not load data.json', err);
      hidePreloader();
    });

  function render(data) {
    const config = data.config || {};
    if (Number(config.maintenance_mode) === 1) {
      document.body.innerHTML = '';
      document.body.style.overflow = 'hidden';
      document.body.append(el('iframe', {
        src: 'https://mbanifawaz.github.io/coming-soon/',
        title: 'Coming soon',
        style: 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:99999'
      }));
      return;
    }

    const cv = config.cv_url || DEFAULT_CV;
    $$('[data-cv]').forEach(a => { a.href = cv; });

    const resume = data.resume || {};
    const portfolio = data.portfolio || { filters: [], items: [] };

    renderSocials(data.links || []);
    renderLogos(resume.experience || [], portfolio.items);
    renderWork(portfolio);
    if (resume.summary) $('#summary').textContent = resume.summary.description;
    renderTimeline(resume.experience || []);
    renderEducation(resume.education || []);
    renderSkills(data.skills?.data || []);
    renderQuotes(data.testimonials || []);

    reveal($$('.section-head, .counter, .tile, .services article, .job, .side-card, .contact, .work-bar'));
    const skills = $('#skillsList');
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) { skills.classList.add('in'); obs.disconnect(); }
    }, { threshold: 0.2 }).observe(skills);

    hidePreloader();

    // Content arrives after load, so honour a #section link once it exists.
    const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
  }

  function renderSocials(list) {
    [$('#socials'), $('#footerSocials')].forEach(ul => list.forEach(l => {
      const name = (l.icon.match(/bi-([a-z]+)/) || [, 'link'])[1];
      ul.append(el('li', {}, el('a', {
        href: l.href, target: '_blank', rel: 'noopener', 'aria-label': name, title: name
      }, el('i', { class: l.icon }))));
    }));
  }

  function renderLogos(experience, items) {
    const clean = s => String(s || '').split(' - ')[0].trim();
    const skip = /munes|personal/i;
    const names = [...new Set([
      ...experience.map(e => clean(e.company)),
      ...items.map(i => clean(i.client))
    ].filter(n => n && !skip.test(n)))]
      // "Maple" and "Maple Telecommunications" are the same company: keep the longer name.
      .filter((n, _, all) => !all.some(o => o !== n && o.startsWith(`${n} `)));
    const track = $('#logos');
    // Four copies keep the strip wider than any screen; the animation moves it by half.
    for (let i = 0; i < 4; i++) names.forEach(n => track.append(el('span', { text: n, 'aria-hidden': i ? 'true' : null })));
  }

  /* ---------- Work ---------- */
  let modalList = [];
  let modalIndex = 0;
  let labels = {};

  function renderWork({ filters, items }) {
    labels = Object.fromEntries(filters.map(f => [f.value.replace('.', ''), f.label]));
    const year = i => parseInt((String(i.projectDate).match(/\d{4}/) || [0])[0], 10);
    const sorted = items.map((it, idx) => ({ it, idx }))
      .sort((a, b) => year(b.it) - year(a.it) || a.idx - b.idx)
      .map(x => x.it);

    // Featured case studies
    const featured = items.filter(i => i.featured);
    const featuredBox = $('#featured');
    featured.forEach((item, i) => {
      const media = el('div', { class: 'case-media' },
        item.video ? previewVideo(item.video) : el('img', { src: item.image, alt: '', loading: 'lazy' }));
      const card = el('button', { type: 'button', class: 'case glass spot' }, [
        media,
        el('div', { class: 'case-body' }, [
          el('div', { class: 'case-tag' }, [
            el('b', { text: `0${i + 1}` }),
            el('span', { text: labels[item.category] || 'Project' }),
            el('span', { text: '·' }),
            el('span', { text: item.client })
          ]),
          el('h3', { text: item.title }),
          el('p', { text: item.shortDescription }),
          el('ul', { class: 'checks' }, (item.highlights || []).map(h => el('li', { text: h }))),
          el('div', { class: 'chips' }, splitList(item.stack).slice(0, 6).map(s => el('span', { text: s }))),
          el('span', { class: 'case-cta' }, [document.createTextNode('Read the case study '), el('i', { class: 'bi bi-arrow-right' })])
        ])
      ]);
      card.addEventListener('click', () => openModal(featured, i));
      featuredBox.append(card);
    });
    reveal($$('.case', featuredBox));

    // All projects
    const grid = $('#workGrid');
    const cards = sorted.map(item => {
      const media = el('div', { class: 'card-media' }, [
        item.video ? previewVideo(item.video) : el('img', { src: item.image, alt: '', loading: 'lazy' }),
        el('span', { class: 'badge', text: labels[item.category] || 'Work' }),
        item.video ? el('span', { class: 'play-icon', 'aria-hidden': 'true' }, el('i', { class: 'bi bi-play-fill' })) : null
      ]);
      const card = el('button', { type: 'button', class: 'card glass spot', 'data-cat': item.category }, [
        media,
        el('div', { class: 'card-body' }, [
          el('div', { class: 'card-top' }, [el('span', { text: item.client || '' }), el('span', { text: item.projectDate || '' })]),
          el('h4', { text: item.title }),
          item.shortDescription ? el('p', { text: item.shortDescription }) : null,
          el('div', { class: 'chips' }, splitList(item.stack).slice(0, 3).map(s => el('span', { text: s })))
        ])
      ]);
      card._item = item;
      card.addEventListener('click', () => {
        const visible = cards.filter(c => !c.classList.contains('hidden'));
        openModal(visible.map(c => c._item), visible.indexOf(card));
      });
      grid.append(card);
      return card;
    });
    reveal(cards);

    const bar = $('#filters');
    filters.forEach(f => {
      const key = f.value.replace('.', '');
      const count = f.value === '*' ? items.length : items.filter(i => i.category === key).length;
      if (!count) return;
      const b = el('button', { type: 'button', role: 'tab', 'aria-selected': String(f.value === '*') }, [
        document.createTextNode(f.label), el('sup', { text: count })
      ]);
      b.addEventListener('click', () => {
        $$('button', bar).forEach(x => x.setAttribute('aria-selected', String(x === b)));
        cards.forEach(c => c.classList.toggle('hidden', f.value !== '*' && c.dataset.cat !== key));
      });
      bar.append(b);
    });
  }

  /* ---------- Modal (details + gallery navigation) ---------- */
  const modal = $('#modal');
  const media = $('#modalMedia');
  const speed = $('#speed');
  const closeModal = () => { if (modal.open) modal.close(); };
  modal.addEventListener('close', () => { media.innerHTML = ''; });
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalPrev').addEventListener('click', () => showProject(modalIndex - 1));
  $('#modalNext').addEventListener('click', () => showProject(modalIndex + 1));
  modal.addEventListener('keydown', e => {
    if (e.target.closest('video')) return;
    if (e.key === 'ArrowLeft') showProject(modalIndex - 1);
    if (e.key === 'ArrowRight') showProject(modalIndex + 1);
  });
  media.addEventListener('click', e => { if (e.target.tagName === 'IMG') media.classList.toggle('zoomed'); });
  speed.addEventListener('click', e => {
    const rate = Number(e.target.dataset.rate);
    const v = $('video', media);
    if (!rate || !v) return;
    v.playbackRate = rate;
    $$('button', speed).forEach(b => b.classList.toggle('on', b === e.target));
  });

  function openModal(list, index) {
    modalList = list;
    showProject(index);
    if (!modal.open) modal.showModal();
  }

  function showProject(index) {
    const n = modalList.length;
    modalIndex = (index + n) % n;
    const item = modalList[modalIndex];

    $('#modalCount').textContent = `${String(modalIndex + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    $('#modalPrev').disabled = $('#modalNext').disabled = n < 2;

    media.innerHTML = '';
    media.classList.remove('zoomed');
    if (item.video) {
      const v = el('video', { src: item.video, controls: '', autoplay: '', loop: '', playsinline: '' });
      v.muted = true;
      v.addEventListener('loadedmetadata', () => { v.playbackRate = PREVIEW_RATE; });
      media.append(v);
      speed.hidden = false;
      $$('button', speed).forEach(b => b.classList.toggle('on', Number(b.dataset.rate) === PREVIEW_RATE));
    } else {
      media.append(el('img', { src: item.image, alt: item.title }));
      speed.hidden = true;
    }

    $('#modalCat').textContent = labels[item.category] || '';
    $('#modalTitle').textContent = item.title;

    const meta = $('#modalMeta');
    meta.innerHTML = '';
    [['Client', item.client], ['Date', item.projectDate], ['Platform', item.platform], ['Stack', item.stack]]
      .filter(([, v]) => v)
      .forEach(([k, v]) => meta.append(el('div', {}, [el('dt', { text: k }), el('dd', { text: splitList(v).join(' · ') || v })])));

    const hl = $('#modalHighlights');
    hl.innerHTML = '';
    (item.highlights || []).forEach(h => hl.append(el('li', { text: h })));

    // Descriptions are authored HTML in data.json.
    $('#modalDesc').innerHTML = item.description || item.shortDescription || '';

    const box = $('#modalLinks');
    box.innerHTML = '';
    [[item.projectURL, item.projectURLText, 'btn-primary'], [item.projectURL2, item.projectURLText2, 'btn-glass']]
      .filter(([url]) => url && url !== '#')
      .forEach(([url, text, cls]) => box.append(el('a', { href: url, target: '_blank', rel: 'noopener', class: `btn ${cls}` },
        [document.createTextNode(text || 'Open'), el('i', { class: 'bi bi-arrow-up-right' })])));

    modal.scrollTop = 0;
  }

  /* ---------- Experience ---------- */
  function renderTimeline(jobs) {
    const list = $('#timeline');
    const VISIBLE = 3;
    jobs.forEach(job => {
      const tags = [...String(job.year).matchAll(/\(([^)]+)\)/g)].map(m => m[1]);
      const range = String(job.year).replace(/\s*\([^)]*\)/g, '').trim();
      const current = /present/i.test(job.year);
      const bullets = job.responsibilities || [];

      const li = el('li', { class: `job${current ? ' current' : ''}` }, [
        el('div', { class: 'job-head' }, [el('h3', { text: job.title }), el('span', { class: 'job-when', text: range })]),
        el('div', { class: 'job-company' }, [
          el('span', { text: job.company }),
          current ? el('span', { class: 'tag now', text: 'Current' }) : null,
          ...tags.map(t => el('span', { class: 'tag', text: t }))
        ]),
        el('ul', {}, bullets.map((r, i) => el('li', { class: i >= VISIBLE ? 'extra' : null, text: r })))
      ]);
      if (bullets.length > VISIBLE) {
        const label = `+ ${bullets.length - VISIBLE} more`;
        const more = el('button', { class: 'more', type: 'button', text: label, 'aria-expanded': 'false' });
        more.addEventListener('click', () => {
          const open = li.classList.toggle('open');
          more.textContent = open ? 'Show less' : label;
          more.setAttribute('aria-expanded', String(open));
        });
        li.append(more);
      }
      list.append(li);
    });
  }

  function renderEducation(list) {
    const ul = $('#education');
    list.forEach(e => {
      const long = (e.description || '').includes('\n');
      ul.append(el('li', {}, [
        el('span', { class: 'when', text: e.year }),
        el('h4', { text: e.degree }),
        el('p', { text: e.institution }),
        long
          ? el('details', {}, [el('summary', { text: 'Show schools' }), el('p', { text: e.description })])
          : el('p', { text: e.description })
      ]));
    });
  }

  function renderSkills(skills) {
    const box = $('#skillsList');
    [...skills].sort((a, b) => b.level - a.level).forEach(s => box.append(
      el('div', { class: 'skill' }, [
        el('div', { class: 'skill-top' }, [el('span', { text: s.name }), el('span', { text: `${s.level}%` })]),
        el('div', { class: 'skill-bar' }, el('span', { style: `--w:${s.level}%` }))
      ])
    ));
  }

  /* ---------- Testimonials carousel ---------- */
  function renderQuotes(list) {
    const track = $('#quotes');
    const dots = $('#quoteDots');
    const figs = list.map((t, i) => {
      const bq = el('blockquote', { text: t.text });
      const fig = el('figure', { class: 'quote glass spot' }, [
        el('i', { class: 'bi bi-quote quote-mark', 'aria-hidden': 'true' }),
        bq,
        el('figcaption', {}, [
          el('img', { src: t.image, alt: '', loading: 'lazy' }),
          el('div', {}, [el('strong', { text: t.name }), el('small', { text: t.title })])
        ])
      ]);
      track.append(fig);
      dots.append(el('button', { type: 'button', role: 'tab', 'aria-label': `Testimonial ${i + 1}`, 'aria-selected': String(i === 0) }));
      return { fig, bq };
    });

    // "Read more" only where the text is actually cut off
    requestAnimationFrame(() => figs.forEach(({ fig, bq }) => {
      if (bq.scrollHeight <= bq.clientHeight + 4) return;
      const more = el('button', { class: 'more', type: 'button', text: 'Read more' });
      more.addEventListener('click', () => {
        const open = fig.classList.toggle('open');
        more.textContent = open ? 'Read less' : 'Read more';
      });
      bq.after(more);
    }));

    const cardWidth = () => (figs[0] ? figs[0].fig.getBoundingClientRect().width + 16 : 1);
    const current = () => Math.round(track.scrollLeft / cardWidth());
    const maxIndex = () => Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / cardWidth()));
    const goTo = i => {
      const last = maxIndex();
      const target = i > last ? 0 : i < 0 ? last : i;
      track.scrollTo({ left: target * cardWidth(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    const syncDots = () => $$('button', dots).forEach((d, i) => d.setAttribute('aria-selected', String(i === current())));
    track.addEventListener('scroll', () => requestAnimationFrame(syncDots), { passive: true });
    dots.addEventListener('click', e => {
      const i = $$('button', dots).indexOf(e.target);
      if (i >= 0) goTo(i);
    });
    $('#prevQuote').addEventListener('click', () => goTo(current() - 1));
    $('#nextQuote').addEventListener('click', () => goTo(current() + 1));

    // Autoplay, paused while the reader is hovering, focused or reading a full quote
    let paused = false;
    ['pointerenter', 'focusin'].forEach(ev => track.addEventListener(ev, () => { paused = true; }));
    ['pointerleave', 'focusout'].forEach(ev => track.addEventListener(ev, () => { paused = false; }));
    if (!reduceMotion) setInterval(() => {
      if (!paused && !document.hidden && !track.querySelector('.quote.open')) goTo(current() + 1);
    }, 5000);
  }

  /* ---------- Dock "more" toggle (phones only) ---------- */
  const dock = $('#dock');
  const dockMore = $('#dockMore');
  dockMore.addEventListener('click', () => {
    const open = dock.classList.toggle('open');
    dockMore.setAttribute('aria-expanded', String(open));
  });

  /* ---------- Background music (off until the visitor asks) ---------- */
  const audio = $('#bgAudio');
  const soundBtn = $('#soundToggle');
  audio.volume = 0.3;
  soundBtn.addEventListener('click', () => {
    const on = audio.paused;
    if (on) audio.play().catch(() => {}); else audio.pause();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Mute background music' : 'Play background music');
    soundBtn.firstElementChild.className = on ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill';
  });

  /* ---------- Contact (EmailJS) ---------- */
  const form = $('#contact-form');
  const status = $('#formStatus');
  if (window.emailjs) emailjs.init('JgwpfmPhF5CMdTpy0');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!window.emailjs) {
      status.className = 'form-status err';
      status.textContent = 'The form is unavailable right now. Please email or WhatsApp me instead.';
      return;
    }
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';

    emailjs.send('service_w8ondbc', 'template_pl80m3p', {
      name: $('#name-field').value,
      email: $('#email-field').value,
      subject: $('#subject-field').value,
      message: $('#message-field').value
    }).then(() => {
      status.className = 'form-status ok';
      status.textContent = 'Message sent. I will get back to you soon.';
      form.reset();
    }).catch(err => {
      // Provider errors (e.g. an expired mail connection) mean nothing to visitors.
      console.error('EmailJS error', err);
      status.className = 'form-status err';
      status.textContent = "Couldn't send right now. Please email or WhatsApp me directly.";
    }).finally(() => { btn.disabled = false; });
  });
})();
