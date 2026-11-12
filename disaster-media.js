// Preserve hero playback and restore the original research interactions.
const video = document.querySelector('[data-hero-video]');
const toggle = document.querySelector('[data-motion-toggle]');

if (video && toggle) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let userPaused = motion.matches || Boolean(connection?.saveData);
  let visible = false;
  let playbackRequest = 0;

  const updateToggle = () => {
    toggle.classList.toggle('is-paused', video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };

  const syncPlayback = async () => {
    const request = ++playbackRequest;
    if (!visible || document.hidden || userPaused) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try {
      await video.play();
      if (request === playbackRequest && (!visible || document.hidden || userPaused)) video.pause();
    } catch {
      // Keep the poster and a manual play control when autoplay is unavailable.
    }
    updateToggle();
  };

  toggle.hidden = false;
  updateToggle();
  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  video.addEventListener('error', () => { toggle.hidden = true; });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    syncPlayback();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0.05 }).observe(video);
  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', () => {
    userPaused = motion.matches || Boolean(connection?.saveData);
    syncPlayback();
  });
}

// Keep all six levels available without repeating the two main examples.
const selector = document.querySelector('[data-damage-selector]');
if (selector) {
  const levels = JSON.parse(selector.dataset.levels);
  const photo = selector.querySelector('[data-damage-photo]');
  const stage = photo.closest('.damage-photo-stage');
  const reference = selector.querySelector('[data-damage-reference]');
  const range = selector.querySelector('input[type="range"]');
  const output = selector.querySelector('output');
  const previous = selector.querySelector('[data-damage-previous]');
  const next = selector.querySelector('[data-damage-next]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = Number(range.value);

  const selectLevel = (index) => {
    selected = Math.max(0, Math.min(levels.length - 1, index));
    const level = levels[selected];
    range.value = String(selected);
    range.setAttribute('aria-valuetext', `${level.name} damage, level ${selected + 1} of ${levels.length}`);
    output.value = `${level.name} damage`;
    const mainExample = { Severe: 'severe-example', Devastating: 'devastating-example' }[level.name];
    stage.hidden = Boolean(mainExample);
    reference.hidden = !mainExample;
    reference.replaceChildren();
    if (mainExample) {
      const link = document.createElement('a');
      link.href = `#${mainExample}`;
      link.textContent = `View ${level.name.toLowerCase()} damage in the main examples above.`;
      reference.append(link);
    } else {
      photo.alt = level.alt;
      photo.width = level.width;
      photo.height = level.height;
      if (photo.getAttribute('src') !== level.src) photo.src = level.src;
    }
    previous.disabled = selected === 0;
    next.disabled = selected === levels.length - 1;
  };
  range.addEventListener('input', () => selectLevel(Number(range.value)));
  previous.addEventListener('click', () => selectLevel(selected - 1));
  next.addEventListener('click', () => selectLevel(selected + 1));
  photo.addEventListener('load', () => {
    photo.getAnimations().forEach(animation => animation.cancel());
    if (!motion.matches) photo.animate([{ opacity: .75 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
  });
  motion.addEventListener('change', () => {
    if (motion.matches) photo.getAnimations().forEach(animation => animation.cancel());
  });
  selector.querySelector('.damage-selector-controls').hidden = false;
  selectLevel(selected);
}

// Draggable damage-map comparison — recovered from 76b1d5c.
const s=document.querySelector("[data-damage-comparison]"),r=s?.querySelector(".map-stage"),e=s?.querySelector("input");if(r&&e){const a=()=>{r.style.setProperty("--split",`${e.value}%`),e.setAttribute("aria-valuetext",`${e.value}% original map, ${100-Number(e.value)}% inference map`)};e.addEventListener("input",a);let n=!1;const i=t=>{const o=r.getBoundingClientRect();e.value=String(Math.round(Math.max(0,Math.min(100,(t.clientX-o.left)/o.width*100)))),a()};e.addEventListener("pointerdown",t=>{t.button===0&&(t.preventDefault(),e.focus({preventScroll:!0}),n=!0,e.setPointerCapture(t.pointerId),i(t))}),e.addEventListener("pointermove",t=>{n&&i(t)}),e.addEventListener("pointerup",()=>{n=!1}),e.addEventListener("pointercancel",()=>{n=!1}),e.addEventListener("lostpointercapture",()=>{n=!1})}

// Mission-planning scenario tabs — recovered from 76b1d5c.
const a=document.querySelector("[data-mission-planning]");if(a){const r=[...a.querySelectorAll('[role="tab"]')],c=[...a.querySelectorAll('[role="tabpanel"]')];a.querySelector('[role="tablist"]').hidden=!1,a.querySelectorAll(".scenario-fallback").forEach(t=>{t.hidden=!0});const s=(t,o=!1)=>{r.forEach((l,e)=>{l.setAttribute("aria-selected",String(e===t)),l.tabIndex=e===t?0:-1,c[e].hidden=e!==t}),o&&r[t].focus()};r.forEach((t,o)=>{t.addEventListener("click",()=>s(o)),t.addEventListener("keydown",l=>{let e=o;if(l.key==="ArrowRight")e=(o+1)%r.length;else if(l.key==="ArrowLeft")e=(o-1+r.length)%r.length;else if(l.key==="Home")e=0;else if(l.key==="End")e=r.length-1;else return;l.preventDefault(),s(e,!0)})}),s(0)}
