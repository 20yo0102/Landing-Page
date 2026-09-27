 document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header-navigation');
  const themeToggle = document.getElementById('theme-toggle');
  const tabs = document.querySelectorAll('.main-container__offer--tab');

  // Бургер-меню
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
    });
  } else {
    console.warn('Бургер-меню не найдено:', { hamburger, nav });
  }

  // Переключение темы
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);

      const lightIcon = themeToggle.querySelector('.theme__light');
      const darkIcon = themeToggle.querySelector('.theme__dark');

      if (lightIcon) lightIcon.style.display = next === 'light' ? 'none' : 'block';
      if (darkIcon) darkIcon.style.display = next === 'dark' ? 'none' : 'block';
    });
  } else {
    console.warn('Элемент theme-toggle не найден');
  }

  // Табы (coffee / tea / dessert)
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // По умолчанию активируем первый таб
    tabs[0].classList.add('active');
  } else {
    console.warn('Табы не найдены');
  }
});
