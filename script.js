/**
 * Spotify Clone — Working Music Player
 * Features: play/pause, next/prev, progress bar (click & drag),
 *           volume, mute, shuffle, repeat, greeting, scroll topbar,
 *           card & quick-link play buttons, heart toggle, keyboard shortcuts
 */

"use strict";

/* ================================================================
   TRACK LIBRARY
   ================================================================ */
const TRACKS = [
  {
    id: 0,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    img: "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b",
    src: null,
  },
  {
    id: 1,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    img: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    src: null,
  },
  {
    id: 2,
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: 200,
    img: "https://i.scdn.co/image/ab67616d0000b2737fcaea956b960b2a82702453",
    src: null,
  },
  {
    id: 3,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: 167,
    img: "https://i.scdn.co/image/ab67616d0000b273b1a24e5ca8a757f53aacf779",
    src: null,
  },
  {
    id: 4,
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: 200,
    img: "https://i.scdn.co/image/ab67616d0000b273ad4e3d2a30e3b7a3cc47dd10",
    src: null,
  },
  {
    id: 5,
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    duration: 178,
    img: "https://i.scdn.co/image/ab67616d0000b27345b4a03a85e5fb4ddf2a8aab",
    src: null,
  },
  {
    id: 6,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: 234,
    img: "https://i.scdn.co/image/ab67616d0000b273b0b8da8b0cfbd1bc93416bf0",
    src: null,
  },
  {
    id: 7,
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: 230,
    img: "https://i.scdn.co/image/ab67616d0000b2737a864b9f60c5a2d2e8ae6893",
    src: null,
  },
  {
    id: 8,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: 174,
    img: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bf3b9b5c19c1e4e2",
    src: null,
  },
  {
    id: 9,
    title: "bad guy",
    artist: "Billie Eilish",
    album: "WHEN WE ALL FALL ASLEEP…",
    duration: 194,
    img: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
    src: null,
  },
  {
    id: 10,
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    album: "F*CK LOVE 3+",
    duration: 141,
    img: "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431",
    src: null,
  },
  {
    id: 11,
    title: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    duration: 198,
    img: "https://i.scdn.co/image/ab67616d0000b2735ef878a782c987d54ffed43d",
    src: null,
  },
];

/* ================================================================
   STATE
   ================================================================ */
const state = {
  currentTrackIndex: 0,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 0, // 0=off, 1=all, 2=one
  isMuted: false,
  volume: 70,       // 0–100
  progress: 0,      // 0–100 (simulated %)
  elapsed: 0,       // seconds
  timer: null,      // interval ID
  likedTracks: new Set(),
};

/* ================================================================
   DOM REFERENCES
   ================================================================ */
const DOM = {};

function queryDOM() {
  DOM.playerImg    = document.getElementById("player-img");
  DOM.playerName   = document.getElementById("player-name");
  DOM.playerArtist = document.getElementById("player-artist");
  DOM.btnPlay      = document.getElementById("btn-play");
  DOM.iconPlay     = document.getElementById("icon-play");
  DOM.iconPause    = document.getElementById("icon-pause");
  DOM.btnPrev      = document.getElementById("btn-prev");
  DOM.btnNext      = document.getElementById("btn-next");
  DOM.btnShuffle   = document.getElementById("btn-shuffle");
  DOM.btnRepeat    = document.getElementById("btn-repeat");
  DOM.btnHeart     = document.getElementById("btn-heart");
  DOM.btnMute      = document.getElementById("btn-mute");
  DOM.iconVolume   = document.getElementById("icon-volume");
  DOM.iconMuted    = document.getElementById("icon-muted");
  DOM.volumeSlider = document.getElementById("volume-slider");
  DOM.progressBar  = document.getElementById("progress-bar");
  DOM.progressFill = document.getElementById("progress-filled");
  DOM.progressThumb = document.getElementById("progress-thumb");
  DOM.timeCurrent  = document.getElementById("time-current");
  DOM.timeTotal    = document.getElementById("time-total");
  DOM.greeting     = document.getElementById("greeting");
  DOM.topBar       = document.getElementById("top-bar");
  DOM.mainView     = document.getElementById("main-view");
  DOM.playerBar    = document.getElementById("player-bar");
}

