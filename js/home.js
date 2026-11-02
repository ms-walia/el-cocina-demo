gsap.registerPlugin(ScrollTrigger, SplitText);
const navBar = document.querySelector('#nav .nav__bar');
function navOffset() {
  if (!navBar) return 0;
  const root = navBar.parentElement, form = root.dataset.form;
  root.dataset.form = 'compact';
  const height = navBar.offsetHeight;
  root.dataset.form = form;
  return height;
}
function refreshScroll() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = window.lenis = new Lenis({ lerp: .085, wheelMultiplier: .95, anchors: { offset: -navOffset() } });
  const tick = time => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); window.lenis = null; };
});

(() => {
  const root = document.getElementById('nav');
  const toggle = root.querySelector('.nav__toggle');
  const menu = root.querySelector('.nav__menu');
  const close = root.querySelector('.nav__close');
  let last = scrollY, turn = scrollY, dir = 0;
  const setState = state => {
    root.dataset.state = state;
    if (state !== 'hidden') root.dataset.form = state === 'top' ? 'full' : 'compact';
  };
  const update = () => {
    const y = scrollY;
    const d = y - last;
    if (d !== 0) {
      const nd = d > 0 ? 1 : -1;
      if (nd !== dir) { dir = nd; turn = last; }
    }
    last = y;
    if (y < 60) setState('top');
    else if (dir > 0 && y - turn > 40) setState('hidden');
    else if (dir < 0 && turn - y > 24) setState('shown');
  };
  addEventListener('scroll', update, { passive: true });
  setState(scrollY < 60 ? 'top' : 'shown');
  const setOpen = open => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) { window.lenis?.stop(); menu.querySelector('a')?.focus(); }
    else { window.lenis?.start(); toggle.focus(); }
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  close.addEventListener('click', () => setOpen(false));
  menu.addEventListener('click', event => { if (event.target.closest('a')) { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); window.lenis?.start(); } });
  addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) setOpen(false); });
})();

(() => {
  const root = document.getElementById('opening');
  const hero = root.querySelector('.op__hero');
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => { root.dataset.loop = entry.isIntersecting ? 'on' : 'off'; }).observe(hero);
})();

const effects = {
  cut(figure, vars = {}) {
    const img = figure.querySelector('img');
    return gsap.timeline(vars)
      .fromTo(figure, { clipPath: 'inset(0% 49.5% 0% 49.5%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'power3.inOut' }, 0)
      .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
      .set(figure, { clearProps: 'clipPath' })
      .set(img, { clearProps: 'transform' });
  },
  flush(heading, vars = {}) {
    const lines = heading.querySelectorAll('.line');
    const items = lines.length ? [...lines] : [heading];
    const timeline = gsap.timeline(vars);
    items.forEach((line, index) => {
      timeline.fromTo(line, { x: () => (index % 2 ? -1 : 1) * Math.min(innerWidth * .2, 320) }, { x: 0, duration: 1, ease: 'power2.out' }, index * .1);
    });
    return timeline;
  },
  shade(figure, vars = {}) {
    let layer = figure.querySelector(':scope > .fx-shade');
    if (!layer) {
      layer = document.createElement('span');
      layer.className = 'fx-shade';
      layer.setAttribute('aria-hidden', 'true');
      Object.assign(layer.style, { position: 'absolute', left: '-25%', top: '-30%', width: '90%', aspectRatio: '1.2', borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'multiply', background: 'radial-gradient(closest-side, var(--color-7) 55%, transparent)', opacity: '.45' });
      figure.append(layer);
    }
    return gsap.timeline(vars).fromTo(layer, { xPercent: -45, yPercent: -20, scale: .85 }, { xPercent: 95, yPercent: 60, scale: 1.25, ease: 'none', duration: 1 });
  }
};
document.querySelectorAll('[data-8b-section]').forEach(section => {
  const first = section.getBoundingClientRect().top < innerHeight;
  const cuts = section.querySelectorAll('[data-8b-motion~="cut"]');
  if (cuts.length) {
    const id = `effect:cut:${section.id}`;
    queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      cuts.forEach((figure, index) => ScrollTrigger.create({ id: `${id}:${index}`, trigger: figure, start: 'top 88%', once: true, animation: effects.cut(figure, { paused: true, delay: (index % 3) * .08 }) }));
    }), { first, id });
  }
  const flushes = section.querySelectorAll('[data-8b-motion~="flush"]');
  if (flushes.length) {
    const id = `effect:flush:${section.id}`;
    queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      flushes.forEach((heading, index) => ScrollTrigger.create({ id: `${id}:${index}`, trigger: heading, start: 'top bottom', end: 'top 58%', scrub: .5, invalidateOnRefresh: true, animation: effects.flush(heading) }));
    }), { first, id });
  }
  const shades = section.querySelectorAll('[data-8b-motion~="shade"]');
  if (shades.length) {
    const id = `effect:shade:${section.id}`;
    queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      shades.forEach((figure, index) => ScrollTrigger.create({ id: `${id}:${index}`, trigger: figure, start: 'top bottom', end: 'bottom top', scrub: .6, animation: effects.shade(figure) }));
      return () => shades.forEach(figure => figure.querySelector(':scope > .fx-shade')?.remove());
    }), { first, id });
  }
});

