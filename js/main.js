/**
 * GULI DENT CLINIC - MAIN INTERACTIVE SCRIPT
 * Handles 3D Three.js Tooth Model, Online Appointment Booking,
 * Language Selector, Map Zoom, and Responsive Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initThreeJsTooth();
  initBookingSystem();
  initLanguageSwitcher();
  initMapControls();
  initMobileNav();
});

/* ==========================================================================
   1. THREE.JS INTERACTIVE 3D TOOTH & IMPLANT MODEL
   ========================================================================== */
function initThreeJsTooth() {
  const container = document.getElementById('tooth-3d-viewport');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 540;

  // Scene & Camera setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 7.8);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Studio Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x0d9488, 2.8);
  keyLight.position.set(6, 8, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
  rimLight.position.set(-6, -3, -5);
  scene.add(rimLight);

  const softWhite = new THREE.PointLight(0xffffff, 1.8, 20);
  softWhite.position.set(0, 4, 4);
  scene.add(softWhite);

  const bottomFill = new THREE.PointLight(0x99f6e4, 1.2, 15);
  bottomFill.position.set(0, -5, 2);
  scene.add(bottomFill);

  // Master Tooth Model Group
  const toothGroup = new THREE.Group();
  scene.add(toothGroup);

  // Materials
  const crystalEnamelMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    emissive: 0x0f766e,
    emissiveIntensity: 0.12,
    roughness: 0.1,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transmission: 0.55,
    opacity: 0.92,
    transparent: true,
    reflectivity: 0.95
  });

  const glowingPulpMat = new THREE.MeshPhongMaterial({
    color: 0x14b8a6,
    emissive: 0x0d9488,
    emissiveIntensity: 0.45,
    shininess: 100,
    specular: 0xccfbf1
  });

  const titaniumScrewMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.88,
    roughness: 0.32
  });

  const goldAbutmentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.75,
    roughness: 0.28
  });

  // Crown (Molar geometry)
  const crownGroup = new THREE.Group();
  const crownBodyGeo = new THREE.CylinderGeometry(1.45, 1.18, 1.6, 32, 16);
  const crownBody = new THREE.Mesh(crownBodyGeo, crystalEnamelMat);
  crownBody.position.y = 0.65;
  crownGroup.add(crownBody);

  // 4 Cusps
  const cuspGeo = new THREE.SphereGeometry(0.74, 24, 24);
  const cuspOffsets = [
    [-0.62, 1.35, -0.58],
    [0.62, 1.35, -0.58],
    [-0.68, 1.35, 0.58],
    [0.68, 1.35, 0.58]
  ];

  cuspOffsets.forEach(pos => {
    const cusp = new THREE.Mesh(cuspGeo, crystalEnamelMat);
    cusp.position.set(pos[0], pos[1], pos[2]);
    cusp.scale.set(1.08, 0.72, 1.08);
    crownGroup.add(cusp);
  });

  // Glowing Dental Pulp Core
  const pulpGeo = new THREE.SphereGeometry(0.62, 16, 16);
  const pulpMesh = new THREE.Mesh(pulpGeo, glowingPulpMat);
  pulpMesh.position.set(0, 0.75, 0);
  pulpMesh.scale.set(0.9, 1.4, 0.9);
  crownGroup.add(pulpMesh);
  toothGroup.add(crownGroup);

  // Dental Implant Section
  const implantGroup = new THREE.Group();

  // Abutment
  const abutmentGeo = new THREE.CylinderGeometry(1.12, 0.88, 0.5, 32);
  const abutment = new THREE.Mesh(abutmentGeo, goldAbutmentMat);
  abutment.position.y = -0.32;
  implantGroup.add(abutment);

  // Titanium Screw Body
  const screwBodyGeo = new THREE.ConeGeometry(0.88, 2.8, 32);
  const screwBody = new THREE.Mesh(screwBodyGeo, titaniumScrewMat);
  screwBody.rotation.x = Math.PI;
  screwBody.position.y = -1.82;
  implantGroup.add(screwBody);

  // Screw Ridge Threads
  for (let i = 0; i < 7; i++) {
    const r = 0.88 - (i * 0.1);
    const ringGeo = new THREE.TorusGeometry(r, 0.055, 12, 32);
    const ringMesh = new THREE.Mesh(ringGeo, titaniumScrewMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.85 - (i * 0.35);
    implantGroup.add(ringMesh);
  }
  toothGroup.add(implantGroup);

  // Orbital Tech Scanner Rings
  const orbitGeo1 = new THREE.TorusGeometry(2.45, 0.02, 16, 100);
  const orbitMat1 = new THREE.MeshBasicMaterial({ color: 0x0d9488, opacity: 0.55, transparent: true });
  const orbitRing1 = new THREE.Mesh(orbitGeo1, orbitMat1);
  orbitRing1.rotation.x = Math.PI / 2.6;
  toothGroup.add(orbitRing1);

  const orbitGeo2 = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
  const orbitMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, opacity: 0.45, transparent: true });
  const orbitRing2 = new THREE.Mesh(orbitGeo2, orbitMat2);
  orbitRing2.rotation.x = -Math.PI / 3.4;
  orbitRing2.rotation.y = 0.35;
  toothGroup.add(orbitRing2);

  // 18 Floating Scanner Particles
  const pGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
  for (let i = 0; i < 18; i++) {
    const pMesh = new THREE.Mesh(pGeo, pMat);
    const ang = (i / 18) * Math.PI * 2;
    pMesh.position.set(Math.cos(ang) * 2.45, Math.sin(ang) * 0.35, Math.sin(ang) * 2.45);
    toothGroup.add(pMesh);
  }

  toothGroup.position.set(0, 0.1, 0);

  // Mouse / Touch Tracking
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  function updateMouse(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    mouseX = (x / rect.width) * 2 - 1;
    mouseY = -(y / rect.height) * 2 + 1;
  }

  window.addEventListener('mousemove', updateMouse);
  window.addEventListener('touchmove', updateMouse, { passive: true });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    toothGroup.rotation.y = time * 0.4 + targetX * 0.9;
    toothGroup.rotation.x = Math.sin(time * 0.6) * 0.08 - targetY * 0.45;
    toothGroup.position.y = Math.sin(time * 1.4) * 0.12;

    orbitRing1.rotation.z = time * 0.25;
    orbitRing2.rotation.z = -time * 0.2;

    renderer.render(scene, camera);
  }
  animate();

  // Responsive Resizing
  function onResize() {
    const w = container.clientWidth || 540;
    const h = container.clientHeight || 540;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
}

