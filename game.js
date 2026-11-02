/**
 * game.js — loop utama, state mesin, kamera, HUD, dan layar kemenangan.
 * State: "start" → "playing" → ("dead" → "playing" | "gameover") → "win"
 */
(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const T = CONFIG.tileSize;

  const winEl = document.getElementById("win");
  const againBtn = document.getElementById("again");

  let state, level, player, camX, lives, coins, hearts, timer, tick;

  // ---------- Setup ----------
  function newGame() {
    level = new Level();
    player = new Player(3 * T, 10 * T);
    camX = 0; lives = CONFIG.lives; coins = 0;
    hearts = []; timer = 0; tick = 0;
    state = "start";
    winEl.classList.add("hidden");
  }

  // Titik simpan otomatis (kolom tile): setelah dilewati, nyawa hilang tidak mengulang dari awal
  const CHECKPOINTS = [42, 71, 105];

  function respawn() {
    player.reset();
    camX = Math.max(0, Math.min(level.width - W, player.x - W * 0.4));
    state = "playing";
  }

  // ---------- Update ----------
  function update() {
    tick++;
    level.updateEffects();

    switch (state) {
      case "start":
      case "gameover":
        if (Input.jump) { if (state === "gameover") newGame(); state = "playing"; }
        break;
      case "playing": updatePlaying(); break;
      case "dead":
        player.update(Input, level);
        if (--timer <= 0) { lives > 0 ? respawn() : (state = "gameover"); }
        break;
      case "win": updateWin(); break;
    }
    updateHearts();
  }

  function updatePlaying() {
    player.update(Input, level);
    coins += player.coinsFromBlocks;

    // Simpan checkpoint saat berdiri di tanah melewati titik simpan
    if (player.onGround) {
      CHECKPOINTS.forEach((c) => {
        if (player.x > c * T && c * T > player.spawn.x) player.spawn.x = c * T;
      });
    }

    // Koin
    level.coins.forEach((c) => {
      if (!c.taken && player.overlaps({ x: c.x, y: c.y, w: 16, h: 20 })) { c.taken = true; coins++; }
    });

    // Musuh
    level.enemies.forEach((e) => {
      e.update(level);
      if (!e.alive || player.dead) return;
      if (player.overlaps(e)) {
        const stomp = player.vy > 0 && player.y + player.h - e.y < 16;
        if (stomp) { e.alive = false; player.bounce(); coins += 0; }
        else loseLife();
      }
    });

    // Jatuh ke lubang
    if (player.y > H + 40 && !player.dead) loseLife();

    // Kamera
    const target = player.x - W * 0.4;
    camX += (target - camX) * 0.15;
    camX = Math.max(0, Math.min(level.width - W, camX));

    // Menang
    if (!player.dead && player.x + player.w > level.flagX) {
      state = "win"; timer = 0;
      player.vx = 0;
    }
  }

  function loseLife() {
    player.die();
    lives--;
    state = "dead";
    timer = 90;
  }

  function updateWin() {
    timer++;
    // pemain berjalan ke arah istana
    player.vx = 1.5; player.facing = 1;
    player.update({ left: false, right: false, jump: false, run: false }, level);
    player.x += 1.2;
    if (timer % 4 === 0) spawnHeart();
    if (timer === 100) showWin();
  }

  // ---------- Hati melayang ----------
  function spawnHeart() {
    hearts.push({
      x: Math.random() * W, y: H + 20,
      vy: -(1 + Math.random() * 2), size: 14 + Math.random() * 24,
      sway: Math.random() * 6, color: ["#ff4f8b", "#ff7aa8", "#ffb3cd", "#ff2d6f"][Math.floor(Math.random() * 4)],
    });
  }
  function updateHearts() {
    hearts.forEach((h) => { h.y += h.vy; });
    hearts = hearts.filter((h) => h.y > -40);
  }

  // ---------- Layar kemenangan ----------
  function showWin() {
    const m = CONFIG.message;
    document.getElementById("win-title").textContent = CONFIG.fill(m.title);
    const body = document.getElementById("win-body");
    body.innerHTML = "";
    m.paragraphs.forEach((text, i) => {
      const p = document.createElement("p");
      p.textContent = CONFIG.fill(text);
      p.style.animationDelay = `${0.6 + i * 1.4}s`;
      body.appendChild(p);
    });
    const sign = document.getElementById("win-sign");
    sign.textContent = CONFIG.fill(m.sign);
    sign.style.animationDelay = `${0.6 + m.paragraphs.length * 1.4}s`;
    winEl.classList.remove("hidden");
  }
  againBtn.addEventListener("click", newGame);

  // ---------- Render ----------
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#4a86f0"); g.addColorStop(1, "#a8d4ff");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // awan (parallax)
    ctx.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 12; i++) {
      const x = ((i * 260 - camX * 0.4) % (W + 300) + (W + 300)) % (W + 300) - 100;
      const y = 40 + (i % 3) * 45;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, 7); ctx.arc(x + 26, y - 10, 28, 0, 7); ctx.arc(x + 56, y, 22, 0, 7);
      ctx.fill();
    }
    // bukit
    ctx.fillStyle = "#6fc46f";
    for (let i = 0; i < 8; i++) {
      const x = ((i * 380 - camX * 0.6) % (W + 400) + (W + 400)) % (W + 400) - 200;
      ctx.beginPath(); ctx.arc(x, 12 * T, 90, Math.PI, 0); ctx.fill();
    }
  }

  function drawHUD() {
    ctx.fillStyle = "#fff"; ctx.font = "14px 'Press Start 2P', monospace"; ctx.textAlign = "left";
    ctx.shadowColor = "#000"; ctx.shadowBlur = 4;
    ctx.fillText("♥ x " + Math.max(lives, 0), 16, 28);
    ctx.fillStyle = "#ffd54a"; ctx.fillText("● x " + coins, 160, 28);
    ctx.fillStyle = "#fff"; ctx.textAlign = "right";
    const prog = Math.min(100, Math.round((player.x / level.flagX) * 100));
    ctx.fillText(prog + "%", W - 16, 28);
    ctx.shadowBlur = 0;
  }

  function banner(lines) {
    ctx.fillStyle = "rgba(15,5,35,.6)"; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.shadowColor = "#000"; ctx.shadowBlur = 6;
    lines.forEach(([text, size, color], i) => {
      ctx.fillStyle = color; ctx.font = `${size}px 'Press Start 2P', monospace`;
      ctx.fillText(text, W / 2, H / 2 - 40 + i * 44);
    });
    ctx.shadowBlur = 0;
  }

  function render() {
    drawBackground();
    level.draw(ctx, camX, W, tick);
    player.draw(ctx, camX, tick);

    hearts.forEach((h) => {
      ctx.fillStyle = h.color; ctx.font = `${h.size}px sans-serif`; ctx.textAlign = "center";
      ctx.fillText("♥", h.x + Math.sin((h.y + h.sway) / 25) * 14, h.y);
    });

    drawHUD();

    if (state === "start") {
      banner([
        ["HAPPY MENSIVERSARY", 22, "#ffd54a"],
        [`${CONFIG.years} BULAN BERSAMA`, 14, "#ff9ec2"],
        ["Tekan SPASI / tombol LOMPAT", 11, "#fff"],
        ["Capai bendera hati di ujung level!", 10, "#c9b8ff"],
      ]);
    } else if (state === "gameover") {
      banner([
        ["GAME OVER", 26, "#ff6b6b"],
        ["Jangan menyerah, coba lagi!", 11, "#fff"],
        ["Tekan SPASI untuk mengulang", 11, "#ffd54a"],
      ]);
    }
  }

  // ---------- Loop (langkah tetap 60 Hz) ----------
  let last = performance.now(), acc = 0;
  function frame(now) {
    acc += Math.min(now - last, 100); last = now;
    while (acc >= 1000 / 60) { update(); acc -= 1000 / 60; }
    render();
    requestAnimationFrame(frame);
  }

  newGame();
  requestAnimationFrame(frame);
})();
