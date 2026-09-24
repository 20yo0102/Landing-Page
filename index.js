document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header-navigation');
  const themeToggle = document.getElementById('theme-toggle');

  // Бургер-меню
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
    });
  }

  // Переключение темы
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);

      // Переключаем видимость иконок
      const lightIcon = themeToggle.querySelector('.theme__light');
      const darkIcon = themeToggle.querySelector('.theme__dark');
      if (lightIcon && darkIcon) {
        lightIcon.style.display = next === 'light' ? 'none' : 'block';
        darkIcon.style.display = next === 'dark' ? 'none' : 'block';
      }
    });
  }

  // Табы (coffee / tea / dessert)
  const tabs = document.querySelectorAll('.main-container__offer--tab');
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Здесь можно добавить логику фильтрации карточек по data-атрибутам
        // Например: filterCards(tab.querySelector('.tab__text').textContent.toLowerCase());
      });
    });

    // По умолчанию активируем первый таб
    tabs[0].classList.add('active');
  }
});
