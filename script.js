/* =========================================================
   BARIRA'S BIRTHDAY JOURNEY — SCRIPT
   Sections:
   1. Ambient background (hearts + sparkles)
   2. Scene navigation engine
   3. Confetti / heart burst effects
   4. Page 1 — Welcome (yes/no)
   5. Page 2 — Gift box
   6. Page 3 — Candle (tap + optional mic blow)
   7. Page 4 — Bouquet
   8. Page 5 — Photo carousel
   9. Page 6 — Envelope + letter
   10. Page 7 — Final gift + teddy
   11. Music toggle
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 0. PASSWORD LOCK SCREEN ================= */
  const SITE_PASSWORD = 'onlyyours';

  const lockScreen = document.getElementById('lockScreen');
  const lockInner = document.getElementById('lockInner');
  const passwordBox = document.getElementById('passwordBox');
  const passwordInput = document.getElementById('passwordInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const lockError = document.getElementById('lockError');
  const lockWelcome = document.getElementById('lockWelcome');
  let unlocking = false;

  function tryUnlock(){
    if (unlocking) return;
    const entered = passwordInput.value.trim().toLowerCase();

    if (entered === SITE_PASSWORD){
      unlocking = true;
      lockError.classList.remove('show');
      burstConfetti(30);
      burstHearts(unlockBtn, 12);

      lockInner.classList.add('fading');
      setTimeout(() => {
        lockWelcome.classList.add('show');
      }, 300);

      setTimeout(() => {
        lockScreen.classList.add('unlocking');
      }, 1700);

      setTimeout(() => {
        lockScreen.classList.add('hidden');
      }, 2450);
    } else {
      lockError.classList.add('show');
      passwordBox.classList.remove('shake');
      void passwordBox.offsetWidth; // restart animation
      passwordBox.classList.add('shake');
    }
  }

  // Note: burstConfetti() and burstHearts() are declared further down
  // this same script with `function` syntax, so they are hoisted and
  // already callable here by the time a person actually clicks Unlock.

  unlockBtn.addEventListener('click', tryUnlock);
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      tryUnlock();
    }
  });
  passwordInput.addEventListener('input', () => {
    lockError.classList.remove('show');
  });

  /* ================= 1. AMBIENT BACKGROUND ================= */
  function startAmbientBackground(){
    const heartsLayer = document.getElementById('bgHearts');
    const sparkleLayer = document.getElementById('bgSparkles');
    const heartEmojis = ['❤', '💗', '💕'];

    function spawnHeart(){
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
      const duration = 9 + Math.random() * 8;
      h.style.animationDuration = duration + 's';
      h.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      heartsLayer.appendChild(h);
      setTimeout(() => h.remove(), duration * 1000 + 500);
    }

    function spawnSparkle(){
      const s = document.createElement('span');
      s.className = 'floating-sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDuration = (2 + Math.random() * 2.5) + 's';
      sparkleLayer.appendChild(s);
      setTimeout(() => s.remove(), 5000);
    }

    // Keep density low so it stays smooth on mobile
    setInterval(spawnHeart, 1400);
    setInterval(spawnSparkle, 900);
    for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 350);
  }
  startAmbientBackground();

  /* ================= 2. SCENE NAVIGATION ================= */
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const dots = Array.from(document.querySelectorAll('.journey-dots .dot'));
  let currentScene = 1;

  function updateDots(sceneNum){
    dots.forEach(dot => {
      const n = Number(dot.dataset.scene);
      dot.classList.toggle('current', n === sceneNum);
      dot.classList.toggle('done', n < sceneNum);
    });
  }

  function goToScene(num){
    const next = document.getElementById('scene-' + num);
    const current = document.getElementById('scene-' + currentScene);
    if (!next || next === current) return;

    current.classList.add('leaving');
    current.classList.remove('active');

    setTimeout(() => {
      current.classList.remove('leaving');
      next.classList.add('active', 'entering');
      window.scrollTo(0, 0);
      setTimeout(() => next.classList.remove('entering'), 650);
    }, 320);

    currentScene = num;
    updateDots(num);
  }
  updateDots(1);

  // Wire every "Continue →" button via its data-next attribute
  document.querySelectorAll('.continue-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.next;
      if (next) goToScene(Number(next));
    });
  });

  function showContinue(btn){
    btn.classList.add('show');
  }

  /* ================= 3. CONFETTI / HEART BURST ================= */
  const confettiLayer = document.getElementById('confettiLayer');
  const confettiColors = ['#E8617B', '#C23B57', '#D9A85C', '#FFD0DE', '#FFFFFF'];

  function burstConfetti(count = 26){
    for (let i = 0; i < count; i++){
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.width = size + 'px';
      piece.style.height = size * 0.4 + 'px';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      const duration = 2.2 + Math.random() * 1.6;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = (Math.random() * 0.3) + 's';
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
    }
  }

  function burstHearts(originEl, count = 10){
    const rect = originEl.getBoundingClientRect();
    const emojis = ['❤️', '💗', '✨', '💕'];
    for (let i = 0; i < count; i++){
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = (rect.left + rect.width / 2 + (Math.random() * 90 - 45)) + 'px';
      h.style.top = (rect.top + rect.height / 2) + 'px';
      h.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
      h.style.animationDelay = (Math.random() * 0.2) + 's';
      confettiLayer.appendChild(h);
      setTimeout(() => h.remove(), 2000);
    }
  }

  /* ================= 4. PAGE 1 — WELCOME ================= */
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const teaseText = document.getElementById('teaseText');

  btnYes.addEventListener('click', () => {
    burstConfetti(34);
    burstHearts(btnYes, 12);
    btnYes.textContent = 'I knew you would! ❤️';
    btnYes.disabled = true;
    btnNo.style.opacity = '0';
    btnNo.style.pointerEvents = 'none';
    ensureMusicStarts();
    setTimeout(() => goToScene(2), 1300);
  });

  let noClickCount = 0;
  btnNo.addEventListener('click', () => {
    noClickCount++;
    teaseText.classList.add('show');
    btnNo.classList.remove('no-shake');
    void btnNo.offsetWidth; // restart animation
    btnNo.classList.add('no-shake');

    // Playful dodge after a couple of tries
    if (noClickCount >= 2){
      const dodgeX = (Math.random() * 90 - 45);
      const dodgeY = (Math.random() * 24 - 12);
      btnNo.style.transform = `translate(${dodgeX}px, ${dodgeY}px)`;
    }
  });

  /* ================= 5. PAGE 2 — GIFT BOX ================= */
  const giftBox = document.getElementById('giftBox');
  const boxHint = document.getElementById('box-hint');
  const boxReveal = document.getElementById('box-reveal');
  const boxKicker = document.getElementById('box-kicker');
  const continue2 = document.getElementById('continue2');
  let box1Opened = false;

  giftBox.addEventListener('click', () => {
    if (box1Opened) return;
    box1Opened = true;
    giftBox.classList.add('opened');
    burstConfetti(28);
    burstHearts(giftBox, 10);
    boxHint.style.opacity = '0';
    boxKicker.style.opacity = '0.4';

    setTimeout(() => {
      boxReveal.classList.add('show');
      boxReveal.querySelectorAll('.reveal-line').forEach((line, i) => {
        setTimeout(() => line.classList.add('show'), i * 400);
      });
      setTimeout(() => showContinue(continue2), 900);
    }, 500);
  });

  /* ================= 6. PAGE 3 — CANDLE ================= */
  const flameBtn = document.getElementById('flameBtn');
  const flame = document.getElementById('flame');
  const candleHint = document.getElementById('candle-hint');
  const micHint = document.getElementById('micHint');
  const wishText = document.getElementById('wishText');
  const wishLine1 = document.getElementById('wishLine1');
  const wishLine2 = document.getElementById('wishLine2');
  const wishLine3 = document.getElementById('wishLine3');
  const continue3 = document.getElementById('continue3');
  const cakeWrap = document.getElementById('cakeWrap');
  let candleOut = false;

  function extinguishCandle(){
    if (candleOut) return;
    candleOut = true;
    flame.classList.add('out');
    candleHint.style.opacity = '0';
    micHint.style.opacity = '0';

    // Little smoke wisps
    for (let i = 0; i < 3; i++){
      setTimeout(() => {
        const smoke = document.createElement('span');
        smoke.className = 'smoke';
        smoke.style.left = (48 + Math.random() * 14) + '%';
        cakeWrap.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1700);
      }, i * 220);
    }

    setTimeout(() => wishLine1.classList.add('show'), 500);
    setTimeout(() => wishLine2.classList.add('show'), 2000);
    setTimeout(() => {
      wishLine3.classList.add('show');
      burstConfetti(18);
    }, 3800);
    setTimeout(() => showContinue(continue3), 4600);
  }

  // Tap-to-extinguish always works — the primary, required interaction
  flameBtn.addEventListener('click', extinguishCandle);

  // Optional microphone "blow" detection — never required
  function tryEnableMicBlow(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      return; // Not supported — tap interaction remains the only method
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        try{
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          const micSource = audioCtx.createMediaStreamSource(stream);
          micSource.connect(analyser);
          analyser.fftSize = 512;
          const data = new Uint8Array(analyser.frequencyBinCount);

          function checkVolume(){
            if (candleOut){
              stream.getTracks().forEach(t => t.stop());
              audioCtx.close();
              return;
            }
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            if (avg > 42){ // blow threshold
              extinguishCandle();
              stream.getTracks().forEach(t => t.stop());
              audioCtx.close();
              return;
            }
            requestAnimationFrame(checkVolume);
          }
          checkVolume();
        } catch(e){ /* mic pipeline unavailable — tap still works */ }
      })
      .catch(() => { /* permission denied or unavailable — tap still works */ });
  }

  // Only ask for the mic once she actually reaches this scene
  const scene3Observer = new MutationObserver(() => {
    if (document.getElementById('scene-3').classList.contains('active')){
      tryEnableMicBlow();
      scene3Observer.disconnect();
    }
  });
  scene3Observer.observe(document.getElementById('scene-3'), { attributes: true, attributeFilter: ['class'] });

  /* ================= 7. PAGE 4 — BOUQUET ================= */
  const acceptRoses = document.getElementById('acceptRoses');
  const rosesReveal = document.getElementById('rosesReveal');
  const continue4 = document.getElementById('continue4');

  acceptRoses.addEventListener('click', () => {
    burstConfetti(20);
    burstHearts(acceptRoses, 10);
    acceptRoses.style.transform = 'scale(0.9)';
    acceptRoses.style.opacity = '0.6';
    acceptRoses.disabled = true;
    setTimeout(() => {
      rosesReveal.classList.add('show');
      showContinue(continue4);
    }, 350);
  });

  /* ================= 8. PAGE 5 — PHOTO CAROUSEL ================= */
  const track = document.getElementById('carouselTrack');
  const cards = Array.from(track.children);
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  const dotsWrap = document.getElementById('carouselDots');
  const continue5 = document.getElementById('continue5');
  let carouselIndex = 0;

  cards.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'cdot';
    dotsWrap.appendChild(d);
  });
  const cdots = Array.from(dotsWrap.children);

  function renderCarousel(){
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    cdots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
    if (carouselIndex === cards.length - 1) showContinue(continue5);
  }

  function goCarousel(delta){
    carouselIndex = Math.max(0, Math.min(cards.length - 1, carouselIndex + delta));
    renderCarousel();
  }

  arrowLeft.addEventListener('click', () => goCarousel(-1));
  arrowRight.addEventListener('click', () => goCarousel(1));
  cdots.forEach((d, i) => d.addEventListener('click', () => { carouselIndex = i; renderCarousel(); }));

  // Touch swipe support
  let touchStartX = 0;
  let touchDeltaX = 0;
  const trackWrap = document.querySelector('.carousel-track-wrap');

  trackWrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    track.style.transition = 'none';
  }, { passive: true });

  trackWrap.addEventListener('touchmove', e => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
    const base = -carouselIndex * trackWrap.offsetWidth;
    track.style.transform = `translateX(${base + touchDeltaX}px)`;
  }, { passive: true });

  trackWrap.addEventListener('touchend', () => {
    track.style.transition = '';
    if (touchDeltaX < -50) goCarousel(1);
    else if (touchDeltaX > 50) goCarousel(-1);
    else renderCarousel();
    touchDeltaX = 0;
  });

  renderCarousel();

  /* ================= 9. PAGE 6 — ENVELOPE + LETTER ================= */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  const letterWrap = document.getElementById('letterWrap');
  const continue6 = document.getElementById('continue6');
  let envelopeOpened = false;

  envelope.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');
    envelopeHint.style.opacity = '0';
    burstHearts(envelope, 8);

    setTimeout(() => {
      letterWrap.classList.add('show');
      const lines = letterWrap.querySelectorAll('.letter-line, .letter-signature');
      lines.forEach((line, i) => {
        setTimeout(() => line.classList.add('in'), 250 + i * 260);
      });
      setTimeout(() => showContinue(continue6), 250 + lines.length * 260 + 300);
    }, 600);
  });

  /* ================= 10. PAGE 7 — FINAL GIFT + TEDDY ================= */
  const giftBox2 = document.getElementById('giftBox2');
  const finalHint = document.getElementById('final-hint');
  const teddyReveal = document.getElementById('teddyReveal');
  let box2Opened = false;

  giftBox2.addEventListener('click', () => {
    if (box2Opened) return;
    box2Opened = true;
    giftBox2.classList.add('opened');
    finalHint.style.opacity = '0';
    burstConfetti(46);
    burstHearts(giftBox2, 16);

    setTimeout(() => {
      teddyReveal.classList.add('show');
      teddyReveal.querySelectorAll('.reveal-line, .signature-block').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.25) + 's';
        requestAnimationFrame(() => el.classList.add('show'));
      });
      burstConfetti(20);
    }, 550);
  });

  /* ================= 11. MUSIC TOGGLE ================= */
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  let musicOn = false;
  let musicStarted = false;

  function ensureMusicStarts(){
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicOn = true;
      musicToggle.classList.remove('muted');
    }).catch(() => {
      // Autoplay blocked — she can still tap the music button manually
      musicOn = false;
      musicToggle.classList.add('muted');
    });
  }

  musicToggle.addEventListener('click', () => {
    if (!musicStarted){
      ensureMusicStarts();
      return;
    }
    if (musicOn){
      bgMusic.pause();
      musicOn = false;
      musicToggle.classList.add('muted');
    } else {
      bgMusic.play().catch(() => {});
      musicOn = true;
      musicToggle.classList.remove('muted');
    }
  });

});
