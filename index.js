// document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.querySelector('.hamburger');
//   const nav = document.querySelector('.header-navigation');
//   const themeToggle = document.getElementById('theme-toggle');
//   // Бургер-меню
//   if (hamburger && nav) {
//     hamburger.addEventListener('click', () => {
//       const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
//       hamburger.setAttribute('aria-expanded', !isExpanded);
//       nav.classList.toggle('active');
//     });
//   }
//   // Переключение темы
//   if (themeToggle) {
//     themeToggle.addEventListener('click', () => {
//       const current = document.documentElement.getAttribute('data-theme');
//       const next = current === 'light' ? 'dark' : 'light';
//       document.documentElement.setAttribute('data-theme', next);
//       const lightIcon = themeToggle.querySelector('.theme__light');
//       const darkIcon = themeToggle.querySelector('.theme__dark');
//       if (lightIcon && darkIcon) {
//         lightIcon.style.display = next === 'light' ? 'none' : 'block';
//         darkIcon.style.display = next === 'dark' ? 'none' : 'block';
//       }
//     });
//   }
//   // Табы (coffee / tea / dessert)
//   const tabs = document.querySelectorAll('.main-container__offer--tab');
//   if (tabs.length > 0) {
//     tabs.forEach(tab => {
//       tab.addEventListener('click', () => {
//         tabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');
//       });
//     });

//     // По умолчанию активируем первый таб
//     tabs[0].classList.add('active');
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');
  const indicatorsContainer = document.querySelector('.slider-indicators');

  if (!sliderTrack || !prevBtn || !nextBtn || !indicatorsContainer) return;

  const slides = Array.from(sliderTrack.querySelectorAll('.slider-slide'));
  const totalSlides = slides.length;
  let currentSlide = 0;

  // Создаём индикаторы
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-indicator');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
    });
    indicatorsContainer.appendChild(dot);
  });

  const indicators = Array.from(indicatorsContainer.querySelectorAll('.slider-indicator'));

  function getSlideWidth() {
    // Учитываем gap между слайдами
    return slides[0] ? slides[0].offsetWidth + 16 : 0;
  }

  function updateSlider() {
    const slideWidth = getSlideWidth();
    if (!slideWidth) return;

    sliderTrack.scrollTo({
      left: currentSlide * slideWidth,
      behavior: 'smooth'
    });

    // Обновляем индикаторы
    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });

    // Синхронизация с табами (если они есть)
    const tabs = document.querySelectorAll('.main-container__offer--tab');
    tabs.forEach((tab, index) => {
      tab.classList.toggle('active', index === currentSlide);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });

  // Адаптивность: пересчёт при изменении ширины окна
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Пересчитываем позицию текущего слайда
      const slideWidth = getSlideWidth();
      if (slideWidth) {
        sliderTrack.scrollTo({
          left: currentSlide * slideWidth,
          behavior: 'auto' // без анимации при ресайзе
        });
      }
    }, 150);
  });

  // Инициализация
  updateSlider();
});

