/**
 * BRANDTRIX — Interactive Three.js Experience
 * Visual Theme: Dynamic Champagne-Gold Signal Wave & Frequency Lattice
 * Represents advertising signals, brand reach, and urban momentum across Chennai.
 */

(function () {
  'use strict';

  // Check if WebGL is supported
  function isWebGLAvailable() {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  var container = document.getElementById('webgl-container');
  if (!container || !isWebGLAvailable() || typeof THREE === 'undefined') {
    if (container) container.style.display = 'none';
    return;
  }

  var scene, camera, renderer;
  var particles, particleGeometry;
  var count = 0;
  var mouseX = 0, mouseY = 0;
  var targetMouseX = 0, targetMouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  // Grid dimensions
  var SEPARATION = 85;
  var AMOUNTX = 55;
  var AMOUNTY = 55;
  var numParticles = AMOUNTX * AMOUNTY;

  function init() {
    // 1. Camera
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 380, 1100);
    camera.lookAt(0, 0, 0);

    // 2. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.00075);

    // 3. Particle Buffer Geometry
    var positions = new Float32Array(numParticles * 3);
    var scales = new Float32Array(numParticles);
    var colors = new Float32Array(numParticles * 3);

    var i = 0, j = 0;
    // Champagne Gold: #C6A76A -> rgb(0.776, 0.655, 0.416)
    // Antique Gold: #A88B55   -> rgb(0.659, 0.545, 0.333)
    var goldR = 0.776, goldG = 0.655, goldB = 0.416;
    var muteR = 0.55, muteG = 0.45, muteB = 0.28;

    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        var x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        var z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        var y = 0;

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // Subtle gradient between champagne gold and muted antique gold
        var factor = Math.sin((ix / AMOUNTX) * Math.PI) * Math.cos((iy / AMOUNTY) * Math.PI);
        colors[i] = muteR + (goldR - muteR) * Math.abs(factor);
        colors[i + 1] = muteG + (goldG - muteG) * Math.abs(factor);
        colors[i + 2] = muteB + (goldB - muteB) * Math.abs(factor);

        scales[j] = 2.5 + Math.random() * 2.0;

        i += 3;
        j++;
      }
    }

    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Shader Material for soft luminous circular gold particles
    var vertexShader = [
      'attribute float scale;',
      'attribute vec3 color;',
      'varying vec3 vColor;',
      'void main() {',
      '  vColor = color;',
      '  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
      '  gl_PointSize = scale * ( 300.0 / - mvPosition.z );',
      '  gl_Position = projectionMatrix * mvPosition;',
      '}'
    ].join('\n');

    var fragmentShader = [
      'varying vec3 vColor;',
      'void main() {',
      '  float dist = length( gl_PointCoord - vec2( 0.5 ) );',
      '  if ( dist > 0.5 ) discard;',
      '  float alpha = smoothstep( 0.5, 0.05, dist );',
      '  gl_FragColor = vec4( vColor, alpha * 0.75 );',
      '}'
    ].join('\n');

    var particleMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Subtle connecting lattice lines
    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0xC6A76A,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending
    });

    // Create a few longitude lines along the grid for architectural structure
    var lineGeometry = new THREE.BufferGeometry();
    var linePositions = [];

    for (var lx = 0; lx < AMOUNTX; lx += 6) {
      for (var ly = 0; ly < AMOUNTY - 1; ly++) {
        var x1 = lx * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        var z1 = ly * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        var x2 = lx * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        var z2 = (ly + 1) * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        linePositions.push(x1, 0, z1, x2, 0, z2);
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    var gridLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(gridLines);

    // 5. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x080808, 0);
    container.appendChild(renderer.domElement);

    // 6. Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('scroll', onDocumentScroll, { passive: true });

    animate();
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    targetMouseX = (event.clientX - windowHalfX) * 0.4;
    targetMouseY = (event.clientY - windowHalfY) * 0.3;
  }

  var scrollY = 0;
  function onDocumentScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    // Smooth camera inertia
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Clamped subtle parallax so scrolling never flips or clips the 3D scene
    var clampedScroll = Math.min(scrollY, 1200);
    camera.position.x = mouseX;
    camera.position.y = 380 - mouseY * 0.5 - (clampedScroll * 0.08);
    camera.position.z = 1100 - (clampedScroll * 0.12);
    camera.lookAt(0, 0, 0);

    // Harmonic wave mathematics
    var positions = particleGeometry.attributes.position.array;
    var i = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        // Multi-frequency wave calculation representing advertising pulses
        var waveY = (Math.sin((ix + count) * 0.25) * 45) +
                    (Math.sin((iy + count) * 0.35) * 45) +
                    (Math.cos((ix + iy + count) * 0.15) * 30);

        positions[i + 1] = waveY;
        i += 3;
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    count += 0.035;

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

