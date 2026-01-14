/**
 * Project: Helion-Hover.fit
 * Role: Core Frontend Logic 2026
 * Description: Smooth scroll, Split-text animations, Form validation, Cookie management.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Инициализация иконок (Lucide) ---
  const initIcons = () => {
      if (typeof lucide !== 'undefined') {
          lucide.createIcons();
      }
  };
  initIcons();

  // --- 2. Плавный скролл (Lenis) ---
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- 3. Шапка и мобильное меню ---
  const header = document.querySelector('.header');
  const burger = document.getElementById('burger-menu');
  const nav = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  // Смена фона шапки при скролле
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(10, 12, 16, 0.95)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'transparent';
      }
  });

  // Бургер-меню
  if (burger) {
      burger.addEventListener('click', () => {
          nav.classList.toggle('nav--active');
          burger.classList.toggle('burger--active');
          document.body.classList.toggle('no-scroll'); // Блокировка скролла при меню
      });
  }

  // Закрытие меню при клике на ссылку
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          nav.classList.remove('nav--active');
          burger.classList.remove('burger--active');
          document.body.classList.remove('no-scroll');
      });
  });

  // --- 4. Hero Анимация (GSAP + SplitType) ---
  // Настроено так, чтобы слова не разрывались при переносе (words + chars)
  const initHeroAnimation = () => {
      const titleElement = document.getElementById('hero-title');

      if (titleElement && typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
          // Разбиваем на слова и символы. Слова оборачиваются в .word (inline-block)
          const split = new SplitType(titleElement, { types: 'words, chars' });

          const tl = gsap.timeline({ delay: 0.5 });

          tl.from('.hero__subtitle', {
              opacity: 0,
              x: -30,
              duration: 0.8
          })
          .from(split.chars, {
              opacity: 0,
              y: 40,
              rotateX: -90,
              stagger: 0.03,
              duration: 1,
              ease: "back.out(1.7)"
          }, "-=0.4")
          .from('.hero__description', {
              opacity: 0,
              y: 20,
              duration: 0.8
          }, "-=0.6")
          .from('.hero__btns', {
              opacity: 0,
              y: 20,
              duration: 0.8
          }, "-=0.7")
          .from('.hero__visual', {
              opacity: 0,
              scale: 0.9,
              duration: 1.2,
              ease: "expo.out"
          }, "-=1");
      }
  };
  initHeroAnimation();

  // --- 5. Контактная форма: Валидация и Капча ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
      const phoneInput = document.getElementById('phone');
      const captchaQuestion = document.getElementById('captcha-question');
      const captchaAnswerInput = document.getElementById('captcha-answer');
      const successMessage = document.getElementById('form-success');

      let captchaValue;

      // Генерация примера
      const generateCaptcha = () => {
          const a = Math.floor(Math.random() * 9) + 1;
          const b = Math.floor(Math.random() * 9) + 1;
          captchaValue = a + b;
          if (captchaQuestion) captchaQuestion.innerText = `${a} + ${b} = ?`;
      };
      generateCaptcha();

      // Ограничение ввода: только цифры для телефона
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });

      // Отправка формы (имитация AJAX)
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          // Проверка капчи
          if (parseInt(captchaAnswerInput.value) !== captchaValue) {
              alert('Неверный ответ на защитный пример. Попробуйте снова.');
              generateCaptcha();
              captchaAnswerInput.value = '';
              return;
          }

          const submitBtn = contactForm.querySelector('button[type="submit"]');
          submitBtn.disabled = true;
          submitBtn.innerText = 'Отправка...';

          // Имитация задержки сети
          setTimeout(() => {
              successMessage.style.display = 'flex';
              contactForm.reset();
              generateCaptcha();
              initIcons(); // Переинициализация иконки в сообщении успеха
          }, 1500);
      });
  }

  // --- 6. Cookie Popup (LocalStorage) ---
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookiePopup && !localStorage.getItem('helion_cookies_accepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('cookie-popup--active');
      }, 3000);
  }

  if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
          localStorage.setItem('helion_cookies_accepted', 'true');
          cookiePopup.classList.remove('cookie-popup--active');
      });
  }
});