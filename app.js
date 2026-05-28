/* ==========================================================================
   Universe Labs - Interactive Core Logic (Spatial, Glitch & 3D HUD Theme)
   Author: Universe Labs
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Global mouse coordinates
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, normX: 0, normY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    
    // Normalize coordinates [-1, 1] for WebGL space
    mouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.normY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Smooth mouse interpolation
  function updateMouseCoordinates() {
    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;
  }

  /* ==========================================================================
     1. Custom Cyber Cursor (with active jitter/glitch)
     ========================================================================== */
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');

  if (cursor && cursorDot) {
    const tickCursor = () => {
      updateMouseCoordinates();
      cursor.style.left = `${mouse.x}px`;
      cursor.style.top = `${mouse.y}px`;
      
      cursorDot.style.left = `${mouse.targetX}px`;
      cursorDot.style.top = `${mouse.targetY}px`;
      
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);

    // Occasional random cyber cursor jitter
    setInterval(() => {
      cursor.classList.add('glitch-cursor');
      setTimeout(() => {
        cursor.classList.remove('glitch-cursor');
      }, 250);
    }, 4000);

    // Hover effect on interactive elements
    const updateClickables = () => {
      const clickables = document.querySelectorAll('a, button, .tech-card, .project-card, .cta-nav');
      clickables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('active'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
      });
    };
    updateClickables();
  }

  /* ==========================================================================
     2. Cyber Scramble Text Effect (Hover Interaction)
     ========================================================================== */
  function scrambleText(element, duration = 400) {
    const originalText = element.dataset.originalText || element.textContent;
    if (!element.dataset.originalText) {
      element.dataset.originalText = originalText;
    }
    
    // Cyber/Matrix characters
    const chars = '@#$%&?*10[]/+_';
    let start = null;
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      if (progress < duration) {
        const scrambled = originalText.split('').map((char, index) => {
          if (char === ' ') return ' ';
          // Character reveal threshold based on time
          const charProgress = (index / originalText.length) * duration;
          if (progress > charProgress) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        
        element.textContent = scrambled;
        requestAnimationFrame(step);
      } else {
        element.textContent = originalText;
      }
    };
    requestAnimationFrame(step);
  }

  // Attach scramble triggers to navbar and cards
  const scrambleElements = document.querySelectorAll('.nav-link, .cta-nav, .btn, .card-title, .project-name');
  scrambleElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      scrambleText(elem, 500);
    });
  });

  /* ==========================================================================
     3. Sticky Header & Menu Toggles
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  const sections = document.querySelectorAll('section');
  function highlightActiveLink() {
    let scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     4. Starfield & Cosmic Nebula Canvas
     ========================================================================== */
  const starCanvas = document.getElementById('starfieldCanvas');
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    let width = (starCanvas.width = window.innerWidth);
    let height = (starCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = (starCanvas.width = window.innerWidth);
      height = (starCanvas.height = window.innerHeight);
    });

    const numStars = 150;
    const stars = [];

    // Create tiny, sharp stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * width,
        size: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.85 ? 'rgba(0, 240, 255, 0.75)' : 'rgba(255, 255, 255, 0.55)',
        speedOffset: Math.random() * 0.3 + 0.1
      });
    }

    const animateStars = () => {
      ctx.fillStyle = '#020403';
      ctx.fillRect(0, 0, width, height);

      // Render cosmic mouse-reactive nebula aura
      const speedFactor = 0.5 + (window.scrollY * 0.001);
      const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(width, height) * 0.35);
      glowGrad.addColorStop(0, 'rgba(127, 0, 255, 0.04)'); // Indigo
      glowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.015)');  // Cyan
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach(star => {
        star.z -= star.speedOffset * speedFactor;

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        const k = 128 / star.z;
        const px = (star.x - width / 2) * k + width / 2;
        const py = (star.y - height / 2) * k + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const starSize = star.size * k * 1.2;
          ctx.beginPath();
          ctx.arc(px, py, Math.min(starSize, 2), 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
      });

      requestAnimationFrame(animateStars);
    };

    animateStars();
  }

  /* ==========================================================================
     5. Typewriter Transition
     ========================================================================== */
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const terms = [
      '3D Digital Twins',
      'WebXR Spatial Cores',
      'Immersive XR Interfaces',
      'Edge Computing R&D'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const handleTypewriter = () => {
      const currentWord = terms[wordIndex];
      
      if (isDeleting) {
        typewriter.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriter.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2200;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % terms.length;
        typingSpeed = 500;
      }

      setTimeout(handleTypewriter, typingSpeed);
    };

    setTimeout(handleTypewriter, 1000);
  }

  /* ==========================================================================
     6. Three.js Full-Screen WebGL Constellation, 3D Globe & Dynamic Glitch
     ========================================================================== */
  const threeContainer = document.getElementById('threeCanvasContainer');
  if (threeContainer && window.THREE) {
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 24;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainer.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Responsive asymmetric globe positioning
      if (window.innerWidth > 992) {
        globeGroup.position.x = 4.5;
      } else {
        globeGroup.position.x = 0;
      }
    });

    // A. Create the central 3D Digital Twin Globe Group
    const globeGroup = new THREE.Group();
    if (window.innerWidth > 992) {
      globeGroup.position.x = 4.5;
    }
    scene.add(globeGroup);

    // Glowing wireframe Sphere mesh
    const globeGeom = new THREE.SphereGeometry(3.6, 20, 20);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending
    });
    const digitalTwinGlobe = new THREE.Mesh(globeGeom, globeMat);
    globeGroup.add(digitalTwinGlobe);

    // Orbiting data scanner ring around the globe (tilted)
    const globeRingGeom = new THREE.RingGeometry(4.4, 4.45, 64);
    const globeRingMat = new THREE.MeshBasicMaterial({
      color: 0x7f00ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const globeRing = new THREE.Mesh(globeRingGeom, globeRingMat);
    globeRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(globeRing);

    // Lidar scanner radar sweep ring (translates vertically inside the globe)
    const radarGeom = new THREE.RingGeometry(0.1, 3.55, 32);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const radarSweep = new THREE.Mesh(radarGeom, radarMat);
    radarSweep.rotation.x = Math.PI / 2;
    globeGroup.add(radarSweep);

    // Concentric Dot Shell rotating in reverse
    const shellGeom = new THREE.SphereGeometry(4.2, 10, 10);
    const shellMat = new THREE.PointsMaterial({
      color: 0x7f00ff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const outerDotShell = new THREE.Points(shellGeom, shellMat);
    globeGroup.add(outerDotShell);

    // B. Interactive 3D Cursor HUD Reticle
    const hudGroup = new THREE.Group();
    scene.add(hudGroup);

    // Outer bracket ring
    const hudOuterGeom = new THREE.RingGeometry(0.9, 0.94, 4, 1, 0, Math.PI * 1.8); // gaps in ring
    const hudOuterMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const hudOuter = new THREE.LineLoop(hudOuterGeom, hudOuterMat);
    hudGroup.add(hudOuter);

    // Inner target reticle dots
    const hudInnerGeom = new THREE.CircleGeometry(0.08, 8);
    const hudInnerMat = new THREE.MeshBasicMaterial({
      color: 0x7f00ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const hudInner = new THREE.Mesh(hudInnerGeom, hudInnerMat);
    hudGroup.add(hudInner);

    // Link line connecting mouse HUD reticle to the closest particle in the constellation
    const linkLineGeom = new THREE.BufferGeometry();
    const linkLineCoords = new Float32Array(6); // 2 points (x1,y1,z1) to (x2,y2,z2)
    linkLineGeom.setAttribute('position', new THREE.BufferAttribute(linkLineCoords, 3));
    const linkLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const hudLinkLine = new THREE.Line(linkLineGeom, linkLineMat);
    scene.add(hudLinkLine);

    // D. 3D Spatial HUD Lattices (nested rotating gyroscope rings and pitch ladders)
    const gyroGroup = new THREE.Group();
    scene.add(gyroGroup);

    // Grid helper floor
    const gridHelper = new THREE.GridHelper(90, 45, 0x00f0ff, 0x7f00ff);
    gridHelper.position.y = -12;
    gridHelper.material.opacity = 0.12;
    gridHelper.material.transparent = true;
    gridHelper.material.blending = THREE.AdditiveBlending;
    scene.add(gridHelper);

    // Horizontal compass tick ring
    const compassRingGeom = new THREE.RingGeometry(12, 12.06, 64);
    const compassRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const compassRing = new THREE.Mesh(compassRingGeom, compassRingMat);
    compassRing.rotation.x = Math.PI / 2;
    gyroGroup.add(compassRing);

    // Pitch ladder / elevation ticks
    const elevationLines = [];
    const elevationGeom = new THREE.BufferGeometry();
    for (let i = -10; i <= 10; i += 2) {
      if (i === 0) continue;
      // Draw left bar
      elevationLines.push(-3.0, i, 0,  -2.0, i, 0);
      elevationLines.push(-3.0, i, 0,  -3.0, i + (i > 0 ? -0.4 : 0.4), 0);
      // Draw right bar
      elevationLines.push(2.0, i, 0,   3.0, i, 0);
      elevationLines.push(3.0, i, 0,   3.0, i + (i > 0 ? -0.4 : 0.4), 0);
    }
    elevationGeom.setAttribute('position', new THREE.Float32BufferAttribute(elevationLines, 3));
    const elevationMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const elevationLadder = new THREE.LineSegments(elevationGeom, elevationMat);
    gyroGroup.add(elevationLadder);

    // Concentric vertical tracking rings
    const trackingRing1Mat = new THREE.LineBasicMaterial({ color: 0x7f00ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
    const trackingRing1 = new THREE.LineLoop(
      new THREE.RingGeometry(8, 8.03, 64),
      trackingRing1Mat
    );
    trackingRing1.rotation.y = Math.PI / 4;
    gyroGroup.add(trackingRing1);

    const trackingRing2Mat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending });
    const trackingRing2 = new THREE.LineLoop(
      new THREE.RingGeometry(10, 10.03, 64),
      trackingRing2Mat
    );
    trackingRing2.rotation.y = -Math.PI / 4;
    gyroGroup.add(trackingRing2);

    // C. Create the surrounding 1024-particle grid constellation
    const cols = 32;
    const rows = 32;
    const particleCount = cols * rows;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const spherePositions = new Float32Array(particleCount * 3);
    const wavePositions = new Float32Array(particleCount * 3);

    const sphereRadius = 8.5;
    const spacing = 0.95;

    for (let i = 0; i < particleCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Sphere mapping
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      spherePositions[i * 3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      spherePositions[i * 3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      spherePositions[i * 3 + 2] = sphereRadius * Math.cos(phi);

      // Grid Wave mapping
      wavePositions[i * 3] = (col - cols / 2) * spacing;
      wavePositions[i * 3 + 1] = 0;
      wavePositions[i * 3 + 2] = (row - rows / 2) * spacing;

      positions[i * 3] = spherePositions[i * 3];
      positions[i * 3 + 1] = spherePositions[i * 3 + 1];
      positions[i * 3 + 2] = spherePositions[i * 3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Network lines segments mapping
    const lineIndices = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (c < cols - 1) lineIndices.push(idx, idx + 1);
        if (r < rows - 1) lineIndices.push(idx, idx + cols);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7f00ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });

    const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(networkLines);

    // D. Active Data Beams (Shooting nodes from center to surrounding constellation)
    const beamCount = 12;
    const beams = [];
    const beamGeom = new THREE.BufferGeometry();
    const beamPositions = new Float32Array(beamCount * 3);
    beamGeom.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    
    const beamMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.22,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const beamPoints = new THREE.Points(beamGeom, beamMat);
    scene.add(beamPoints);

    // Initialize shooting beams
    for (let i = 0; i < beamCount; i++) {
      beams.push({
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.014,
        targetIndex: Math.floor(Math.random() * particleCount)
      });
    }

    // Dynamic camera coordinates and scroll progress trackers
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentScrollProgress = 0;

    // Glitch engine control variables
    let isGlitching = false;
    let glitchTimer = 0;

    // Trigger CPU glitch routine periodically
    setInterval(() => {
      isGlitching = true;
      setTimeout(() => {
        isGlitching = false;
      }, 150 + Math.random() * 200); // glitch length: 150-350ms
    }, 4500);

    // Render loop
    const clock = new THREE.Clock();
    
    const animateThree = () => {
      const elapsedTime = clock.getElapsedTime();

      // Calculate scroll progress (0 to 1) to morph grid & drive camera fly-through
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        currentScrollProgress = window.scrollY / scrollHeight;
      }

      const morphProgress = Math.min(Math.max(currentScrollProgress * 1.5, 0), 1);

      // 1. Update particles and lines (Sphere-to-Wave morphing + Mouse ripple)
      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const xSphere = spherePositions[i * 3];
        const ySphere = spherePositions[i * 3 + 1];
        const zSphere = spherePositions[i * 3 + 2];

        const xWave = wavePositions[i * 3];
        const zWave = wavePositions[i * 3 + 2];
        
        // Base undulation for wave mesh
        let waveY = Math.sin(elapsedTime * 1.5 + xWave * 0.3) * Math.cos(elapsedTime * 1.0 + zWave * 0.3) * 1.2;

        // Mouse proximity ripple effect
        if (mouse.normX !== 0 || mouse.normY !== 0) {
          const dx = posArray[i * 3] - (mouse.normX * 12);
          const dy = posArray[i * 3 + 1] - (mouse.normY * 8);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 4.5) {
            const rippleForce = (4.5 - dist) * 0.3 * Math.sin(elapsedTime * 8 - dist * 2);
            waveY += rippleForce;
          }
        }

        posArray[i * 3] = xSphere + (xWave - xSphere) * morphProgress;
        posArray[i * 3 + 1] = ySphere + (waveY - ySphere) * morphProgress;
        posArray[i * 3 + 2] = zSphere + (zWave - zSphere) * morphProgress;
      }

      posAttr.needsUpdate = true;
      networkLines.geometry.attributes.position.needsUpdate = true;

      // 2. Track 3D cursor reticle positions in coordinate space
      // Project normalized mouse coordinates into 3D camera plane coordinates
      const targetReticleX = mouse.normX * 11;
      const targetReticleY = mouse.normY * 7;
      hudGroup.position.x += (targetReticleX - hudGroup.position.x) * 0.12;
      hudGroup.position.y += (targetReticleY - hudGroup.position.y) * 0.12;
      hudGroup.position.z = 2.5; // sit slightly in front of the background
      hudOuter.rotation.z = elapsedTime * 0.8;

      // 3. Find closest particle in constellation to connect data link line
      let closestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < particleCount; i++) {
        const px = posArray[i * 3];
        const py = posArray[i * 3 + 1];
        const pz = posArray[i * 3 + 2];
        const dx = px - hudGroup.position.x;
        const dy = py - hudGroup.position.y;
        const dz = pz - hudGroup.position.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < minDistance) {
          minDistance = d;
          closestIdx = i;
        }
      }

      // Update HUD link line coords
      const linkPosAttr = hudLinkLine.geometry.attributes.position;
      const linkPosArray = linkPosAttr.array;
      linkPosArray[0] = hudGroup.position.x;
      linkPosArray[1] = hudGroup.position.y;
      linkPosArray[2] = hudGroup.position.z;
      linkPosArray[3] = posArray[closestIdx * 3];
      linkPosArray[4] = posArray[closestIdx * 3 + 1];
      linkPosArray[5] = posArray[closestIdx * 3 + 2];
      linkPosAttr.needsUpdate = true;

      // 4. Update Shooting Data Beams
      const beamPosAttr = beamPoints.geometry.attributes.position;
      const beamPosArray = beamPosAttr.array;

      for (let i = 0; i < beamCount; i++) {
        const b = beams[i];
        b.progress += b.speed;
        
        if (b.progress >= 1) {
          b.progress = 0;
          b.targetIndex = Math.floor(Math.random() * particleCount);
          b.speed = 0.008 + Math.random() * 0.014;
        }

        // Interpolate position from the digital twin center (0,0,0) to target point coords
        const targetX = posArray[b.targetIndex * 3];
        const targetY = posArray[b.targetIndex * 3 + 1];
        const targetZ = posArray[b.targetIndex * 3 + 2];

        beamPosArray[i * 3] = targetX * b.progress;
        beamPosArray[i * 3 + 1] = targetY * b.progress;
        beamPosArray[i * 3 + 2] = targetZ * b.progress;
      }
      beamPosAttr.needsUpdate = true;

      // 5. Rotate Digital Twin Globe Components
      digitalTwinGlobe.rotation.y = elapsedTime * 0.15;
      digitalTwinGlobe.rotation.x = elapsedTime * 0.08;
      
      globeRing.rotation.z = -elapsedTime * 0.2;
      outerDotShell.rotation.y = -elapsedTime * 0.18;
      outerDotShell.rotation.z = elapsedTime * 0.05;

      // Translate radar sweep ring
      radarSweep.position.y = Math.sin(elapsedTime * 1.8) * 3.55;

      // Rotate Gyro Group
      gyroGroup.rotation.y = elapsedTime * 0.05;
      gyroGroup.rotation.x = elapsedTime * 0.02;

      // 6. Camera Orbit Descent path
      const angle = currentScrollProgress * Math.PI * 0.5; // 90 degree orbit
      const radius = 24 - (currentScrollProgress * 8); // zoom in
      
      let targetCameraX = Math.sin(angle) * radius;
      let targetCameraZ = Math.cos(angle) * radius;
      let targetCameraY = -currentScrollProgress * 18;

      // Mouse Parallax displacement on the camera
      targetCameraX += mouse.normX * 2.0;
      targetCameraY += mouse.normY * 1.5;

      // 7. Apply CPU-driven Glitch routine to Camera & Shaders
      if (isGlitching) {
        // Jitter camera coordinates
        targetCameraX += (Math.random() - 0.5) * 0.65;
        targetCameraY += (Math.random() - 0.5) * 0.65;
        targetCameraZ += (Math.random() - 0.5) * 0.45;
        
        // Randomize materials
        pMaterial.size = 0.14 + Math.random() * 0.06;
        lineMaterial.color.setHex(Math.random() > 0.5 ? 0x00f0ff : 0xffffff);
        lineMaterial.opacity = 0.35;
        hudOuterMat.color.setHex(0x7f00ff);
        
        // Jitter central digital twin scale
        const scaleVal = 1.15 + (Math.random() - 0.5) * 0.25;
        digitalTwinGlobe.scale.set(scaleVal, scaleVal, scaleVal);
      } else {
        // Reset properties
        pMaterial.size = 0.08;
        lineMaterial.color.setHex(0x7f00ff);
        lineMaterial.opacity = 0.12 + (morphProgress * 0.08);
        hudOuterMat.color.setHex(0x00f0ff);
        digitalTwinGlobe.scale.set(1, 1, 1);
      }

      // Elastic camera track update
      camera.position.x += (targetCameraX - camera.position.x) * 0.08;
      camera.position.y += (targetCameraY - camera.position.y) * 0.08;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08;
      
      camera.lookAt(new THREE.Vector3(0, camera.position.y * 0.9, 0));

      // Fade out Central digital twin globe
      const globeOpacity = Math.max(0.18 - (currentScrollProgress * 0.28), 0);
      globeMat.opacity = globeOpacity;
      globeRingMat.opacity = globeOpacity * 2;
      radarMat.opacity = globeOpacity * 0.5;
      shellMat.opacity = globeOpacity * 2.2;
      hudOuterMat.opacity = 0.5 - (currentScrollProgress * 0.4);
      hudInnerMat.opacity = 0.6 - (currentScrollProgress * 0.5);
      hudLinkLine.material.opacity = 0.35 - (currentScrollProgress * 0.3);

      // Fade Gyroscope and Grid Helper
      compassRingMat.opacity = Math.max(0.12 - currentScrollProgress * 0.1, 0.02);
      elevationMat.opacity = Math.max(0.15 - currentScrollProgress * 0.12, 0.03);
      trackingRing1Mat.opacity = Math.max(0.08 - currentScrollProgress * 0.06, 0.01);
      trackingRing2Mat.opacity = Math.max(0.06 - currentScrollProgress * 0.04, 0.01);
      gridHelper.material.opacity = 0.12 + (currentScrollProgress * 0.08);

      renderer.render(scene, camera);
      requestAnimationFrame(animateThree);
    };

    animateThree();
  }

  /* ==========================================================================
     7. Card Hover Mouse Tracking Glow Effects
     ========================================================================== */
  const cards = document.querySelectorAll('.tech-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     8. Live Operations Log Streaming
     ========================================================================== */
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const logPool = [
      { tag: 'SYS', style: 'tag-sys', text: 'Initializing spatial digital twin sync loops... SUCCESS' },
      { tag: 'XR', style: 'tag-xr', text: 'Calibrating WebXR camera tracking matrices... 90fps LOCK' },
      { tag: 'SYS', style: 'tag-sys', text: 'Synchronizing CAD geometry vertices (10,482 faces loaded)' },
      { tag: 'EDGE', style: 'tag-sys', text: 'Edge node mesh telemetry active on port 8080 (RSSI: -45dBm)' },
      { tag: 'EDGE', style: 'tag-sys', text: 'Executing low-latency R&D loops: local LLM agent & validation' },
      { tag: 'XR', style: 'tag-xr', text: 'SLAM mesh triangulation updated. Key anchors: 42 active' },
      { tag: 'SYS', style: 'tag-sys', text: 'Sensor fusion pipeline: mapping physical temperature to 3D mesh' },
      { tag: 'EDGE', style: 'tag-sys', text: 'R&D validation block processed: hash validated (0x5C...a8)' }
    ];

    const getTimestamp = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${(d.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}`;
    };

    for (let i = 0; i < 6; i++) {
      appendLogLine(logPool[i % logPool.length]);
    }

    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * logPool.length);
      appendLogLine(logPool[randomIndex]);
    }, 3200);

    function appendLogLine(logObj) {
      const line = document.createElement('div');
      line.className = 'log-line';
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'log-time';
      timeSpan.textContent = `[${getTimestamp()}]`;

      const tagSpan = document.createElement('span');
      tagSpan.className = `log-tag ${logObj.style}`;
      tagSpan.textContent = `[${logObj.tag}]`;

      const msgSpan = document.createElement('span');
      msgSpan.className = 'log-msg';
      msgSpan.textContent = logObj.text;

      line.appendChild(timeSpan);
      line.appendChild(tagSpan);
      line.appendChild(msgSpan);
      
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      if (terminalBody.childNodes.length > 50) {
        terminalBody.removeChild(terminalBody.firstChild);
      }
    }
  }

  /* ==========================================================================
     9. Orbit Matrix Core - 3D Interactive Carousel & UI Orchestrator
     ========================================================================== */
  const nodesData = [
    {
      title: "Terra-Twin (HCMC Edge Grid)",
      subLabel: "SYSTEM TWIN REALITY MESH",
      coordinate: "10.76°N, 106.66°E",
      description: "Real-time synchronization of IoT data points directly into browser WebGL meshes. Triangulates multi-sensor feeds to automate spatial optimization.",
      stats: [
        { val: "98,7%", label: "SYSTEM RELIABILITY" },
        { val: "-30%", label: "LATENCY REDUCTION" },
        { val: "+12K", label: "TELEMETRY SYNC RATE" },
        { val: "NOMINAL", label: "MATRIX STATUS" }
      ],
      hash: "ST-REF: v2.5.0-TWIN",
      status: "SYNC ACTIVE"
    },
    {
      title: "Luna-Portal (Spatial WebXR)",
      subLabel: "WEBXR INTERFACE LAYER",
      coordinate: "38.48°N, 12.01°W",
      description: "Immersive XR viewport enabling direct visual overlays and gesture-controlled interfaces on spatial nodes, mapping real-time interaction.",
      stats: [
        { val: "90Hz", label: "RENDER FREQUENCY" },
        { val: "< 4.2ms", label: "INTERACTION LAG" },
        { val: "120°", label: "VIEWPORT FIELD" },
        { val: "CALIBRATED", label: "TRACKING STATUS" }
      ],
      hash: "XR-REF: v3.0.4-WEB",
      status: "90HZ LOCK"
    },
    {
      title: "Ares-Mesh (Edge AI Cluster)",
      subLabel: "EDGE COMPUTING & MODEL MESH",
      coordinate: "47.37°N, 8.54°E",
      description: "Decentralized AI model execution running directly on localized Jetson/ESP32 cluster meshes, prioritizing privacy and offline capability.",
      stats: [
        { val: "12 Nodes", label: "EDGE NODE ARRAYS" },
        { val: "45 Tops", label: "INFERENCE RATE" },
        { val: "15W", label: "LOW POWER DRAW" },
        { val: "OPTIMIZED", label: "AGENT STATE" }
      ],
      hash: "EN-REF: v1.1.2-R&D",
      status: "MODEL ACTIVE"
    },
    {
      title: "Sol-Ledger (Consensus Core)",
      subLabel: "CRYPTOGRAPHIC VALIDATION BLOCK",
      coordinate: "35.67°N, 139.65°E",
      description: "Local cryptographic validation nodes running proof-of-authority consensus blocks to ensure integrity and validation without centralized dependency.",
      stats: [
        { val: "100%", label: "BLOCK INTEGRITY" },
        { val: "< 1.2s", label: "BLOCKTIME AVG" },
        { val: "256-bit", label: "SECURE SHIELD" },
        { val: "CONSENSUS", label: "LEDGER STATE" }
      ],
      hash: "SL-REF: v0.9.1-LEDG",
      status: "BLOCKCHAIN OK"
    }
  ];

  let activeIndex = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;

  function updateUI(index) {
    // Update active class on tabs
    const tabs = document.querySelectorAll('.selector-tab');
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Animate details panel using GSAP
    if (window.gsap) {
      gsap.to('#orbitDetailsPanel', {
        opacity: 0,
        x: 15,
        duration: 0.2,
        onComplete: () => {
          const data = nodesData[index];
          document.getElementById('panelSubLabel').textContent = data.subLabel;
          document.getElementById('panelNodeTitle').textContent = data.title;
          document.getElementById('panelCoordinate').textContent = data.coordinate;
          document.getElementById('panelDescription').textContent = data.description;
          
          document.getElementById('statVal1').textContent = data.stats[0].val;
          document.getElementById('statLabel1').textContent = data.stats[0].label;
          document.getElementById('statVal2').textContent = data.stats[1].val;
          document.getElementById('statLabel2').textContent = data.stats[1].label;
          document.getElementById('statVal3').textContent = data.stats[2].val;
          document.getElementById('statLabel3').textContent = data.stats[2].label;
          document.getElementById('statVal4').textContent = data.stats[3].val;
          document.getElementById('statLabel4').textContent = data.stats[3].label;
          
          document.getElementById('panelHashTag').textContent = data.hash;
          document.querySelector('.hud-pulse-tag').innerHTML = `<span class="badge-pulse"></span> ${data.status}`;

          // Micro scramble animation
          scrambleText(document.getElementById('panelNodeTitle'), 400);
          scrambleText(document.getElementById('statVal1'), 400);
          scrambleText(document.getElementById('statVal2'), 400);
          scrambleText(document.getElementById('statVal3'), 400);
          scrambleText(document.getElementById('statVal4'), 400);

          gsap.to('#orbitDetailsPanel', {
            opacity: 1,
            x: 0,
            duration: 0.3
          });
        }
      });
    } else {
      const data = nodesData[index];
      document.getElementById('panelSubLabel').textContent = data.subLabel;
      document.getElementById('panelNodeTitle').textContent = data.title;
      document.getElementById('panelCoordinate').textContent = data.coordinate;
      document.getElementById('panelDescription').textContent = data.description;
      
      document.getElementById('statVal1').textContent = data.stats[0].val;
      document.getElementById('statLabel1').textContent = data.stats[0].label;
      document.getElementById('statVal2').textContent = data.stats[1].val;
      document.getElementById('statLabel2').textContent = data.stats[1].label;
      document.getElementById('statVal3').textContent = data.stats[2].val;
      document.getElementById('statLabel3').textContent = data.stats[2].label;
      document.getElementById('statVal4').textContent = data.stats[3].val;
      document.getElementById('statLabel4').textContent = data.stats[3].label;
      
      document.getElementById('panelHashTag').textContent = data.hash;
      document.querySelector('.hud-pulse-tag').innerHTML = `<span class="badge-pulse"></span> ${data.status}`;
    }
  }

  function initOrbitCarousel() {
    const container = document.getElementById('orbitCanvasContainer');
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 10;
    camera.position.y = 1.0; 

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Parent group for orbit rotation
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    // Orbit visual path ring
    const orbitRadius = 3.6;
    const trajectoryGeom = new THREE.RingGeometry(orbitRadius - 0.015, orbitRadius + 0.015, 64);
    const trajectoryMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    const trajectory = new THREE.Mesh(trajectoryGeom, trajectoryMat);
    trajectory.rotation.x = Math.PI / 2;
    scene.add(trajectory);

    // Instantiate Node Groups
    const nodeGroups = [];

    for (let i = 0; i < 4; i++) {
      const nodeGroup = new THREE.Group();
      const angle = (i * Math.PI) / 2;
      nodeGroup.position.x = Math.sin(angle) * orbitRadius;
      nodeGroup.position.z = Math.cos(angle) * orbitRadius;
      carouselGroup.add(nodeGroup);
      nodeGroups.push(nodeGroup);

      // Create distinctive visual geometries per node matching current themes
      if (i === 0) {
        // Node 01: Terra-Twin (Mesh Globe with Scan Ring)
        const sphereGeom = new THREE.SphereGeometry(0.7, 12, 12);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.75
        });
        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        nodeGroup.add(sphere);

        const ringGeom = new THREE.RingGeometry(0.9, 0.95, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x7f00ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 3;
        nodeGroup.add(ring);
      } 
      else if (i === 1) {
        // Node 02: Luna-Portal (Double-ringed Torus Knot)
        const torusGeom = new THREE.TorusKnotGeometry(0.42, 0.15, 64, 8);
        const torusMat = new THREE.MeshBasicMaterial({
          color: 0x7f00ff,
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
        const torus = new THREE.Mesh(torusGeom, torusMat);
        nodeGroup.add(torus);

        const pointGeom = new THREE.SphereGeometry(0.85, 8, 8);
        const pointMat = new THREE.PointsMaterial({
          color: 0x00f0ff,
          size: 0.04,
          transparent: true,
          opacity: 0.55
        });
        const points = new THREE.Points(pointGeom, pointMat);
        nodeGroup.add(points);
      } 
      else if (i === 2) {
        // Node 03: Ares-Mesh (Octahedron inside high-density particle swarm)
        const octaGeom = new THREE.OctahedronGeometry(0.6, 0);
        const octaMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const octa = new THREE.Mesh(octaGeom, octaMat);
        nodeGroup.add(octa);

        const cageGeom = new THREE.SphereGeometry(0.9, 6, 6);
        const cageMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.25
        });
        const cage = new THREE.Mesh(cageGeom, cageMat);
        nodeGroup.add(cage);
      } 
      else if (i === 3) {
        // Node 04: Sol-Ledger (Tetrahedron surrounded by a rotating Cube block)
        const tetraGeom = new THREE.TetrahedronGeometry(0.6, 0);
        const tetraMat = new THREE.MeshBasicMaterial({
          color: 0x7f00ff,
          wireframe: true,
          transparent: true,
          opacity: 0.75
        });
        const tetra = new THREE.Mesh(tetraGeom, tetraMat);
        nodeGroup.add(tetra);

        const boxGeom = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const boxMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.35
        });
        const box = new THREE.Mesh(boxGeom, boxMat);
        nodeGroup.add(box);
      }
    }

    // Drag / Swipe Interactions
    let isDragging = false;
    let startX = 0;
    let dragStartRotation = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      dragStartRotation = carouselGroup.rotation.y;
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const rotationAmount = (deltaX / container.clientWidth) * Math.PI * 1.2;
      carouselGroup.rotation.y = dragStartRotation + rotationAmount;
      currentRotationY = carouselGroup.rotation.y;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = '';
      
      const snappedMultiple = Math.round(currentRotationY / (Math.PI / 2));
      targetRotationY = snappedMultiple * (Math.PI / 2);
      activeIndex = ((-snappedMultiple % 4) + 4) % 4;
      updateUI(activeIndex);
    });

    // Touch events for mobile compatibility
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      dragStartRotation = carouselGroup.rotation.y;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      const rotationAmount = (deltaX / container.clientWidth) * Math.PI * 1.2;
      carouselGroup.rotation.y = dragStartRotation + rotationAmount;
      currentRotationY = carouselGroup.rotation.y;
    });

    container.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const snappedMultiple = Math.round(currentRotationY / (Math.PI / 2));
      targetRotationY = snappedMultiple * (Math.PI / 2);
      activeIndex = ((-snappedMultiple % 4) + 4) % 4;
      updateUI(activeIndex);
    });

    // Selectors tabs clicks
    const tabs = document.querySelectorAll('.selector-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetIdx = parseInt(tab.getAttribute('data-index'), 10);
        const currentMultiple = Math.round(currentRotationY / (Math.PI / 2));
        const currentIdx = ((-currentMultiple % 4) + 4) % 4;
        
        let diff = targetIdx - currentIdx;
        if (diff > 2) diff -= 4;
        if (diff < -2) diff += 4;
        
        targetRotationY = (currentMultiple - diff) * (Math.PI / 2);
        activeIndex = targetIdx;
        updateUI(activeIndex);
      });
    });

    // Chevrons click binding
    document.getElementById('orbitPrev').addEventListener('click', () => {
      const currentMultiple = Math.round(currentRotationY / (Math.PI / 2));
      targetRotationY = (currentMultiple + 1) * (Math.PI / 2);
      activeIndex = (activeIndex - 1 + 4) % 4;
      updateUI(activeIndex);
    });

    document.getElementById('orbitNext').addEventListener('click', () => {
      const currentMultiple = Math.round(currentRotationY / (Math.PI / 2));
      targetRotationY = (currentMultiple - 1) * (Math.PI / 2);
      activeIndex = (activeIndex + 1) % 4;
      updateUI(activeIndex);
    });

    // Orbit Animation frame loops
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        carouselGroup.rotation.y += (targetRotationY - carouselGroup.rotation.y) * 0.12;
        currentRotationY = carouselGroup.rotation.y;
      }

      // Keep sub-objects spinning locally and scale active node
      nodeGroups.forEach((group, index) => {
        group.rotation.y = elapsedTime * 0.3 * (index % 2 === 0 ? 1 : -1);
        group.rotation.x = elapsedTime * 0.15 * (index % 2 === 0 ? 1 : -1);

        // Scale based on world camera cosine proximity
        const groupAngle = (index * Math.PI) / 2;
        const proximity = Math.cos(carouselGroup.rotation.y + groupAngle); 
        
        const scaleFactor = 0.8 + (proximity + 1) * 0.25; 
        group.scale.set(scaleFactor, scaleFactor, scaleFactor);
      });

      renderer.render(scene, camera);
    };

    animate();
  }

  // Initialize Orbit Carousel
  initOrbitCarousel();

  /* ==========================================================================
     10. Entrance GSAP animations
     ========================================================================== */
  if (window.gsap) {
    gsap.from('.hud-corner-tl, .hud-corner-br', { scale: 0, opacity: 0, duration: 1 });
    gsap.from('.hud-corner-tr, .hud-corner-bl', { scale: 0, opacity: 0, duration: 1 });
    
    gsap.from('.hero-badge', { opacity: 0, y: 15, duration: 0.6, delay: 0.5 });
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.7 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 15, duration: 0.6, delay: 0.9 });
    gsap.from('.hero-description', { opacity: 0, y: 15, duration: 0.6, delay: 1.1 });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.6, delay: 1.3 });
  }
});
