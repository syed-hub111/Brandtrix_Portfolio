/**
 * BRANDTRIX — Ambient Luxury Sound Engine (Web Audio API)
 * Pure procedural synthesis. No external audio files required.
 */

(function () {
  'use strict';

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var isPlaying = false;
  var masterGain = null;
  var droneOsc1 = null;
  var droneOsc2 = null;
  var droneGain = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported on this browser.');
    }
  }

  function startAmbientDrone() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Warm, deep cinematic drone (Root note A at 108Hz & harmonic at 216Hz)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc2 = audioCtx.createOscillator();

    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, audioCtx.currentTime);

    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(108, audioCtx.currentTime); // Deep A

    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(216, audioCtx.currentTime); // Harmonic octave

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();

    // Smooth fade in
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2.5);
  }

  function stopAmbientDrone() {
    if (!audioCtx || !masterGain) return;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    setTimeout(function () {
      if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); droneOsc1 = null; }
      if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); droneOsc2 = null; }
    }, 1300);
  }

  // Micro tactile UI click sound
  function playTactileClick(freq, duration) {
    if (!audioCtx || audioCtx.state !== 'running' || !isPlaying) return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var f = freq || 880;
      var d = duration || 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 0.4, audioCtx.currentTime + d);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + d);
    } catch (e) {}
  }

  // Toggle Handler
  function toggleAudio() {
    var btn = document.getElementById('audioToggle');
    var label = btn ? btn.querySelector('.audio-label') : null;

    if (!isPlaying) {
      initAudio();
      startAmbientDrone();
      isPlaying = true;
      if (btn) btn.classList.add('playing');
      if (label) label.textContent = 'SOUND ON';
    } else {
      stopAmbientDrone();
      isPlaying = false;
      if (btn) btn.classList.remove('playing');
      if (label) label.textContent = 'SOUND OFF';
    }
  }

  // Expose to window for UI hooks
  window.BrandtrixAudio = {
    toggle: toggleAudio,
    click: playTactileClick,
    isPlaying: function () { return isPlaying; }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('audioToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleAudio);
    }

    // Attach micro-tactile sounds to buttons and links
    var interactives = document.querySelectorAll('button, .menu-link, .chapter-chip, .pill-checkbox, .btn-luxury-primary, .btn-luxury-secondary');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (window.BrandtrixAudio && window.BrandtrixAudio.isPlaying()) {
          window.BrandtrixAudio.click(1200, 0.02);
        }
      });
      el.addEventListener('click', function () {
        if (window.BrandtrixAudio && window.BrandtrixAudio.isPlaying()) {
          window.BrandtrixAudio.click(650, 0.05);
        }
      });
    });
  });
})();

