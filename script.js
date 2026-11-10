(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const welcome = $('welcomeAudio'), voice = $('greetingAudio');
  const music = new Audio('assets/audio/music/bgm-opening.mp3');
  music.loop = true; music.volume = 0.25;
  let soundOn = true, musicOn = false, current = 'opening', detailKind = '', noticeTimer;
  let returnFocus = null, musicRevision = 0;
  const habits = ['Bangun Tidur', 'Beribadah', 'Berolahraga', 'Gemar Belajar', 'Makan Sehat dan Bergizi', 'Bermasyarakat', 'Tidur Cepat'];
  function notice(message) {
    clearTimeout(noticeTimer); $('greeting').textContent = message;
    $('greeting').classList.remove('hidden');
    noticeTimer = setTimeout(() => $('greeting').classList.add('hidden'), 5000);
  }
  const atlasVoice = new Audio();
  function stopVoices() { [welcome, voice, atlasVoice].forEach(a => { a.pause(); a.currentTime = 0; }); }
  function playVoice(audio) {
    stopVoices();
    if (soundOn) audio.play().catch(() => notice('Suara SAGI belum dapat diputar. Silakan coba lagi.'));
  }
  const openingVideo = $('openingVideo');
  const videoPlayingScreen = () => current === 'openingVideoView' || (current === 'detail' && detailKind === 'video');
  function updateMusicButton() {
    const pausedForVideo = videoPlayingScreen();
    $('musicToggle').textContent = musicOn ? (pausedForVideo ? '♫ Musik ON · jeda video' : '♫ Musik ON') : '♫ Musik OFF';
    $('musicToggle').setAttribute('aria-pressed', String(musicOn));
    $('musicToggle').setAttribute('aria-label', $('musicToggle').textContent);
  }
  function syncMusic() {
    const revision = ++musicRevision;
    updateMusicButton();
    if (!musicOn || videoPlayingScreen()) { music.pause(); return; }
    music.play().catch(() => {
      if (revision !== musicRevision) return;
      musicOn = false; updateMusicButton();
      notice('Musik belum dapat diputar. Tekan Musik ON untuk mencoba lagi.');
    });
  }
  function show(screen) {
    if (current === 'imageView' && screen !== 'imageView') resetImageSwipe();
    if (current === 'openingVideoView' && screen !== 'openingVideoView') openingVideo.pause();
    if (current === 'activityView' && screen !== 'activityView') {
      if (activeActivity === 2) {
        $('worshipMatch').hidden = true;
      }
      if (activeActivity >= 5) {
        stopKitchenDrags();
        $('kitchenGame').hidden = true;
      }
      if (activeActivity === 3) {
        stopSportVideo();
        $('sportGame').hidden = true;
      }
      stopClosureAudio();
    }
    if (current === 'mazeView' && screen !== 'mazeView') stopMaze();
    if (current === 'puzzleView' && screen !== 'puzzleView') stopPuzzle();
    if (current === 'memoryView' && screen !== 'memoryView') stopMemory();
    if (current === 'reflectionView' && screen !== 'reflectionView') stopReflection();
    if (['missionRewardView','trophyView'].includes(current) && screen !== current) stopMissionReward();
    $('missionCollection').hidden=true;
    current = screen;
    $('game').classList.toggle('showing-front-full', screen === 'openingVideoView' || screen === 'reportView');
    $('game').classList.toggle('showing-activity', screen === 'activityView');
    $('game').classList.toggle('showing-closure', ['reflectionView','missionRewardView','trophyView'].includes(screen));
    $('game').classList.toggle('showing-memory', screen === 'memoryView');
    $('game').classList.toggle('showing-puzzle', screen === 'puzzleView');
    $('game').classList.toggle('showing-maze', screen === 'mazeView');
    $('game').classList.toggle('showing-atlas', screen === 'atlasView');
    document.body.classList.toggle('atlas-active', screen === 'atlasView' || screen === 'mazeView' || screen === 'puzzleView' || screen === 'memoryView' || screen === 'reflectionView' || screen === 'missionRewardView' || screen === 'activityView');
    $('game').classList.toggle('showing-image', screen === 'imageView');
    ['opening', 'openingVideoView', 'menu', 'detail', 'reportView', 'imageView', 'atlasView', 'mazeView', 'puzzleView', 'memoryView', 'reflectionView', 'missionRewardView', 'trophyView', 'activityView'].forEach(id => $(id).classList.toggle('hidden', id !== screen));
    $('greeting').classList.add('hidden'); clearTimeout(noticeTimer); stopVoices();
    if (screen !== 'detail') { $('detailContent').replaceChildren(); detailKind = ''; }
    syncMusic();
    syncAdventureNav();
  }
  function openDetail(kind, title, content, trigger) {
    returnFocus = trigger; detailKind = kind;
    $('backButton').lastChild.textContent = kind === 'about' ? 'Kembali ke Info' : 'Kembali ke menu';
    $('detailTitle').textContent = title; $('detailContent').innerHTML = content;
    show('detail'); $('detailTitle').focus();
  }
  function playOpeningVideo() {
    $('openingVideoStatus').textContent = '';
    $('openingVideoPlay').hidden = true;
    openingVideo.play().catch(() => {
      if (current !== 'openingVideoView') return;
      $('openingVideoPlay').hidden = false;
      $('openingVideoStatus').textContent = 'Video belum dapat diputar. Coba tekan Putar video.';
    });
  }
  $('startButton').addEventListener('click', () => {
    show('openingVideoView');
    openingVideo.muted = !soundOn;
    openingVideo.currentTime = 0;
    playOpeningVideo();
    $('openingVideoBack').focus();
  });
  $('openingVideoPlay').addEventListener('click', playOpeningVideo);
  $('openingVideoBack').addEventListener('click', () => {
    show('menu'); $('menuTitle').focus(); playVoice(welcome);
  });
  $('homeButton').addEventListener('click', () => { show('opening'); $('startButton').focus(); });
  function back() {
    const infoChild = current === 'imageView' && imageGroup !== 'learn' ? imageGroup
      : current === 'detail' && detailKind === 'about' ? 'about' : null;
    if (infoChild) {
      openInfo();
      $('info-' + infoChild).focus();
      return;
    }
    const target = returnFocus;
    show('menu');
    (target || $('menuTitle')).focus();
  }
  $('backButton').addEventListener('click', back);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && (current === 'detail' || current === 'imageView' || current === 'reportView')) back();
    if (e.key === 'Escape' && current === 'openingVideoView') $('openingVideoBack').click(); });
  $('musicToggle').addEventListener('click', () => { musicOn = !musicOn; syncMusic(); });
  $('soundToggle').addEventListener('click', () => {
    soundOn = !soundOn; if (activeSportVideo) activeSportVideo.muted = !soundOn; if (!soundOn) stopVoices();
    $('soundToggle').textContent = soundOn ? '🔊 Suara ON' : '🔇 Suara OFF';
    $('soundToggle').setAttribute('aria-pressed', String(soundOn));
    $('soundToggle').setAttribute('aria-label', soundOn ? 'Suara ON' : 'Suara OFF');
  });
  $('greetingButton').addEventListener('click', () => {
    notice('Hai, Sahabat! Aku SAGI. Yuk, kita berpetualang bersama! ✨'); playVoice(voice);
  });
  $('videoButton').addEventListener('click', e => {
    openDetail('video', 'VIDEO SAGI', `<div class="video-frame"><iframe title="Video SAGI — Petualangan Negeri Ceria" src="https://www.youtube.com/embed/w7_5ClPuars" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p>Video memerlukan internet. Jika video tidak tampil atau tidak dapat diputar, <a href="https://www.youtube.com/watch?v=w7_5ClPuars" target="_blank" rel="noopener noreferrer">buka video di YouTube</a>.</p>`, e.currentTarget);
  });
  const infoContent = '<p>Berpetualang dan Belajar Bersama SAGI.</p><p>Kenali tujuh kebiasaan melalui Yuk Belajar dan jelajahi tiga pulau bersama SAGI. Laporan Misi menampilkan hasil permainan sesi pemain ini.</p><p>Musik dan suara SAGI dapat diatur secara terpisah. Gunakan Layar penuh jika tersedia. Disarankan digunakan bersama guru atau orang tua.</p><p>Laporan permainan dipisahkan dari jurnal kebiasaan harian. Versi ini belum mencatat kebiasaan anak di luar permainan.</p>';
  function openInfo() {
    openDetail('info', 'INFO', `<nav class="info-actions" aria-label="Pilihan informasi">
      <button class="asset-option" id="info-cpTp"><img src="assets/images/buttons/btn-cp-tp.png" alt=""><span>CP/TP</span></button>
      <button class="asset-option" id="info-developer"><img src="assets/images/buttons/btn-pengembang.png" alt=""><span>PENGEMBANG</span></button>
      <button class="asset-option" id="info-about"><img src="assets/images/buttons/btn-informasi.png" alt=""><span>INFO SAKTI GEN-AI</span></button>
    </nav>`, $('infoButton'));
    $('info-cpTp').onclick = () => openImages('cpTp', $('infoButton'));
    $('info-developer').onclick = () => openImages('developer', $('infoButton'));
    $('info-about').onclick = () => openDetail('about', 'INFO SAKTI GEN-AI', infoContent, $('infoButton'));
  }
  $('infoButton').addEventListener('click', openInfo);
  // Hotspot memakai persen dari gambar asli, bukan persen layar.
  const homeBounds = [0.8,0.5,9.6,14.8], closeBounds = [91.7,6.2,6.7,11.8];
  const imagePages = {
    learn: [
      {src:'assets/images/yuk-belajar/belajar-1-bangun-pagi.jpeg',alt:'Materi 1: Bangun Pagi',back:[91.7,3.2,7.1,12.7]},
      {src:'assets/images/yuk-belajar/belajar-2-beribadah.jpeg',alt:'Materi 2: Beribadah',home:homeBounds,back:closeBounds},
      {src:'assets/images/yuk-belajar/belajar-3-berolahraga.jpeg',alt:'Materi 3: Berolahraga',home:[2.2,0.7,8.8,15.6],back:[90.7,2.2,8,13.8]},
      {src:'assets/images/yuk-belajar/belajar-4-gemar-belajar.jpeg',alt:'Materi 4: Gemar Belajar',home:homeBounds,back:closeBounds},
      {src:'assets/images/yuk-belajar/belajar-5-makan-sehat.jpeg',alt:'Materi 5: Makan Sehat dan Bergizi',home:homeBounds,back:[91.4,4.8,6.8,12]},
      {src:'assets/images/yuk-belajar/belajar-6-bermasyarakat.jpeg',alt:'Materi 6: Bermasyarakat',home:homeBounds,back:closeBounds},
      {src:'assets/images/yuk-belajar/belajar-7-tidur-cepat.jpeg',alt:'Materi 7: Tidur Cepat',home:homeBounds,back:closeBounds}
    ],
    developer:[{src:'assets/images/pengembang/file_00000000920481fab24e02f96250d5dd.png',alt:'Profil pengembang SAKTI GEN-AI',back:[1.5,88,17.8,10.2]}],
    cpTp:[{src:'assets/images/cp-tp/CP-TP.jpeg',alt:'Capaian Pembelajaran dan Tujuan Pembelajaran SAKTI GEN-AI',home:[91.8,1.2,7,12.8]}]
  };
  let imageGroup = 'learn', imageIndex = 0;
  const pageImage = $('pageImage');
  function fitPageImage() {
    if (current !== 'imageView' || !pageImage.naturalWidth) return;
    const area = $('imageViewport');
    const scale = Math.min(area.clientWidth / pageImage.naturalWidth, area.clientHeight / pageImage.naturalHeight);
    $('imageCanvas').style.width = `${pageImage.naturalWidth * scale}px`;
    $('imageCanvas').style.height = `${pageImage.naturalHeight * scale}px`;
    const page = imagePages[imageGroup][imageIndex];
    positionHotspot('imageHomeHotspot', page.home);
    positionHotspot('imageBackHotspot', page.back);
  }
  function positionHotspot(id, bounds) {
    const button = $(id); button.hidden = !bounds;
    if (!bounds) return;
    const canvas = $('imageCanvas');
    const [left,top,width,height] = bounds;
    const w = Math.min(100,Math.max(width,4800 / Math.max(canvas.clientWidth,1)));
    const h = Math.min(100,Math.max(height,4800 / Math.max(canvas.clientHeight,1)));
    Object.assign(button.style,{
      left: Math.max(0,Math.min(100-w,left+(width-w)/2)) + '%',
      top: Math.max(0,Math.min(100-h,top+(height-h)/2)) + '%',
      width:w+'%', height:h+'%'
    });
  }
  function renderImagePage() {
    const pages = imagePages[imageGroup], page = pages[imageIndex];
    pageImage.alt = page.alt; pageImage.src = page.src;
    positionHotspot('imageHomeHotspot', page.home);
    positionHotspot('imageBackHotspot', page.back);
    $('imageHome').hidden = true; $('imageBack').hidden = Boolean(page.home || page.back);
    $('imagePrevious').hidden = pages.length < 2; $('imageNext').hidden = pages.length < 2;
    $('imagePrevious').disabled = imageIndex === 0; $('imageNext').disabled = imageIndex === pages.length - 1;
    $('imageView').setAttribute('aria-label', page.alt);
    fitPageImage();
  }
  function openImages(group, trigger) {
    resetImageSwipe();
    returnFocus = trigger; imageGroup = group; imageIndex = 0;
    const label = group === 'learn' ? 'Kembali ke menu' : 'Kembali ke Info';
    ['imageHome','imageBack','imageHomeHotspot','imageBackHotspot'].forEach(id => $(id).setAttribute('aria-label', label));
    $('imageView').classList.toggle('digital-book', group === 'learn');
    show('imageView'); renderImagePage();
    const first = imagePages[group][0];
    $(first.back ? 'imageBackHotspot' : first.home ? 'imageHomeHotspot' : 'imageBack').focus();
  }
  pageImage.addEventListener('load', fitPageImage);
  pageImage.addEventListener('error', () => notice('Gambar belum dapat dimuat. Silakan kembali ke menu dan coba lagi.'));
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fitPageImage).observe($('imageViewport'));
  window.addEventListener('resize', fitPageImage);
  $('learnButton').addEventListener('click', e => openImages('learn', e.currentTarget));
  ['imageHome','imageBack','imageHomeHotspot','imageBackHotspot'].forEach(id => $(id).addEventListener('click', back));

  function turnImagePage(delta) {
    if (imageSettling) return;
    const next = imageIndex + delta;
    if (next < 0 || next >= imagePages[imageGroup].length) return;
    imageIndex = next;
    renderImagePage();
  }

  const imageViewport = $('imageViewport'), imageCanvas = $('imageCanvas');
  const imagePreview = $('imageSwipePreview');
  let imageSwipe = null, imageSettling = null, suppressImageClick = false;

  function resetImageSwipe() {
    const pointer = imageSwipe?.id;
    imageSwipe = null;
    if (pointer !== undefined && imageViewport.hasPointerCapture(pointer)) imageViewport.releasePointerCapture(pointer);
    if (imageSettling) {
      imageSettling.cancel();
      imageSettling = null;
    }
    imageCanvas.style.transform = '';
    imagePreview.hidden = true;
    suppressImageClick = false;
  }

  imageViewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || imageGroup !== 'learn' || imageSettling) return;
    suppressImageClick = false;
    imageSwipe = {id:event.pointerId,x:event.clientX,y:event.clientY,offset:0,dragged:false};
  });
  window.addEventListener('pointermove', event => {
    if (event.pointerId !== imageSwipe?.id || current !== 'imageView') return;
    const dx = event.clientX - imageSwipe.x, dy = event.clientY - imageSwipe.y;
    if (!imageSwipe.dragged) {
      if (Math.hypot(dx,dy) < 8) return;
      suppressImageClick = true;
      if (Math.abs(dx) <= Math.abs(dy)) {
        imageSwipe = null;
        return;
      }
      imageSwipe.dragged = true;
      imageViewport.setPointerCapture(event.pointerId);
    }
    const width = imageCanvas.clientWidth;
    const direction = dx < 0 ? 1 : -1;
    const next = imagePages.learn[imageIndex + direction];
    imagePreview.hidden = !next;
    if (next) {
      if (imagePreview.getAttribute('src') !== next.src) imagePreview.src = next.src;
      imagePreview.style.left = direction * 100 + '%';
    }
    imageSwipe.offset = next ? Math.max(-width,Math.min(width,dx)) : dx * .18;
    imageCanvas.style.transform = 'translateX(' + imageSwipe.offset + 'px)';
  }, true);

  function settleImageSwipe(event, cancelled = false) {
    if (event.pointerId !== imageSwipe?.id) return;
    const drag = imageSwipe;
    imageSwipe = null;
    if (!drag.dragged) return;
    const width = imageCanvas.clientWidth;
    const direction = drag.offset < 0 ? 1 : -1;
    const delta = !cancelled && Math.abs(drag.offset) >= Math.min(58,width * .14)
      && imagePages.learn[imageIndex + direction] ? direction : 0;
    const finish = () => {
      imageSettling = null;
      imageCanvas.style.transform = '';
      imagePreview.hidden = true;
      if (delta && current === 'imageView' && imageGroup === 'learn') {
        imageIndex += delta;
        renderImagePage();
      }
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    imageSettling = imageCanvas.animate(
      [{transform:'translateX(' + drag.offset + 'px)'},{transform:'translateX(' + (-delta * width) + 'px)'}],
      {duration:190,easing:'cubic-bezier(.2,.7,.25,1)'}
    );
    imageSettling.onfinish = finish;
  }
  window.addEventListener('pointerup', settleImageSwipe, true);
  window.addEventListener('pointercancel', event => settleImageSwipe(event,true), true);
  imageViewport.addEventListener('click', event => {
    if ((suppressImageClick || imageSettling) && event.detail !== 0) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);


  $('imagePrevious').addEventListener('click', () => turnImagePage(-1));
  $('imageNext').addEventListener('click', () => turnImagePage(1));
  document.addEventListener('keydown', e => {
    if (current !== 'imageView') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); turnImagePage(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turnImagePage(-1); }
  });

  const atlasPages = {
    map: {src:'assets/images/backgrounds/peta-petualangan.jpeg', name:'Peta Petualangan'},
    morning: {src:'assets/images/backgrounds/bg-pulau-ceria.jpeg', name:'Pulau Pagi Ceria'},
    learning: {src:'assets/images/backgrounds/bg-pulau-ilmu-ajaib.jpeg', name:'Pulau Ilmu Ajaib'},
    friendship: {src:'assets/images/backgrounds/bg-sahabat-hebat.jpeg', name:'Pulau Sahabat Hebat'}
  };
  let atlasPage = 'map', atlasFocus = null;
  const atlasStarGroups = [
    {hotspot:'morningIsland', name:'Pulau Pagi Ceria', ids:[1,2,3], x:11.5, y:10.8},
    {hotspot:'learningIsland', name:'Pulau Ilmu Ajaib', ids:[4], x:56, y:28.4},
    {hotspot:'friendshipIsland', name:'Pulau Sahabat Hebat', ids:[5,6,7], x:86.4, y:10.8}
  ];
  let renderedAtlasStars = new Set();
  function renderAtlasDecor(page) {
    $('atlasDecor').hidden = page !== 'map';
    if (page !== 'map') return;
    const layer = $('atlasStars');
    const visibleStars = new Set();
    layer.replaceChildren();
    for (const group of atlasStarGroups) {
      const earned = group.ids.filter(id => missionCollection.missions[id].starEarned);
      $(group.hotspot).setAttribute('aria-label', 'Buka ' + group.name + ' · ' + earned.length + ' dari ' + group.ids.length + ' bintang');
      const row = document.createElement('div');
      row.className = 'atlas-star-row';
      row.style.left = group.x + '%';
      row.style.top = group.y + '%';
      row.dataset.island = group.hotspot;
      for (const id of earned) {
        const slot = document.createElement('span');
        slot.dataset.missionStar = id;
        slot.classList.toggle('atlas-star-new', !renderedAtlasStars.has(id));
        const image = document.createElement('img');
        image.src = 'assets/images/rewards/reward-bintang.png';
        image.alt = '';
        slot.append(image);
        row.append(slot);
        visibleStars.add(id);
      }
      layer.append(row);
    }
    renderedAtlasStars = visibleStars;
  }
  function fitAtlas() {
    const img = $('atlasImage'), area = $('atlasView');
    if (current !== 'atlasView' || !img.naturalWidth) return;
    const scale = Math.min(area.clientWidth / img.naturalWidth, area.clientHeight / img.naturalHeight);
    $('atlasCanvas').style.width = `${img.naturalWidth * scale}px`;
    $('atlasCanvas').style.height = `${img.naturalHeight * scale}px`;
  }
  function renderAtlas(page) {
    atlasPage = page;
    $('morningIntro').hidden = true;
    $('morningMissions').hidden = page !== 'morning';
    $('learningMissions').hidden = page !== 'learning';
    $('friendshipMissions').hidden = page !== 'friendship';
    $('missionCollection').hidden = true;
    const data = atlasPages[page];
    $('atlasImage').alt = data.name;
    $('atlasImage').src = data.src;
    $('atlasView').setAttribute('aria-label', data.name);
    $('atlasBack').hidden = page === 'map';
    $('atlasBack').setAttribute('aria-label','Kembali ke peta');
    ['morningIsland','learningIsland','friendshipIsland'].forEach(id => $(id).hidden = page !== 'map');
    fitAtlas();
    renderAtlasDecor(page);
    syncAdventureNav();
    $('missionCollectionToggle').hidden=page==='map';renderMissionCollection();
  }
  const atlasNarration = {
    map:'sagi-opening-peta-petualangan.mp3.mp3',
    morning:'sagi-opening-pulau-bangun-pagi.mp3.mp3',
    learning:'sagi-opening-pulau-ilmu-ajaib.mp3.mp3',
    friendship:'sagi-opening-pulau-sahabat-hebat.mp3.mp3'
  };
  function narrateAtlas(page) {
    stopVoices();
    if (!soundOn) return;
    atlasVoice.src = 'assets/audio/sagi-opening-pulau/' + atlasNarration[page];
    atlasVoice.play().catch(() => {});
  }
  function openAtlas() {
    if (maybeOpenTrophy()) return;
    show('atlasView'); renderAtlas('map');
    $('atlasView').focus({preventScroll:true});
  }
  function atlasBack() {
    stopVoices();
    if (atlasPage === 'map') { show('menu'); $('mapButton').focus(); }
    else { renderAtlas('map'); (atlasFocus || $('atlasView')).focus({preventScroll:true}); }
  }

  $('missionOne').addEventListener('click', () => {
    if (current === 'atlasView' && atlasPage === 'morning') openMaze();
  });
  $('missionTwo').addEventListener('click', () => openActivity(2));
  $('missionThree').addEventListener('click', () => openActivity(3));

  $('mapButton').addEventListener('click', () => {
    openAtlas();
    if (current === 'atlasView') narrateAtlas('map');
  });
  for (const [id,page] of [['morningIsland','morning'],['learningIsland','learning'],['friendshipIsland','friendship']]) {
    $(id).addEventListener('click', () => { atlasFocus = $(id); renderAtlas(page); narrateAtlas(page);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        $('atlasImage').animate([{opacity:.75},{opacity:1}],{duration:260});
      }
      $('adventureBack').focus({preventScroll:true}); });
  }
  $('atlasBack').addEventListener('click', atlasBack);
  $('atlasHome').addEventListener('click', () => { show('menu'); $('mapButton').focus(); });
  // Pakai pengendali fullscreen yang sudah ada, tanpa menggandakan logikanya.
  $('atlasFullscreen').addEventListener('click', () => $('fullscreenToggle').click());
  $('atlasImage').addEventListener('load', fitAtlas);
  $('atlasImage').addEventListener('error', () => notice('Gambar peta atau pulau belum dapat dimuat. Silakan kembali ke menu.'));
  window.addEventListener('resize', fitAtlas);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fitAtlas).observe($('atlasView'));
  function syncAtlasFullscreen() {
    const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    $('atlasFullscreen').setAttribute('aria-pressed', String(active));
    $('atlasFullscreen').setAttribute('aria-label', active ? 'Keluar layar penuh' : 'Layar penuh');
    $('atlasFullscreen').disabled = !($('game').requestFullscreen || $('game').webkitRequestFullscreen);
    fitAtlas();
  }
  document.addEventListener('fullscreenchange', syncAtlasFullscreen);
  document.addEventListener('webkitfullscreenchange', syncAtlasFullscreen);
  syncAtlasFullscreen();
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && current === 'atlasView') atlasBack(); });

  const mazeBase='assets/images/missions/mission-01-bangun-pagi/maze/';
  const mazeDirections={right:{dx:1,dy:0,text:'kanan'},up:{dx:0,dy:-1,text:'atas'},left:{dx:-1,dy:0,text:'kiri'},down:{dx:0,dy:1,text:'bawah'}};
  const mazeStart={x:0,y:5},mazeEnd={x:8,y:4};
  // Peta eksplisit di bawah menjaga setiap cabang tetap sederhana dan terbaca.
  const mazeFloor=new Set();
  const addFloor=(x,y)=>mazeFloor.add(`${x},${y}`);
  const addRun=(x,y,dir,count)=>{addFloor(x,y);for(let i=0;i<count;i++){x+=mazeDirections[dir].dx;y+=mazeDirections[dir].dy;addFloor(x,y);}return {x,y};};
  [[0,5,'right',3],[3,5,'up',2],[3,3,'left',2],[1,3,'up',2],[1,1,'right',6],[7,1,'down',3],[7,4,'right',1],
   [3,5,'right',2],[5,5,'up',2],[5,3,'left',2],[5,1,'up',1],[5,0,'right',2],[7,0,'down',1],
   [1,3,'left',1],[0,3,'up',1],[7,3,'right',1],[8,3,'up',1],[2,5,'up',1],[3,4,'right',1],
   [1,5,'down',1],[5,5,'down',1],[5,6,'right',1]].forEach(r=>addRun(...r));
  const mazeObstacles=new Map([
    ['2,4',{file:'Mossy Log Obstacle with Wildflowers.png',name:'batang kayu'}],
    ['4,4',{file:'Mossy Boulder Cluster with Wildflowers.png',name:'batu'}],
    ['6,1',{file:'obstacle-warning-rock.png',name:'batu'}],
    ['8,2',{file:'Colorful 3D Pond with Rocks and Flowers.png',name:'kolam'}]
  ]);
  const mazeCanEnter=(x,y)=>x>=0&&x<9&&y>=0&&y<7&&mazeFloor.has(`${x},${y}`)&&!mazeObstacles.has(`${x},${y}`);
  // BFS dipakai untuk validasi dan petunjuk dari posisi aktual, bukan rute wajib.
  function findMazeRoute(startX,startY){
    const queue=[{x:startX,y:startY,path:[]}],seen=new Set([`${startX},${startY}`]);
    for(let i=0;i<queue.length;i++){
      const node=queue[i];if(node.x===mazeEnd.x&&node.y===mazeEnd.y)return node.path;
      for(const [dir,d]of Object.entries(mazeDirections)){
        const x=node.x+d.dx,y=node.y+d.dy,key=`${x},${y}`;
        if(mazeCanEnter(x,y)&&!seen.has(key)){seen.add(key);queue.push({x,y,path:[...node.path,dir]});}
      }
    }
    return null;
  }
  if(!findMazeRoute(mazeStart.x,mazeStart.y)?.length)throw Error('Labirin tidak memiliki jalan ke Finish');
  for(const key of mazeFloor){const [x,y]=key.split(',').map(Number);if(mazeCanEnter(x,y)&&findMazeRoute(x,y)===null)throw Error('Cabang labirin terputus');}
  let mazeX=0,mazeY=5,mazePlan=null,mazeMoving=false,mazeDone=false,mazeTimer=null,mazeTotalSteps=0,mazeResult=null;
  const mazeQueue=[];
  const mazeEffects={click:new Audio('assets/audio/sfx/sfx-correct.mp3'),step:new Audio('assets/audio/sfx/sfx-correct.mp3'),success:new Audio('assets/audio/sfx/sfx-correct.mp3'),finish:new Audio('assets/audio/sfx/sfx-applause.mp3')};
  const mazeFxTimers={};
  function stopMazeEffects(){Object.entries(mazeEffects).forEach(([name,a])=>{clearTimeout(mazeFxTimers[name]);a.pause();});}
  function mazeEffect(name){
    if(!soundOn||current!=='mazeView')return;
    const audio=mazeEffects[name];clearTimeout(mazeFxTimers[name]);audio.pause();audio.currentTime=0;
    audio.volume={click:.10,step:.16,success:.35,finish:.45}[name];audio.playbackRate=name==='click'?1.6:1;
    audio.play().catch(()=>{});
    if(name==='click'||name==='step')mazeFxTimers[name]=setTimeout(()=>audio.pause(),name==='click'?65:130);
  }
  function stopMaze(){clearTimeout(mazeTimer);mazeQueue.length=0;mazeMoving=false;stopMazeEffects();}
  function fitMaze(){
    if(current!=='mazeView')return;
    const area=$('mazeBoard').parentElement,portrait=window.matchMedia('(orientation:portrait)').matches;
    const cell=portrait?area.clientWidth/9:Math.min(area.clientWidth/9,area.clientHeight/7);
    $('mazeBoard').style.width=`${cell*9}px`;$('mazeBoard').style.height=`${cell*7}px`;
  }
  function updateMazePosition(){
    $('mazePlayer').style.left=`${mazeX/9*100}%`;$('mazePlayer').style.top=`${mazeY/7*100}%`;
    $('mazePlayer').dataset.x=mazeX;$('mazePlayer').dataset.y=mazeY;
    $('mazeView').dataset.steps=mazeTotalSteps;
    $('mazePlayer').setAttribute('aria-label',`Bimo di kolom ${mazeX+1}, baris ${mazeY+1}`);
    const cell=$('mazeGrid').children[mazeY*9+mazeX];cell.classList.add('visited');
    cell.classList.remove('new-step');void cell.offsetWidth;cell.classList.add('new-step');
  }
  function updateMazeInstruction(hint){
    const route=findMazeRoute(mazeX,mazeY);
    if(!route||!route.length)return;
    const dir=route[0];let count=0;
    while(count<route.length&&count<3&&route[count]===dir)count++;
    mazePlan={dir,count,done:0};
    $('mazeInstruction').textContent=`Ayo, Bimo! Jalan ${count} langkah ke ${mazeDirections[dir].text}!`;
    $('mazeInstruction').dataset.direction=dir;$('mazeInstruction').dataset.count=count;
    $('mazeCounter').textContent=`0/${count}`;
    $('mazeHint').textContent=hint||'Satu sentuhan, satu pijakan. Kamu boleh memilih jalan lain yang aman.';
  }
  function mazeImage(file,alt){const img=document.createElement('img');img.src=mazeBase+file;img.alt=alt;img.draggable=false;return img;}
  function resetMaze(){
    stopMaze();mazeX=mazeStart.x;mazeY=mazeStart.y;mazeDone=false;mazeTotalSteps=0;mazeResult=null;
    $('mazeView').dataset.completed='false';delete $('mazeView').dataset.result;$('mazeGrid').replaceChildren();
    for(let y=0;y<7;y++)for(let x=0;x<9;x++){
      const key=`${x},${y}`,obstacle=mazeObstacles.get(key),tile=document.createElement('div');
      tile.className='maze-cell'+(mazeFloor.has(key)?' path':' garden');tile.dataset.x=x;tile.dataset.y=y;
      tile.dataset.walkable=String(mazeCanEnter(x,y));
      if(obstacle){tile.classList.add('obstacle');tile.appendChild(mazeImage('objects/'+obstacle.file,obstacle.name));tile.dataset.obstacle=obstacle.name;}
      if(x===mazeStart.x&&y===mazeStart.y){tile.classList.add('maze-start');tile.appendChild(mazeImage('guide/sign-start.png','START'));}
      if(x===mazeEnd.x&&y===mazeEnd.y){tile.classList.add('maze-finish');tile.appendChild(mazeImage('guide/sign-finish.png','Tujuan akhir'));}
      $('mazeGrid').appendChild(tile);
    }
    $('mazeVictory').hidden=true;$('mazeDpad').hidden=false;$('mazePuzzleNote').hidden=true;
    $('mazePlayer').style.transition='none';updateMazePosition();void $('mazePlayer').offsetWidth;$('mazePlayer').style.transition='';
    updateMazeInstruction();fitMaze();
  }
  function openMaze(){markMissionOneStarted();show('mazeView');resetMaze();if(morningProgress.maze.complete)restoreCompletedMaze();else restoreMazePosition();syncMazeSound();$('mazeTitle').focus({preventScroll:true});}
  function returnFromMaze(){show('atlasView');renderAtlas('morning');$('missionOne').focus({preventScroll:true});}
  function finishMaze(){
    mazeDone=true;mazeQueue.length=0;mazeResult={stage:'labirin-misi-1',complete:true,steps:mazeTotalSteps,completedAt:new Date().toISOString()};
    $('mazeView').dataset.completed='true';$('mazeView').dataset.result=JSON.stringify(mazeResult);
    $('mazeInstruction').textContent='Yeay! Sampai di tujuan!';$('mazeHint').textContent='Kamu berhasil menemukan jalan cahaya pagi!';
    $('mazeDpad').hidden=true;$('mazeVictory').hidden=false;mazeEffect('finish');saveMazeCompletion();refreshMazeContinuation();$('mazePuzzle').focus({preventScroll:true});
  }
  function bumpMaze(direction,obstacle){
    const img=$('mazePlayer').querySelector('img');
    if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){const d=mazeDirections[direction];img.animate([{translate:'0 0'},{translate:`${d.dx*5}px ${d.dy*5}px`},{translate:'0 0'}],{duration:220,easing:'ease-out'});}
    const suggested=mazePlan?mazeDirections[mazePlan.dir].text:'jalan lain';
    $('mazeHint').textContent=`${obstacle?'Ada '+obstacle+' di depan.':'Jalan di sana belum bisa dilewati.'} Tidak apa-apa! Cari jalan lain, coba ke ${suggested}.`;
    mazeEffect('click');
  }
  function processMazeQueue(){
    if(mazeMoving||mazeDone||current!=='mazeView'||!mazeQueue.length)return;
    const direction=mazeQueue.shift(),d=mazeDirections[direction],nx=mazeX+d.dx,ny=mazeY+d.dy;
    if(!mazeCanEnter(nx,ny)){
      bumpMaze(direction,mazeObstacles.get(`${nx},${ny}`)?.name);
      if(mazeQueue.length)mazeTimer=setTimeout(processMazeQueue,80);return;
    }
    const followsPlan=direction===mazePlan.dir;
    mazeMoving=true;mazeX=nx;mazeY=ny;mazeTotalSteps++;updateMazePosition();mazeEffect('step');
    if(followsPlan){mazePlan.done++;$('mazeCounter').textContent=`${mazePlan.done}/${mazePlan.count}`;}
    else updateMazeInstruction('Pilihan bagus! Kita hitung lagi dari pijakan ini.');
    saveMazePosition();
    mazeTimer=setTimeout(()=>{
      mazeMoving=false;
      if(mazeX===mazeEnd.x&&mazeY===mazeEnd.y){finishMaze();return;}
      if(followsPlan&&mazePlan.done===mazePlan.count){mazeEffect('success');updateMazeInstruction('Hebat! Ayo lanjutkan petualangan.');}
      processMazeQueue();
    },190);
  }
  function queueMazeMove(direction){if(current!=='mazeView'||mazeDone)return;mazeEffect('click');mazeQueue.push(direction);processMazeQueue();}
  ['mazeUp','mazeDown','mazeLeft','mazeRight'].forEach(id=>$(id).addEventListener('click',()=>queueMazeMove($(id).dataset.direction)));
  $('mazeBack').addEventListener('click',returnFromMaze);$('mazeRetry').addEventListener('click', () => { morningProgress.maze = {complete:false}; resetMaze(); saveMorningProgress(); });
  $('mazePuzzle').addEventListener('click',()=>{if(puzzleState.complete)openMemory();else openPuzzle();});
  $('mazeFullscreen').addEventListener('click',()=>$('fullscreenToggle').click());
  function syncMazeSound(){
    $('mazeSound').textContent=soundOn?'🔊':'🔇';$('mazeSound').setAttribute('aria-label',soundOn?'Suara ON':'Suara OFF');$('mazeSound').setAttribute('aria-pressed',String(soundOn));if(!soundOn)stopMazeEffects();
  }
  $('soundToggle').addEventListener('click',syncMazeSound);$('mazeSound').addEventListener('click',()=>$('soundToggle').click());
  document.addEventListener('keydown',e=>{
    if(current!=='mazeView')return;
    const directions={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
    if(directions[e.key]){e.preventDefault();if(!e.repeat)queueMazeMove(directions[e.key]);}if(e.key==='Escape')returnFromMaze();
  });
  window.addEventListener('resize',fitMaze);if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitMaze).observe($('mazeBoard').parentElement);
  document.addEventListener('fullscreenchange',fitMaze);window.addEventListener('pagehide',stopMaze);

  // Progres permainan lokal; terpisah dari laporan kebiasaan harian.
  const morningProgressKey='sakti.misi1.progress.v1';
  let puzzleStorageAvailable=true;
  const validPuzzleOrder=a=>Array.isArray(a)&&a.length===4&&new Set(a).size===4&&a.every(n=>Number.isInteger(n)&&n>=0&&n<4);
  const puzzleIsSolved=a=>a.every((piece,slot)=>piece===slot);
  function shuffledPuzzle(){
    const order=[0,1,2,3];
    for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    // Selalu mulai belum tersusun, termasuk ketika pengacakan menghasilkan identitas.
    if(puzzleIsSolved(order))[order[0],order[1]]=[order[1],order[0]];
    return order;
  }
  function readMorningProgress(){
    const fresh={version:1,maze:{complete:false},puzzle:{order:null,placed:0,complete:false,moves:0},nextStage:'maze'};
    try{
      const raw=JSON.parse(localStorage.getItem(morningProgressKey)||'null');
      if(!raw||raw.version!==1)return fresh;
      if (typeof raw.playerSession === 'string') fresh.playerSession = raw.playerSession;
      if (raw.finalTrophy === 'pending' || raw.finalTrophy === 'shown') fresh.finalTrophy = raw.finalTrophy;
      fresh.activities = {};
      for (let id = 2; id <= 7; id++) {
        const steps = raw.activities?.[id];
        if (Number.isInteger(steps) && steps >= 0 && steps <= (id === 2 ? 6 : 3)) fresh.activities[id] = steps;
      }
      const sport = raw.activities?.sport;
      if (Number.isInteger(sport?.step) && sport.step >= 0 && sport.step <= 4 && Array.isArray(sport.found)) {
        fresh.activities.sport = {step:sport.step,found:sport.found.slice(0,6)};
      }
      const kitchen = raw.activities?.kitchen;
      if (Number.isInteger(kitchen?.step) && kitchen.step >= 0 && kitchen.step <= 4 && Array.isArray(kitchen.placed)) {
        fresh.activities.kitchen = {step:kitchen.step, placed:kitchen.placed.filter(id => typeof id === 'string').slice(0,10)};
      }
      for (const [key,max] of [['social',4],['night',1]]) {
        const state = raw.activities?.[key];
        if (Number.isInteger(state?.step) && state.step >= 0 && state.step <= max && Array.isArray(state.placed)) {
          fresh.activities[key] = {step:state.step,placed:state.placed.slice(0,6),order:Array.isArray(state.order) ? state.order.slice(0,6) : undefined};
        }
      }
      const worshipChoices = raw.activities?.['worship-activities'];
      if (Number.isInteger(worshipChoices) && worshipChoices >= 0) fresh.activities['worship-activities'] = worshipChoices & 21;
      const worshipMask = raw.activities?.['worship-matches'];
      if (Number.isInteger(worshipMask) && worshipMask >= 0 && worshipMask <= 31) {
        fresh.activities['worship-matches'] = worshipMask;
        fresh.activities[2] = Math.min(fresh.activities[2] || 0, worshipMask === 31 ? 4 : 3);
      } else if (fresh.activities[2]) {
        // Older sessions placed the equipment quiz before the three activity questions.
        fresh.activities[2] = Math.max(0, fresh.activities[2] - 3);
      }
      const position = raw.maze?.position;
      if (position && Number.isInteger(position.x) && Number.isInteger(position.y) && mazeCanEnter(position.x, position.y)) {
        fresh.maze.position = {
          x: position.x, y: position.y,
          steps: Number.isInteger(position.steps) && position.steps >= 0 ? position.steps : 0,
          visited: Array.isArray(position.visited) ? position.visited.filter(index => Number.isInteger(index) && index >= 0 && index < 63) : []
        };
      }
      if(raw.maze?.complete===true){fresh.maze={complete:true,result:raw.maze.result,visited:Array.isArray(raw.maze.visited)?raw.maze.visited.filter(n=>Number.isInteger(n)&&n>=0&&n<63):[],counter:typeof raw.maze.counter==='string'?raw.maze.counter:'SELESAI'};fresh.nextStage='puzzle';}
      if(validPuzzleOrder(raw.puzzle?.order)){
        const placed = Number.isInteger(raw.puzzle.placed) && raw.puzzle.placed >= 0 && raw.puzzle.placed <= 15 ? raw.puzzle.placed : 0;
        fresh.puzzle={order:[...raw.puzzle.order],placed,complete:puzzleIsSolved(raw.puzzle.order),moves:Number.isInteger(raw.puzzle.moves)&&raw.puzzle.moves>=0?raw.puzzle.moves:0};
        if(fresh.puzzle.complete&&fresh.maze.complete)fresh.nextStage='awaiting-next-challenge';
      }
      if(fresh.puzzle.complete&&fresh.maze.complete)fresh.nextStage='memory';
      if(validMemoryProgress(raw.memory)){
        fresh.memory={deck:[...raw.memory.deck],matched:[...raw.memory.matched],complete:raw.memory.matched.length===6,completedAt:raw.memory.completedAt||null};
        if(fresh.memory.complete&&fresh.puzzle.complete)fresh.nextStage='reflection';
      }
      fresh.collection=normalizeMissionCollection(raw.collection);
      migrateBookProgress(raw, fresh);
      if(validReflectionProgress(raw.reflection))fresh.reflection={bankOrder:[...raw.reflection.bankOrder],slots:[...raw.reflection.slots],complete:raw.reflection.complete===true&&raw.reflection.slots.every((n,i)=>n===i)};
      if(fresh.memory?.complete)fresh.nextStage='reflection';
      if(!fresh.collection.missions[1].starEarned&&(fresh.maze.complete||fresh.puzzle.complete||fresh.memory?.complete))fresh.collection.missions[1].status='SEDANG DIKERJAKAN';
      if(fresh.collection.missions[1].starEarned)fresh.nextStage='mission-complete';
    }catch(_){puzzleStorageAvailable=false;}
    return fresh;
  }
  const morningProgress=readMorningProgress();
  const puzzleState=morningProgress.puzzle;
  let puzzleSelected=null,puzzleConfettiTimer=null;
  const puzzleSfx=new Audio();let puzzleSoundTimer=null,puzzleSoundToken=0;
  const puzzleAsset='assets/images/missions/mission-01-bangun-pagi/puzzle/illustrations/puzzle-bangun-pagi.png';
  const puzzleNodes=[];
  function saveMorningProgress(newPlayer = false){
    try {
      const stored = JSON.parse(localStorage.getItem(morningProgressKey) || 'null');
      if (!newPlayer && stored?.playerSession !== morningProgress.playerSession) return;
      if (morningProgress.collection && morningProgress.activities) {
        captureBookEvidence(morningProgress.activities, morningProgress.collection.missions[4].activities);
      }
      localStorage.setItem(morningProgressKey, JSON.stringify(morningProgress));
      puzzleStorageAvailable = true;
    } catch (_) { puzzleStorageAvailable = false; }
    $('puzzleSaveNote').hidden=puzzleStorageAvailable;
    $('memorySaveNote').hidden=puzzleStorageAvailable;
  }
  function saveMazeCompletion(){
    morningProgress.maze={complete:true,result:mazeResult,counter:$('mazeCounter').textContent,visited:[...$('mazeGrid').children].map((c,i)=>c.classList.contains('visited')?i:-1).filter(i=>i>=0)};
    morningProgress.nextStage=puzzleState.complete?stageAfterPuzzle():'puzzle';saveMorningProgress();
  }
  function refreshMazeContinuation(){
    $('mazePuzzle').textContent='LANJUT PETUALANGAN';
    $('mazePuzzleNote').textContent=missionCollection.missions[1].starEarned?'Misi 1 selesai. Bintang SAKTI tersimpan di koleksi.':morningProgress.memory?.complete?'Memory Game selesai. Yuk, ingat urutan kegiatan pagi sebagai penutup.':'Puzzle Pagi sudah selesai. Lanjutkan ke Memory Game tanpa mengulang.';
    $('mazePuzzleNote').hidden=!puzzleState.complete;$('mazeView').dataset.nextStage=morningProgress.nextStage;
  }
  function restoreCompletedMaze(){
    mazeX=mazeEnd.x;mazeY=mazeEnd.y;mazeDone=true;
    const steps=morningProgress.maze.result?.steps;
    mazeTotalSteps=Number.isInteger(steps)&&steps>=0?steps:0;
    mazeResult={stage:'labirin-misi-1',complete:true,steps:mazeTotalSteps,completedAt:morningProgress.maze.result?.completedAt||null};
    for(const i of morningProgress.maze.visited||[])$('mazeGrid').children[i]?.classList.add('visited');
    updateMazePosition();$('mazeView').dataset.completed='true';$('mazeView').dataset.result=JSON.stringify(mazeResult);
    $('mazeCounter').textContent=morningProgress.maze.counter||'SELESAI';
    $('mazeInstruction').textContent='Yeay! Sampai di tujuan!';$('mazeHint').textContent='Kamu berhasil menemukan jalan cahaya pagi!';
    $('mazeDpad').hidden=true;$('mazeVictory').hidden=false;refreshMazeContinuation();
  }
  function stopPuzzleAudio(){puzzleSoundToken++;clearTimeout(puzzleSoundTimer);puzzleSfx.onended=null;puzzleSfx.pause();}
  function puzzleEffect(kind){
    stopPuzzleAudio();if(!soundOn||current!=='puzzleView')return;
    const token=puzzleSoundToken;
    puzzleSfx.src='assets/audio/sfx/sfx-correct.mp3';puzzleSfx.volume=kind==='win'?.35:.15;puzzleSfx.playbackRate=kind==='select'?1.5:1.15;
    if(kind==='win')puzzleSfx.onended=()=>{
      if(token!==puzzleSoundToken||!soundOn||current!=='puzzleView')return;
      puzzleSfx.onended=null;puzzleSfx.src='assets/audio/sfx/sfx-applause.mp3';puzzleSfx.volume=.3;puzzleSfx.playbackRate=1;puzzleSfx.play().catch(()=>{});
    };
    puzzleSfx.play().catch(()=>{});
    if(kind!=='win')puzzleSoundTimer=setTimeout(()=>puzzleSfx.pause(),kind==='select'?85:180);
  }


  function renderPuzzle(){
    const placed = puzzleState.complete ? 15 : puzzleState.placed || 0;
    puzzleNodes.forEach((button,piece)=>{
      const slot=puzzleState.order.indexOf(piece);
      button.style.order=slot;
      button.hidden=Boolean(placed & (1 << piece));
      button.classList.toggle('selected',piece===puzzleSelected);
      button.setAttribute('aria-pressed',String(piece===puzzleSelected));
    });
    for (const slot of $('puzzleSlots').children) {
      const piece=Number(slot.dataset.puzzleSlot);
      const locked=Boolean(placed & (1 << piece));
      slot.classList.toggle('puzzle-locked',locked);
      slot.disabled=locked;
    }
    $('puzzleSlots').hidden=puzzleState.complete;
    $('puzzleHintImage').hidden=puzzleState.complete;
    $('puzzleWhole').hidden=!puzzleState.complete;
    $('puzzleWin').hidden=!puzzleState.complete;
    $('puzzleView').dataset.completed=String(puzzleState.complete);
    $('puzzleView').dataset.order=JSON.stringify(puzzleState.order);
    $('puzzleView').dataset.moves=puzzleState.moves;
    if(puzzleState.complete)$('puzzleDialog').textContent='Hore! Puzzle Pagi berhasil! Kamu memang anak hebat!';
    $('puzzleSaveNote').hidden=puzzleStorageAvailable;
  }
  function renderPuzzleInstant(){renderPuzzle();}


  function celebratePuzzle(){
    $('puzzleConfetti').replaceChildren();
    if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
      for(let i=0;i<18;i++){const dot=document.createElement('i');dot.style.left=`${Math.random()*100}%`;dot.style.background=['#ffdc63','#ff8f9b','#77d5cb','#b9a1ff'][i%4];dot.style.setProperty('--drift',`${(Math.random()-.5)*100}px`);dot.style.animationDelay=`${Math.random()*.25}s`;$('puzzleConfetti').appendChild(dot);}
      puzzleConfettiTimer=setTimeout(()=>$('puzzleConfetti').replaceChildren(),2100);
    }
    puzzleEffect('win');$('puzzleContinue').focus({preventScroll:true});
  }

  function selectPuzzlePiece(piece){
    if(puzzleState.complete || (puzzleState.placed & (1 << piece))) return;
    puzzleSelected=puzzleSelected===piece ? null : piece;
    renderPuzzle();
  }
  function placePuzzlePiece(piece, slot){
    if(puzzleState.complete || (puzzleState.placed & (1 << piece))) return;
    if(piece !== slot){
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) puzzleNodes[piece].animate([{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:190});
      $('puzzleDialog').textContent='Belum pas. Coba kotak yang lain, ya!';
      return;
    }
    puzzleState.placed=(puzzleState.placed || 0) | (1 << piece);
    puzzleState.moves++;
    puzzleSelected=null;
    puzzleState.complete=puzzleState.placed===15;
    if(puzzleState.complete)puzzleState.order=[0,1,2,3];
    morningProgress.nextStage=puzzleState.complete ? stageAfterPuzzle() : 'puzzle';
    saveMorningProgress();
    renderPuzzle();
    $('puzzleSlots').children[slot].classList.add('puzzle-snap');
    if(puzzleState.complete)celebratePuzzle();
    else {
      $('puzzleDialog').textContent='Bagus! Kepingnya pas.';
      puzzleEffect('swap');
    }
  }
  const puzzleDragStops=[];
  function clearPuzzleDrag(){puzzleDragStops.forEach(stop=>stop());}
  function stopPuzzle(){
    clearTimeout(puzzleConfettiTimer);
    clearPuzzleDrag();
    puzzleSelected=null;
    stopPuzzleAudio();
    $('puzzleConfetti').replaceChildren();
  }
  function buildPuzzlePieces(){
    for(let piece=0;piece<4;piece++){
      const fragment = () => {
        const span=document.createElement('span');
        span.className='puzzle-fragment';
        span.style.backgroundPosition=(piece%2*100)+'% '+(Math.floor(piece/2)*100)+'%';
        span.setAttribute('aria-hidden','true');
        return span;
      };
      const slot=bookButton('Kotak '+(piece+1),()=>{
        if(puzzleSelected!==null)placePuzzlePiece(puzzleSelected,piece);
      });
      slot.dataset.puzzleSlot=piece;
      slot.append(fragment());
      $('puzzleSlots').append(slot);
      const button=bookButton('Keping '+(piece+1),null,fragment());
      button.className='puzzle-piece';
      button.dataset.piece=piece;
      puzzleDragStops.push(bookDrag(button,()=>selectPuzzlePiece(piece),hit=>{
        const target=hit?.closest('[data-puzzle-slot]');
        if(target && !target.disabled)placePuzzlePiece(piece,Number(target.dataset.puzzleSlot));
      },event=>{
        $('puzzleSlots').querySelector('.puzzle-over')?.classList.remove('puzzle-over');
        if(event)document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-puzzle-slot]:not(:disabled)')?.classList.add('puzzle-over');
      }));
      $('puzzlePieces').append(button);
      puzzleNodes.push(button);
    }
  }


  function openPuzzle(){
    if(!mazeDone&&!morningProgress.maze.complete)return;
    if(!morningProgress.maze.complete)saveMazeCompletion();
    if(!validPuzzleOrder(puzzleState.order)){puzzleState.order=shuffledPuzzle();puzzleState.placed=0;puzzleState.complete=false;puzzleState.moves=0;saveMorningProgress();}
    show('puzzleView');puzzleSelected=null;renderPuzzleInstant();syncPuzzleSound();
    if(!puzzleState.complete)$('puzzleDialog').textContent=puzzleState.moves?'Perhatikan gambarnya, lalu susun potongannya, ya!':'Yeay! Kita sampai di tantangan berikutnya! Ayo susun gambar pagi ini!';
    $('puzzleTitle').focus({preventScroll:true});
  }
  function returnFromPuzzle(continueAdventure=false){
    saveMorningProgress();show('mazeView');
    if(!$('mazeGrid').children.length){resetMaze();restoreCompletedMaze();}
    refreshMazeContinuation();fitMaze();
    if(continueAdventure&&puzzleState.complete)$('mazeHint').textContent='Puzzle Pagi selesai! Tantangan berikutnya sedang disiapkan.';
    $('mazePuzzle').focus({preventScroll:true});
  }
  function retryPuzzle(){
    stopPuzzle();puzzleState.order=shuffledPuzzle();puzzleState.placed=0;puzzleState.complete=false;puzzleState.moves=0;morningProgress.nextStage='puzzle';
    $('puzzleDialog').textContent='Perhatikan gambarnya, lalu susun potongannya, ya!';saveMorningProgress();renderPuzzleInstant();
  }
  function syncPuzzleSound(){
    $('puzzleSound').textContent=soundOn?'🔊':'🔇';$('puzzleSound').setAttribute('aria-label',soundOn?'Suara ON':'Suara OFF');$('puzzleSound').setAttribute('aria-pressed',String(soundOn));if(!soundOn)stopPuzzleAudio();
  }
  $('puzzleBack').addEventListener('click',()=>returnFromPuzzle());$('puzzleRetry').addEventListener('click',retryPuzzle);
  $('puzzleContinue').addEventListener('click',()=>{if(puzzleState.complete)openMemory();});
  $('puzzleSound').addEventListener('click',()=>$('soundToggle').click());$('soundToggle').addEventListener('click',syncPuzzleSound);
  $('puzzleFullscreen').addEventListener('click',()=>$('fullscreenToggle').click());
  document.addEventListener('keydown',event=>{if(current==='puzzleView'&&event.key==='Escape'){event.preventDefault();returnFromPuzzle();}});
  window.addEventListener('resize',clearPuzzleDrag);
  window.addEventListener('pagehide',()=>{saveMorningProgress();stopPuzzle();});

  function validMemoryDeck(deck){return Array.isArray(deck)&&deck.length===6&&deck.every(n=>Number.isInteger(n)&&n>=0&&n<3)&&[0,1,2].every(id=>deck.filter(n=>n===id).length===2);}
  function validMemoryProgress(raw){
    if(!raw||!validMemoryDeck(raw.deck)||!Array.isArray(raw.matched)||new Set(raw.matched).size!==raw.matched.length||!raw.matched.every(n=>Number.isInteger(n)&&n>=0&&n<6))return false;
    return [0,1,2].every(id=>{const count=raw.matched.filter(index=>raw.deck[index]===id).length;return count===0||count===2;});
  }
  function stageAfterPuzzle(){return morningProgress.memory?.complete?'reflection':'memory';}
  const memoryBase='assets/images/missions/mission-01-bangun-pagi/memory/';
  const memoryPictures=[
    {file:'memory-game-misi1-merapikan-selimut.png',name:'Merapikan selimut'},
    {file:'memory-game-misi1-membasuh-muka.png',name:'Membasuh muka'},
    {file:'memory-game-misi1menggosok-gigi.png',name:'Menggosok gigi'}
  ];
  const memoryState=morningProgress.memory||{deck:null,matched:[],complete:false};
  morningProgress.memory=memoryState;
  let memoryFlipped=[],memoryBusy=false,memoryTimer=null,memoryConfettiTimer=null;
  const memoryNodes=[];
  const memorySfx=new Audio();let memorySoundToken=0,memorySoundTimer=null;
  function stopMemoryAudio(){memorySoundToken++;clearTimeout(memorySoundTimer);memorySfx.onended=null;memorySfx.pause();}
  function memoryEffect(kind){
    stopMemoryAudio();if(!soundOn||current!=='memoryView')return;
    const token=memorySoundToken;
    // Seleksi memakai potongan pendek, feedback berbeda tetap lembut tanpa hukuman.
    memorySfx.src='assets/audio/sfx/'+(kind==='different'?'sfx-incorrect.mp3':'sfx-correct.mp3');
    memorySfx.volume=kind==='open'?.12:kind==='different'?.12:.3;memorySfx.playbackRate=kind==='open'?1.5:1;
    if(kind==='win')memorySfx.onended=()=>{
      if(token!==memorySoundToken||!soundOn||current!=='memoryView')return;
      memorySfx.onended=null;memorySfx.src='assets/audio/sfx/sfx-applause.mp3';memorySfx.volume=.3;memorySfx.play().catch(()=>{});
    };
    memorySfx.play().catch(()=>{});
    if(kind==='open'||kind==='different')memorySoundTimer=setTimeout(()=>memorySfx.pause(),kind==='open'?100:250);
  }
  function fitMemory(){
    if(current!=='memoryView')return;
    const view=$('memoryView'),portrait=window.matchMedia('(orientation:portrait)').matches;
    const width=Math.min(view.clientWidth,(view.clientHeight-(portrait?120:0))*16/9);
    $('memoryCanvas').style.width=`${width}px`;$('memoryCanvas').style.height=`${width*9/16}px`;
  }
  function shuffledMemory(){
    const deck=[0,0,1,1,2,2];
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
    if(JSON.stringify(deck)===JSON.stringify(memoryState.deck))deck.push(deck.shift());
    return deck;
  }
  function buildMemoryCards(){
    $('memoryGrid').replaceChildren();memoryNodes.length=0;
    memoryState.deck.forEach((id,index)=>{
      const button=document.createElement('button');button.type='button';button.className='memory-card';button.dataset.index=index;
      const flipper=document.createElement('span');flipper.className='memory-flipper';
      for(const side of ['back','front']){
        const face=document.createElement('span');face.className='memory-face '+side;face.setAttribute('aria-hidden','true');
        const img=document.createElement('img');img.src=memoryBase+(side==='back'?'Back-card.png':memoryPictures[id].file);img.alt='';img.draggable=false;
        face.appendChild(img);flipper.appendChild(face);
      }
      button.appendChild(flipper);button.addEventListener('click',()=>flipMemoryCard(index));
      $('memoryGrid').appendChild(button);memoryNodes.push(button);
    });renderMemory();
  }
  function renderMemory(){
    const pairs=memoryState.matched.length/2;
    memoryNodes.forEach((button,index)=>{
      const matched=memoryState.matched.includes(index),open=matched||memoryFlipped.includes(index);
      button.classList.toggle('is-open',open);button.classList.toggle('matched',matched);
      button.disabled=matched||memoryState.complete||memoryBusy;
      button.setAttribute('aria-pressed',String(open));
      button.setAttribute('aria-label',`Kartu ${index+1}, ${matched?'pasangan cocok: '+memoryPictures[memoryState.deck[index]].name:open?memoryPictures[memoryState.deck[index]].name:'tertutup'}`);
    });
    $('memoryCounter').textContent=`${pairs}/3`;$('memoryCounter').setAttribute('aria-label',`${pairs} dari 3 pasangan ditemukan`);
    $('memoryContinue').hidden=!memoryState.complete;$('memoryReward').hidden=!memoryState.complete;
    $('memoryView').dataset.completed=String(memoryState.complete);$('memoryView').dataset.matched=JSON.stringify(memoryState.matched);$('memoryView').dataset.open=JSON.stringify(memoryFlipped);$('memoryView').dataset.busy=String(memoryBusy);
    $('memorySaveNote').hidden=puzzleStorageAvailable;
  }
  function celebrateMemory(){
    $('memoryDialog').textContent='Hore! Semua pasangan berhasil ditemukan! Kamu hebat!';
    $('memoryConfetti').replaceChildren();
    if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
      for(let i=0;i<18;i++){const dot=document.createElement('i');dot.style.left=`${Math.random()*100}%`;dot.style.background=['#ffe16e','#ff9ba6','#7ed7ca','#a9a2ff'][i%4];dot.style.setProperty('--drift',`${(Math.random()-.5)*110}px`);dot.style.animationDelay=`${Math.random()*.2}s`;$('memoryConfetti').appendChild(dot);}
      memoryConfettiTimer=setTimeout(()=>$('memoryConfetti').replaceChildren(),2200);
    }
    memoryEffect('win');$('memoryContinue').focus({preventScroll:true});
  }
  function flipMemoryCard(index){
    if(current!=='memoryView'||memoryBusy||memoryState.complete||memoryState.matched.includes(index)||memoryFlipped.includes(index))return;
    memoryFlipped.push(index);memoryEffect('open');
    if(memoryFlipped.length===1){renderMemory();return;}
    memoryBusy=true;
    const [a,b]=memoryFlipped;
    if(memoryState.deck[a]===memoryState.deck[b]){
      memoryState.matched.push(a,b);memoryState.complete=memoryState.matched.length===6;
      $('memoryDialog').textContent='Yeay! Kamu menemukan pasangannya!';
      if(memoryState.complete){memoryState.completedAt=new Date().toISOString();morningProgress.nextStage='reflection';}
      saveMorningProgress();renderMemory();memoryEffect('match');
      memoryTimer=setTimeout(()=>{memoryFlipped=[];memoryBusy=false;renderMemory();if(memoryState.complete)celebrateMemory();},480);
    }else{
      $('memoryDialog').textContent='Belum sama, nih. Coba ingat gambarnya, ya!';renderMemory();memoryEffect('different');
      memoryTimer=setTimeout(()=>{memoryFlipped=[];renderMemory();memoryTimer=setTimeout(()=>{memoryBusy=false;renderMemory();},440);},1200);
    }
  }
  function stopMemory(){
    clearTimeout(memoryTimer);clearTimeout(memoryConfettiTimer);memoryBusy=false;memoryFlipped=[];stopMemoryAudio();$('memoryConfetti').replaceChildren();
  }
  function openMemory(){
    if(!puzzleState.complete)return;
    if(!validMemoryDeck(memoryState.deck)){memoryState.deck=shuffledMemory();memoryState.matched=[];memoryState.complete=false;saveMorningProgress();}
    stopMemory();show('memoryView');buildMemoryCards();fitMemory();syncMemorySound();
    $('memoryDialog').textContent=memoryState.complete?'Hore! Semua pasangan berhasil ditemukan! Kamu hebat!':'Halo, Sahabat Hebat! Yuk, cari dua gambar yang sama!';
    $('memoryView').focus({preventScroll:true});
  }
  function retryMemory(){
    stopMemory();memoryState.deck=shuffledMemory();memoryState.matched=[];memoryState.complete=false;delete memoryState.completedAt;
    morningProgress.nextStage='memory';saveMorningProgress();buildMemoryCards();
    $('memoryDialog').textContent='Halo, Sahabat Hebat! Yuk, cari dua gambar yang sama!';
  }
  function returnFromMemory(){saveMorningProgress();openPuzzle();}
  function syncMemorySound(){
    $('memorySound').textContent=soundOn?'🔊':'🔇';$('memorySound').setAttribute('aria-label',soundOn?'Suara ON':'Suara OFF');$('memorySound').setAttribute('aria-pressed',String(soundOn));if(!soundOn)stopMemoryAudio();
  }
  $('memoryBack').addEventListener('click',returnFromMemory);$('memoryRetry').addEventListener('click',retryMemory);
  $('memoryContinue').addEventListener('click',()=>{if(memoryState.complete)openReflection();});
  $('memorySound').addEventListener('click',()=>$('soundToggle').click());$('soundToggle').addEventListener('click',syncMemorySound);
  $('memoryFullscreen').addEventListener('click',()=>$('fullscreenToggle').click());
  document.addEventListener('keydown',event=>{if(current==='memoryView'&&event.key==='Escape'){event.preventDefault();returnFromMemory();}});
  window.addEventListener('resize',fitMemory);document.addEventListener('fullscreenchange',fitMemory);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitMemory).observe($('memoryView'));
  window.addEventListener('pagehide',stopMemory);

  function validReflectionProgress(raw){
    if(!raw||!validPuzzleOrder(raw.bankOrder)||!Array.isArray(raw.slots)||raw.slots.length!==4)return false;
    const chosen=raw.slots.filter(n=>n!==null);
    return chosen.every(n=>Number.isInteger(n)&&n>=0&&n<4)&&new Set(chosen).size===chosen.length;
  }
  function normalizeMissionCollection(raw){
    const result={missions:{}};
    for(let id=1;id<=7;id++){
      const source=raw?.missions?.[id]||{},proof=source.activities;
      const earned=source.starEarned===true&&(id!==1||['maze','puzzle','memory','reflection'].every(k=>proof?.[k]===true));
      const status=earned?'SELESAI':['BELUM DIMAINKAN','SEDANG DIKERJAKAN'].includes(source.status)?source.status:'BELUM DIMAINKAN';
      result.missions[id]={...source,status,starEarned:earned,activities:proof&&typeof proof==='object'?{...proof}:{}};
    }
    return result;
  }
  const missionCollection=morningProgress.collection||normalizeMissionCollection(null);morningProgress.collection=missionCollection;
  const reflectionState=morningProgress.reflection||{bankOrder:shuffledPuzzle(),slots:[null,null,null,null],complete:false};morningProgress.reflection=reflectionState;
  const reflectionPictures=[
    {file:'memory-game-misi1-bangun-pagi.png',name:'Bangun tidur'},
    {file:'memory-game-misi1-merapikan-selimut.png',name:'Merapikan tempat tidur'},
    {file:'memory-game-misi1-membasuh-muka.png',name:'Membasuh wajah'},
    {file:'memory-game-misi1menggosok-gigi.png',name:'Menggosok gigi'}
  ];
  const reflectionBankNodes=[],reflectionSlotNodes=[];
  let reflectionSelected=null,reflectionDrag=null,reflectionTimer=null,reflectionFinishing=false;
  let missionRewardToken=0;
  const closureSfx=new Audio();let closureSoundTimer=null,closureSoundToken=0;
  const getStarTotal=()=>Object.values(missionCollection.missions).filter(m=>m.starEarned).length;
  const reflectionCorrect=()=>reflectionState.slots.every((piece,index)=>piece===index);
  const previousMissionActivitiesDone=()=>morningProgress.maze.complete===true&&puzzleState.complete&&validPuzzleOrder(puzzleState.order)&&puzzleIsSolved(puzzleState.order)&&memoryState.complete&&memoryState.matched.length===6;
  const allMissionOneActivitiesDone=()=>previousMissionActivitiesDone()&&reflectionState.complete&&reflectionCorrect();
  function stopClosureAudio(){closureSoundToken++;clearTimeout(closureSoundTimer);closureSfx.onended=null;closureSfx.pause();}
  function closureEffect(kind){
    stopClosureAudio();
    const bookReward = current === 'activityView' && activeActivity === 4 && bookPanel === 'celebration';
    const bookCorrect = (kind === 'book-correct' || kind === 'book-incorrect') && current === 'activityView' && ((activeActivity === 4 && bookPanel === 'challenge') || (activeActivity === 2 && !$('worshipMatch').hidden) || (activeActivity >= 5 && !$('kitchenGame').hidden) || (activeActivity === 3 && !$('sportGame').hidden));
    if (!soundOn || (!bookReward && !bookCorrect && !['reflectionView','missionRewardView'].includes(current))) return;
    const token=closureSoundToken;closureSfx.src=kind==='book-incorrect'?'assets/audio/sfx/sfx-incorrect.mp3':'assets/audio/sfx/sfx-correct.mp3';closureSfx.volume=kind==='win'?.35:.15;closureSfx.playbackRate=kind==='select'?1.5:1;
    if(kind==='win')closureSfx.onended=()=>{if(token!==closureSoundToken||!soundOn||current!=='missionRewardView')return;closureSfx.onended=null;closureSfx.src='assets/audio/sfx/sfx-applause.mp3';closureSfx.volume=.3;closureSfx.play().catch(()=>{});};
    const playback = closureSfx.play();
    playback.catch(()=>{});if(kind==='select')closureSoundTimer=setTimeout(()=>closureSfx.pause(),100);
    return playback;
  }
  function saveClosureProgress(){saveMorningProgress();$('reflectionSaveNote').hidden=puzzleStorageAvailable;renderMissionCollection();}
  function markMissionOneStarted(){
    const record=missionCollection.missions[1];if(!record.starEarned)record.status='SEDANG DIKERJAKAN';saveClosureProgress();
  }
  function renderMissionCollection(){
    const total=getStarTotal();$('missionCollectionCount').textContent=`${total}/7`;
    $('missionCollectionToggle').setAttribute('aria-label',`Koleksi Bintang SAKTI: ${total} dari 7. Misi 1 ${missionCollection.missions[1].status}.`);
    $('missionCollectionTotal').textContent=`Total Bintang SAKTI: ${total}/7`;$('missionCollectionList').replaceChildren();
    const names = missionNames;
    names.forEach((name,index)=>{
      const record=missionCollection.missions[index+1],row=document.createElement('li'),star=document.createElement('img'),label=document.createElement('span'),status=document.createElement('small');
      star.src='assets/images/rewards/reward-bintang.png';star.alt=record.starEarned?'Bintang emas sudah diperoleh':'Bintang belum diperoleh';star.classList.toggle('unearned',!record.starEarned);
      label.textContent=`Misi ${index+1}: ${name}`;status.textContent=record.status;label.appendChild(status);row.append(star,label);$('missionCollectionList').appendChild(row);
    });
    const historical=missionCollection.missions[1].activities;
    const stages={maze:historical.maze||morningProgress.maze.complete,puzzle:historical.puzzle||puzzleState.complete,memory:historical.memory||memoryState.complete,reflection:historical.reflection||reflectionState.complete};
    $('missionCollectionActivities').textContent=`Misi 1 — Labirin: ${stages.maze?'selesai':'belum selesai'} · Puzzle: ${stages.puzzle?'selesai':'belum selesai'} · Memory: ${stages.memory?'selesai':'belum selesai'} · Refleksi penutup: ${stages.reflection?'selesai':'belum selesai'}`;
    $('missionReplay').hidden=!missionCollection.missions[1].starEarned;
  }
  function renderReflection(){
    reflectionBankNodes.forEach((button,piece)=>{
      button.style.order=reflectionState.bankOrder.indexOf(piece);button.hidden=reflectionState.slots.includes(piece);
      button.classList.toggle('selected',reflectionSelected===piece);button.setAttribute('aria-pressed',String(reflectionSelected===piece));
    });
    reflectionSlotNodes.forEach((button,index)=>{
      const piece=reflectionState.slots[index];button.dataset.piece=piece===null?'':piece;
      button.classList.toggle('selected',piece!==null&&reflectionSelected===piece);button.setAttribute('aria-pressed',String(piece!==null&&reflectionSelected===piece));
      button.setAttribute('aria-label',`Urutan ${index+1}: ${piece===null?'kosong. Ketuk untuk meletakkan gambar':reflectionPictures[piece].name+'. Ketuk untuk memilih atau menukar'}`);
      const image=button.querySelector('img');image.hidden=piece===null;if(piece!==null){image.src=memoryBase+reflectionPictures[piece].file;image.alt=reflectionPictures[piece].name;}
    });
    $('reflectionView').dataset.slots=JSON.stringify(reflectionState.slots);$('reflectionView').dataset.completed=String(reflectionState.complete);$('reflectionCheck').disabled=reflectionFinishing;
  }
  function assignReflection(piece,index){
    if(reflectionFinishing)return;
    const previousIndex=reflectionState.slots.indexOf(piece),displaced=reflectionState.slots[index];
    if(previousIndex>=0)reflectionState.slots[previousIndex]=displaced;
    reflectionState.slots[index]=piece;reflectionState.complete=false;reflectionSelected=null;
    $('reflectionDialog').textContent='Susun gambarnya, mulai dari bangun tidur sampai menggosok gigi, ya!';
    closureEffect('select');renderReflection();saveClosureProgress();
  }
  function reflectionTap(button){
    if(reflectionFinishing)return;
    const slot=button.dataset.slot===undefined?null:Number(button.dataset.slot);
    const piece=slot===null?Number(button.dataset.piece):reflectionState.slots[slot];
    if(slot!==null&&reflectionSelected!==null){assignReflection(reflectionSelected,slot);return;}
    if(piece===null)return;
    reflectionSelected=reflectionSelected===piece?null:piece;
    $('reflectionDialog').textContent='Susun gambarnya, mulai dari bangun tidur sampai menggosok gigi, ya!';closureEffect('select');renderReflection();
  }
  function clearReflectionDrag(){
    const drag=reflectionDrag;reflectionDrag=null;$('reflectionDragGhost').hidden=true;
    if(drag?.button.hasPointerCapture(drag.id))drag.button.releasePointerCapture(drag.id);
  }
  function attachReflectionInput(button){
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0||reflectionDrag||reflectionFinishing)return;
      const piece=button.dataset.slot===undefined?Number(button.dataset.piece):reflectionState.slots[Number(button.dataset.slot)];
      reflectionDrag={id:event.pointerId,button,piece,x:event.clientX,y:event.clientY,moved:false};button.setPointerCapture(event.pointerId);
    });
    button.addEventListener('pointermove',event=>{
      const drag=reflectionDrag;if(!drag||drag.id!==event.pointerId||drag.piece===null)return;
      if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>8)drag.moved=true;
      if(drag.moved){event.preventDefault();const ghost=$('reflectionDragGhost');ghost.src=memoryBase+reflectionPictures[drag.piece].file;ghost.hidden=false;ghost.style.left=`${event.clientX-55}px`;ghost.style.top=`${event.clientY-55}px`;}
    });
    button.addEventListener('pointerup',event=>{
      const drag=reflectionDrag;if(!drag||drag.id!==event.pointerId)return;
      clearReflectionDrag();if(!drag.moved){reflectionTap(button);return;}
      const slot=document.elementFromPoint(event.clientX,event.clientY)?.closest('.reflection-slot');
      if(slot&&drag.piece!==null)assignReflection(drag.piece,Number(slot.dataset.slot));
    });
    button.addEventListener('pointercancel',clearReflectionDrag);button.addEventListener('lostpointercapture',clearReflectionDrag);
    button.addEventListener('click',event=>{if(event.detail===0)reflectionTap(button);});button.addEventListener('dragstart',event=>event.preventDefault());
  }
  function buildReflection(){
    reflectionPictures.forEach((picture,piece)=>{
      const button=document.createElement('button');button.type='button';button.className='reflection-picture';button.dataset.piece=piece;button.setAttribute('aria-label',`Pilih gambar: ${picture.name}`);
      const image=document.createElement('img');image.src=memoryBase+picture.file;image.alt=picture.name;image.draggable=false;button.appendChild(image);attachReflectionInput(button);$('reflectionBank').appendChild(button);reflectionBankNodes.push(button);
    });
    for(let index=0;index<4;index++){
      const button=document.createElement('button');button.type='button';button.className='reflection-slot';button.dataset.slot=index;
      const number=document.createElement('span');number.className='reflection-number';number.textContent=index+1;
      const image=document.createElement('img');image.alt='';image.hidden=true;image.draggable=false;
      button.append(number,image);attachReflectionInput(button);$('reflectionSlots').appendChild(button);reflectionSlotNodes.push(button);
    }
  }
  function openReflection(){
    if(!previousMissionActivitiesDone())return;
    stopReflection();show('reflectionView');syncClosureSound();renderReflection();
    $('reflectionDialog').textContent='Halo, Sahabat Hebat! Sekarang, yuk kita ingat kegiatan pagi yang baik!';$('reflectionSaveNote').hidden=puzzleStorageAvailable;
    $('reflectionTitle').focus({preventScroll:true});
  }
  function stopReflection(){clearTimeout(reflectionTimer);reflectionFinishing=false;reflectionSelected=null;clearReflectionDrag();stopClosureAudio();}
  function retryReflection(){
    stopReflection();reflectionState.bankOrder=shuffledPuzzle();reflectionState.slots=[null,null,null,null];reflectionState.complete=false;
    $('reflectionDialog').textContent='Susun gambarnya, mulai dari bangun tidur sampai menggosok gigi, ya!';renderReflection();saveClosureProgress();
  }
  function awardMissionOne(){
    if(!allMissionOneActivitiesDone())return false;
    completeMission(1, {maze:true,puzzle:true,memory:true,reflection:true});
    return true;
  }
  function checkReflection(){
    if(current!=='reflectionView'||reflectionFinishing)return;
    if(!reflectionCorrect()){$('reflectionDialog').textContent='Yuk, kita ingat lagi. Apa yang kita lakukan pertama kali setelah bangun tidur?';closureEffect('select');return;}
    if(!previousMissionActivitiesDone())return;
    reflectionState.complete=true;if(!awardMissionOne())return;
    reflectionFinishing=true;renderReflection();$('reflectionDialog').textContent='Hebat sekali! Kamu sudah tahu urutan kegiatan pagi yang baik!';closureEffect('success');
    reflectionTimer=setTimeout(()=>{if(current==='reflectionView')openMissionReward();},700);
  }
  const rewardVoices = [
    'sagi-misi1-berhasil.mp3.mp3','sagi-misi2-berhasil.mp3.mp3','sagi-misi3-berhasil.mp3.mp3',
    'sagi-misi4-berhasil.mp3.mp3','sagi-misi5-berhasil.mp3.mp3','sagi-misi6-berhasil.mp3.mp3','sagi-misi7-berhasil.mp3.mp3'
  ];
  const rewardApplause = new Audio('assets/audio/sfx/sfx-applause.mp3');
  rewardApplause.volume = .18;

  function stopMissionReward(){
    missionRewardToken++;
    stopClosureAudio();
    rewardApplause.pause();
    $('missionRewardFx').replaceChildren();
  }

  function playRewardNarration(file, token, screen) {
    if (!soundOn) return;
    closureSfx.src = 'assets/audio/' + file;
    closureSfx.volume = 1;
    closureSfx.playbackRate = 1;
    closureSfx.onended = () => {
      closureSfx.onended = null;
      if (token !== missionRewardToken || current !== screen || !soundOn) return;
      rewardApplause.currentTime = 0;
      rewardApplause.play().catch(() => {});
    };
    closureSfx.play().catch(() => {
      if (token === missionRewardToken) closureSfx.onended = null;
    });
  }

  function returnRewardToIsland(){
    if(current!=='missionRewardView')return;
    show('atlasView');renderAtlas(missionIsland(rewardMission));renderMissionCollection();if(rewardMission===1)$('missionOne').focus({preventScroll:true});
  }
  function openMissionReward(id = 1){
    if (!missionCollection.missions[id]?.starEarned || (id === 1 && !allMissionOneActivitiesDone()) || (id === 4 && completedBookCount() !== 3)) return;
    if (current === 'missionRewardView' && rewardMission === id) return;
    rewardMission = id;
    $('missionRewardBack').setAttribute('aria-label', id === 3 || id >= 5 ? 'Lanjutkan misi · Kembali ke peta' : 'Lanjutkan misi · Kembali ke pulau');
    $('missionRewardBack').querySelector('img').src = id >= 5
      ? missionAssets + islandActionFolders[id] + '/btn-lanjutkan-misi.png'
      : 'assets/images/buttons/btn-lanjutkan-misi.png';
    const image = $('missionRewardImage');
    const file = id === 3 ? 'reward-misi3-berhasil.jpeg' : 'reward-misi-' + id + '-berhasil.jpeg';
    image.src = 'assets/images/rewards/' + file;
    image.alt = 'Misi ' + id + ' berhasil · ' + missionNames[id - 1];
    $('missionRewardView').setAttribute('aria-label', 'Misi ' + id + ' berhasil');
    stopMissionReward();show('missionRewardView');const token=++missionRewardToken;
    $('missionRewardTotal').textContent=`Total Bintang SAKTI: ${getStarTotal()}/7${puzzleStorageAvailable?'':' · tersimpan selama halaman terbuka'}`;
    $('missionRewardView').dataset.totalStars=getStarTotal();$('missionRewardView').focus({preventScroll:true});
    playRewardNarration(rewardVoices[id - 1], token, 'missionRewardView');
    $('missionRewardImage').decode().then(()=>{
      if(token!==missionRewardToken||current!=='missionRewardView')return;
      if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){for(let i=0;i<16;i++){const dot=document.createElement('i');dot.style.left=`${i%2?97+Math.random()*2:Math.random()*3}%`;dot.style.background=['#ffe36e','#ffb4c8','#a5e3d8'][i%3];dot.style.animationDelay=`${Math.random()*.3}s`;$('missionRewardFx').appendChild(dot);}}
    }).catch(()=>{$('missionRewardTotal').textContent='Gambar reward belum dapat dimuat. Gunakan tombol kembali ke pulau.';});
  }
  function replayMissionOne(){
    if(current!=='atlasView'||atlasPage!=='morning')return;
    stopMaze();stopPuzzle();stopMemory();stopReflection();stopMissionReward();
    morningProgress.maze={complete:false};Object.assign(puzzleState,{order:null,placed:0,complete:false,moves:0});Object.assign(memoryState,{deck:null,matched:[],complete:false});delete memoryState.completedAt;
    Object.assign(reflectionState,{bankOrder:shuffledPuzzle(),slots:[null,null,null,null],complete:false});morningProgress.nextStage='maze';saveClosureProgress();openMaze();
  }
  function syncClosureSound(){
    $('reflectionSound').textContent=soundOn?'🔊':'🔇';$('reflectionSound').setAttribute('aria-label',soundOn?'Suara ON':'Suara OFF');$('reflectionSound').setAttribute('aria-pressed',String(soundOn));if(!soundOn){stopClosureAudio();rewardApplause.pause();}
  }
  buildReflection();
  $('reflectionBack').addEventListener('click',openMemory);$('reflectionRetry').addEventListener('click',retryReflection);$('reflectionCheck').addEventListener('click',checkReflection);
  $('reflectionSound').addEventListener('click',()=>$('soundToggle').click());$('soundToggle').addEventListener('click',syncClosureSound);$('reflectionFullscreen').addEventListener('click',()=>$('fullscreenToggle').click());
  $('missionRewardBack').addEventListener('click', () => {
    if (maybeOpenTrophy()) return;
    if (rewardMission === 3 || rewardMission >= 5) openAtlas();
    else returnRewardToIsland();
  });
  $('missionCollectionToggle').addEventListener('click',()=>{renderMissionCollection();$('missionCollection').hidden=!$('missionCollection').hidden;});
  $('missionCollectionClose').addEventListener('click',()=>{$('missionCollection').hidden=true;$('missionCollectionToggle').focus();});$('missionReplay').addEventListener('click',replayMissionOne);
  document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(current==='reflectionView'){event.preventDefault();openMemory();}});
  window.addEventListener('resize',clearReflectionDrag);
  window.addEventListener('pagehide',()=>{stopReflection();stopMissionReward();});

  const missionNames = ['Bangun Pagi', 'Beribadah', 'Berolahraga', 'Gemar Belajar', 'Makan Sehat dan Bergizi', 'Bermasyarakat', 'Tidur Cepat'];
  const missionIsland = id => id <= 3 ? 'morning' : id === 4 ? 'learning' : 'friendship';
  const missionAssets = 'assets/images/missions/';
  const worshipAssets = missionAssets + 'mission-02-beribadah/';
  const item = (name, image, crop) => ({ name, image, crop });
  const question = (prompt, answer, ...others) => ({ prompt, answer, options: [answer, ...others] });
  const activityProgress = morningProgress.activities || {};
  morningProgress.activities = activityProgress;
  let activeActivity = 2;
  let rewardMission = 1;

  const equipmentArt = {
    Sajadah: '<rect x="18" y="8" width="84" height="104" rx="8" fill="#167760"/><path d="M32 96V50L60 23l28 27v46Z" fill="#ffd87a"/><path d="M38 105h44M38 15h44" stroke="#fff1b0" stroke-width="5"/>',
    Mukena: '<path d="M60 12c-18 0-25 19-30 37L13 100q47 18 94 0L90 49C85 31 78 12 60 12Z" fill="#f0a9cb" stroke="#843657" stroke-width="4"/><ellipse cx="60" cy="43" rx="15" ry="20" fill="#fff2d4"/><path d="M22 94q38 13 76 0" fill="none" stroke="#fff4fa" stroke-width="5"/>',
    Peci: '<path d="M24 84l7-41q29-20 58 0l7 41q-36 19-72 0Z" fill="#374660" stroke="#1e2b44" stroke-width="4"/><path d="M27 73q33 13 66 0" fill="none" stroke="#e2b758" stroke-width="7"/>'
  };
  const schoolObjects = missionAssets + 'mission-04-gemar-belajar/dunia-kata/susun-huruf-kata/';
  const ball = item('Bola', schoolObjects + 'bola.png');
  const pencil = item('Pensil', schoolObjects + 'pensil.png');
  const book = item('Buku', schoolObjects + 'buku.png');
  const worship = (name, file) => item(name, worshipAssets + 'mengenal-ibadah/' + file);
  const pray = worship('Berdoa', 'card-anak-anak-berdoa-puffy.png');
  const salat = worship('Salat berjamaah', 'card-anak-salat-berjamaah-puffy.png');
  const recite = worship('Mengaji bersama', 'card-keluarga-mengaji-puffy.png');
  const play = worship('Bermain', 'card-anak-bermain-puffy.png');
  const tv = worship('Menonton TV', 'card-anak-menonton-tv-puffy.png');
  const sport = (name, file) => item(name, missionAssets + 'mission-03-berolahraga/kenali-olahraga/cards/card-' + file + '-02.png');
  const runCard = sport('Berlari', 'berlari');
  const swim = sport('Berenang', 'berenang');
  const cycle = sport('Bersepeda', 'bersepeda');
  const habitat = (name, file) => item(name, missionAssets + 'mission-04-gemar-belajar/dunia-hewan/dimana-tinggalnya/habitat-' + file + '.png');
  const water = habitat('Air', 'air');
  const forest = habitat('Hutan', 'hutan');
  const barn = habitat('Kandang', 'kandang');
  const poster = (name, file, crop) => item(name, 'assets/images/yuk-belajar/' + file, crop);
  const food = (name, crop) => poster(name, 'belajar-5-makan-sehat.jpeg', crop);
  const sleep = (name, crop) => poster(name, 'belajar-7-tidur-cepat.jpeg', crop);
  const breakfast = food('Sarapan', '949 240 184 151');
  const fruit = food('Buah dan sayur', '1146 240 186 151');
  const drink = food('Air putih', '1349 240 190 151');
  const tidy = sleep('Merapikan mainan', '969 242 181 147');
  const bedtimePrayer = sleep('Berdoa sebelum tidur', '1360 242 185 147');
  const rest = sleep('Tidur di tempat tidur', '1163 464 185 148');
  const community = (name, file) => item(name, missionAssets + 'mission-06-bermasyarakat/' + file + '.jpeg');
  const helpFriend = community('Menolong teman', 'menolong_teman_01');
  const helpParent = community('Membantu orang tua', 'membantu_orang_tua_02');
  const trash = community('Membuang sampah pada tempatnya', 'membuang_sampah_benar_03');
  const grabToy = community('Berebut mainan', 'berebut_mainan_05');

  const missions = {
    2: [
      { title: 'Mengenal Kegiatan Ibadah', questions: [
        question('Mana gambar anak sedang berdoa?', pray, play, tv),
        question('Mana gambar anak salat bersama?', salat, tv, play),
        question('Mana gambar keluarga sedang mengaji?', recite, pray, salat)
      ] }
    ],
    3: [{ title: 'Kenali Olahraga', questions: [
      question('Mana gambar anak berlari?', runCard, tv, cycle),
      question('Mana olahraga yang dilakukan di air?', swim, cycle, runCard),
      question('Mana olahraga yang memakai sepeda?', cycle, swim, runCard)
    ] }],
    4: [{ title: 'Di Mana Hewan Tinggal?', questions: [
      question('Di mana ikan berenang?', water, forest, barn),
      question('Di mana monyet hidup di alam?', forest, barn, water),
      question('Di mana sapi di peternakan beristirahat?', barn, water, forest)
    ] }],
    5: [{ title: 'Pilihan Sehat', questions: [
      question('Mana gambar anak sedang sarapan?', breakfast, drink, fruit),
      question('Mana gambar anak makan buah dan sayur?', fruit, breakfast, drink),
      question('Mana yang diminum saat haus?', drink, fruit, breakfast)
    ] }],
    6: [{ title: 'Saling Membantu', questions: [
      question('Mana gambar anak menolong temannya?', helpFriend, grabToy, trash),
      question('Mana gambar anak membantu orang tua?', helpParent, helpFriend, grabToy),
      question('Mana cara menjaga lingkungan tetap bersih?', trash, helpParent, grabToy)
    ] }],
    7: [{ title: 'Siap Tidur', questions: [
      question('Mana gambar anak merapikan mainan sebelum tidur?', tidy, rest, bedtimePrayer),
      question('Mana gambar anak berdoa sebelum tidur?', bedtimePrayer, tidy, rest),
      question('Di mana anak beristirahat dengan nyaman?', rest, bedtimePrayer, tidy)
    ] }]
  };

  function markMissionStarted(id) {
    const record = missionCollection.missions[id];
    if (!record.starEarned) record.status = 'SEDANG DIKERJAKAN';
    saveClosureProgress();
  }

  function completeMission(id, activities) {
    const record = missionCollection.missions[id];
    const newlyEarned = !record.starEarned;
    if (newlyEarned) record.earnedAt = new Date().toISOString();
    record.starEarned = true;
    record.status = 'SELESAI';
    record.activities = activities;
    if (id === 1) morningProgress.nextStage = 'mission-complete';
    if (newlyEarned && allMissionsEarned() && morningProgress.finalTrophy !== 'shown') morningProgress.finalTrophy = 'pending';
    saveClosureProgress();
  }

  function activityQuestions(id) {
    const stages = missions[id];
    return stages.flatMap(stage => stage.questions.map(entry => ({ ...entry, stage: stage.title })));
  }

  function activityPicture(option) {
    if (option.image && !option.crop) {
      const image = document.createElement('img');
      image.src = option.image;
      image.alt = '';
      return image;
    }
    const ns = 'http://www.w3.org/2000/svg';
    const graphic = document.createElementNS(ns, 'svg');
    graphic.setAttribute('aria-hidden', 'true');
    graphic.setAttribute('viewBox', option.crop || '0 0 120 120');
    if (option.crop) {
      const image = document.createElementNS(ns, 'image');
      image.setAttribute('href', option.image);
      image.setAttribute('width', '1600');
      image.setAttribute('height', '900');
      graphic.appendChild(image);
    } else {
      graphic.innerHTML = equipmentArt[option.name];
    }
    return graphic;
  }

  function openActivity(id) {
    if (id === 3) { openSport(); return; }
    if (id === 5) { openKitchen(); return; }
    if (id === 6 || id === 7) { openIslandChallenge(id); return; }
    if (id === 4) {
      openBookShelf();
      return;
    }
    activeActivity = id;
    if (id === 2) {
      activityProgress['worship-matches'] ??= 0;
      const previous = activityProgress[2] || 0;
      activityProgress['worship-activities'] ??= previous >= 3 ? 21 : previous === 2 ? 5 : previous === 1 ? 1 : 0;
    }
    selectBookPanel('game');
    $('activityBack').textContent = 'Kembali ke pulau';
    markMissionStarted(id);
    show('activityView');
    $('activityFeedback').textContent = '';
    const background = id === 2 ? worshipAssets + 'background/bg-misi-2-beribadah.jpeg' : atlasPages[missionIsland(id)].src;
    $('activityView').style.backgroundImage = 'url("' + background + '")';
    $('activityTitle').textContent = 'Misi ' + id + ' · ' + missionNames[id - 1];
    renderActivity();
    if ($('worshipMatch').hidden) $('activityTitle').focus();
  }

  function renderActivity() {
    const id = activeActivity;
    const questions = activityQuestions(id);
    const key = id;
    if (id === 2 && activityProgress[id] !== 4) {
      renderWorshipMatching();
      return;
    }
    $('worshipMatch').hidden = true;
    $('activityPanel').hidden = false;
    const position = Math.min(activityProgress[key] || 0, questions.length);
    const entry = questions[position];
    $('activityOptions').replaceChildren();
    $('activityCounter').textContent = position + '/' + questions.length;
    $('activityReward').hidden = Boolean(entry);
    $('activityRetry').hidden = Boolean(entry);
    if (!entry) {
      $('activityStage').textContent = 'Misi selesai!';
      $('activityPrompt').textContent = 'Hebat! Kamu sudah menemukan semua jawaban.';
      return;
    }
    $('activityStage').textContent = entry.stage;
    $('activityPrompt').textContent = entry.prompt;
    const rotation = (position + id) % entry.options.length;
    const options = [...entry.options.slice(rotation), ...entry.options.slice(0, rotation)];
    for (const option of options) {
      const button = document.createElement('button');
      const label = document.createElement('span');
      label.textContent = option.name;
      button.appendChild(activityPicture(option));
      button.appendChild(label);
      button.addEventListener('click', () => {
        if (current !== 'activityView' || activeActivity !== id || bookPanel !== 'game' || (activityProgress[key] || 0) !== position) return;
        if (option !== entry.answer) {
          $('activityFeedback').textContent = 'Coba lihat gambarnya lagi. Kamu boleh mencoba kembali!';
          return;
        }
        activityProgress[key] = position + 1;
        if (id === 2) {
          if (position + 1 === questions.length) missionCollection.missions[2].activities[entry.stage] = true;
          saveMorningProgress();
        } else if (position + 1 === questions.length) {
          const proof = Object.fromEntries(missions[id].map(stage => [stage.title, true]));
          completeMission(id, proof);
        } else {
          saveMorningProgress();
        }
        renderActivity();
        $('activityFeedback').textContent = 'Bagus, jawabannya tepat!';
        if ($('worshipMatch').hidden) $('activityPrompt').focus({preventScroll:true});
      });
      $('activityOptions').appendChild(button);
    }
  }

  function returnFromActivity() {
    if (activeActivity === 4 && bookPanel !== 'shelf') {
      openBookShelf();
      return;
    }
    show('atlasView');
    renderAtlas(missionIsland(activeActivity));
  }

  function addIslandCards() {
    const lists = { learning: $('learningMissions'), friendship: $('friendshipMissions') };
    const files = ['gemar-belajar', 'makan-sehat-bergizi', 'bermasyarakat', 'tidur-cepat'];
    files.forEach((file, index) => {
      const id = index + 4;
      const button = document.createElement('button');
      const image = document.createElement('img');
      button.className = 'morning-card';
      image.src = 'assets/images/mission-cards/mission-0' + id + '-' + file + '.png';
      image.alt = 'Misi ' + id + ' · ' + missionNames[id - 1];
      button.appendChild(image);
      button.addEventListener('click', () => openActivity(id));
      lists[missionIsland(id)].appendChild(button);
    });
  }

  function resetPlayerProgress() {
    stopMaze();
    stopPuzzle();
    stopMemory();
    stopReflection();
    stopMissionReward();
    morningProgress.maze = {complete:false};
    Object.assign(puzzleState, {order:null, placed:0, complete:false, moves:0});
    Object.assign(memoryState, {deck:null, matched:[], complete:false});
    delete memoryState.completedAt;
    Object.assign(reflectionState, {bankOrder:shuffledPuzzle(), slots:[null,null,null,null], complete:false});
    for (const id of Object.keys(activityProgress)) delete activityProgress[id];
    missionCollection.missions = normalizeMissionCollection(null).missions;
    morningProgress.nextStage = 'maze';
    delete morningProgress.finalTrophy;
    morningProgress.playerSession = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    saveMorningProgress(true);
    renderMissionCollection();
    $('newPlayerDialog').close();
    openAtlas();
    if (!puzzleStorageAvailable) notice('Sesi baru dimulai. Penyimpanan perangkat belum dapat digunakan.');
  }

  $('newPlayerButton').addEventListener('click', () => $('newPlayerDialog').showModal());
  $('cancelNewPlayer').addEventListener('click', () => $('newPlayerDialog').close());
  $('confirmNewPlayer').addEventListener('click', resetPlayerProgress);
  $('activityBack').addEventListener('click', returnFromActivity);
  $('activityFullscreen').addEventListener('click', () => $('fullscreenToggle').click());
  $('activityReward').addEventListener('click', () => openMissionReward(activeActivity));
  $('activityRetry').addEventListener('click', () => {
    activityProgress[activeActivity] = 0;
    if (activeActivity === 2) { activityProgress['worship-matches'] = 0; activityProgress['worship-activities'] = 0; }
    saveMorningProgress();
    $('activityFeedback').textContent = '';
    renderActivity();
    $('activityPrompt').focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && current === 'activityView' && !$('bookAnswer').open) returnFromActivity();
  });
  const learningAssets = missionAssets + 'mission-04-gemar-belajar/';
  const books = { hewan: {name: 'Dunia Hewan'}, angka: {name: 'Dunia Angka'}, kata: {name: 'Dunia Kata'} };
  let activeBook = 'hewan';
  let bookPanel = 'game';
  const bookNames = ['hewan', 'angka', 'kata'];

  function migrateBookProgress(raw, progress) {
    const record = progress.collection.missions[4];
    const legacySteps = progress.activities[4] || 0;
    delete progress.activities[4];
    for (const name of ['hewan', 'angka', 'kata']) {
      const gameKey = 'book-game-' + name;
      const round = raw.activities?.[gameKey];
      const maxRound = {hewan: 1, angka: 2, kata: 9}[name];
      if (!Number.isInteger(round) || round < 0 || round > maxRound) continue;
      progress.activities[gameKey] = round;
      const harvestRound = raw.activities['book-game-angka-harvest'];
      if (name === 'angka' && round === 0 && Number.isInteger(harvestRound) && harvestRound >= 0 && harvestRound <= 2) {
        progress.activities['book-game-angka-harvest'] = harvestRound;
      }
      const work = raw.activities[gameKey + '-work'];
      const maxWork = name === 'hewan' ? 7 : name === 'angka' ? (round ? 2 : 63) : (round ? 1 : 15);
      if (round < maxRound && Number.isInteger(work) && work >= 0 && work <= maxWork) {
        progress.activities[gameKey + '-work'] = work;
      }
    }
    captureBookEvidence(progress.activities, record.activities);
    // The earlier version only had the animal activity, even when it awarded a mission star.
    if (record.activities['Di Mana Hewan Tinggal?'] || legacySteps === 3 || raw.activities?.['book-hewan'] === 3) record.activities.hewan = true;
    delete record.activities['Di Mana Hewan Tinggal?'];
    if (!['hewan', 'angka', 'kata'].every(name => record.activities[name] === true)) {
      record.starEarned = false;
      delete record.earnedAt;
      if (record.status === 'SELESAI' || legacySteps || record.activities.hewan) record.status = 'SEDANG DIKERJAKAN';
    }
  }

  function completedBookCount() {
    return bookNames.filter(name => missionCollection.missions[4].activities[name] === true).length;
  }

  function selectBookPanel(panel) {
    bookPanel = panel;
    $('activityPanel').hidden = panel !== 'game';
    $('bookShelf').hidden = panel !== 'shelf';
    $('bookGame').hidden = panel !== 'challenge';
    if (panel !== 'challenge') $('bookGame').classList.remove('book-harvest');
    if (panel !== 'challenge') {
      bookLineObserver?.disconnect();
      bookLineObserver = null;
      $('bookGameBoard').replaceChildren();
    }
    $('bookCelebration').hidden = panel !== 'celebration';
  }

  function openBookShelf() {
    activeActivity = 4;
    stopClosureAudio();
    selectBookPanel('shelf');
    show('activityView');
    $('activityView').style.backgroundImage = 'url("' + learningAssets + 'background/bg-misi-4.png")';
    const done = completedBookCount();
    $('bookCounter').textContent = done + '/3 buku selesai';
    $('bookMainReward').hidden = !missionCollection.missions[4].starEarned || done !== 3;
    $('bookChoices').replaceChildren();
    for (const name of bookNames) {
      const button = document.createElement('button');
      const image = document.createElement('img');
      const label = document.createElement('span');
      const complete = missionCollection.missions[4].activities[name] === true;
      image.src = learningAssets + 'buku-ajaib/buku-ajaib-dunia-' + name + '.png';
      image.alt = 'Buku ' + books[name].name;
      label.textContent = complete ? 'SELESAI · MAIN LAGI' : 'BELUM SELESAI';
      button.append(image, label);
      button.dataset.book = name;
      button.addEventListener('click', () => openBookGame(name));
      $('bookChoices').appendChild(button);
    }
    $('bookShelfTitle').focus();
  }

  function finishBook(name) {
    const record = missionCollection.missions[4];
    record.activities[name] = true;
    const newStar = completedBookCount() === 3 && !record.starEarned;
    if (newStar) completeMission(4, record.activities);
    else saveMorningProgress();
    selectBookPanel('celebration');
    $('bookPraise').textContent = 'Hebat! Kamu selesai menjelajahi Buku ' + books[name].name + '!';
    $('bookCelebrationCounter').textContent = completedBookCount() + '/3 buku selesai';
    $('bookContinue').dataset.mainReward = String(newStar);
    const confetti = $('bookConfetti');
    confetti.replaceChildren();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let index = 0; index < 16; index++) {
        const piece = document.createElement('i');
        piece.style.left = (4 + index * 6) + '%';
        piece.style.backgroundColor = ['#ffd46a', '#e98db6', '#7fceb8'][index % 3];
        piece.style.animationDelay = (index % 4) * .07 + 's';
        confetti.appendChild(piece);
      }
    }
    closureEffect('success');
    $('bookContinue').focus();
  }

  $('bookShelfBack').addEventListener('click', returnFromActivity);
  $('bookMainReward').addEventListener('click', () => openMissionReward(4));
  $('bookContinue').addEventListener('click', () => {
    const mainReward = $('bookContinue').dataset.mainReward === 'true';
    openBookShelf();
    if (mainReward) $('bookMainReward').focus();
  });


  const bookGames = {
    hewan: ['habitat'],
    angka: ['panen', 'pola'],
    kata: ['tempat', ...Array(8).fill('ejaan')]
  };
  const harvestAssets = 'dunia-angka/berapa-jumlahnya/ayo-memanen-buah/';
  const patternAssets = 'dunia-angka/temukan-polanya/';
  const spellingAssets = 'dunia-kata/susun-huruf-kata/';
  const spellingCards = [
    ['balok.png', [...'BALOK']], ['bola.png', [...'BOLA']],
    ['buku.png', [...'BUKU']], ['pensil.png', [...'PENSIL']],
    ['bola.png', ['BO', 'LA']], ['buku.png', ['BU', 'KU']],
    ['card-roti.jpeg', ['RO', 'TI']],
    ['card-kupu.jpeg', ['KU', 'PU', 'KU', 'PU']]
  ];
  const bookTileArt = {
    B: 'card-huruf-b.png', O: 'card-huruf-o.png', L: 'card-huruf-l.png', A: 'card-huruf-a.png',
    BO: 'card-bo.png', LA: 'card-la.png'
  };
  let bookLineObserver = null;
  const bookStateKey = () => 'book-game-' + activeBook;
  const bookRound = () => activityProgress[bookStateKey()] || 0;

  function bookShuffle(values) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function bookImage(path, alt = '') {
    const image = document.createElement('img');
    image.src = learningAssets + path;
    image.alt = alt;
    image.draggable = false;
    return image;
  }

  function bookButton(label, action, image) {
    const button = document.createElement('button');
    button.type = 'button';
    if (image) {
      button.setAttribute('aria-label', label);
      button.append(image);
    } else {
      button.textContent = label;
    }
    if (action) button.addEventListener('click', action);
    return button;
  }

  function bookFeedback(text) {
    $('bookGameFeedback').textContent = text;
  }

  function openBookGame(name) {
    activeBook = name;
    if (bookRound() === bookGames[name].length) {
      activityProgress[bookStateKey()] = 0;
      activityProgress[bookStateKey() + '-work'] = 0;
      saveMorningProgress();
    }
    activityProgress[bookStateKey()] = bookRound();
    markMissionStarted(4);
    renderBookGame();
  }

  function renderBookGame() {
    const round = bookRound();
    const type = bookGames[activeBook][round];
    const board = $('bookGameBoard');
    bookLineObserver?.disconnect();
    bookLineObserver = null;
    selectBookPanel('challenge');
    $('bookGame').classList.toggle('book-harvest', type === 'panen');
    $('bookGameTitle').textContent = books[activeBook].name;
    $('bookGameNext').hidden = true;
    $('bookGameNext').onclick = null;
    board.replaceChildren();
    board.style.backgroundImage = '';
    board.className = 'book-game-board book-game-' + type;
    bookFeedback('');
    if (type === 'habitat' || type === 'tempat') renderBookPairs(board, type === 'tempat');
    else if (type === 'panen') renderBookHarvest(board);
    else if (type === 'pola') renderBookPattern(board);
    else renderBookSpelling(board, round - 1);
    $('bookGameTitle').focus({preventScroll: true});
  }

  function bookReady(message) {
    bookFeedback(message);
    const next = $('bookGameNext');
    next.hidden = false;
    next.textContent = bookRound() + 1 === bookGames[activeBook].length ? 'LIHAT REWARD BUKU' : 'LANJUT';
    next.onclick = () => {
      next.onclick = null;
      activityProgress[bookStateKey()] = bookRound() + 1;
      delete activityProgress[bookStateKey() + '-work'];
      if (bookRound() === bookGames[activeBook].length) finishBook(activeBook);
      else {
        saveMorningProgress();
        renderBookGame();
      }
    };
  }

  // Use the same hit testing for mouse, touch and pen. Keyboard activation uses click.
  function bookDrag(source, onTap, onDrop, onMove = () => {}) {
    let drag = null;
    let ghost = null;
    function clearDrag() {
      drag = null;
      ghost?.remove();
      ghost = null;
      source.classList.remove('dragging');
      onMove(null);
    }
    source.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY, moved: false};
      source.setPointerCapture(event.pointerId);
    });
    source.addEventListener('pointermove', event => {
      if (drag?.id !== event.pointerId) return;
      drag.moved ||= Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8;
      if (drag.moved) {
        if (!ghost && !source.closest('.book-game-tempat')) {
          const bounds = source.getBoundingClientRect();
          ghost = document.createElement('div');
          ghost.className = 'book-drag-preview';
          ghost.setAttribute('aria-hidden', 'true');
          ghost.style.width = bounds.width + 'px';
          ghost.style.height = bounds.height + 'px';
          ghost.append(...[...source.childNodes].map(node => node.cloneNode(true)));
          document.body.append(ghost);
        }
        if (ghost) {
          ghost.style.left = event.clientX + 'px';
          ghost.style.top = event.clientY + 'px';
        }
        source.classList.add('dragging');
        onMove(event);
      }
    });
    source.addEventListener('pointerup', event => {
      if (drag?.id !== event.pointerId) return;
      const moved = drag.moved;
      clearDrag();
      if (moved) onDrop(document.elementFromPoint(event.clientX, event.clientY));
      else onTap();
    });
    source.addEventListener('lostpointercapture', clearDrag);
    source.addEventListener('pointercancel', clearDrag);
    source.addEventListener('click', event => {
      if (event.detail === 0) onTap();
    });
    return () => {
      const pointer = drag?.id;
      clearDrag();
      if (pointer !== undefined && source.hasPointerCapture(pointer)) source.releasePointerCapture(pointer);
    };
  }

  function renderBookPairs(board, lines) {
    const pairs = lines ? [
      ['Buku', 'Rak Buku', 'buku.png', 'rak-buku.png'],
      ['Pensil', 'Tempat Pensil', 'pensil.png', 'tempat-pensil.png'],
      ['Bola', 'Keranjang Bola', 'bola.png', 'keranjang-bola.png'],
      ['Balok', 'Keranjang Balok', 'balok.png', 'keranjang-balok.png']
    ] : [
      ['Ikan', 'Air', 'card-ikan.png', 'habitat-air.png'],
      ['Monyet', 'Hutan', 'card-monyet.png', 'habitat-hutan.png'],
      ['Sapi', 'Kandang', 'card-sapi.png', 'habitat-kandang.png']
    ];
    const folder = lines ? 'dunia-kata/dimana-tempatnya/' : 'dunia-hewan/dimana-tinggalnya/';
    const instruction = lines ? 'Tarik garis dari benda ke tempatnya.' : 'Seret hewan ke tempat tinggalnya.';
    $('bookGamePrompt').textContent = instruction + ' Kamu juga bisa mengetuk dua gambar.';
    $('bookGameStage').textContent = lines ? 'DI MANA TEMPATNYA?' : 'DI MANA TEMPAT TINGGALNYA?';
    const workKey = bookStateKey() + '-work';
    let matched = activityProgress[workKey] || 0;
    let selected = -1;
    const all = (1 << pairs.length) - 1;
    const sources = document.createElement('div');
    const targets = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    board.append(sources, svg, targets);
    svg.classList.add('book-pair-lines');
    const left = [], right = [];
    const matchedLines = pairs.map(() => document.createElementNS(svg.namespaceURI, 'line'));
    const liveLine = document.createElementNS(svg.namespaceURI, 'line');
    if (lines) svg.append(...matchedLines);
    svg.append(liveLine);

    function draw(line, source, target, point) {
      line.style.display = source ? '' : 'none';
      if (!source) return;
      const bounds = svg.getBoundingClientRect();
      const from = source.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      line.setAttribute('x1', from.right - bounds.left);
      line.setAttribute('y1', from.top + from.height / 2 - bounds.top);
      line.setAttribute('x2', (to?.left ?? point.clientX) - bounds.left);
      line.setAttribute('y2', (to ? to.top + to.height / 2 : point.clientY) - bounds.top);
    }

    function refresh() {
      pairs.forEach((_, index) => {
        const done = Boolean(matched & (1 << index));
        left[index].disabled = right[index].disabled = done;
        left[index].classList.toggle('selected', selected === index);
        left[index].classList.toggle('matched', done);
        right[index].classList.toggle('matched', done);
        if (lines) draw(matchedLines[index], done ? left[index] : null, right[index]);
        else if (done && !left[index].hidden) {
          left[index].hidden = true;
          right[index].append(left[index].querySelector('img'));
          right[index].setAttribute('aria-label', pairs[index][0] + ' di ' + pairs[index][1] + ' · Selesai');
        }
      });
      if (matched === all) bookReady(lines ? 'Hebat! Semua pasangan sudah tepat!' : 'BERHASIL! Semua hewan sudah menemukan tempat tinggalnya.');
    }

    function match(source, target) {
      selected = -1;
      if (source === target && !(matched & (1 << source))) {
        matched |= 1 << source;
        activityProgress[workKey] = matched;
        saveMorningProgress();
        if (!lines) closureEffect('book-correct');
        bookFeedback('Bagus! ' + pairs[source][0] + ' cocok dengan ' + pairs[source][1] + '.');
      } else {
        bookFeedback('Belum cocok. Yuk, coba pasangan yang lain!');
      }
      refresh();
    }

    pairs.forEach(([name, , image], index) => {
      const button = bookButton(name, null, bookImage(folder + image));
      sources.append(button);
      left[index] = button;
      bookDrag(button, () => {
        selected = selected === index ? -1 : index;
        refresh();
      }, hit => {
        const target = hit?.closest('[data-book-target]');
        if (target && targets.contains(target) && !target.disabled) match(index, Number(target.dataset.bookTarget));
        else {
          selected = -1;
          refresh();
        }
      }, point => { if (lines) draw(liveLine, point ? button : null, null, point); });
    });
    for (const index of bookShuffle(pairs.map((_, index) => index))) {
      const [, name, , image] = pairs[index];
      const button = bookButton(name, () => {
        if (selected >= 0) match(selected, index);
        else bookFeedback(lines ? 'Pilih gambar di sebelah kiri dulu, ya!' : 'Pilih hewan di baris atas dulu, ya!');
      }, bookImage(folder + image));
      button.dataset.bookTarget = index;
      right[index] = button;
      targets.append(button);
    }
    if (lines) {
      const observer = new ResizeObserver(() => {
        if (!svg.isConnected) {
          observer.disconnect();
          return;
        }
        pairs.forEach((_, index) => {
          draw(matchedLines[index], matched & (1 << index) ? left[index] : null, right[index]);
        });
      });
      observer.observe(board);
      bookLineObserver = observer;
    }
    refresh();
  }

  function bookAction(label, file, action) {
    return bookButton(label, action, bookImage('dunia-kata/' + file));
  }

  let bookAnswerRevision = 0;
  function showBookAnswer(correct, message, onContinue) {
    const dialog = $('bookAnswer');
    dialog.classList.toggle('correct', correct);
    const character = correct ? 'sagi-correct.png' : 'sagi-incorrect.png';
    $('bookAnswerImage').src = learningAssets + 'dunia-kata/characters/' + character;
    $('bookAnswerText').textContent = message;
    $('bookAnswerClose').textContent = correct ? 'LANJUT' : 'COBA LAGI';
    $('bookAnswerClose').onclick = () => dialog.close();
    const revision = ++bookAnswerRevision;
    const onClose = () => {
      if (revision !== bookAnswerRevision) {
        dialog.removeEventListener('close', onClose);
        return;
      }
      if (dialog.open) return;
      dialog.removeEventListener('close', onClose);
      stopClosureAudio();
      onContinue?.();
    };
    dialog.addEventListener('close', onClose);
    dialog.showModal();
    return closureEffect(correct ? 'book-correct' : 'book-incorrect');
  }

  function renderBookHarvest(board) {
    const roundKey = 'book-game-angka-harvest';
    const challenge = activityProgress[roundKey] || 0;
    const target = challenge + 3;
    $('bookGameStage').textContent = 'AYO, MEMANEN BUAH!';
    $('bookGamePrompt').textContent = 'AYO, PANEN ' + target + ' BUAH APEL!';
    board.style.backgroundImage = 'url("' + learningAssets + harvestAssets + 'bg-ayo-memanen-buah.jpeg")';
    const orchard = document.createElement('div');
    const basket = document.createElement('div');
    basket.className = 'book-basket';
    const counter = document.createElement('strong');
    counter.setAttribute('aria-live', 'polite');
    const collected = document.createElement('div');
    collected.className = 'book-collected-apples';
    basket.append(collected, counter);
    const controls = document.createElement('div');
    controls.className = 'book-harvest-controls book-image-actions';
    board.append(orchard, basket, controls);
    const workKey = bookStateKey() + '-work';
    let picked = activityProgress[workKey] || 0;
    const apples = [];
    const positions = [[52, 17], [65, 13], [80, 15], [94, 17], [59, 34], [85, 33]];
    function refresh() {
      const count = apples.filter((_, index) => picked & (1 << index)).length;
      counter.textContent = 'Keranjang · ' + count + '/' + target;
      apples.forEach((apple, index) => {
        const harvested = Boolean(picked & (1 << index));
        if (harvested && !apple.hidden) {
          apple.hidden = true;
          collected.append(apple.querySelector('img'));
        }
        apple.disabled = harvested;
      });

    }
    positions.forEach(([x, y], index) => {
      const apple = bookButton('Apel ' + (index + 1), null, bookImage(harvestAssets + 'buah-apel.png'));
      apple.style.left = x + '%';
      apple.style.top = y + '%';
      const pick = () => {
        if (apple.disabled || apple.hidden) return;
        picked |= 1 << index;
        activityProgress[workKey] = picked;
        saveMorningProgress();
        bookFeedback('Bagus! Hitung lagi apel di keranjang, ya.');
        refresh();

      };
      bookDrag(apple, pick, hit => {
        if (hit && basket.contains(hit)) pick();
        else bookFeedback('Bawa apelmu ke keranjang, ya!');
      });
      orchard.append(apple);
      apples.push(apple);
    });
    controls.append(
      bookAction('PERIKSA', 'btn-periksa.png', () => {
        if (collected.childElementCount !== target) {
          showBookAnswer(false, 'Yuk, hitung lagi buahnya! Ketuk ULANGI jika ingin mengosongkan keranjang.');
          return;
        }
        missionCollection.missions[4].activities['harvest-' + target] = true;
        saveMorningProgress();
        showBookAnswer(true, 'Hebat! Kamu memanen tepat ' + target + ' apel!', () => {
          delete activityProgress[workKey];
          if (challenge === 2) {
            delete activityProgress[roundKey];
            bookReady('Hebat! Ketiga tantangan panen selesai.');
            $('bookGameNext').click();
          } else {
            activityProgress[roundKey] = challenge + 1;
            saveMorningProgress();
            renderBookGame();
          }
        });
      }),
      bookAction('ULANGI', 'btn-ulangi.png', () => {
        delete activityProgress[workKey];
        saveMorningProgress();
        renderBookGame();
      })
    );
    refresh();
  }

  function renderBookPattern(board) {
    const workKey = bookStateKey() + '-work';
    const solved = activityProgress[workKey] || 0;
    const sequence = solved === 0 ? [0, 1, 0] : [0, 0, 1, 0, 0];
    const row = document.createElement('div');
    const choices = document.createElement('div');
    const image = (index, alt) => bookImage(patternAssets + ['card-bintang.png', 'card-hati.png', 'card-tanda-tanya.png'][index], alt);
    $('bookGameStage').textContent = 'TENTUKAN POLANYA';
    $('bookGamePrompt').textContent = 'Gambar apa yang mengisi tanda tanya?';
    const equals = document.createElement('span');
    equals.className = 'book-pattern-equals';
    equals.textContent = '=';
    row.append(...sequence.map(index => image(index, ['Bintang', 'Hati'][index])), equals,
      image(solved === 2 ? 1 : 2, solved === 2 ? 'Hati' : 'Tanda tanya'));
    board.append(row, choices);
    let selected = null;
    const check = bookButton('PERIKSA', () => {
      if (selected === null) {
        bookFeedback('Pilih satu gambar dulu, ya!');
        return;
      }
      if (selected !== 1) {
        bookFeedback('Coba lihat urutan gambar dari awal, ya!');
        return;
      }
      activityProgress[workKey] = solved + 1;
      saveMorningProgress();
      renderBookGame();
      if (!solved) bookFeedback('Tepat! Sekarang coba pola yang baru.');
    }, bookImage('dunia-kata/btn-periksa.png'));
    check.className = 'book-pattern-check';
    for (const index of [0, 1]) {
      const button = bookButton(['Bintang', 'Hati'][index], () => {
        selected = index;
        [...choices.children].forEach((choice, position) => {
          choice.classList.toggle('selected', position === index);
          choice.setAttribute('aria-pressed', String(position === index));
        });
      }, image(index));
      button.setAttribute('aria-pressed', 'false');
      button.disabled = solved === 2;
      choices.append(button);
    }
    if (solved !== 2) board.append(check);
    if (solved === 2) bookReady('Bagus! Kamu berhasil melengkapi dua pola!');
  }

  function renderBookSpelling(board, index) {
    const [asset, answer] = spellingCards[index];
    const workKey = bookStateKey() + '-work';
    let solved = activityProgress[workKey] === 1;
    const order = bookShuffle(answer.map((_, tile) => tile));
    if (order.every((tile, position) => answer[tile] === answer[position])) order.push(order.shift());
    const slots = solved ? answer.map((_, tile) => tile) : answer.map(() => null);
    let selected = null;
    const row = document.createElement('div');
    const bank = document.createElement('div');
    const tileButtons = [];
    const slotButtons = [];
    $('bookGameStage').textContent = index < 4 ? 'LEVEL 1 · SEMPURNAKAN HURUFNYA' : 'LEVEL 2 · SEMPURNAKAN SUKU KATA';
    $('bookGamePrompt').textContent = 'Lihat contoh, lalu susun kepingan.';
    const example = document.createElement('strong');
    example.className = 'book-spelling-example';
    example.textContent = answer.join(index < 4 ? '' : ' – ');
    board.append(bookImage(spellingAssets + asset, answer.join('')), example, row, bank);
    const check = bookAction('PERIKSA', 'btn-periksa.png', () => {
      if (!slots.every((tile, position) => tile !== null && answer[tile] === answer[position])) {
        showBookAnswer(false, 'Cocokkan lagi kepingannya dengan contoh, ya!');
        return;
      }
      solved = true;
      activityProgress[workKey] = 1;
      saveMorningProgress();
      refresh();
      showBookAnswer(true, 'Hebat! Susunanmu sudah tepat!', () => $('bookGameNext').click());
    });
    const retry = bookAction('ULANGI', 'btn-ulangi.png', renderBookGame);
    const controls = document.createElement('div');
    controls.className = 'book-image-actions';
    controls.append(check, retry);
    board.append(controls);

    function refresh() {
      slotButtons.forEach((slot, position) => {
        const tile = slots[position];
        slot.textContent = tile === null ? '·' : answer[tile];
        slot.setAttribute('aria-label', 'Tempat ' + (position + 1) + ': ' + (tile === null ? 'kosong' : answer[tile]));
        slot.disabled = solved;
      });
      tileButtons.forEach((tile, id) => {
        tile.disabled = solved || slots.includes(id);
        tile.classList.toggle('selected', selected === id);
      });
      controls.hidden = solved;
      if (solved) bookReady('Tepat sekali! Kamu berhasil menyusun kata.');
    }

    function place(tile, position) {
      if (position < 0 || solved || slots.includes(tile)) return;
      slots[position] = tile;
      selected = null;
      refresh();
    }

    answer.forEach((_, position) => {
      const slot = bookButton('', () => {
        if (selected !== null) place(selected, position);
        else if (slots[position] !== null) {
          selected = slots[position];
          slots[position] = null;
          refresh();
        }
      });
      slot.dataset.bookSlot = position;
      row.append(slot);
      slotButtons.push(slot);
    });
    order.forEach(tile => {
      const value = answer[tile];
      const art = bookTileArt[value];
      const button = bookButton(value, null, art ? bookImage(spellingAssets + art) : null);
      button.dataset.bookTile = tile;
      bookDrag(button, () => {
        selected = selected === tile ? null : tile;
        refresh();
      }, hit => {
        const slot = hit?.closest('[data-book-slot]');
        if (slot && row.contains(slot)) place(tile, Number(slot.dataset.bookSlot));
      });
      bank.append(button);
      tileButtons[tile] = button;
    });
    refresh();
  }

  $('bookGameBack').addEventListener('click', returnFromActivity);






  const worshipGameTitle = 'Pilih Perlengkapan Ibadah';
  const worshipActivityTitle = 'Pilih Kegiatan Ibadah';
  const worshipActivities = [
    ['Berdoa','card-anak-anak-berdoa-puffy.png',true], ['Bermain','card-anak-bermain-puffy.png',false],
    ['Salat berjamaah','card-anak-salat-berjamaah-puffy.png',true], ['Menonton TV','card-anak-menonton-tv-puffy.png',false],
    ['Mengaji bersama keluarga','card-keluarga-mengaji-puffy.png',true], ['Berolahraga','card-anak-berolahraga-puffy.png',false]
  ];
  const worshipItems = [
    ['sajadah','Sajadah',45,54], ['mukenah','Mukena',29,47],
    ['alquran','Al-Qur’an',61,48], ['tasbih','Tasbih',58,72], ['kopyah','Kopiah',72,52],
    ['mobil','Mobil mainan',39,73], ['boneka','Boneka',77,73], ['tas','Tas',89,56]
  ];
  const worshipMaskKey = 'worship-matches';
  const worshipAll = 31;
  const worshipActivitiesKey = 'worship-activities';
  const worshipActivitiesAll = 21;

  function renderWorshipMatching() {
    const panel = $('worshipMatch'), board = $('worshipBoard');
    const equipment = activityProgress[2] >= 3;
    const key = equipment ? worshipMaskKey : worshipActivitiesKey;
    const all = equipment ? worshipAll : worshipActivitiesAll;
    const total = equipment ? 5 : 3;
    let mask = activityProgress[key] || 0;
    let selected = null;
    $('activityPanel').hidden = true;
    panel.hidden = false;
    panel.dataset.phase = equipment ? 'equipment' : 'activities';
    $('worshipHeading').textContent = equipment ? worshipGameTitle : worshipActivityTitle;
    board.replaceChildren();
    $('worshipPick').hidden = equipment;
    const next = $('worshipNext');
    next.classList.toggle('worship-hotspot',!equipment);
    next.setAttribute('aria-label',equipment ? 'Selesai' : 'Lanjut');
    next.querySelector('img').hidden = !equipment;
    const cards = equipment ? worshipItems.map(([id,label,x,y],index) =>
      [label,'pilih-perlengkapan-ibadah/image/btn-'+id+'.png',index<5,x,y]) :
      worshipActivities.map(([label,file,correct]) => [label,'mengenal-ibadah/'+file,correct]);
    const nodes = cards.map(([label,path,correct,x,y],index) => {
      const image = kitchenImage(worshipAssets+path);
      const button = bookButton(label,() => {
        if ($('bookAnswer').open || button.disabled) return;
        if (equipment) check(index);
        else {
          selected = selected === index ? null : index;
          refresh();
        }
      },image);
      button.dataset.worshipCard = index;
      if (equipment) {
        button.className='worship-item';
        button.style.left=x+'%';
        button.style.top=y+'%';
      }
      const tick=document.createElement('b');
      tick.className='worship-choice-tick';
      tick.textContent='✓';
      tick.setAttribute('aria-hidden','true');
      button.append(tick);
      board.append(button);
      return button;
    });

    function refresh() {
      let count=0;
      nodes.forEach((button,index)=>{
        const found=Boolean(mask & (1 << index));
        count+=Number(found);
        button.disabled=found;
        button.classList.toggle('worship-selected',selected===index);
        button.setAttribute('aria-pressed',String(selected===index||found));
        if(equipment && found){
          button.style.left=(32.5+index*14.3)+'%';
          button.style.top='90.5%';
        }
      });
      $('worshipCount').textContent=count+'/'+total;
      next.disabled=mask!==all;
      next.hidden=equipment && mask!==all;
    }

    function check(index) {
      if ($('bookAnswer').open || mask & (1 << index)) return;
      selected=null;
      if (!cards[index][2]) {
        refresh();
        showBookAnswer(false,equipment ? 'Coba pilih benda yang digunakan untuk beribadah, ya!' : 'Coba pilih gambar kegiatan ibadah, ya!');
        return;
      }
      mask |= 1 << index;
      activityProgress[key]=mask;
      if(mask===all)missionCollection.missions[2].activities[equipment ? worshipGameTitle : worshipActivityTitle]=true;
      saveMorningProgress();
      refresh();
      showBookAnswer(true,mask===all ? 'Hebat! Semua pilihan yang tepat sudah ditemukan!' : 'Bagus sekali! Pilihanmu tepat.');
    }
    $('worshipPick').onclick=()=>{
      if(selected!==null)check(selected);
    };
    next.onclick=()=>{
      if(mask!==all || $('bookAnswer').open || activeActivity!==2) return;
      if(!equipment){
        activityProgress[2]=3;
        saveMorningProgress();
        renderWorshipMatching();
        return;
      }
      activityProgress[2]=4;
      const proof=missionCollection.missions[2].activities;
      proof[worshipActivityTitle]=true;
      proof[worshipGameTitle]=true;
      completeMission(2,proof);
      renderActivity();
      openMissionReward(2);
    };
    refresh();
    $('worshipHeading').focus({preventScroll:true});
  }

  $('worshipBack').onclick = returnFromActivity;
  $('worshipHome').onclick = () => $('adventureHome').click();


  const kitchenPath = 'assets/images/missions/mission-05-makan-sehat-dan-bergizi/';
  const kitchenPlate = 'piring-sehatku/';
  const kitchenBasket = 'keranjang-sehatku/';
  const kitchenTitles = ['Isi Piring Sehatku','Keranjang Sehat, Keranjang Batasi'];
  const kitchenFood = {
    nasi: ['Nasi','pokok','card-nasi.png'],
    ikan: ['Ikan','lauk','card-ikan.png','card-ikan-sehat.png'],
    sayur: ['Sayur','sayur','card-sayur.png'],
    buah: ['Buah','buah','card-buah.png'],
    susu: ['Susu','susu','card-susu.png','card-susu-sehat.png'],
    air: ['Air putih','air','card-air-putih.png','card-air-sehat.png'],
    apel: ['Apel','buah',null,'card-apple-sehat.png'],
    wortel: ['Wortel','sayur',null,'card-carrot-sehat.png'],
    telur: ['Telur','lauk',null,'card-telur-sehat.png'],
    snack: ['Camilan kemasan','batasi',null,'card-snack-batasi.png'],
    donat: ['Donat','batasi',null,'card-donat-batasi.png'],
    permen: ['Permen','batasi',null,'card-permen-batasi.png'],
    coklat: ['Cokelat','batasi',null,'card-coklat-batasi.png']
  };
  const kitchenFoods = [
    ['nasi','ikan','sayur','buah','susu','air'],
    ['apel','donat','wortel','permen','telur','ikan','air','coklat','susu','snack']
  ];
  const kitchenSlots = [
    ['pokok','Makanan pokok'],['lauk','Lauk-pauk'],['sayur','Sayur'],['buah','Buah'],
    ['susu','Susu'],['air','Air putih']
  ];
  const kitchenPlateAreas = [[34,44,13,15],[46,44,13,15],[34,61,13,15],[46,61,13,15],[73,43,10,19],[73,63,10,19]];
  let kitchenDragCleanup = [];

  function stopKitchenDrags() {
    kitchenDragCleanup.forEach(cancel => cancel());
    kitchenDragCleanup = [];
  }

  function kitchenImage(path) {
    const img = document.createElement('img');
    img.src = path;
    img.alt = '';
    img.draggable = false;
    return img;
  }

  function kitchenCard(id, basket) {
    const [, , plateFile, basketFile] = kitchenFood[id];
    return kitchenImage(kitchenPath + (basketFile && (basket || !plateFile)
      ? kitchenBasket + 'card-keranjang-sehat/' + basketFile
      : kitchenPlate + 'card-makan-bergizi/' + plateFile));
  }

  const islandActionFolders = {
    5:'mission-05-makan-sehat-dan-bergizi',
    6:'mission-06-bermasyarakat',
    7:'mission-07-tidur-cepat'
  };

  function setIslandAction(button, file, label) {
    button.querySelector('img').src = missionAssets + islandActionFolders[activeActivity] + '/btn-' + file + '.png';
    button.setAttribute('aria-label', label);
  }

  function openKitchen() {
    activeActivity = 5;
    selectBookPanel('game');
    markMissionStarted(5);
    show('activityView');
    renderKitchen();
  }

  function renderKitchen() {
    stopKitchenDrags();
    $('activityPanel').hidden = true;
    const panel = $('kitchenGame');
    const board = $('kitchenBoard');
    panel.hidden = false;
    board.replaceChildren();
    const state = activityProgress.kitchen ??= {step:0, placed:[]};
    // Older saves in either lunch stage already finished the two retained games.
    if (state.step === 2 || state.step === 3) {
      state.step = 1;
      state.placed = kitchenFoods[1].filter(id => id !== 'snack');
    }
    const step = state.step;
    const basket = step === 1;
    panel.dataset.mission = '5';
    panel.setAttribute('aria-label','Misi 5 · Dapur Ajaib SAGI');
    panel.dataset.step = step;
    const heading = $('kitchenTitle');
    heading.textContent = step === 4 ? 'Dapur Ajaib SAGI selesai!' : kitchenTitles[step];
    $('kitchenHint').textContent = step === 4 ? 'Kedua permainan sudah selesai.' : '';
    $('kitchenCount').hidden = step === 4;
    $('kitchenNext').hidden = step !== 4;
    setIslandAction($('kitchenReplay'), 'coba-lagi', 'Coba lagi');
    setIslandAction($('kitchenNext'), step === 4 ? 'lanjutkan-misi' : step === 1 ? 'selesai' : 'lanjut',
      step === 4 ? 'Lihat reward' : step === 1 ? 'Selesaikan misi' : 'Lanjut');
    $('kitchenReplay').hidden = step !== 4;
    $('kitchenNext').onclick = () => {
      if (step === 4) {
        openMissionReward(5);
        return;
      }
      if (state.placed.length !== total) return;
      state.step = basket ? 4 : 1;
      state.placed = [];
      if (basket) {
        completeMission(5, missionCollection.missions[5].activities);
        renderKitchen();
        openMissionReward(5);
      } else {
        saveMorningProgress();
        renderKitchen();
      }
    };
    if (step === 4) return;
    const foods = kitchenFoods[step];
    const slots = basket ? [['sehat','Sehat sehari-hari'],['batasi','Perlu dibatasi']]
      : kitchenSlots;
    const total = basket ? foods.length : slots.length;
    const sources = new Map(), targets = new Map();
    let selected = null;
    if (!basket) {
      const plate = kitchenImage(kitchenPath + kitchenPlate + 'background/piring-sehat.png');
      plate.className = 'kitchen-plate';
      board.append(plate);
    }
    const targetRow = document.createElement('div');
    targetRow.className = 'kitchen-targets';
    const sourceRow = document.createElement('div');
    sourceRow.className = 'kitchen-sources';
    sourceRow.style.setProperty('--food-count', foods.length);
    board.append(targetRow, sourceRow);
    const category = id => basket ? (kitchenFood[id][1] === 'batasi' ? 'batasi' : 'sehat') : kitchenFood[id][1];
    const targetAt = hit => {
      const target = hit?.closest('[data-kitchen-target]');
      return target && targetRow.contains(target) ? target : null;
    };
    slots.forEach(([id,label], index) => {
      const target = bookButton(label, () => { if (selected) drop(selected, target); });
      target.dataset.kitchenTarget = id;
      target.className = 'kitchen-target';
      target.setAttribute('aria-label', label);
      target.textContent = '';
      const inside = document.createElement('span');
      inside.className = 'kitchen-content';
      target.append(inside);
      if (!basket) {
        const [x,y,w,h] = kitchenPlateAreas[index];
        Object.assign(target.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
        if (id === 'susu' || id === 'air') {
          const silhouette = kitchenImage(kitchenPath + kitchenPlate + 'card-makan-bergizi/siluet-' + id + '.png');
          silhouette.className = 'kitchen-silhouette';
          target.prepend(silhouette);
        }
      }
      if (basket) target.style.left = (23 + index * 30) + '%';
      targetRow.append(target);
      targets.set(id, target);
    });
    foods.forEach(id => {
      const source = bookButton(kitchenFood[id][0], null, kitchenCard(id, basket));
      source.dataset.kitchenItem = id;
      sourceRow.append(source);
      sources.set(id, source);
      const cancel = bookDrag(source, () => {
        const previous = selected;
        sources.get(previous)?.classList.remove('kitchen-selected');
        selected = previous === id ? null : id;
        sources.get(selected)?.classList.add('kitchen-selected');
      }, hit => drop(id, targetAt(hit)), event => {
        targetRow.querySelector('.kitchen-over')?.classList.remove('kitchen-over');
        if (event) targetAt(document.elementFromPoint(event.clientX,event.clientY))?.classList.add('kitchen-over');
      });
      kitchenDragCleanup.push(cancel);
    });
    const used = new Set();
    state.placed = state.placed.filter(id => {
      if (!sources.has(id)) return false;
      const key = basket ? id : category(id);
      if (!targets.has(category(id)) || used.has(key)) return false;
      used.add(key);
      return true;
    });
    state.placed.forEach(lock);
    refresh();
    heading.focus({preventScroll:true});

    function lock(id) {
      const source = sources.get(id), target = targets.get(category(id));
      const mark = document.createElement('span');
      mark.className = 'kitchen-placed';
      const check = document.createElement('b');
      check.textContent = '✓';
      check.setAttribute('aria-hidden','true');
      mark.append(source.querySelector('img'),check);
      mark.setAttribute('aria-label', kitchenFood[id][0] + ' terpasang');
      target.querySelector('.kitchen-content').append(mark);
      source.hidden = true;
      source.disabled = true;
      if (!basket) target.disabled = true;
    }

    function refresh() {
      $('kitchenCount').textContent = state.placed.length + '/' + total;
      $('kitchenNext').hidden = state.placed.length !== total;
    }

    function drop(id, target) {
      if (!target || panel.hidden || $('bookAnswer').open || state.placed.includes(id)) return;
      sources.get(selected)?.classList.remove('kitchen-selected');
      selected = null;
      if (target.dataset.kitchenTarget !== category(id) || target.disabled) {
        showBookAnswer(false, 'Belum cocok. Ayo coba tempat yang lain!');
        return;
      }
      state.placed.push(id);
      lock(id);
      const done = state.placed.length === total;
      if (done) {
        const proof = missionCollection.missions[5].activities;
        proof[kitchenTitles[step]] = true;
      }
      saveMorningProgress();
      refresh();
      const messages = ['Hebat! Piring sehatmu sudah lengkap. Jangan lupa minum air putih, ya!',
        'Yeay! Kamu pintar memilih makanan dan minuman. Ayo, makan sehat setiap hari!'];
      showBookAnswer(true, done ? messages[step] : 'Bagus sekali! Pilihanmu cocok.');
    }
  }

  $('kitchenHome').onclick = () => $('adventureHome').click();
  $('kitchenBack').onclick = returnFromActivity;
  $('kitchenFullscreen').onclick = () => $('fullscreenToggle').click();
  $('kitchenReplay').onclick = () => {
    const key = {5:'kitchen',6:'social',7:'night'}[activeActivity];
    activityProgress[key] = {step:0, placed:[]};
    saveMorningProgress();
    if (activeActivity === 5) renderKitchen();
    else renderIslandChallenge();
  };
  window.addEventListener('resize', () => kitchenDragCleanup.forEach(cancel => cancel()));




  const socialRoot = missionAssets + 'mission-06-bermasyarakat/';
  const nightRoot = missionAssets + 'mission-07-tidur-cepat/';
  const socialActions = [
    ['tolong','Menolong teman','baik','pilih-perbuatan-baik/card-ditolong.png'],
    ['rebut','Merebut mainan','tidak','yang-boleh-dan-tidak-boleh/merebut-mainan.jpeg'],
    ['sampah','Membuang sampah pada tempatnya','baik','yang-boleh-dan-tidak-boleh/membuang-sampah.jpeg'],
    ['tawa','Menertawakan teman','tidak','pilih-perbuatan-baik/card-menertawakan-teman.png'],
    ['bantu','Membantu orang tua','baik','yang-boleh-dan-tidak-boleh/membantu-orang-tua.jpeg'],
    ['giliran','Tidak mau bergantian','tidak','yang-boleh-dan-tidak-boleh/tidak-mau-bergantian.jpeg']
  ];
  const socialScene = 'pilih-perbuatan-baik/card-anak-terjatuh.png';
  const socialAnswers = [
    ['ditolong','Menolong teman','pilih-perbuatan-baik/card-ditolong.png'],
    ['menertawakan','Menertawakan teman','pilih-perbuatan-baik/card-menertawakan-teman.png','Ups, jangan menertawakan teman yang terjatuh, ya. Ayo, coba lagi!'],
    ['meninggalkan','Meninggalkan teman','pilih-perbuatan-baik/card-meninggalkan.png','Teman kita membutuhkan bantuan. Yuk, pilih sikap yang lebih baik!']
  ];
  const nightCards = [
    ['mainan','Merapikan mainan','1','card-merapikan-mainan.png'],
    ['gigi','Menggosok gigi','2','card-menggosok-gigi.png'],
    ['doa','Berdoa sebelum tidur','3','card-berdoa-sebelum-tidur.png'],
    ['tidur','Tidur tepat waktu','4','card-tidur.png']
  ];
  const socialBoardTitle = 'Papan Sikap Sahabat';
  const socialQuizTitle = 'Pilih Sikap dalam Situasi';
  const nightTitle = 'Urutkan Kegiatan Sebelum Tidur';

  function openIslandChallenge(id) {
    activeActivity = id;
    selectBookPanel('game');
    markMissionStarted(id);
    show('activityView');
    renderIslandChallenge();
  }

  function finishIslandChallenge(id) {
    completeMission(id, missionCollection.missions[id].activities);
    renderIslandChallenge();
    openMissionReward(id);
  }

  function renderIslandChallenge() {
    stopKitchenDrags();
    const id = activeActivity, social = id === 6;
    const key = social ? 'social' : 'night';
    const state = activityProgress[key] ??= {step:0, placed:[]};
    const proof = missionCollection.missions[id].activities;
    if (social && (state.step === 2 || state.step === 3 || (state.step === 4 && proof[socialQuizTitle] !== true))) {
      state.step = 1;
      state.placed = [];
      state.order = undefined;
    }
    const done = state.step === (social ? 4 : 1);
    const quiz = social && state.step > 0 && !done;
    const panel = $('kitchenGame'), board = $('kitchenBoard'), next = $('kitchenNext');
    $('activityPanel').hidden = true;
    panel.hidden = false;
    panel.dataset.step = done ? 'island-done' : quiz ? 'social-quiz' : social ? 'social-board' : 'night';
    panel.dataset.mission = id;
    panel.setAttribute('aria-label', 'Misi ' + id + ' · ' + missionNames[id-1]);
    board.replaceChildren();
    const title = $('kitchenTitle');
    title.textContent = done ? 'Misi selesai!' : quiz ? socialQuizTitle : social ? socialBoardTitle : nightTitle;
    $('kitchenHint').textContent = done ? 'Hebat, Sahabat!' : quiz ? 'Wah, ada teman yang terjatuh! Apa yang sebaiknya kita lakukan?' : '';
    $('kitchenCount').hidden = done;
    $('kitchenReplay').hidden = !done;
    next.hidden = !done;
    setIslandAction($('kitchenReplay'), 'coba-lagi', 'Coba lagi');
    setIslandAction(next, done ? 'lanjutkan-misi' : quiz || !social ? 'selesai' : 'lanjut',
      done ? 'Lihat reward' : quiz || !social ? 'Selesaikan misi' : 'Lanjut');
    next.onclick = () => openMissionReward(id);
    title.focus({preventScroll:true});
    if (done) return;

    if (quiz) {
      const scene = kitchenImage(socialRoot + socialScene);
      scene.className = 'social-scene';
      scene.alt = 'Seorang anak terjatuh di taman';
      const choices = document.createElement('div');
      choices.className = 'social-choices';
      let solved = state.placed.includes('ditolong');
      const answerIds = socialAnswers.map(([value]) => value);
      if (!state.order || state.order.length !== 3 || new Set(state.order).size !== 3 || !state.order.every(value => answerIds.includes(value))) {
        state.order = bookShuffle(answerIds);
      }
      next.onclick = () => {
        if (!solved || $('bookAnswer').open || state.step !== 1) return;
        state.step = 4;
        state.placed = [];
        finishIslandChallenge(id);
      };
      function refreshQuiz() {
        $('kitchenCount').textContent = solved ? '1/1' : '0/1';
        next.hidden = !solved;
        for (const button of choices.children) {
          button.disabled = solved;
          button.classList.toggle('social-correct', solved && button.dataset.socialAnswer === 'ditolong');
        }
      }
      for (const value of state.order) {
        const [, label, path, hint] = socialAnswers.find(answer => answer[0] === value);
        const button = bookButton(label, () => {
          if (solved || $('bookAnswer').open || state.step !== 1) return;
          if (value !== 'ditolong') {
            showBookAnswer(false, hint);
            return;
          }
          solved = true;
          state.placed = ['ditolong'];
          proof[socialQuizTitle] = true;
          saveMorningProgress();
          refreshQuiz();
          showBookAnswer(true, 'Hebat! Kita harus menolong teman yang membutuhkan bantuan!', () => next.focus());
        }, kitchenImage(socialRoot + path));
        button.dataset.socialAnswer = value;
        const check = document.createElement('b');
        check.className = 'social-check';
        check.textContent = '✓';
        check.setAttribute('aria-hidden','true');
        button.append(check);
        choices.append(button);
      }
      board.append(scene,choices);
      refreshQuiz();
      return;
    }

    const cards = social ? socialActions : nightCards;
    const root = social ? socialRoot : nightRoot;
    const slots = social ? [['baik','SIKAP BAIK'],['tidak','SIKAP TIDAK BAIK']]
      : nightCards.map(card => [card[2], card[2]]);
    const targets = new Map(), sources = new Map();
    const targetRow = document.createElement('div'), sourceRow = document.createElement('div');
    targetRow.className = 'island-targets';
    sourceRow.className = 'island-sources';
    board.append(targetRow,sourceRow);
    let selected = null;
    const cardFor = value => cards.find(card => card[0] === value);
    const targetAt = hit => {
      const target = hit?.closest('[data-island-target]');
      return target && targetRow.contains(target) ? target : null;
    };
    for (const [slot, label] of slots) {
      const target = bookButton(label, () => { if (selected) place(selected,target); });
      target.dataset.islandTarget = slot;
      if (social) {
        const symbol = document.createElement('strong');
        symbol.className = 'island-board-symbol';
        symbol.textContent = slot === 'baik' ? '✓' : '✕';
        symbol.setAttribute('aria-hidden','true');
        target.prepend(symbol);
      }
      const content = document.createElement('span');
      content.className = 'island-placed';
      target.append(content);
      targetRow.append(target);
      targets.set(slot,target);
    }
    let order = social ? cards.map(card=>card[0]) : state.order;
    if (!order || order.length !== cards.length || new Set(order).size !== cards.length || !order.every(cardFor)) {
      order = bookShuffle(cards.map(card=>card[0]));
      if (order.every((value,index)=>value === cards[index][0])) order.push(order.shift());
      state.order = order;
    }
    for (const value of order) {
      const [,label,,path] = cardFor(value);
      const source = bookButton(label,null,kitchenImage(root + path));
      source.dataset.islandItem = value;
      sourceRow.append(source);
      sources.set(value,source);
      kitchenDragCleanup.push(bookDrag(source, () => {
        sources.get(selected)?.classList.remove('kitchen-selected');
        selected = selected === value ? null : value;
        sources.get(selected)?.classList.add('kitchen-selected');
      }, hit => place(value,targetAt(hit)), event => {
        targetRow.querySelector('.kitchen-over')?.classList.remove('kitchen-over');
        if (event) targetAt(document.elementFromPoint(event.clientX,event.clientY))?.classList.add('kitchen-over');
      }));
    }
    state.placed = [...new Set(state.placed)].filter(value => Boolean(cardFor(value)));
    state.placed.forEach(lock);
    refresh();

    function lock(value) {
      const source = sources.get(value);
      const target = targets.get(cardFor(value)[2]);
      const image = source.querySelector('img');
      image.alt = cardFor(value)[1];
      const mark = document.createElement('span'), check = document.createElement('b');
      mark.className = 'kitchen-placed';
      check.textContent = '✓';
      check.setAttribute('aria-hidden','true');
      mark.append(image,check);
      target.querySelector('.island-placed').append(mark);
      source.hidden = source.disabled = true;
      if (!social) target.disabled = true;
    }

    function refresh() {
      $('kitchenCount').textContent = state.placed.length + '/' + cards.length;
      next.hidden = state.placed.length !== cards.length;
      next.onclick = () => {
        if (state.placed.length !== cards.length || state.step !== 0) return;
        state.step = 1;
        state.placed = [];
        if (!social) finishIslandChallenge(id);
        else {
          saveMorningProgress();
          renderIslandChallenge();
        }
      };
    }

    function place(value,target) {
      if (!target || $('bookAnswer').open || panel.hidden || state.placed.includes(value)) return;
      sources.get(selected)?.classList.remove('kitchen-selected');
      selected = null;
      if (target.disabled || cardFor(value)[2] !== target.dataset.islandTarget) {
        showBookAnswer(false,'Belum tepat. Coba tempat yang lain, ya!');
        return;
      }
      state.placed.push(value);
      lock(value);
      const last = state.placed.length === cards.length;
      if (last) proof[social ? socialBoardTitle : nightTitle] = true;
      saveMorningProgress();
      refresh();
      const message = social ? 'Hebat! Kamu sudah mengenal sikap yang baik. Ayo, selalu berbuat baik kepada sesama!'
        : 'Yeay! Kamu hebat! Sebelum tidur, kita merapikan mainan, menggosok gigi, berdoa, lalu tidur tepat waktu. Selamat malam, Sahabat Hebat!';
      showBookAnswer(true,last ? message : 'Bagus sekali! Jawabanmu tepat.');
    }
  }




  const sportRoot = missionAssets + 'mission-03-berolahraga/';
  const sportCardsPath = 'kenali-olahraga/kenali-olahraga-misi-3/';
  const sportCards = [
    ['berlari','Berlari',true], ['bersepeda','Bersepeda',true], ['membaca','Membaca',false],
    ['berenang','Berenang',true], ['bermain-bola','Bermain bola',true], ['menonton-tv','Menonton TV',false]
  ];

  const sportVideos = ['vid-gerak-1.mp4','vid-gerak-2.mp4'];
  let activeSportVideo = null;
  let sportPlayToken = 0;

  function stopSportVideo() {
    sportPlayToken++;
    activeSportVideo?.pause();
    activeSportVideo = null;
  }

  function renderSportVideo(panel, board, actions, state, step, proof, control) {
    const frame = document.createElement('div');
    frame.className = 'sport-video-frame';
    const video = document.createElement('video');
    video.playsInline = true;
    video.preload = 'auto';
    video.muted = !soundOn;
    video.setAttribute('aria-label','Video gerak SAGI ' + step + ' dari ' + sportVideos.length);
    video.src = sportRoot + 'ikuti-gerak-sagi/' + sportVideos[step-1];
    frame.append(video,$('sportHome'),$('sportBack'));
    board.append(frame);
    activeSportVideo = video;
    const last = step === sportVideos.length;
    const status = $('sportInstruction');
    const start = bookButton('Mulai gerak', () => play(false));
    start.className = 'sport-video-start';
    start.hidden = true;
    const replay = bookButton('Ulangi video', () => play(true),
      kitchenImage(learningAssets + 'dunia-kata/btn-ulangi.png'));
    const next = control(last ? 'Selesai' : 'Lanjut',last ? 'btn-selesai.png' : 'btn-lanjut.png', () => {
      if (activeSportVideo !== video || state.step !== step || !video.ended) return;
      if (last) {
        state.step = 4;
        proof[sportTitles[1]] = true;
        completeMission(3,proof);
        renderSport();
        openMissionReward(3);
      } else {
        state.step++;
        saveMorningProgress();
        renderSport();
      }
    });
    next.disabled = true;
    actions.append(start,replay,next);
    $('sportCount').textContent = step + '/' + sportVideos.length;

    function play(restart) {
      if (activeSportVideo !== video) return;
      const token = ++sportPlayToken;
      stopClosureAudio();
      if (restart) {
        video.pause();
        video.currentTime = 0;
      }
      start.hidden = true;
      next.disabled = true;
      status.textContent = '';
      video.play().catch(error => {
        if (token !== sportPlayToken || activeSportVideo !== video) return;
        start.hidden = false;
        if (error.name !== 'NotAllowedError') status.textContent = 'Video belum dapat diputar. Yuk, coba lagi!';
      });
    }
    video.addEventListener('ended', () => {
      if (activeSportVideo !== video) return;
      next.disabled = false;
      status.textContent = last ? 'Hebat! Terima kasih sudah bergerak bersama SAGI!' : 'Bagus! Yuk, lanjut ke video berikutnya.';
    });
    play(false);
  }

  function showSportTransition(onContinue) {
    const dialog = $('bookAnswer');
    const close = $('bookAnswerClose');
    const playback = showBookAnswer(true, 'Hebat! Semua kegiatan olahraga sudah ditemukan!', onContinue);
    close.disabled = true;
    const preventCancel = event => event.preventDefault();
    dialog.addEventListener('cancel', preventCancel);
    let timer;
    const finish = () => {
      if (dialog.open) dialog.close();
    };
    const showBriefly = () => { if (dialog.open && timer === undefined) timer = setTimeout(finish, 900); };
    const restoreClose = () => {
      if (dialog.open) return;
      dialog.removeEventListener('close', restoreClose);
      clearTimeout(timer);
      dialog.removeEventListener('cancel', preventCancel);
      closureSfx.removeEventListener('error', showBriefly);
      close.disabled = false;
    };
    dialog.addEventListener('close', restoreClose);
    if (playback) {
      closureSfx.onended = finish;
      closureSfx.addEventListener('error', showBriefly, {once:true});
      playback.catch(showBriefly);
    } else {
      showBriefly();
    }
  }


  const sportTitles = ['Kenali Kegiatan Olahraga','Ikuti Gerak SAGI'];

  function openSport() {
    activeActivity = 3;
    selectBookPanel('game');
    markMissionStarted(3);
    show('activityView');
    renderSport();
  }

  function renderSport() {
    stopSportVideo();
    const panel = $('sportGame'), board = $('sportBoard');
    const state = activityProgress.sport ??= {step:0,found:[]};
    const proof = missionCollection.missions[3].activities;
    if (state.step === 3) state.step = 2;
    const answers = sportCards.filter(([, , correct]) => correct).map(([id]) => id);
    state.found = [...new Set(state.found)].filter(id => answers.includes(id));
    if (state.step === 0 && state.found.length === answers.length) {
      state.step = 1;
      saveMorningProgress();
    }
    const step = state.step;
    const move = step === 1 || step === 2;
    panel.hidden = false;
    $('activityPanel').hidden = true;
    panel.dataset.stage = step === 0 ? 'cards' : move ? 'move' : 'done';
    $('sportHeading').textContent = step === 0 ? sportTitles[0] : move ? sportTitles[1] : 'Misi 3 selesai!';
    $('sportInstruction').textContent = '';
    panel.append($('sportHome'),$('sportBack'));
    board.replaceChildren();
    const actions = $('sportActions');
    actions.replaceChildren();
    const control = (label, file, action) => bookButton(label, action, kitchenImage(sportRoot + file));
    $('sportCount').hidden = step === 4;
    if (step === 4) {
      actions.append(
        control('Lihat reward', 'btn-lanjutkan-misi.png', () => openMissionReward(3)),
        control('Coba lagi', 'btn-coba-lagi.png', () => {
          activityProgress.sport = {step:0,found:[]};
          saveMorningProgress();
          renderSport();
        })
      );
    } else if (move) {
      renderSportVideo(panel,board,actions,state,step,proof,control);
    } else {
      const refresh = () => {
        $('sportCount').textContent = state.found.length + '/' + answers.length;
      };
      for (const [id,label,correct] of sportCards) {
        const button = control(label, sportCardsPath + 'card-' + id + '-02.png', () => {
          if ($('bookAnswer').open || state.found.includes(id)) return;
          if (!correct) {
            showBookAnswer(false, 'Belum tepat. Yuk, pilih gambar kegiatan olahraga!');
            return;
          }
          state.found.push(id);
          button.disabled = true;
          const done = state.found.length === answers.length;
          if (done) proof[sportTitles[0]] = true;
          saveMorningProgress();
          refresh();
          if (done) showSportTransition(() => {
            if (current !== 'activityView' || activeActivity !== 3 || state.step !== 0) return;
            state.step = 1;
            saveMorningProgress();
            renderSport();
          });
          else showBookAnswer(true,'Bagus! Itu kegiatan olahraga.');
        });
        button.dataset.sportCard = id;
        button.disabled = state.found.includes(id);
        const check = document.createElement('b');
        check.textContent = '✓';
        check.setAttribute('aria-hidden','true');
        button.append(check);
        board.append(button);
      }
      refresh();
    }
    $('sportHeading').focus({preventScroll:true});
  }

  window.addEventListener('pagehide',stopSportVideo);
  $('sportHome').onclick = () => $('adventureHome').click();
  $('sportBack').onclick = returnFromActivity;
  $('sportFullscreen').onclick = () => $('fullscreenToggle').click();



  function captureBookEvidence(progress, proof) {
    const animal = progress['book-game-hewan'] || 0;
    const number = progress['book-game-angka'] || 0;
    const word = progress['book-game-kata'] || 0;
    const harvest = progress['book-game-angka-harvest'] || 0;
    if (animal || progress['book-game-hewan-work'] === 7) proof.habitat = true;
    for (let index = 0; index < harvest; index++) proof['harvest-' + (index + 3)] = true;
    if (number >= 1) proof.harvest = true;
    if (number === 2 || (number === 1 && progress['book-game-angka-work'] === 2)) proof.pattern = true;
    if (word >= 1 || progress['book-game-kata-work'] === 15) proof.places = true;
    if (word >= 5 || (word === 4 && progress['book-game-kata-work'] === 1)) proof.letters = true;
    if (word === 9 || (word === 8 && progress['book-game-kata-work'] === 1)) proof.syllables = true;
  }

  function reportChallenges(id, proof) {
    const entry = (name, done, children = []) => ({name, done: Boolean(done), children});
    if (id === 1) return [
      entry('Labirin Jejak Cahaya Pagi', proof.maze === true || morningProgress.maze.complete),
      entry('Puzzle Pagi Ajaib', proof.puzzle === true || puzzleState.complete),
      entry('Memory Game Pasangan Pagi Ceria', proof.memory === true || memoryState.complete),
      entry('Refleksi penutup', proof.reflection === true || reflectionState.complete)
    ];
    if (id === 4) return [
      entry('Buku Dunia Hewan', proof.hewan === true, [
        entry('Di Mana Tempat Tinggalnya?', proof.habitat === true)
      ]),
      entry('Buku Dunia Angka', proof.angka === true, [
        entry('Ayo, Memanen Buah!', proof.harvest === true, [3, 4, 5].map(count =>
          entry('Panen ' + count + ' apel', proof['harvest-' + count] === true))),
        entry('Tentukan Polanya', proof.pattern === true)
      ]),
      entry('Buku Dunia Kata', proof.kata === true, [
        entry('Di Mana Tempatnya?', proof.places === true),
        entry('Susun Huruf dan Suku Kata', proof.letters === true && proof.syllables === true, [
          entry('Level Huruf', proof.letters === true),
          entry('Level Suku Kata', proof.syllables === true)
        ])
      ])
    ];
    if (id === 3) return sportTitles.map(title => entry(title, proof[title] === true));
    if (id === 5) {
      const stages = [
        entry(kitchenTitles[0], proof[kitchenTitles[0]] === true),
        entry(kitchenTitles[1], proof[kitchenTitles[1]] === true)
      ];
      if (proof['Pilihan Sehat'] === true) stages.unshift(entry('Pilihan Sehat (versi sebelumnya)', true));
      return stages;
    }
    if (id === 6) return [
      entry(socialBoardTitle, proof[socialBoardTitle] === true),
      entry(socialQuizTitle, proof[socialQuizTitle] === true)
    ];
    if (id === 7) return [entry(nightTitle, proof[nightTitle] === true)];
    let questionNumber = 0;
    const stages = missions[id].map(stage => {
      const children = stage.questions.map(item => {
        const position = questionNumber++;
        return entry(item.prompt, proof[stage.title] === true || (activityProgress[id] || 0) > position);
      });
      return entry(stage.title, children.every(item => item.done), children);
    });
    if (id === 2) return [
      entry(worshipActivityTitle, proof[worshipActivityTitle] === true || activityProgress[2] >= 3),
      entry(worshipGameTitle, proof[worshipGameTitle] === true || activityProgress[worshipMaskKey] === worshipAll)
    ];
    return stages;
  }

  function reportChallengeList(challenges) {
    const list = document.createElement('ul');
    for (const challenge of challenges) {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = challenge.name;
      const status = document.createElement('small');
      status.className = challenge.done ? 'report-done' : 'report-pending';
      status.textContent = challenge.done ? 'Selesai' : 'Belum tercatat selesai';
      item.append(label, status);
      if (challenge.children.length) item.append(reportChallengeList(challenge.children));
      list.append(item);
    }
    return list;
  }

  function openMissionReport() {
    returnFocus = $('reportButton');
    const total = getStarTotal();
    $('reportTotal').textContent = total + '/7 Bintang SAKTI';
    $('reportProgress').value = total;
    const rows = $('reportMissions');
    rows.replaceChildren();
    missionNames.forEach((name, index) => {
      const id = index + 1;
      const record = missionCollection.missions[id];
      const status = {SELESAI:'Selesai', 'SEDANG DIKERJAKAN':'Sedang Berlangsung', 'BELUM DIMAINKAN':'Belum Dimulai'}[record.status];
      const card = document.createElement('details');
      const summary = document.createElement('summary');
      const title = document.createElement('span');
      title.textContent = 'Misi ' + id + ' — ' + name;
      const badge = document.createElement('small');
      badge.className = record.starEarned ? 'report-done' : 'report-pending';
      badge.textContent = status;
      summary.append(title, badge);
      card.append(summary, reportChallengeList(reportChallenges(id, record.activities)));
      rows.append(card);
    });
    $('reportView').scrollTop = 0;
    show('reportView');
    $('reportTitle').focus({preventScroll:true});
  }

  $('reportButton').addEventListener('click', openMissionReport);
  $('reportBack').addEventListener('click', back);



  addIslandCards();


  function saveMazePosition() {
    if (mazeDone || morningProgress.maze.complete) return;
    const visited = [...$('mazeGrid').children].flatMap((cell, index) => cell.classList.contains('visited') ? [index] : []);
    morningProgress.maze.position = {x:mazeX, y:mazeY, steps:mazeTotalSteps, visited};
    saveMorningProgress();
  }

  function restoreMazePosition() {
    const position = morningProgress.maze.position;
    if (!position) return;
    mazeX = position.x;
    mazeY = position.y;
    mazeTotalSteps = position.steps;
    for (const index of position.visited) $('mazeGrid').children[index]?.classList.add('visited');
    const player = $('mazePlayer');
    player.style.transition = 'none';
    updateMazePosition();
    void player.offsetWidth;
    player.style.transition = '';
    if (mazeX === mazeEnd.x && mazeY === mazeEnd.y) finishMaze();
    else updateMazeInstruction();
  }

  renderMissionCollection();

  const fullButton = $('fullscreenToggle'), game = $('game');
  const canFullscreen = !!(game.requestFullscreen || game.webkitRequestFullscreen);
  if (!canFullscreen) { fullButton.disabled = true; fullButton.title = 'Layar penuh tidak didukung perangkat ini'; fullButton.setAttribute('aria-label', fullButton.title); }
  fullButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen(); else document.webkitExitFullscreen();
      } else if (game.requestFullscreen) await game.requestFullscreen(); else game.webkitRequestFullscreen();
    } catch (_) { notice('Layar penuh belum dapat dibuka. Coba melalui Chrome atau Edge.'); }
  });
  function updateFullscreen() {
    const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    fullButton.textContent = active ? '⛶ Keluar layar penuh' : '⛶ Layar penuh';
    fullButton.setAttribute('aria-pressed', String(active));
    fullButton.setAttribute('aria-label', active ? 'Keluar layar penuh' : 'Layar penuh');
  }
  document.addEventListener('fullscreenchange', updateFullscreen);
  document.addEventListener('webkitfullscreenchange', updateFullscreen);
  window.addEventListener('pagehide', () => { music.pause(); stopVoices(); });
  window.addEventListener('storage', event => {
    if (event.key !== morningProgressKey || !event.newValue) return;
    try {
      if (JSON.parse(event.newValue).playerSession !== morningProgress.playerSession) location.reload();
    } catch (_) {}
  });
  window.addEventListener('pageshow', () => { if (musicOn) syncMusic(); });

  const learningTrigger = $('learningInfoButton');
  const learningDialog = $('learningInfoDialog');
  const learningClose = $('learningInfoClose');

  function currentLearningGame() {
    const dedicated = {mazeView:'maze',puzzleView:'puzzle',memoryView:'memory',reflectionView:'reflection'};
    if (dedicated[current]) {
      const screen = $(current);
      return [dedicated[current], screen];
    }
    if (current !== 'activityView') return [];
    const visible = id => !$(id).hidden;
    if (activeActivity === 2) {
      if (visible('worshipMatch')) return [$('worshipMatch').dataset.phase === 'activities' ? 'worshipQuiz' : 'worshipMatch',$('worshipMatch')];
      if (visible('activityPanel') && !visible('activityReward')) return ['worshipQuiz',$('activityPanel').querySelector('header')];
    }
    if (activeActivity === 3 && visible('sportGame')) {
      const stage = $('sportGame').dataset.stage;
      if (stage === 'cards' || stage === 'move') return [stage === 'cards' ? 'sportCards' : 'sportMoves',$('sportGame')];
    }
    if (activeActivity === 4) {
      if (visible('bookShelf')) return ['shelf',$('game')];
      if (visible('bookGame')) {
        const board = $('bookGameBoard');
        const book = ['habitat','panen','pola','tempat','ejaan'].find(name => board.classList.contains('book-game-' + name));
        const id = book === 'ejaan' ? (bookRound() <= 4 ? 'letters' : 'syllables') : book;
        return [id,$('game')];
      }
    }
    if (activeActivity >= 5 && visible('kitchenGame')) {
      const id = {'0':'plate','1':'basket','social-board':'socialBoard','social-quiz':'socialQuiz',night:'night'}[$('kitchenGame').dataset.step];
      return [id,$('kitchenGame')];
    }
    return [];
  }

  function positionLearningTrigger(id) {
    const game = $('game');
    const stageId = {
      puzzle:'puzzleArt', reflection:'reflectionArt', memory:'memoryCanvas', worshipQuiz:'worshipMatch', worshipMatch:'worshipMatch', sportCards:'sportGame', sportMoves:'sportGame',
      panen:'bookGameBoard', plate:'kitchenGame', basket:'kitchenGame',
      socialBoard:'kitchenGame', socialQuiz:'kitchenGame', night:'kitchenGame'
    }[id];
    const area = game.getBoundingClientRect();
    const stage = stageId ? $(stageId).getBoundingClientRect() : area;
    const visible = stage.width > 0 && stage.height > 0 &&
      stage.top < area.bottom && stage.left < area.right && stage.bottom > area.top;
    learningTrigger.style.setProperty('--info-right', Math.max(0, visible ? area.right - stage.right : 0) + 'px');
    learningTrigger.style.setProperty('--info-bottom', Math.max(0, visible ? area.bottom - stage.bottom : 0) + 'px');
  }

  function syncLearningTrigger() {
    const [id, host] = currentLearningGame();
    const info = learningInfoByGame[id];
    learningTrigger.hidden = !info || !host;
    if (!info || !host) return;
    positionLearningTrigger(id);
    learningTrigger.dataset.game = id;
    learningTrigger.setAttribute('aria-label', 'Informasi pembelajaran · ' + info.title);
  }

  function learningParagraph(text) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }


  const learningMissions = [
    ['maze','puzzle','memory','reflection','morningChoice'],
    ['worshipQuiz','worshipMatch','worshipOrder','worshipBenefits'],
    ['sportCards','sportMoves'],
    ['shelf','habitat','letters','panen','pola','tempat','syllables'],
    ['plate','basket'], ['socialBoard','socialQuiz'], ['night']
  ];
  const learningSectionIcons = {
    cp:'M3 5h7l2 2 2-2h7v14h-7l-2 2-2-2H3z M12 7v14',
    goals:'M20 10a8 8 0 1 1-6-6 M16 12a4 4 0 1 1-4-4 M12 12l8-8 M16 4h4v4',
    deep:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
    habit:'M12 3l2.7 5.6 6.3.9-4.5 4.4 1.1 6.1-5.6-2.9L6.4 20l1.1-6.1L3 9.5l6.3-.9z',
    indicator:'M8 4h12v16H4V4h4 M8 11l2 2 5-5 M8 4v2h8V4'
  };

  function learningSection(content, type, title, body) {
    const section = document.createElement('section');
    section.className = 'learning-section learning-section-' + type;
    const heading = document.createElement('h3');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('aria-hidden','true');
    const path = document.createElementNS(ns,'path');
    path.setAttribute('d',learningSectionIcons[type]);
    svg.append(path);
    heading.append(svg, title);
    section.append(heading,body);
    content.append(section);
  }

  function learningGoals(goals) {
    const list = document.createElement('ol');
    list.className = 'learning-goals';
    for (const goal of goals) {
      const item = document.createElement('li');
      const firstSpace = goal.indexOf(' ');
      const verb = document.createElement('strong');
      verb.textContent = firstSpace < 0 ? goal : goal.slice(0,firstSpace);
      item.append(verb, firstSpace < 0 ? '' : goal.slice(firstSpace));
      list.append(item);
    }
    return list;
  }

  function learningDeepCards(lines) {
    const cards = document.createElement('ul');
    cards.className = 'learning-deep';
    for (const [index, label] of ['Berkesadaran','Bermakna','Menggembirakan'].entries()) {
      const card = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = label;
      card.append(title,learningParagraph(lines[index]));
      cards.append(card);
    }
    return cards;
  }

  function learningIndicator(text) {
    if (Array.isArray(text)) {
      const list = document.createElement('ul');
      for (const line of text) {
        const item = document.createElement('li');
        const split = line.indexOf(' ');
        const verb = document.createElement('strong');
        verb.textContent = line.slice(0,split);
        item.append(verb,line.slice(split));
        list.append(item);
      }
      return list;
    }
    const paragraph = document.createElement('p');
    const ending = text.search(/, dengan|, dinilai| dengan dukungan| dan (?:menyebutkan|menjelaskan|menceritakan|mengungkapkan|mengikuti)/i);
    const result = document.createElement('strong');
    result.textContent = ending < 0 ? text : text.slice(0,ending);
    paragraph.append(result, ending < 0 ? '' : text.slice(ending));
    return paragraph;
  }

  learningTrigger.addEventListener('click', () => {
    const [id] = currentLearningGame();
    const info = learningInfoByGame[id];
    if (!info || learningDialog.open || $('bookAnswer').open) return;
    const mission = learningMissions.findIndex(ids => ids.includes(id));
    $('learningInfoTitle').textContent = info.title;
    const context = {habitat:'Buku Dunia Hewan',panen:'Buku Dunia Angka',pola:'Buku Dunia Angka',
      tempat:'Buku Dunia Kata',letters:'Buku Dunia Kata · Level 1',syllables:'Buku Dunia Kata · Level 2'}[id];
    $('learningInfoMission').textContent = ['Misi ' + (mission + 1),missionNames[mission],context].filter(Boolean).join(' · ');
    const content = $('learningInfoContent');
    content.replaceChildren();
    if (info.goals) {
      const chips = document.createElement('ul');
      chips.className = 'learning-cp';
      for (const element of info.cp.split(';')) {
        const chip = document.createElement('li');
        chip.textContent = element.trim().replace(/\.$/,'');
        chips.append(chip);
      }
      const [habit, explanation] = info.habit.split(' — ');
      learningSection(content,'cp','Elemen CP',chips);
      learningSection(content,'goals','Tujuan Pembelajaran',learningGoals(info.goals));
      learningSection(content,'deep','Pembelajaran Mendalam',learningDeepCards(info.deep));
      learningSection(content,'habit','Fokus 7 KAIH · ' + habit,learningParagraph(explanation || info.habit));
      learningSection(content,'indicator','Indikator Ketercapaian',learningIndicator(info.indicator));
      if (info.note) content.append(learningParagraph(info.note));
      const academic = learningParagraph('Elemen CP mengacu pada Fase Fondasi PAUD. Tujuan dan indikator adalah rumusan operasional media SAKTI GEN-AI.');
      academic.className = 'learning-academic';
      content.append(academic);
    } else {
      content.append(learningParagraph('CP/TP khusus untuk permainan ini belum tersedia dalam materi yang diberikan.'));
    }
    learningDialog.showModal();
    content.scrollTop = 0;
  });


  learningClose.addEventListener('click', () => learningDialog.close());
  learningDialog.addEventListener('keydown', event => {
    // The game has document-level shortcuts. Keep them outside the dialog.
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      learningDialog.close();
    }
  });
  learningDialog.addEventListener('close', () => {
    if (!learningTrigger.hidden) learningTrigger.focus({preventScroll:true});
  });

  const learningObserver = new MutationObserver(syncLearningTrigger);
  for (const id of ['mazeView','puzzleView','memoryView','reflectionView','activityView','worshipMatch',
    'activityPanel','activityReward','sportGame','bookShelf','bookGame','bookGameBoard','kitchenGame']) {
    learningObserver.observe($(id), {attributes:true,attributeFilter:['class','hidden','data-step','data-stage','data-phase']});
  }
  if (typeof ResizeObserver !== 'undefined') {
    const learningResize = new ResizeObserver(() => {
      if (!learningTrigger.hidden) positionLearningTrigger(learningTrigger.dataset.game);
    });
    for (const id of ['game','puzzleArt','reflectionArt','memoryCanvas','worshipMatch','sportGame','bookGameBoard','kitchenGame']) learningResize.observe($(id));
  }
  window.addEventListener('resize', syncLearningTrigger);
  document.addEventListener('fullscreenchange', syncLearningTrigger);
  syncLearningTrigger();


  function allMissionsEarned() {
    return [1,2,3,4,5,6,7].every(id => {
      const record = missionCollection.missions[id];
      return record?.starEarned === true && record.status === 'SELESAI';
    });
  }

  function maybeOpenTrophy() {
    if (morningProgress.finalTrophy === 'shown' || !allMissionsEarned()) return false;
    morningProgress.finalTrophy = 'shown';
    saveMorningProgress();
    show('trophyView');
    const trophyStars = $('trophyStars');
    trophyStars.replaceChildren();
    for (let index = 0; index < 7; index++) {
      trophyStars.append(kitchenImage('assets/images/rewards/reward-bintang.png'));
    }
    const fx = $('trophyFx');
    fx.replaceChildren();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let index = 0; index < 18; index++) {
        const piece = document.createElement('i');
        piece.style.left = (3 + index * 5.4) + '%';
        piece.style.background = ['#ffdb62','#80e5c1','#ff8fb0'][index % 3];
        piece.style.animationDelay = (index % 6) * .09 + 's';
        fx.append(piece);
      }
    }
    playRewardNarration('sagi-misi-tuntas.mp3.mp3', ++missionRewardToken, 'trophyView');
    $('trophyView').focus({preventScroll:true});
    return true;
  }

  function syncAdventureNav() {
    const nav = $('adventureNav');
    const showNav = ['atlasView','mazeView','puzzleView','memoryView','reflectionView','activityView','trophyView'].includes(current);
    const sport = $('sportGame');
    const kitchen = $('kitchenGame');
    const activity = current === 'activityView';
    const sportCards = activity && !sport.hidden && sport.dataset.stage === 'cards';
    const bakedPair = activity && (!$('worshipMatch').hidden ||
      (!sport.hidden && !sportCards) ||
      (!kitchen.hidden && ['1','social-board','social-quiz','night','island-done'].includes(kitchen.dataset.step)));
    nav.hidden = !showNav || bakedPair || current === 'puzzleView' || current === 'reflectionView';
    $('adventureHome').hidden = sportCards;
    nav.classList.toggle('adventure-back-only',sportCards);
    nav.classList.toggle('adventure-nav-map',current === 'atlasView' && atlasPage === 'map');
    $('adventureBack').setAttribute('aria-label', current === 'trophyView' ? 'Kembali ke Peta Petualangan' : 'Kembali');
  }

  function leaveAdventure(action) {
    const board = $('bookGameBoard');
    if (current === 'activityView' && activeActivity === 4 && bookPanel === 'challenge' &&
        board.classList.contains('book-game-ejaan') && [...board.querySelectorAll('[data-book-slot]')].some(slot => !slot.disabled && slot.textContent !== '·') &&
        !window.confirm('Susunan kata ini belum selesai. Mau kembali sekarang?')) return;
    if (current === 'mazeView') saveMazePosition();
    saveMorningProgress();
    action();
  }

  $('adventureHome').addEventListener('click', () => leaveAdventure(() => {
    show('menu');
    $('mapButton').focus({preventScroll:true});
  }));
  $('adventureBack').addEventListener('click', () => leaveAdventure(() => {
    const back = {
      atlasView:atlasBack, mazeView:returnFromMaze, puzzleView:returnFromPuzzle,
      memoryView:returnFromMemory, reflectionView:openMemory, activityView:returnFromActivity,
      trophyView:openAtlas
    }[current];
    back?.();
  }));
  window.addEventListener('pagehide', () => {
    if (current === 'trophyView' || current === 'missionRewardView') stopMissionReward();
  });
  const adventureNavObserver = new MutationObserver(syncAdventureNav);
  for (const id of ['worshipMatch','sportGame','kitchenGame']) {
    adventureNavObserver.observe($(id), {attributes:true,attributeFilter:['hidden','data-step','data-stage']});
  }
  $('puzzleHome').onclick = () => $('adventureHome').click();
  $('reflectionHome').onclick = () => $('adventureHome').click();
  buildPuzzlePieces();
  syncAdventureNav();

})();




