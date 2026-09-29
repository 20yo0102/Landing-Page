document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  //  СОСТОЯНИЕ
  // ============================================================
  let productsData = [];
  let currentCategory = 'coffee';
  let cardsShown = 4;       // сколько карточек показываем на мобиле
  let showAll = false;      // показаны ли все карточки (после кнопки)

  // ============================================================
  //  DOM-ЭЛЕМЕНТЫ
  // ============================================================
  const hamburger       = document.querySelector('.hamburger');
  const nav             = document.querySelector('.header-navigation');
  const themeToggle     = document.getElementById('theme-toggle');
  const tabs            = document.querySelectorAll('.main-container__offer--tab');
  const cardsContainer  = document.querySelector('.main-container-grid');
  const showMoreBtn     = document.getElementById('show-more-btn');

  // Слайдер
  const sliderTrack     = document.querySelector('.slider-track');
  const sliderBtnLeft   = document.querySelector('.favorite-coffee__arrow--left');
  const sliderBtnRight  = document.querySelector('.favorite-coffee__arrow--right');
  const slides           = document.querySelectorAll('.slider-slide');
  const sliderDots      = document.querySelectorAll('.slider-dot');

  let currentSlide = 0;
  const totalSlides = slides.length;

  // ============================================================
  //  1. БУРГЕР-МЕНЮ
  // ============================================================
  function initBurgerMenu() {
    if (!hamburger || !nav) return;

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      nav.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      if (nav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Закрытие по клику на ссылку внутри меню
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Закрытие при ширине >= 769px
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 769 && nav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ============================================================
  //  2. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
  // ============================================================
  function initThemeToggle() {
    if (!themeToggle) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcons(currentTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      updateThemeIcons(next);
    });

    function updateThemeIcons(theme) {
      const lightIcon = themeToggle.querySelector('.theme__light');
      const darkIcon  = themeToggle.querySelector('.theme__dark');
      if (lightIcon) lightIcon.style.display = theme === 'light' ? 'none' : 'block';
      if (darkIcon)  darkIcon.style.display  = theme === 'dark'  ? 'none' : 'block';
    }
  }

  // ============================================================
  //  3. СЛАЙДЕР (ЦИКЛИЧЕСКИЙ)
  // ============================================================
  function initSlider() {
    if (!sliderTrack || totalSlides === 0) return;

    let autoplayTimer = null;

    function goToSlide(index) {
      // Цикличность: после последнего -> первый, после первого -> последний
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      const offset = -currentSlide * 100;
      sliderTrack.style.transition = 'transform 0.5s ease';
      sliderTrack.style.transform = `translateX(${offset}%)`;

      // Обновление индикаторов (точек)
      sliderDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (sliderBtnRight) sliderBtnRight.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    if (sliderBtnLeft) sliderBtnLeft.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Клик по точкам-индикаторам
    sliderDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
      });
    });

    // Автопрокрутка
    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Пауза при наведении
    sliderTrack.addEventListener('mouseenter', stopAutoplay);
    sliderTrack.addEventListener('mouseleave', startAutoplay);

    // Корректная работа при изменении ширины окна
    window.addEventListener('resize', () => {
      goToSlide(currentSlide);
    });

    // Старт
    goToSlide(0);
    startAutoplay();
  }

  // ============================================================
  //  4. ЗАГРУЗКА ДАННЫХ ИЗ products.json
  // ============================================================
  async function loadProducts() {
    try {
      const response = await fetch('products.json');
      if (!response.ok) throw new Error('Не удалось загрузить products.json');
      productsData = await response.json();
      return productsData;
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      // Fallback — пустой массив, чтобы не сломать страницу
      return [];
    }
  }

  // ============================================================
  //  5. РЕНДЕР КАРТОЧЕК (ДИНАМИЧЕСКИ ИЗ МАССИВА ДАННЫХ)
  // ============================================================
  function renderCards() {
    if (!cardsContainer) return;

    const categoryProducts = productsData.filter(p => p.category === currentCategory);

    // Очищаем контейнер
    cardsContainer.innerHTML = '';

    const isMobile = window.innerWidth <= 768;
    const visibleCount = (isMobile && !showAll) ? cardsShown : categoryProducts.length;

    const fragment = document.createDocumentFragment();

    categoryProducts.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'main-container-grid__card';
      card.dataset.category = product.category;
      card.dataset.id = product.id;

      // Скрытые карточки на мобиле (если их больше cardsShown)
      if (isMobile && index >= cardsShown && !showAll) {
        card.classList.add('hidden');
      }

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="card__image" loading="lazy">
        <div class="card__body">
          <h3 class="card__title">${product.title}</h3>
          <p class="card__description">${product.description}</p>
          <span class="card__price">${product.price} &#8381;</span>
        </div>
      `;

      // Клик по карточке -> открытие модального окна
      card.addEventListener('click', () => openModal(product));

      fragment.appendChild(card);
    });

    cardsContainer.appendChild(fragment);

    // Управление кнопкой "Показать ещё"
    if (showMoreBtn) {
      const hasHidden = isMobile && categoryProducts.length > cardsShown && !showAll;
      showMoreBtn.style.display = hasHidden ? 'inline-flex' : 'none';
    }
  }

  // ============================================================
  //  6. ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ
  // ============================================================
  function initCategoryTabs() {
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Снимаем active со всех
        tabs.forEach(t => t.classList.remove('active'));
        // Ставим active на выбранный
        tab.classList.add('active');

        // Меняем категорию
        currentCategory = tab.dataset.category || tab.textContent.toLowerCase().trim();

        // Сбрасываем показ карточек
        showAll = false;

        // Перерисовываем карточки
        renderCards();
      });
    });

    // Активируем первую категорию при загрузке
    if (tabs.length > 0) {
      tabs[0].classList.add('active');
      currentCategory = tabs[0].dataset.category || tabs[0].textContent.toLowerCase().trim();
    }
  }

  // ============================================================
  //  7. КНОПКА "ПОКАЗАТЬ ЕЩЁ"
  // ============================================================
  function initShowMore() {
    if (!showMoreBtn) return;

    showMoreBtn.addEventListener('click', () => {
      showAll = true;
      renderCards();
    });
  }

  // ============================================================
  //  8. МОДАЛЬНОЕ ОКНО
  // ============================================================
  let modalOverlay = null;
  let selectedSizeIndex = 0;
  let selectedAdditives = new Set();

  function createModal() {
    // Создаём модальное окно один раз, затем переиспользуем
    if (modalOverlay) return;

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    `;
    modalOverlay.innerHTML = `
      <div class="modal-content" style="
        background: var(--background-color, #fff);
        color: var(--text-color, #333);
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      ">
        <button class="modal-close" style="
          position: absolute;
          top: 12px; right: 16px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: inherit;
          line-height: 1;
        ">&times;</button>
        <div id="modal-inner"></div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.modal-close');
    const content  = modalOverlay.querySelector('.modal-content');

    // Закрытие по крестику
    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику на затемнённую область
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Клик внутри контента не закрывает окно
    content.addEventListener('click', (e) => e.stopPropagation());

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        closeModal();
      }
    });
  }

  function openModal(product) {
    createModal();

    // Сброс параметров для новой карточки
    selectedSizeIndex = 0;
    selectedAdditives = new Set();

    const inner = modalOverlay.querySelector('#modal-inner');

    // Генерация содержимого модального окна из объекта карточки
    inner.innerHTML = `
      <img src="${product.image}" alt="${product.title}" style="
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 16px;
      " loading="lazy">
      <h2 class="modal-title" style="margin: 0 0 8px; font-size: 1.5rem;">${product.title}</h2>
      <p class="modal-description" style="margin: 0 0 20px; color: inherit; opacity: 0.8;">${product.description}</p>

      <div class="modal-params" style="margin-bottom: 20px;">
        <!-- Размеры -->
        <p style="margin: 0 0 8px; font-weight: 600;">Размер:</p>
        <div class="modal-sizes" style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
          ${product.sizes.map((s, i) => `
            <button class="modal-size-btn" data-size-index="${i}" style="
              padding: 8px 16px;
              border: 1px solid var(--border-color, #ccc);
              border-radius: 8px;
              background: ${i === 0 ? 'var(--accent-color, #6F4E37)' : 'transparent'};
              color: ${i === 0 ? '#fff' : 'inherit'};
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              ${s.size} (${s.volume})
            </button>
          `).join('')}
        </div>

        <!-- Добавки -->
        <p style="margin: 0 0 8px; font-weight: 600;">Добавки:</p>
        <div class="modal-additives" style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${product.additives.map((a, i) => `
            <button class="modal-additive-btn" data-additive-index="${i}" style="
              padding: 8px 16px;
              border: 1px solid var(--border-color, #ccc);
              border-radius: 8px;
              background: transparent;
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              ${a.name}${a.price > 0 ? ' (+' + a.price + '₽)' : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="modal-footer" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid var(--border-color, #eee);
      ">
        <div class="modal-total" style="font-size: 1.25rem; font-weight: 700;">
          Итого: <span id="modal-price">${product.price}</span> &#8381;
        </div>
      </div>
    `;

    // Обработчики размеров (одиночный выбор)
    const sizeBtns = inner.querySelectorAll('.modal-size-btn');
    sizeBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        selectedSizeIndex = i;
        // Визуальное выделение
        sizeBtns.forEach((b, idx) => {
          b.style.background = idx === i ? 'var(--accent-color, #6F4E37)' : 'transparent';
          b.style.color      = idx === i ? '#fff' : 'inherit';
        });
        updateModalPrice(product);
      });
    });

    // Обработчики добавок (множественный выбор)
    const additiveBtns = inner.querySelectorAll('.modal-additive-btn');
    additiveBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (selectedAdditives.has(i)) {
          selectedAdditives.delete(i);
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        } else {
          selectedAdditives.add(i);
          btn.style.background = 'var(--accent-color, #6F4E37)';
          btn.style.color = '#fff';
        }
        updateModalPrice(product);
      });
    });

    // Показ модального окна
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function updateModalPrice(product) {
    let total = product.price;

    // Доплата за размер
    if (product.sizes[selectedSizeIndex]) {
      total += product.sizes[selectedSizeIndex].price;
    }

    // Доплата за добавки
    selectedAdditives.forEach(idx => {
      if (product.additives[idx]) {
        total += product.additives[idx].price;
      }
    });

    const priceEl = document.getElementById('modal-price');
    if (priceEl) priceEl.textContent = total;
  }

  // ============================================================
  //  9. РЕСАЙЗ — ОБНОВЛЕНИЕ КАРТОЧЕК
  // ============================================================
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderCards();
    }, 200);
  });

  // ============================================================
  //  ИНИЦИАЛИЗАЦИЯ
  // ============================================================
  async function init() {
    initBurgerMenu();
    initThemeToggle();
    initSlider();
    initCategoryTabs();
    initShowMore();

    // Загрузка данных и рендер карточек
    await loadProducts();
    renderCards();
  }

  init();
});