/* ================================================================
   UTILITIES
   ================================================================ */
function formatTime(seconds) {
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* ================================================================
   PLAYER CORE
   ================================================================ */

function loadTrack(index) {
  const track = TRACKS[index];
  if (!track) return;

  state.currentTrackIndex = index;
  state.elapsed = 0;
  state.progress = 0;

  // Update player UI
  DOM.playerImg.src      = track.img;
  DOM.playerName.textContent   = track.title;
  DOM.playerArtist.textContent = track.artist;
  DOM.timeTotal.textContent    = formatTime(track.duration);
  DOM.timeCurrent.textContent  = "0:00";

  updateProgressUI();
  updateHeartUI();
}

function play() {
  if (state.isPlaying) return;
  state.isPlaying = true;
  updatePlayUI();

  const track = TRACKS[state.currentTrackIndex];
  const duration = track.duration;

  // Simulate playback progress with a 1-second interval
  state.timer = setInterval(() => {
    state.elapsed += 1;

    if (state.elapsed >= duration) {
      // Track finished
      clearInterval(state.timer);
      state.timer = null;

      if (state.repeatMode === 2) {
        // Repeat one
        state.elapsed = 0;
        play();
      } else {
        nextTrack();
      }
      return;
    }

    state.progress = (state.elapsed / duration) * 100;
    updateProgressUI();
    DOM.timeCurrent.textContent = formatTime(state.elapsed);
  }, 1000);
}

function pause() {
  if (!state.isPlaying) return;
  state.isPlaying = false;
  clearInterval(state.timer);
  state.timer = null;
  updatePlayUI();
}

function togglePlay() {
  if (state.isPlaying) pause();
  else play();
}

function nextTrack() {
  pause();
  let nextIndex;
  if (state.isShuffle) {
    do {
      nextIndex = Math.floor(Math.random() * TRACKS.length);
    } while (nextIndex === state.currentTrackIndex && TRACKS.length > 1);
  } else {
    nextIndex = (state.currentTrackIndex + 1) % TRACKS.length;
  }
  loadTrack(nextIndex);
  play();
}

function prevTrack() {
  // If more than 3s in, restart; otherwise go previous
  if (state.elapsed > 3) {
    pause();
    state.elapsed = 0;
    state.progress = 0;
    updateProgressUI();
    DOM.timeCurrent.textContent = "0:00";
    play();
  } else {
    pause();
    const prevIndex = (state.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(prevIndex);
    play();
  }
}

function seekTo(percent) {
  const track = TRACKS[state.currentTrackIndex];
  state.elapsed = Math.floor((percent / 100) * track.duration);
  state.progress = percent;
  DOM.timeCurrent.textContent = formatTime(state.elapsed);
  updateProgressUI();
}

/* ================================================================
   UI UPDATE FUNCTIONS
   ================================================================ */

function updatePlayUI() {
  if (state.isPlaying) {
    DOM.iconPlay.style.display  = "none";
    DOM.iconPause.style.display = "";
    DOM.playerBar.classList.add("is-playing");
  } else {
    DOM.iconPlay.style.display  = "";
    DOM.iconPause.style.display = "none";
    DOM.playerBar.classList.remove("is-playing");
  }
}

function updateProgressUI() {
  const pct = state.progress.toFixed(2) + "%";
  DOM.progressFill.style.width = pct;
  DOM.progressThumb.style.left = pct;
}

function updateVolumeUI() {
  DOM.volumeSlider.style.setProperty("--volume-fill", state.volume + "%");
  DOM.volumeSlider.value = state.volume;

  if (state.isMuted || state.volume === 0) {
    DOM.iconVolume.style.display = "none";
    DOM.iconMuted.style.display  = "";
  } else {
    DOM.iconVolume.style.display = "";
    DOM.iconMuted.style.display  = "none";
  }
}

function updateHeartUI() {
  const liked = state.likedTracks.has(state.currentTrackIndex);
  DOM.btnHeart.style.color = liked ? "var(--green)" : "";
  DOM.btnHeart.classList.toggle("active", liked);
}

function toggleShuffle() {
  state.isShuffle = !state.isShuffle;
  DOM.btnShuffle.classList.toggle("active", state.isShuffle);
  DOM.btnShuffle.title = state.isShuffle ? "Shuffle on" : "Shuffle off";
}

function cycleRepeat() {
  state.repeatMode = (state.repeatMode + 1) % 3;
  DOM.btnRepeat.classList.toggle("active", state.repeatMode > 0);

  const titles = ["Repeat", "Repeat all", "Repeat one"];
  DOM.btnRepeat.title = titles[state.repeatMode];

  // Subtle indicator for repeat-one
  DOM.btnRepeat.dataset.mode = state.repeatMode;
}

function toggleMute() {
  state.isMuted = !state.isMuted;
  updateVolumeUI();
}

function toggleHeart() {
  if (state.likedTracks.has(state.currentTrackIndex)) {
    state.likedTracks.delete(state.currentTrackIndex);
  } else {
    state.likedTracks.add(state.currentTrackIndex);
  }
  updateHeartUI();
  animateHeart();
}

function animateHeart() {
  DOM.btnHeart.style.transform = "scale(1.35)";
  setTimeout(() => (DOM.btnHeart.style.transform = ""), 200);
}

/* ================================================================
   PROGRESS BAR INTERACTION (click + drag)
   ================================================================ */
function setupProgressBar() {
  let isDragging = false;

  function getPercent(e) {
    const rect = DOM.progressBar.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }

  DOM.progressBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    pause();
    seekTo(getPercent(e));
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    seekTo(getPercent(e));
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    play();
  });

  // Touch support
  DOM.progressBar.addEventListener("touchstart", (e) => {
    isDragging = true;
    pause();
    seekTo(getPercent(e));
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    seekTo(getPercent(e));
  }, { passive: true });

  window.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    play();
  });
}

