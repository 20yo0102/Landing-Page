//  document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.querySelector('.hamburger');
//   const nav = document.querySelector('.header-navigation');
//   const themeToggle = document.getElementById('theme-toggle');
//   const tabs = document.querySelectorAll('.main-container__offer--tab');
  
//   // Элементы карусели табов (стрелки и трек)
//   const sliderTrack = document.querySelector('.slider-track');
//   const sliderBtnLeft = document.querySelector('.favorite-coffee__arrow--left');
//   const sliderBtnRight = document.querySelector('.favorite-coffee__arrow--right');
//   const slides = document.querySelectorAll('.slider-slide');

//   // Элементы карточек для фильтрации
//   const cards = document.querySelectorAll('.main-container-grid__card');

//   // --- 1. Бургер-меню ---
//   if (hamburger && nav) {
//     hamburger.addEventListener('click', () => {
//       const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
//       hamburger.setAttribute('aria-expanded', !isExpanded);
//       nav.classList.toggle('active');
//     });
//   }

//   // --- 2. Переключение темы ---
//   if (themeToggle) {
//     // Инициализация состояния при загрузке (если тема уже сохранена в localStorage или data-theme)
//     const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
//     updateThemeIcons(currentTheme);

//     themeToggle.addEventListener('click', () => {
//       const current = document.documentElement.getAttribute('data-theme') || 'light';
//       const next = current === 'light' ? 'dark' : 'light';
//       document.documentElement.setAttribute('data-theme', next);
//       updateThemeIcons(next);
//     });
//   }

//   function updateThemeIcons(theme) {
//     const lightIcon = themeToggle.querySelector('.theme__light');
//     const darkIcon = themeToggle.querySelector('.theme__dark');
//     if (lightIcon) lightIcon.style.display = theme === 'light' ? 'none' : 'block';
//     if (darkIcon) darkIcon.style.display = theme === 'dark' ? 'none' : 'block';
//   }

//   // --- 3. Табы и фильтрация карточек ---
//   if (tabs.length > 0) {
//     tabs.forEach(tab => {
//       tab.addEventListener('click', () => {
//         // 1. Обновляем UI табов
//         tabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');

//         // 2. Получаем категорию из data-атрибута или текста (предполагаем, что у таба есть data-category="coffee" и т.д.)
//         // Если у вас нет data-category, можно использовать индекс или текст. Ниже вариант с data-category.
//         const category = tab.dataset.category || tab.textContent.toLowerCase().replace(/\s+/g, '-');

//         // 3. Фильтруем карточки
//         filterCards(category);
//       });
//     });

//     // Активация первого таба по умолчанию
//     tabs.classList.add('active');
//     const defaultCategory = tabs.dataset.category || tabs.textContent.toLowerCase().replace(/\s+/g, '-');
//     filterCards(defaultCategory);
//   }

//   function filterCards(category) {
//     cards.forEach(card => {
//       // Предполагаем, что у каждой карточки есть data-category="coffee"
//       const cardCategory = card.dataset.category;
//       if (cardCategory === category || category === 'all') {
//         card.classList.remove('hidden');
//       } else {
//         card.classList.add('hidden');
//       }
//     });
//   }

//   // --- 4. Карусель категорий (Горизонтальный скролл) ---
//   if (sliderTrack && slides.length > 0) {
//     const slideWidth = slides.clientWidth + 16; // 16px - это gap из CSS
    
//     // Логика кнопок
//     if (sliderBtnLeft) {
//       sliderBtnLeft.addEventListener('click', () => {
//         sliderTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
//       });
//     }

//     if (sliderBtnRight) {
//       sliderBtnRight.addEventListener('click', () => {
//         sliderTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
//       });
//     }

//     // Логика скрытия/показа стрелок (опционально, но полезно)
//     function updateArrowsVisibility() {
//       if (!sliderTrack) return;
//       const canScrollLeft = sliderTrack.scrollLeft > 0;
//       const canScrollRight = sliderTrack.scrollLeft + sliderTrack.clientWidth < sliderTrack.scrollWidth;

//       if (sliderBtnLeft) sliderBtnLeft.style.opacity = canScrollLeft ? '1' : '0.3';
//       if (sliderBtnRight) sliderBtnRight.style.opacity = canScrollRight ? '1' : '0.3';
      
//       if (sliderBtnLeft) sliderBtnLeft.style.pointerEvents = canScrollLeft ? 'auto' : 'none';
//       if (sliderBtnRight) sliderBtnRight.style.pointerEvents = canScrollRight ? 'auto' : 'none';
//     }

//     sliderTrack.addEventListener('scroll', updateArrowsVisibility);
//     // Инициализация видимости при загрузке
//     updateArrowsVisibility();
//   }

//   // --- 5. Базовые утилиты ---
//   function getScrollPosition(element) {
//     return {
//       x: element.scrollLeft,
//       y: element.scrollTop
//     };
//   }
// });