/* ==========================================================================
   2. APPOINTMENT BOOKING DASHBOARD LOGIC
   ========================================================================== */
function initBookingSystem() {
  const state = {
    selectedDate: 'Bugun, 25-Okt',
    selectedTime: '09:15',
    duration: '15',
    doctor: 'Dr. Gulnora Alimova (Bosh shifokor)',
    treatment: 'Birlamchi Ko‘rik & Diagnostika'
  };

  const summaryDisplay = document.getElementById('bookingSummaryPillText');
  const dateTabs = document.querySelectorAll('#dateTabs button');
  const slotButtons = document.querySelectorAll('.slot-btn');
  const dur15 = document.getElementById('duration15');
  const dur30 = document.getElementById('duration30');
  const durationRadios = document.querySelectorAll('input[name="duration"]');
  const docSelect = document.getElementById('docSelect');
  const treatmentSelect = document.getElementById('treatmentSelect');
  const bookingBtn = document.getElementById('confirmBookingBtn');
  const patientNameInput = document.getElementById('patientName');
  const patientPhoneInput = document.getElementById('patientPhone');

  function updateSummary() {
    if (summaryDisplay) {
      summaryDisplay.textContent = `${state.selectedDate} • ${state.selectedTime} (${state.duration} min)`;
    }
  }

  // Date selection
  dateTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dateTabs.forEach(t => {
        t.className = 'px-4 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-semibold transition-all shrink-0 date-tab-btn';
      });
      tab.className = 'px-4 py-2 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm shrink-0 date-tab-btn';
      state.selectedDate = tab.textContent.trim();
      updateSummary();
    });
  });

  // Time slot selection
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        b.className = 'slot-btn py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold hover:bg-primary-fixed hover:text-primary transition-all shadow-sm';
        b.innerHTML = b.textContent.replace('check', '').trim();
      });

      btn.className = 'slot-btn py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md flex items-center justify-center gap-1';
      const timeVal = btn.textContent.replace('check', '').trim();
      btn.innerHTML = `<span>${timeVal}</span><span class="material-symbols-outlined text-[16px]">check</span>`;
      state.selectedTime = timeVal;
      updateSummary();
    });
  });

  // Duration toggle
  durationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.duration = e.target.value;
      if (e.target.value === '15') {
        if (dur15) dur15.className = 'flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer bg-primary-fixed/20 shadow-sm transition-all duration-200 border border-primary/20';
        if (dur30) dur30.className = 'flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-all duration-200 border border-transparent';
      } else {
        if (dur30) dur30.className = 'flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer bg-primary-fixed/20 shadow-sm transition-all duration-200 border border-primary/20';
        if (dur15) dur15.className = 'flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-all duration-200 border border-transparent';
      }
      updateSummary();
    });
  });

  // Select doctor and treatment
  if (docSelect) {
    docSelect.addEventListener('change', (e) => {
      state.doctor = e.target.options[e.target.selectedIndex].text;
    });
  }
  if (treatmentSelect) {
    treatmentSelect.addEventListener('change', (e) => {
      state.treatment = e.target.options[e.target.selectedIndex].text;
    });
  }

  // Booking Confirmation & Feedback
  if (bookingBtn) {
    bookingBtn.addEventListener('click', () => {
      const name = patientNameInput ? patientNameInput.value.trim() : '';
      const phone = patientPhoneInput ? patientPhoneInput.value.trim() : '';

      if (!name) {
        showToast('Iltimos, ism va familiyangizni kiriting!', 'error');
        if (patientNameInput) patientNameInput.focus();
        return;
      }

      if (!phone || phone.length < 9) {
        showToast('Iltimos, telefon raqamingizni to‘liq kiriting!', 'error');
        if (patientPhoneInput) patientPhoneInput.focus();
        return;
      }

      // Success Toast
      showToast(`Tabriklaymiz, ${name}! Qabul ${state.selectedDate} soat ${state.selectedTime} ga muvaffaqiyatli band qilindi. SMS tasdiqnoma yuborildi.`, 'success');
    });
  }
}