/* ================================================================
   VOLUME INTERACTION
   ================================================================ */
function setupVolume() {
  DOM.volumeSlider.addEventListener("input", () => {
    state.volume = parseInt(DOM.volumeSlider.value, 10);
    state.isMuted = state.volume === 0;
    DOM.volumeSlider.style.setProperty("--volume-fill", state.volume + "%");
    updateVolumeUI();
  });
}

/* ================================================================
   CARD PLAY BUTTONS
   ================================================================ */
function setupCardButtons() {
  // Grid card play buttons
  document.querySelectorAll(".App__section-grid-item").forEach((card) => {
    const btn = card.querySelector(".card-play-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const trackId = parseInt(card.dataset.track, 10);
      if (isNaN(trackId)) return;

      if (state.currentTrackIndex === trackId && state.isPlaying) {
        pause();
        updateCardPlayBtns();
      } else {
        pause();
        loadTrack(trackId);
        play();
        updateCardPlayBtns();
      }
    });

    // Card click (not on button)
    card.addEventListener("click", () => {
      const trackId = parseInt(card.dataset.track, 10);
      if (isNaN(trackId)) return;
      if (state.currentTrackIndex !== trackId) {
        pause();
        loadTrack(trackId);
      }
      if (!state.isPlaying) play();
      updateCardPlayBtns();
    });
  });

  // Quick link play buttons
  document.querySelectorAll(".App__quick-link").forEach((link) => {
    const btn = link.querySelector(".App__quick-play-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const trackId = parseInt(link.dataset.track, 10);
      if (isNaN(trackId)) return;
      pause();
      loadTrack(trackId);
      play();
      updateCardPlayBtns();
    });
  });
}

