/**
 * level.js — data level, tile, koin, musuh, dan penggambaran dunia.
 *
 * Kode tile:
 *  '.' kosong | '#' tanah | 'B' bata | '?' kotak tanya | 'U' kotak terpakai
 *  'P' pipa   | 'S' balok batu (tangga)
 */
class Level {
  constructor() {
    this.T = CONFIG.tileSize;
    this.cols = 140;
    this.rows = 14;
    this.tiles = Array.from({ length: this.rows }, () => Array(this.cols).fill("."));
    this.coins = [];
    this.enemies = [];
    this.pops = []; // efek koin muncul dari kotak
    this.flagCol = 132;
    this.build();
  }

  // ---------- Pembangunan level ----------
  set(c, r, t) { if (this.inside(c, r)) this.tiles[r][c] = t; }
  inside(c, r) { return c >= 0 && c < this.cols && r >= 0 && r < this.rows; }

  build() {
    const pits = [[22, 23], [48, 49], [75, 76]]; // sedikit & sempit supaya mudah
    const inPit = (c) => pits.some(([a, b]) => c >= a && c <= b);

    // Tanah
    for (let c = 0; c < this.cols; c++) {
      if (c > 138 || inPit(c)) continue;
      this.set(c, 12, "#");
      this.set(c, 13, "#");
    }
    for (let c = 0; c < this.cols; c++) if (c <= 138 && !inPit(c)) { /* tanah utuh */ }

    // Platform bata & kotak tanya (baris 9 bisa dijangkau dari tanah)
    this.row(14, 18, 9, "B"); this.set(16, 9, "?");
    this.row(36, 40, 9, "B"); this.set(38, 9, "?");
    this.row(55, 59, 9, "B"); this.set(57, 9, "?");
    this.row(62, 64, 6, "B"); this.set(63, 6, "?");
    this.row(84, 90, 9, "B"); this.set(86, 9, "?"); this.set(88, 9, "?");
    this.row(92, 95, 6, "B");
    this.row(107, 111, 9, "B"); this.set(109, 9, "?");

    // Platform melayang di atas lubang
    this.row(22, 24, 9, "B");
    this.row(75, 78, 9, "B");

    // Pipa
    this.pipe(30, 2); this.pipe(44, 3); this.pipe(68, 2); this.pipe(97, 3);

    // Tangga menuju bendera
    for (let i = 0; i < 8; i++) for (let h = 0; h <= i; h++) this.set(119 + i, 11 - h, "S");

    // Koin
    [[15, 8], [17, 8], [37, 8], [39, 8], [56, 8], [58, 8], [63, 5], [85, 8], [87, 8],
     [89, 8], [93, 5], [94, 5], [108, 8], [110, 8], [23, 8], [76, 8], [77, 8],
     [10, 11], [11, 11], [12, 11], [52, 11], [53, 11], [80, 11], [81, 11]]
      .forEach(([c, r]) => this.coins.push({ x: c * this.T + 8, y: r * this.T + 6, taken: false }));

    // Musuh (jamur jahat)
    [33, 53, 66, 82, 105].forEach((c) =>
      this.enemies.push(new Enemy(c * this.T, 11 * this.T - 2)));
  }

  row(c1, c2, r, t) { for (let c = c1; c <= c2; c++) this.set(c, r, t); }

  pipe(c, h) {
    for (let i = 0; i < h; i++) { this.set(c, 11 - i, "P"); this.set(c + 1, 11 - i, "P"); }
  }

  // ---------- Query ----------
  tile(c, r) {
    if (c < 0 || c >= this.cols) return "#"; // dinding di tepi
    if (r < 0 || r >= this.rows) return ".";
    return this.tiles[r][c];
  }
  isSolid(c, r) { return this.tile(c, r) !== "."; }
  get width() { return this.cols * this.T; }
  get flagX() { return this.flagCol * this.T; }

  /** Dipanggil saat pemain menyundul tile dari bawah. Mengembalikan jumlah koin baru. */
  hit(c, r) {
    if (this.tile(c, r) === "?") {
      this.set(c, r, "U");
      this.pops.push({ x: c * this.T + 8, y: r * this.T - 8, vy: -6, life: 28 });
      return 1;
    }
    return 0;
  }

  updateEffects() {
    this.pops.forEach((p) => { p.y += p.vy; p.vy += 0.4; p.life--; });
    this.pops = this.pops.filter((p) => p.life > 0);
  }