/* ==========================================================================
   3. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('bookingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bookingToast';
    toast.className = 'booking-toast';
    document.body.appendChild(toast);
  }

  const iconName = type === 'error' ? 'error' : 'check_circle';
  const iconColor = type === 'error' ? 'text-red-500' : 'text-primary';

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[24px]">${iconName}</span>
    <span class="font-body-sm text-body-sm text-on-surface font-medium">${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   4. LANGUAGE SELECTOR SWITCHER (MINIMALIST)
   ========================================================================== */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  if (!langButtons.length) return;

  const setLanguage = (lang, showToastFeedback = true) => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('gulident_lang', lang);
    } catch (e) {
      /* ignore storage quota / sandbox restrictions */
    }

    // Synchronize all desktop and mobile language buttons
    langButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    if (showToastFeedback) {
      const feedbackMessages = {
        uz: 'Til o‘zgartirildi: O‘zbekcha',
        ru: 'Язык изменен: Русский',
        en: 'Language switched: English'
      };
      const message = feedbackMessages[lang] || `Til: ${lang.toUpperCase()}`;
      showToast(message, 'success');
    }
  };

  // Attach click listeners to all language buttons
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute('data-lang') || 'uz';
      setLanguage(selectedLang, true);
    });
  });

  // Restore saved language preference on page load
  let savedLang = 'uz';
  try {
    savedLang = localStorage.getItem('gulident_lang') || 'uz';
  } catch (e) {
    savedLang = 'uz';
  }
  setLanguage(savedLang, false);
}

/* ==========================================================================
   5. INTERACTIVE MAP CONTROLS
   ========================================================================== */
function initMapControls() {
  const zoomInBtn = document.getElementById('mapZoomIn');
  const zoomOutBtn = document.getElementById('mapZoomOut');
  const mapViewport = document.getElementById('mapViewportBg');

  let currentScale = 1;

  if (zoomInBtn && mapViewport) {
    zoomInBtn.addEventListener('click', () => {
      if (currentScale < 1.4) {
        currentScale += 0.15;
        mapViewport.style.transform = `scale(${currentScale})`;
        mapViewport.style.transition = 'transform 0.3s ease';
      }
    });
  }

  if (zoomOutBtn && mapViewport) {
    zoomOutBtn.addEventListener('click', () => {
      if (currentScale > 0.9) {
        currentScale -= 0.15;
        mapViewport.style.transform = `scale(${currentScale})`;
        mapViewport.style.transition = 'transform 0.3s ease';
      }
    });
  }
}

/* ==========================================================================
   6. RESPONSIVE MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const icon = toggleBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = drawer.classList.contains('open') ? 'close' : 'menu';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        const icon = toggleBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }
}
