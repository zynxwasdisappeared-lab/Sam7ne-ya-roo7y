/**
 * ROMANTIC APOLOGY WEBSITE - JAVASCRIPT ENGINE
 * Full Arabic Support | Immediate Autoplay | Fast Smooth Typewriter | WhatsApp Direct
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION & FIXED DATA (No frontend edits)
  // ==========================================
  const config = {
    herName: 'منه',
    hisName: 'خالد',
    whatsappNumber: '201040208528',
    whatsappMessage: 'مسامحاك ياخالودي ❤️',
    typingSpeed: 18, // Fast, natural typing speed
    pausePunctuation: 85, // Subtle breathing pause on dots/question marks
  };

  // Sincere, emotional Egyptian-Arabic letter template
  function getApologyLetter(her, his) {
    return [
      `حقك عليا يا ${her}.. يا أغلى وأجمل ما شافت عيني في الدنيا دي كلها، من كل قلبي أنا أسف.`,
      `عارف إني زعلتك، ومن اللحظة اللي حسيت فيها إنك واخدة على خاطرك مني وأنا روحي مش طالعة ومخنوق ومش طايق نفسي ولا عارف أرتاح.`,
      `والله العظيم ما كان قصدي أضايقك، ولا أوجع قلبك اللي مفيش أرق ولا أحن ولا أطيب منه في الدنيا دي كلها.`,
      `أنا بحبك أوي يا ${her}.. بحبك فوق ما تتخيلي ومقدرش أعيش من غيرك لحظة واحدة بجد. إنتي مش بس حبيبتي.. إنتي فرحة أيامي، وسندي، وأهلي، وأغلى وأحلى نعمة ربنا رزقني بيها، والكون كله ميسواش عندي دمعة أو زعل في عينيكي.`,
      `أنا ندمان بجد وبوعدك إني أتعلم وأتغير، وأكون دايمًا ليكي الأمان والفرحة والراحة، ومخليش أي حاجة تضايق قلبك الأبيض ده تاني أبداً.`,
      `مكانتك في قلبي متتوصفش بكلام، وأنا بجد ماليش غيرك في الدنيا.. بحبك من أول يوم لحد أخر نفس في عمري. ❤️`,
      `— حبيبك ${his}`
    ];
  }

  // Playful dodging texts for Screen 1 "No" button (short for mobile)
  const dodgePhrasesScreen1 = [
    'لأ 🙈',
    'متأكدة؟ 🥺',
    'فكري تاني! 💕',
    'مش هتعرفي 😜',
    'مفيش مفر 😉',
    'قولي أه بقى! 💖',
    'بحبك أوي ❤️'
  ];
  let dodgeCount1 = 0;

  // Playful dodging texts for Screen 2 "No" button (short for mobile)
  const dodgePhrasesScreen2 = [
    'لأ لسه 🙈',
    'مش هتعرفي 😜',
    'مفيش زعل 🥺',
    'سامحيني بقى 💕',
    'مفيش مفر 😉',
    'خالودي بيحبك ❤️'
  ];
  let dodgeCount2 = 0;

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  const questionScreen = document.getElementById('question-screen');
  const apologyScreen = document.getElementById('apology-screen');

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');

  const letterGreeting = document.getElementById('letter-greeting');
  const typewriterText = document.getElementById('typewriter-text');
  const typingCursor = document.getElementById('typing-cursor');
  const finalReveal = document.getElementById('final-reveal');

  const btnForgiveWa = document.getElementById('btn-forgive-wa');
  const btnNoForgive = document.getElementById('btn-no-forgive');
  const noForgiveText = document.getElementById('no-forgive-text');
  const forgiveDodgeHint = document.getElementById('forgive-dodge-hint');
  const celebrationBox = document.getElementById('celebration-box');

  const bgAudio = document.getElementById('bg-audio');

  // ==========================================
  // BACKGROUND MUSIC: IMMEDIATE AUTOPLAY
  // ==========================================
  let isAudioPlaying = false;

  function tryPlayAudio() {
    if (isAudioPlaying) return;
    try {
      bgAudio.volume = 0.8;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isAudioPlaying = true;
            document.body.classList.add('music-playing');
          })
          .catch(() => {
            // Autoplay blocked by browser policy without gesture -> arm first-interaction unlock
            armFirstGestureUnlock();
          });
      }
    } catch (_) {
      armFirstGestureUnlock();
    }
  }

  function armFirstGestureUnlock() {
    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'];
    const unlockHandler = () => {
      if (!isAudioPlaying) {
        bgAudio.volume = 0.8;
        bgAudio.play().then(() => {
          isAudioPlaying = true;
          document.body.classList.add('music-playing');
        }).catch(() => {});
      }
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlockHandler, true));
    };

    unlockEvents.forEach((ev) => window.addEventListener(ev, unlockHandler, { once: true, capture: true }));
  }

  // Attempt play as soon as code runs & on load
  tryPlayAudio();
  window.addEventListener('DOMContentLoaded', tryPlayAudio);
  window.addEventListener('load', tryPlayAudio);

  // ==========================================
  // PARTICLE SYSTEM (HEARTS & SPARKLES)
  // ==========================================
  let particles = [];
  let celebrationParticles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const heartSymbols = ['❤️', '💖', '💕', '💗', '🌸', '✨'];

  class Particle {
    constructor(isExplosion = false, originX = width / 2, originY = height / 2) {
      this.isExplosion = isExplosion;
      this.reset(originX, originY);
    }

    reset(originX = width / 2, originY = height / 2) {
      if (this.isExplosion) {
        this.x = originX;
        this.y = originY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 22 + 14;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.gravity = 0.15;
      } else {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 1.8 + 0.8);
        this.size = Math.random() * 18 + 12;
        this.alpha = Math.random() * 0.6 + 0.3;
        this.oscillationSpeed = Math.random() * 0.03 + 0.01;
        this.oscillationDist = Math.random() * 2 + 1;
      }
      this.symbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
    }

    update() {
      if (this.isExplosion) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
        this.rotation += this.rotSpeed;
        return this.alpha > 0;
      } else {
        this.x += Math.sin(this.y * this.oscillationSpeed) * this.oscillationDist + this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        if (this.y < -50 || this.x < -50 || this.x > width + 50) {
          this.reset();
        }
        return true;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // Create initial floating particles (optimized for smooth 60fps)
  const particleCount = window.innerWidth < 600 ? 14 : 22;
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    for (let i = celebrationParticles.length - 1; i >= 0; i--) {
      const cp = celebrationParticles[i];
      if (cp.update()) {
        cp.draw();
      } else {
        celebrationParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  function triggerConfettiBurst(x = width / 2, y = height / 2, count = 40) {
    for (let i = 0; i < count; i++) {
      celebrationParticles.push(new Particle(true, x, y));
    }
  }

  // ==========================================
  // HELPER: DODGE BUTTON GENERATOR
  // ==========================================
  function setupDodgingButton(buttonEl, labelEl, phrasesList, hintEl, getCounter, incCounter) {
    function dodge(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      incCounter();
      const count = getCounter();
      labelEl.textContent = phrasesList[count % phrasesList.length];

      if (hintEl) {
        if (count === 2) {
          hintEl.textContent = 'شايفك بتحاولي تدوسي.. بس مفيش هروب من حب خالودي ليكي 😉❤️';
          hintEl.style.color = '#f43f5e';
        } else if (count >= 4) {
          hintEl.textContent = 'الزرار هيفضل يهرب عشان قلبي مستنيكي تسامحيني بجد! 🥰';
        }
      }

      if (!buttonEl.classList.contains('dodging')) {
        buttonEl.classList.add('dodging');
      }

      // Accurate viewport dimensions (supports mobile browser dynamic toolbars)
      const vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
      const vpH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      // Measure current button size accurately
      const rect = buttonEl.getBoundingClientRect();
      const btnW = Math.min(rect.width || 105, vpW * 0.7);
      const btnH = rect.height || 44;

      // Safe bounds: stay clearly inside visible screen and below top-bar
      const minX = 14;
      const maxX = Math.max(minX, Math.floor(vpW - btnW - 14));
      const minY = 75; // Stay below header badge
      const maxY = Math.max(minY, Math.floor(vpH - btnH - 25));

      // Current touch/pointer location
      let touchX = vpW / 2;
      let touchY = vpH / 2;
      if (e) {
        if (e.touches && e.touches.length > 0) {
          touchX = e.touches[0].clientX;
          touchY = e.touches[0].clientY;
        } else if (e.clientX !== undefined) {
          touchX = e.clientX;
          touchY = e.clientY;
        }
      }

      // Leap visibly to the opposite side of the screen
      let newX, newY;
      if (touchX < vpW / 2) {
        // Finger is on left -> jump to right half
        newX = minX + (maxX - minX) * (0.52 + Math.random() * 0.44);
      } else {
        // Finger is on right -> jump to left half
        newX = minX + (maxX - minX) * (Math.random() * 0.44);
      }

      if (touchY < vpH / 2) {
        // Finger on top -> jump to bottom half
        newY = minY + (maxY - minY) * (0.52 + Math.random() * 0.44);
      } else {
        // Finger on bottom -> jump to top half
        newY = minY + (maxY - minY) * (Math.random() * 0.44);
      }

      // Strict clamping: mathematically guaranteed inside viewport on all mobile devices
      newX = Math.round(Math.min(maxX, Math.max(minX, newX)));
      newY = Math.round(Math.min(maxY, Math.max(minY, newY)));

      buttonEl.style.position = 'fixed';
      buttonEl.style.left = `${newX}px`;
      buttonEl.style.top = `${newY}px`;
      buttonEl.style.right = 'auto';
      buttonEl.style.bottom = 'auto';
      buttonEl.style.margin = '0';

      triggerConfettiBurst(touchX, touchY, 6);
    }

    buttonEl.addEventListener('mouseenter', dodge);
    buttonEl.addEventListener('pointerenter', dodge);
    buttonEl.addEventListener('click', dodge);
    buttonEl.addEventListener('touchstart', dodge, { passive: false });
    buttonEl.addEventListener('pointerdown', dodge, { passive: false });

    return dodge;
  }

  // Setup Screen 1 Dodging "No"
  setupDodgingButton(
    btnNo,
    noText,
    dodgePhrasesScreen1,
    dodgeHint,
    () => dodgeCount1,
    () => { dodgeCount1++; }
  );

  // Setup Screen 2 Dodging "No" (Forgiveness)
  setupDodgingButton(
    btnNoForgive,
    noForgiveText,
    dodgePhrasesScreen2,
    forgiveDodgeHint,
    () => dodgeCount2,
    () => { dodgeCount2++; }
  );

  // Proximity dodge for Screen 1
  window.addEventListener('mousemove', (e) => {
    if (!questionScreen.classList.contains('active-screen')) return;
    const rect = btnNo.getBoundingClientRect();
    const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
    if (dist < 65) {
      btnNo.dispatchEvent(new Event('mouseenter'));
    }
  });

  // ==========================================
  // "YES" BUTTON & SCREEN TRANSITION (Instant & Snappy)
  // ==========================================
  btnYes.addEventListener('click', () => {
    const rect = btnYes.getBoundingClientRect();
    triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

    tryPlayAudio();

    questionScreen.style.opacity = '0';
    questionScreen.style.transform = 'scale(0.96) translateY(-10px)';

    setTimeout(() => {
      btnNo.style.display = 'none';
      questionScreen.classList.remove('active-screen');
      questionScreen.classList.add('hidden-screen');

      apologyScreen.classList.remove('hidden-screen');
      apologyScreen.classList.add('active-screen');

      window.scrollTo({ top: 0, behavior: 'instant' });

      startTypewriter();
    }, 180);
  });

  // ==========================================
  // LIGHTNING-FAST FLUID TYPEWRITER EFFECT (~2.5s)
  // ==========================================
  let isTyping = false;
  let typewriterTimeout = null;

  function startTypewriter() {
    const paragraphs = getApologyLetter(config.herName, config.hisName);
    letterGreeting.textContent = `إلى حبيبتي ونور عيني وعمري كله.. ${config.herName} 🌹`;

    typewriterText.innerHTML = '';
    typingCursor.style.display = 'inline-block';
    finalReveal.classList.add('hidden-fade');
    celebrationBox.classList.add('hidden-fade');

    let pIndex = 0;
    let charIndex = 0;
    isTyping = true;

    // Create initial paragraph
    let currentP = document.createElement('p');
    typewriterText.appendChild(currentP);

    function typeNext() {
      if (!isTyping) return;

      if (pIndex < paragraphs.length) {
        const text = paragraphs[pIndex];

        if (charIndex < text.length) {
          // Stream 3-4 chars for lightning-fast cursive handwriting
          const chunk = text.substr(charIndex, 3);
          currentP.textContent += chunk;
          charIndex += chunk.length;

          // Auto-scroll
          const wrapper = document.querySelector('.letter-body-wrapper');
          if (wrapper) {
            wrapper.scrollTop = wrapper.scrollHeight;
          }

          // Blazing-fast 12ms delay
          typewriterTimeout = setTimeout(typeNext, 12);
        } else {
          // Next paragraph
          pIndex++;
          charIndex = 0;
          if (pIndex < paragraphs.length) {
            currentP = document.createElement('p');
            typewriterText.appendChild(currentP);
            typewriterTimeout = setTimeout(typeNext, 35);
          } else {
            finishTypewriter();
          }
        }
      } else {
        finishTypewriter();
      }
    }

    typeNext();
  }

  function finishTypewriter() {
    isTyping = false;
    clearTimeout(typewriterTimeout);

    // Ensure all paragraphs rendered
    const paragraphs = getApologyLetter(config.herName, config.hisName);
    typewriterText.innerHTML = paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('');

    typingCursor.style.display = 'none';

    // Snappy reveal for closing plea
    finalReveal.classList.remove('hidden-fade');
    finalReveal.style.opacity = '0';
    finalReveal.style.transform = 'translateY(15px)';
    finalReveal.style.display = 'block';

    setTimeout(() => {
      finalReveal.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      finalReveal.style.opacity = '1';
      finalReveal.style.transform = 'translateY(0)';
      triggerConfettiBurst(width / 2, window.innerHeight * 0.7, 35);
    }, 40);
  }

  // Tap anywhere on the letter to immediately show the full text
  const letterWrapper = document.querySelector('.letter-body-wrapper');
  if (letterWrapper) {
    letterWrapper.addEventListener('click', () => {
      if (isTyping) {
        finishTypewriter();
      }
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // ==========================================
  // WHATSAPP DIRECT RECONCILIATION
  // ==========================================
  btnForgiveWa.addEventListener('click', (e) => {
    const rect = btnForgiveWa.getBoundingClientRect();
    triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);
    triggerConfettiBurst(width * 0.2, height * 0.4, 50);
    triggerConfettiBurst(width * 0.8, height * 0.4, 50);

    celebrationBox.classList.remove('hidden-fade');
    celebrationBox.style.display = 'block';
    celebrationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // WhatsApp URL: https://wa.me/201040208528?text=...
    const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;

    // Open WhatsApp directly in new tab or app
    window.open(waUrl, '_blank');

    // Smooth redirect fallback if popup blocked on mobile
    setTimeout(() => {
      window.location.href = waUrl;
    }, 400);
  });

})();