  // ---------- Gambar ----------
  draw(ctx, camX, viewW, time) {
    const T = this.T;
    const c0 = Math.max(0, Math.floor(camX / T));
    const c1 = Math.min(this.cols - 1, Math.ceil((camX + viewW) / T));

    for (let r = 0; r < this.rows; r++) {
      for (let c = c0; c <= c1; c++) {
        const t = this.tiles[r][c];
        if (t !== ".") this.drawTile(ctx, t, c * T - camX, r * T, r);
      }
    }

    // Koin
    this.coins.forEach((co) => {
      if (co.taken) return;
      const w = Math.abs(Math.sin(time / 12 + co.x)) * 8 + 2;
      ctx.fillStyle = "#ffd54a";
      ctx.beginPath(); ctx.ellipse(co.x - camX + 8, co.y + 10, w, 10, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = "#c98a00"; ctx.lineWidth = 2; ctx.stroke();
    });

    // Koin dari kotak
    this.pops.forEach((p) => {
      ctx.fillStyle = "#ffd54a";
      ctx.beginPath(); ctx.ellipse(p.x - camX + 8, p.y, 6, 10, 0, 0, 7); ctx.fill();
    });

    this.enemies.forEach((e) => e.draw(ctx, camX, time));
    this.drawFlag(ctx, camX, time);
  }

  drawTile(ctx, t, x, y, r) {
    const T = this.T;
    switch (t) {
      case "#":
        ctx.fillStyle = "#b5651d"; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = r === 12 ? "#3fae3f" : "#8a4b12";
        if (r === 12) ctx.fillRect(x, y, T, 8);
        ctx.strokeStyle = "#6e3a0e"; ctx.strokeRect(x + .5, y + .5, T - 1, T - 1);
        break;
      case "B":
        ctx.fillStyle = "#d9733a"; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = "#7a3512"; ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
        ctx.beginPath();
        ctx.moveTo(x, y + T / 2); ctx.lineTo(x + T, y + T / 2);
        ctx.moveTo(x + T / 2, y); ctx.lineTo(x + T / 2, y + T / 2);
        ctx.moveTo(x + T / 4, y + T / 2); ctx.lineTo(x + T / 4, y + T);
        ctx.moveTo(x + 3 * T / 4, y + T / 2); ctx.lineTo(x + 3 * T / 4, y + T);
        ctx.stroke();
        break;
      case "?":
        ctx.fillStyle = "#ffc107"; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = "#b07800"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
        ctx.fillStyle = "#7a4d00"; ctx.font = "bold 20px monospace"; ctx.textAlign = "center";
        ctx.fillText("?", x + T / 2, y + 23);
        break;
      case "U":
        ctx.fillStyle = "#8d7b68"; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = "#5a4c3d"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
        break;
      case "P":
        ctx.fillStyle = "#2eaa4a"; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = "#6be08a"; ctx.fillRect(x + 4, y, 5, T);
        ctx.strokeStyle = "#146b2a"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
        break;
      case "S":
        ctx.fillStyle = "#a9a9b8"; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = "#5b5b6e"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
        break;
    }
  }

  drawFlag(ctx, camX, time) {
    const T = this.T, x = this.flagX - camX, groundY = 12 * T;
    ctx.fillStyle = "#e8e8e8"; ctx.fillRect(x + 14, groundY - 7 * T, 5, 7 * T);
    ctx.fillStyle = "#ffd54a"; ctx.beginPath(); ctx.arc(x + 16, groundY - 7 * T, 7, 0, 7); ctx.fill();
    // bendera hati
    ctx.fillStyle = "#ff4f8b";
    ctx.font = "34px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("♥", x - 20 + Math.sin(time / 10) * 3, groundY - 6 * T + 6);
    // istana kecil
    ctx.fillStyle = "#c26b4a"; ctx.fillRect(x + 60, groundY - 3 * T, 3 * T, 3 * T);
    ctx.fillStyle = "#3b1d10"; ctx.fillRect(x + 60 + T, groundY - 1.6 * T, T, 1.6 * T);
    ctx.fillStyle = "#c26b4a";
    for (let i = 0; i < 3; i++) ctx.fillRect(x + 60 + i * T + 4, groundY - 3 * T - 10, 20, 10);
  }
}

/** Musuh sederhana: berjalan, berbalik saat menabrak dinding. */
class Enemy {
  constructor(x, y) {
    this.x = x; this.y = y; this.w = 28; this.h = 28;
    this.vx = -0.7; this.vy = 0;
    this.alive = true; this.squish = 0;
  }

  update(level) {
    const T = level.T;
    if (!this.alive) { this.squish++; return; }

    this.vy = Math.min(this.vy + CONFIG.gravity, 12);

    // Sumbu X
    this.x += this.vx;
    const top = Math.floor(this.y / T), bot = Math.floor((this.y + this.h - 1) / T);
    const col = Math.floor((this.x + (this.vx > 0 ? this.w : 0)) / T);
    for (let r = top; r <= bot; r++) {
      if (level.isSolid(col, r)) { this.vx *= -1; this.x += this.vx * 2; break; }
    }

    // Sumbu Y
    this.y += this.vy;
    if (this.vy > 0) {
      const row = Math.floor((this.y + this.h) / T);
      const l = Math.floor(this.x / T), r2 = Math.floor((this.x + this.w - 1) / T);
      for (let c = l; c <= r2; c++) {
        if (level.isSolid(c, row)) { this.y = row * T - this.h; this.vy = 0; break; }
      }
    }
    if (this.y > level.rows * T + 100) this.alive = false;
  }

  draw(ctx, camX, time) {
    const x = this.x - camX;
    if (!this.alive) {
      if (this.squish < 25) {
        ctx.fillStyle = "#8b4a2b"; ctx.fillRect(x, this.y + this.h - 8, this.w, 8);
      }
      return;
    }
    ctx.fillStyle = "#8b4a2b";
    ctx.beginPath(); ctx.ellipse(x + 14, this.y + 12, 14, 12, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(x + 2, this.y + 12, 24, 8);
    ctx.fillStyle = "#f3d9b1"; ctx.fillRect(x + 6, this.y + 20, 16, 8);
    // kaki bergantian
    const step = Math.floor(time / 8) % 2;
    ctx.fillStyle = "#3b1d10";
    ctx.fillRect(x + (step ? 2 : 6), this.y + 25, 8, 4);
    ctx.fillRect(x + (step ? 18 : 14), this.y + 25, 8, 4);
    // mata marah
    ctx.fillStyle = "#fff"; ctx.fillRect(x + 6, this.y + 10, 6, 6); ctx.fillRect(x + 16, this.y + 10, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x + 9, this.y + 12, 3, 4); ctx.fillRect(x + 16, this.y + 12, 3, 4);
  }
}