function updateCardPlayBtns() {
  document.querySelectorAll(".App__section-grid-item").forEach((card) => {
    const btn = card.querySelector(".card-play-btn");
    if (!btn) return;
    const trackId = parseInt(card.dataset.track, 10);
    const isActive = trackId === state.currentTrackIndex && state.isPlaying;
    // Show pause icon when this card's track is playing
    btn.innerHTML = isActive
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>`;
  });
}

/* ================================================================
   STICKY TOP BAR ON SCROLL
   ================================================================ */
function setupScrollListener() {
  DOM.mainView.addEventListener("scroll", () => {
    if (DOM.mainView.scrollTop > 60) {
      DOM.topBar.classList.add("scrolled");
    } else {
      DOM.topBar.classList.remove("scrolled");
    }
  });
}

/* ================================================================
   GREETING
   ================================================================ */
function updateGreeting() {
  if (DOM.greeting) DOM.greeting.textContent = getGreeting();
}

/* ================================================================
   KEYBOARD SHORTCUTS
   ================================================================ */
function setupKeyboard() {
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        if (e.shiftKey) { nextTrack(); }
        break;
      case "ArrowLeft":
        if (e.shiftKey) { prevTrack(); }
        break;
      case "KeyM":
        toggleMute();
        break;
      case "KeyS":
        toggleShuffle();
        break;
      case "KeyR":
        cycleRepeat();
        break;
    }
  });
}

/* ================================================================
   HERO GRADIENT COLOR (accent color from current track)
   ================================================================ */
const GRADIENT_COLORS = [
  "#8b1a1a", // Blinding Lights - deep red
  "#1a3f8b", // Levitating - deep blue
  "#1a1a4e", // Anti-Hero - midnight blue
  "#2d4a1f", // As It Was - forest green
  "#5a1a8b", // Flowers - purple
  "#c45900", // Cruel Summer - burnt orange
  "#8b4a00", // Shape of You - amber
  "#1a3a5c", // Starboy - navy
  "#5c3d1a", // Watermelon Sugar - warm tan
  "#000000", // bad guy - black
  "#1a2a8b", // Stay - blue
  "#4a1a5c", // Peaches - violet
];

function updateGradient(trackIndex) {
  const el = document.querySelector(".App__top-gradient");
  if (!el) return;
  const color = GRADIENT_COLORS[trackIndex] || "#5038a0";
  el.style.backgroundImage = `linear-gradient(
    to bottom,
    ${color} 0%,
    ${color}88 50%,
    rgba(18,18,18,0) 100%
  )`;
}

// Hook into loadTrack to also update gradient
const _origLoad = loadTrack;
// We override with a wrapper
window._loadTrackWrapper = function (index) {
  _origLoad(index);
  updateGradient(index);
};

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  queryDOM();
  updateGreeting();
  setupProgressBar();
  setupVolume();
  setupCardButtons();
  setupScrollListener();
  setupKeyboard();

  // Wire up player buttons
  DOM.btnPlay.addEventListener("click",    togglePlay);
  DOM.btnPrev.addEventListener("click",    prevTrack);
  DOM.btnNext.addEventListener("click",    nextTrack);
  DOM.btnShuffle.addEventListener("click", toggleShuffle);
  DOM.btnRepeat.addEventListener("click",  cycleRepeat);
  DOM.btnHeart.addEventListener("click",   toggleHeart);
  DOM.btnMute.addEventListener("click",    toggleMute);

  // Nav buttons (scroll to sections)
  const navHome   = document.getElementById("nav-home");
  const navSearch = document.getElementById("nav-search");
  const navLib    = document.getElementById("nav-library");
  const sections  = ["section-quick-links", "section-recent", "section-mixes"];

  [navHome, navSearch, navLib].forEach((btn, i) => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".App__category-item").forEach(el => el.classList.remove("App__category-item--selected"));
      btn.classList.add("App__category-item--selected");
      const sec = document.getElementById(sections[i] || sections[0]);
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Initial state
  loadTrack(0);
  updateVolumeUI();
  updateGradient(0);

  // Set CSS variable for volume fill
  DOM.volumeSlider.style.setProperty("--volume-fill", state.volume + "%");

  // Heartbeat CSS trick: subtle album art pulse while playing
  DOM.btnPlay.addEventListener("click", () => {
    DOM.playerBar.querySelector(".player__album-art")?.classList.toggle("playing", state.isPlaying);
  });

  console.log(
    "%cSpotify Clone loaded! ✓",
    "color:#1ED760;font-size:14px;font-weight:bold;"
  );
  console.log("Keyboard shortcuts: Space=play/pause, Shift+→=next, Shift+←=prev, M=mute, S=shuffle, R=repeat");
});
