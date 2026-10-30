/**
 * Interactive Date Invitation Website Logic
 * Tailored for Mau & Badak ♡
 */

(function () {
  'use strict';

  // --- PRE-CONFIGURED STATE ---
  const state = {
    recipient: 'Mau',
    sender: 'Badak',
    photoUrl: 'assets/stickers/flork_1_flowers.png',
    theme: 'lavender',
    phone: '918552852791',
    loveNote: "Every single day with you is special, but I really want to take you out on a proper date. Whether we're going to a café, watching a movie together, or just simply talking to each other, spending time with you is honestly my favorite part of life. I really can't wait to see you, my love. ♡",
    selectedDate: '',
    selectedVibe: 'Café',
    selectedVibeIcon: '☕',
    selectedTime: '19:30',
    planStatus: 'confirm',
    userMessage: '',
    noEvasionCount: 0,
    yesScale: 1.0,
    currentScreen: 'screen-1'
  };

  // --- DOM ELEMENTS ---
  const screens = {
    screen1: document.getElementById('screen-1'),
    screen2: document.getElementById('screen-2'),
    screen3: document.getElementById('screen-3'),
    screen4: document.getElementById('screen-4'),
    screen5: document.getElementById('screen-5'),
    screen6: document.getElementById('screen-6')
  };

  const btnOpenInvite = document.getElementById('btn-open-invite');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const teasingCaption = document.getElementById('teasing-caption');
  const playground = document.getElementById('playground');
  const evasionZone = document.getElementById('evasion-zone');
  const doodleImg = document.getElementById('doodle-img');
  const linkNotThisTime = document.getElementById('link-not-this-time');

  const btnGotoStep1 = document.getElementById('btn-goto-step1');
  const btnGotoStep2 = document.getElementById('btn-goto-step2');
  const btnGotoStep3 = document.getElementById('btn-goto-step3');
  const btnBackStep1 = document.getElementById('btn-back-step1');
  const btnBackStep2 = document.getElementById('btn-back-step2');
  const btnBackStep3 = document.getElementById('btn-back-step3');

  const datePicker = document.getElementById('date-picker-input');
  const timePicker = document.getElementById('time-picker-input');
  const userCustomMsg = document.getElementById('user-custom-msg');
  const replyMethodSelect = document.getElementById('reply-method-select');
  const btnSendRsvp = document.getElementById('btn-send-rsvp');
  const replyMethodHint = document.getElementById('reply-method-hint');

  const summaryDateDisplay = document.getElementById('summary-date-display');
  const summaryVibeDisplay = document.getElementById('summary-vibe-display');
  const summaryTimeDisplay = document.getElementById('summary-time-display');
  const liveRsvpBox = document.getElementById('live-rsvp-box');

  const btnToggleLoveNote = document.getElementById('btn-toggle-love-note');
  const loveNoteBody = document.getElementById('love-note-body');
  const loveNoteP = document.getElementById('love-note-p');

  // Modals
  const modalPleading = document.getElementById('modal-pleading');
  const btnReconsiderYes = document.getElementById('btn-reconsider-yes');
  const btnReconsiderClose = document.getElementById('btn-reconsider-close');
  const toast = document.getElementById('toast');

  // --- CONFETTI CANNON ---
  const canvas = document.getElementById('confetti-canvas');
  let ctx = null;
  let particles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    particles = [];

    const colors = ['#e74c67', '#ff8da1', '#ba68c8', '#805b9a', '#ffd54f', '#64b5f6'];
    const heartPaths = ['heart', 'circle', 'rect'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        shape: heartPaths[Math.floor(Math.random() * heartPaths.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 70 + 80
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function drawHeart(c, x, y, size, color, rot, alpha) {
    c.save();
    c.translate(x, y);
    c.rotate((rot * Math.PI) / 180);
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
    c.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    c.closePath();
    c.fill();
    c.restore();
  }

  function animateConfetti() {
    if (!ctx || particles.length === 0) {
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimationId = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vRot;
      p.life++;

      if (p.life > p.maxLife * 0.6) {
        p.alpha = Math.max(0, 1 - (p.life - p.maxLife * 0.6) / (p.maxLife * 0.4));
      }

      if (p.shape === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation, p.alpha);
      } else if (p.shape === 'circle') {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
        ctx.restore();
      }

      if (p.life >= p.maxLife || p.y > canvas.height + 20) {
        particles.splice(i, 1);
      }
    }

    confettiAnimationId = requestAnimationFrame(animateConfetti);
  }

  // --- SCREEN SWITCHING ---
  function goToScreen(screenId) {
    Object.keys(screens).forEach((key) => {
      const s = screens[key];
      if (s) {
        s.classList.remove('active');
        s.style.display = 'none';
      }
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.style.display = 'flex';
      // Trigger reflow for CSS animation
      void target.offsetWidth;
      target.classList.add('active');
      state.currentScreen = screenId;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Special triggers per screen
    if (screenId === 'screen-3') {
      triggerConfetti();
    } else if (screenId === 'screen-6') {
      updateTicketSummary();
      updateLiveRsvpText();
    }
  }

  // --- RUNAWAY "NO" BUTTON & STICKER EVASION LOGIC ---
  const attempts = [
    {
      sticker: 'assets/stickers/flork_1_flowers.png',
      caption: 'Wait, what? Are you really saying no to me? 🤨',
      btnText: 'Are you sure?',
      align: 'left',
      rot: -8,
      topPx: 45
    },
    {
      sticker: 'assets/stickers/flork_2_heart.png',
      caption: 'Wrong button Mau, try the purple one! 💕',
      btnText: 'Really?',
      align: 'right',
      rot: 6,
      topPx: 52
    },
    {
      sticker: 'assets/stickers/flork_3_smile.png',
      caption: "Nice try, but you're stuck with me 🥰",
      btnText: 'Think again',
      align: 'left',
      rot: -10,
      topPx: 38
    },
    {
      sticker: 'assets/stickers/flork_4_panic.png',
      caption: "You can't reject your own boyfriend! 😤",
      btnText: 'Still no?',
      align: 'right',
      rot: 8,
      topPx: 55
    },
    {
      sticker: 'assets/stickers/flork_5_fingerheart.png',
      caption: 'Come on, you know you want to go on a date with me 😌',
      btnText: 'Try again',
      align: 'right',
      rot: -6,
      topPx: 26
    },
    {
      sticker: 'assets/stickers/flork_6_cheer.png',
      caption: 'Give up already and just press Yes! ❤️',
      btnText: 'Too slow',
      align: 'left',
      rot: 11,
      topPx: 62
    }
  ];

  function runAway(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    state.noEvasionCount++;

    const attemptIndex = (state.noEvasionCount - 1) % attempts.length;
    const currentAttempt = attempts[attemptIndex];

    // 1. Swap sticker image with a subtle bouncy pop animation
    if (doodleImg && currentAttempt.sticker) {
      doodleImg.classList.add('pop');
      setTimeout(() => {
        doodleImg.src = currentAttempt.sticker;
        doodleImg.classList.remove('pop');
      }, 90);
    }

    // 2. Update teasing caption text
    if (teasingCaption && currentAttempt.caption) {
      teasingCaption.textContent = currentAttempt.caption;
    }

    // 3. Update button text
    btnNo.textContent = currentAttempt.btnText;

    // 4. Position the "No" button far away from the "Yes" button in the evasion zone
    const zone = evasionZone || playground;
    const zoneRect = zone.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    let targetX = 0;
    const padding = 12;

    if (currentAttempt.align === 'left') {
      const minX = padding;
      const maxX = Math.max(padding + 10, zoneRect.width * 0.28);
      targetX = Math.floor(minX + Math.random() * (maxX - minX));
    } else {
      const maxX = Math.max(padding + 20, zoneRect.width - btnRect.width - padding);
      const minX = Math.max(padding, zoneRect.width * 0.58);
      targetX = Math.floor(minX + Math.random() * (maxX - minX));
    }

    const maxY = Math.max(20, zoneRect.height - btnRect.height - 10);
    const targetY = Math.min(maxY, Math.max(8, currentAttempt.topPx + Math.floor((Math.random() - 0.5) * 14)));

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${targetX}px`;
    btnNo.style.top = `${targetY}px`;
    btnNo.style.right = 'auto';
    btnNo.style.bottom = 'auto';
    btnNo.style.transform = `rotate(${currentAttempt.rot}deg)`;

    // 5. Steadily grow the "Yes" button slightly
    state.yesScale = Math.min(1.36, state.yesScale + 0.045);
    btnYes.style.transform = `scale(${state.yesScale})`;
    btnYes.style.boxShadow = `0 ${6 * state.yesScale}px 0 var(--primary-shadow), 0 ${14 * state.yesScale}px ${26 * state.yesScale}px var(--primary-glow)`;
  }

  // --- DATE & TIME INITIALIZATION ---
  function initDateDefaults() {
    const today = new Date();
    // Default to this upcoming Saturday
    const dayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const defaultDate = new Date(today);
    defaultDate.setDate(today.getDate() + daysUntilSaturday);

    const yyyy = defaultDate.getFullYear();
    const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const dd = String(defaultDate.getDate()).padStart(2, '0');

    datePicker.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    datePicker.value = `${yyyy}-${mm}-${dd}`;
    state.selectedDate = datePicker.value;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'To be decided';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Quick date chips handlers
  document.querySelectorAll('.chip-btn[data-days]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-days');
      const now = new Date();
      let target = new Date(now);

      if (val === '1') {
        target.setDate(now.getDate() + 1);
      } else if (val === 'friday') {
        const diff = (5 - now.getDay() + 7) % 7 || 7;
        target.setDate(now.getDate() + diff);
      } else if (val === 'saturday') {
        const diff = (6 - now.getDay() + 7) % 7 || 7;
        target.setDate(now.getDate() + diff);
      } else if (val === 'next-weekend') {
        const diff = (6 - now.getDay() + 7) % 7 + 7;
        target.setDate(now.getDate() + diff);
      }

      const yyyy = target.getFullYear();
      const mm = String(target.getMonth() + 1).padStart(2, '0');
      const dd = String(target.getDate()).padStart(2, '0');
      datePicker.value = `${yyyy}-${mm}-${dd}`;
      state.selectedDate = datePicker.value;

      document.querySelectorAll('.chip-btn[data-days]').forEach((c) => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // --- VIBES SELECTION (4 OPTIONS ONLY) ---
  document.querySelectorAll('.vibe-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.vibe-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      state.selectedVibe = card.getAttribute('data-vibe');
      state.selectedVibeIcon = card.getAttribute('data-icon') || '♡';

      updateTicketSummary();
      updateLiveRsvpText();
    });
  });

  // --- TICKET SUMMARY & LIVE RSVP UPDATES ---
  function updateTicketSummary() {
    summaryDateDisplay.textContent = formatDisplayDate(state.selectedDate);
    summaryVibeDisplay.textContent = `${state.selectedVibeIcon} ${state.selectedVibe}`;
    if (summaryTimeDisplay) {
      summaryTimeDisplay.textContent = state.selectedTime || '19:30';
    }
  }

  function updateLiveRsvpText() {
    const formattedDate = formatDisplayDate(state.selectedDate);
    let acceptanceLine = 'I said YES and confirmed our date!';
    if (state.planStatus === 'modify') {
      acceptanceLine = 'I said YES, but I have a few fun adjustments in mind!';
    }

    let text = `Hi ${state.sender} ♡\n${acceptanceLine}\nDate: ${formattedDate}\nTime: ${state.selectedTime}\nActivity: ${state.selectedVibe}`;

    if (state.userMessage.trim()) {
      text += `\nMy message: ${state.userMessage.trim()}`;
    }

    liveRsvpBox.textContent = text;
    return text;
  }

  // --- RSVP SEND HANDLERS (WHATSAPP & INSTAGRAM ONLY) ---
  function handleSendRsvp() {
    const method = replyMethodSelect.value;
    const rsvpText = updateLiveRsvpText();
    const encodedText = encodeURIComponent(rsvpText);

    if (method === 'whatsapp') {
      const cleanPhone = (state.phone || '').replace(/[^0-9]/g, '');
      const url = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodedText}`
        : `https://wa.me/?text=${encodedText}`;
      window.open(url, '_blank');
      showToast('Opening WhatsApp to message Badak... 💬');
    } else if (method === 'instagram') {
      navigator.clipboard.writeText(rsvpText).then(() => {
        showToast('RSVP copied! Paste it in Badak\'s DM on Instagram ✨');
        setTimeout(() => {
          window.open('https://www.instagram.com/direct/inbox/', '_blank');
        }, 800);
      }).catch(() => {
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
      });
    }
  }

  // Update send button style and label based on reply method
  replyMethodSelect.addEventListener('change', () => {
    const method = replyMethodSelect.value;
    btnSendRsvp.className = 'btn-primary-3d';

    if (method === 'whatsapp') {
      btnSendRsvp.classList.add('btn-whatsapp');
      btnSendRsvp.textContent = 'Reply via WhatsApp';
      replyMethodHint.textContent = 'Opens WhatsApp with your pre-filled answer ready to send to Badak.';
    } else if (method === 'instagram') {
      btnSendRsvp.classList.add('btn-instagram');
      btnSendRsvp.textContent = 'Reply via Instagram';
      replyMethodHint.textContent = 'Copies your RSVP and opens Instagram Direct to message Badak.';
    }
  });

  // --- LOVE NOTE ACCORDION ---
  btnToggleLoveNote.addEventListener('click', () => {
    const isOpen = loveNoteBody.classList.toggle('open');
    btnToggleLoveNote.classList.toggle('open', isOpen);
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- EVENT LISTENERS ---

  // Screen 1: Open invitation
  btnOpenInvite.addEventListener('click', () => {
    goToScreen('screen-2');
  });

  // Screen 2: Yes button
  btnYes.addEventListener('click', () => {
    goToScreen('screen-3');
  });

  // Screen 2: Runaway No button
  btnNo.addEventListener('mouseover', runAway);
  btnNo.addEventListener('touchstart', runAway, { passive: false });
  btnNo.addEventListener('click', runAway);

  // Screen 2: Not this time link
  linkNotThisTime.addEventListener('click', () => {
    modalPleading.classList.add('active');
  });

  btnReconsiderYes.addEventListener('click', () => {
    modalPleading.classList.remove('active');
    goToScreen('screen-3');
  });

  btnReconsiderClose.addEventListener('click', () => {
    modalPleading.classList.remove('active');
    showToast('The butterflies are still hopeful! ♡');
  });

  // Screen 3: Continue to Step 1
  btnGotoStep1.addEventListener('click', () => {
    goToScreen('screen-4');
  });

  // Screen 4: Step 1 (Date)
  datePicker.addEventListener('change', () => {
    state.selectedDate = datePicker.value;
  });

  btnGotoStep2.addEventListener('click', () => {
    if (!datePicker.value) {
      showToast('Please pick a lovely date first! 📅');
      return;
    }
    state.selectedDate = datePicker.value;
    goToScreen('screen-5');
  });

  btnBackStep1.addEventListener('click', () => {
    goToScreen('screen-3');
  });

  // Screen 5: Step 2 (Vibe)
  btnGotoStep3.addEventListener('click', () => {
    goToScreen('screen-6');
  });

  btnBackStep2.addEventListener('click', () => {
    goToScreen('screen-4');
  });

  // Screen 6: Step 3 (Time Form)
  timePicker.addEventListener('change', () => {
    state.selectedTime = timePicker.value;
    updateTicketSummary();
    updateLiveRsvpText();
  });

  document.querySelectorAll('input[name="plan-confirm"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      state.planStatus = e.target.value;
      updateLiveRsvpText();
    });
  });

  userCustomMsg.addEventListener('input', () => {
    state.userMessage = userCustomMsg.value;
    updateLiveRsvpText();
  });

  btnSendRsvp.addEventListener('click', handleSendRsvp);

  btnBackStep3.addEventListener('click', () => {
    goToScreen('screen-5');
  });

  // Close pleading modal on background click
  if (modalPleading) {
    modalPleading.addEventListener('click', (e) => {
      if (e.target === modalPleading) {
        modalPleading.classList.remove('active');
      }
    });
  }

  // Keyboard accessibility (ESC closes modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalPleading) {
      modalPleading.classList.remove('active');
    }
  });

  // --- INITIALIZATION ---
  initDateDefaults();
  updateTicketSummary();
  updateLiveRsvpText();

})();