queueMotion(() => {
  gsap.matchMedia().add({ wide: '(prefers-reduced-motion: no-preference) and (min-width: 720px)', narrow: '(prefers-reduced-motion: no-preference) and (max-width: 719.98px)' }, context => {
    const narrow = context.conditions.narrow;
    const section = document.getElementById('opening');
    const shade = section.querySelector('.op__shade');
    const light = section.querySelector('.op__light');
    const plate = section.querySelector('.op__frame img');
    const title = section.querySelector('.op__title');
    const pair = section.querySelectorAll('.op__pair figure');
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      id: 'opening', trigger: section, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true
    }});
    timeline
      .to(shade, { xPercent: narrow ? 30 : 128, yPercent: narrow ? 70 : 18, rotation: narrow ? 24 : 9, scaleX: narrow ? 1.6 : 2.3, scaleY: 1.1, duration: .72 }, 0)
      .to(light, { opacity: .72, duration: .6 }, .02)
      .to(plate, { scale: 1.1, duration: .72 }, 0)
      .add(effects.flush(title).duration(.34), .03)
      .fromTo(pair[0], { yPercent: narrow ? 6 : 9, x: () => narrow ? -10 : -innerWidth * .025 }, { yPercent: 0, x: 0, duration: .6, ease: 'power1.out' }, .28)
      .fromTo(pair[1], { yPercent: narrow ? 14 : 22, x: () => narrow ? 10 : innerWidth * .025 }, { yPercent: 0, x: 0, duration: .64, ease: 'power1.out' }, .28)
      .to({}, { duration: .08 }, .92);
  });
}, { first: true });

queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const section = document.getElementById('about');
    const field = section.querySelector('.ab__field');
    const lines = section.querySelectorAll('.ab__title .line');
    const copy = section.querySelector('.ab__copy');
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      id: 'about', trigger: section, start: 'top bottom', end: 'center 52%', scrub: .6, invalidateOnRefresh: true
    }});
    timeline
      .fromTo(field, { clipPath: 'circle(9% at 50% 62%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: .82, ease: 'power2.in' }, 0)
      .set(field, { clearProps: 'clipPath' }, .999);
    lines.forEach((line, index) => {
      timeline.fromTo(line, { x: () => (index % 2 ? -1 : 1) * innerWidth * (index === 2 ? .2 : .32) }, { x: 0, duration: .62, ease: 'power2.out' }, .22 + index * .06);
    });
    timeline.fromTo(copy, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .3, ease: 'power2.out' }, .62);
  });
});

queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const section = document.getElementById('footer');
    const mark = section.querySelector('.ft__mark');
    const split = SplitText.create(mark, { type: 'chars' });
    const middle = (split.chars.length - 1) / 2;
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'footer', trigger: mark, start: 'top bottom', end: 'bottom 96%', scrub: .6, invalidateOnRefresh: true } })
      .fromTo(split.chars, { x: (index) => (index - middle) * Math.min(innerWidth * .045, 64) }, { x: 0, duration: 1, ease: 'power2.out' });
    return () => split.revert();
  });
}, { near: document.querySelector('#footer .ft__mark') });


/* scene:day — Lunch swipes to After dark; background goes from day to night */
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const section = document.getElementById('day');
    const pin = section.querySelector('.dy__pin');
    const track = section.querySelector('.dy__track');
    const panels = [...track.children];
    const tokens = getComputedStyle(document.documentElement);
    const color = name => tokens.getPropertyValue(name).trim();
    section.setAttribute('data-track', '');
    const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      id: 'day', trigger: pin, pin: true, start: 'top top', end: () => `+=${distance()}`, scrub: .5, invalidateOnRefresh: true
    }});
    timeline
      .fromTo(track, { x: 0 }, { x: () => -distance(), duration: 1 }, 0)
      .fromTo(pin, { backgroundColor: color('--color-1'), color: color('--color-2') }, { backgroundColor: color('--color-4'), color: color('--color-1'), duration: .5 }, .22);
    panels.forEach((panel, index) => {
      const img = panel.querySelector('img');
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: `day:photo-${index}`, trigger: panel, containerAnimation: timeline, start: 'left right', end: 'right left', scrub: true
      }})
        .fromTo(img, { xPercent: -7 }, { xPercent: 0, duration: .4 })
        .to(img, { xPercent: 0, duration: .2 })
        .to(img, { xPercent: 7, duration: .4 });
    });
    return () => section.removeAttribute('data-track');
  });
});
