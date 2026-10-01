(() => {
  'use strict';
  const content = window.TRAVEL_CONTENT;
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const menuLinks = [...nav.querySelectorAll('a')];
  const contactMessage = document.querySelector('.contact-message');
  const dialog = document.querySelector('.video-dialog');
  let lastCard;
  const youtubeSearch = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(content.channelName);

  // 외부 링크는 HTTPS 주소만 사용합니다.
  function httpsUrl(value) {
    if (!value) return '';
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
    catch { return ''; }
  }
  document.querySelectorAll('[data-channel-link]').forEach(link => {
    link.href = httpsUrl(content.channelUrl) || youtubeSearch;
    if (!content.channelUrl) link.title = 'YouTube에서 쥬니나나 유튜브 검색';
  });
  document.querySelector('[data-hero-title]').textContent = content.heroTitle;
  document.querySelector('[data-hero-subtitle]').textContent = content.heroSubtitle;
  document.querySelector('[data-hero-description]').textContent = content.heroDescription;
  document.querySelector('[data-about-description]').textContent = content.aboutDescription;
  document.querySelector('[data-email-label]').textContent = content.email || '이메일 문의 준비 중';
  document.querySelector('[data-instagram-label]').textContent = content.instagramLabel;
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    nav.classList.toggle('is-open', open);
  });
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
    nav.classList.remove('is-open');
  }
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  const sections = [...document.querySelectorAll('main > section')];
  function updateActiveLink() {
    const reference = window.scrollY + 150;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    const active = atBottom ? sections[sections.length - 1] :
      [...sections].reverse().find(section => section.offsetTop <= reference) || sections[0];
    menuLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { updateActiveLink(); queued = false; });
  }, {passive:true});
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();

  document.querySelectorAll('.work-card').forEach((card, index) => {
    const video = content.videos[index];
    if (!video) { card.hidden = true; return; }
    card.querySelector('h3').textContent = video.title;
    card.querySelector('p').textContent = video.description;
    card.querySelector('img').src = video.image;
    card.querySelector('.duration').textContent = video.duration;
    card.setAttribute('aria-label', video.title + ' 자세히 보기');
    card.addEventListener('click', () => {
      const url = httpsUrl(video.url);
      if (url) { window.open(url, '_blank', 'noopener,noreferrer'); return; }
      lastCard = card;
      dialog.querySelector('.dialog-image').src = video.image;
      dialog.querySelector('#video-title').textContent = video.title;
      dialog.querySelector('.dialog-description').textContent = video.description;
      dialog.showModal();
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => lastCard?.focus());

  document.querySelector('[data-email]').addEventListener('click', () => {
    const email = content.email.trim();
    if (/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) {
      window.location.href = 'mailto:' + encodeURIComponent(email);
    } else contactMessage.textContent = '문의용 이메일을 준비하고 있어요. 곧 만나요!';
  });
  document.querySelector('[data-instagram]').addEventListener('click', () => {
    const url = httpsUrl(content.instagramUrl);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else contactMessage.textContent = '일상을 함께 나눌 Instagram을 준비하고 있어요.';
  });
})();
