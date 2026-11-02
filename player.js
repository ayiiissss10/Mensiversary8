/**
 * player.js — fisika, tabrakan tile, dan gambar karakter pemain.
 */
class Player {
  constructor(x, y) {
    this.spawn = { x, y };
    this.w = 24; this.h = 30;
    this.reset();
  }

  reset() {
    this.x = this.spawn.x; this.y = this.spawn.y;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.jumpLocked = false;
    this.dead = false;
    this.coinsFromBlocks = 0; // koin dari kotak tanya pada frame ini
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.vy = -9;
    this.vx = 0;
  }

  bounce() { this.vy = -8; }

  update(input, level) {
    this.coinsFromBlocks = 0;

    if (this.dead) { // animasi jatuh tanpa tabrakan
      this.vy += CONFIG.gravity;
      this.y += this.vy;
      return;
    }

    const T = level.T;

    // ----- Input horizontal -----
    const maxSpeed = input.run ? CONFIG.maxRun : CONFIG.maxWalk;
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== 0) {
      this.vx += dir * CONFIG.walkSpeed;
      this.facing = dir;
    } else {
      this.vx *= CONFIG.friction;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
    }
    this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));

    // ----- Lompat (tahan = lebih tinggi) -----
    if (!input.jump) this.jumpLocked = false;
    if (input.jump && this.onGround && !this.jumpLocked) {
      this.vy = -CONFIG.jumpPower;
      this.onGround = false;
      this.jumpLocked = true;
    }
    if (!input.jump && this.vy < -4) this.vy = -4; // lompat pendek

    this.vy = Math.min(this.vy + CONFIG.gravity, 12);

    // ----- Gerak sumbu X -----
    this.x += this.vx;
    let top = Math.floor(this.y / T), bot = Math.floor((this.y + this.h - 1) / T);
    if (this.vx > 0) {
      const col = Math.floor((this.x + this.w) / T);
      for (let r = top; r <= bot; r++) {
        if (level.isSolid(col, r)) { this.x = col * T - this.w; this.vx = 0; break; }
      }
    } else if (this.vx < 0) {
      const col = Math.floor(this.x / T);
      for (let r = top; r <= bot; r++) {
        if (level.isSolid(col, r)) { this.x = (col + 1) * T; this.vx = 0; break; }
      }
    }

    // ----- Gerak sumbu Y -----
    this.y += this.vy;
    this.onGround = false;
    const left = Math.floor(this.x / T), right = Math.floor((this.x + this.w - 1) / T);
    if (this.vy > 0) {
      const row = Math.floor((this.y + this.h) / T);
      for (let c = left; c <= right; c++) {
        if (level.isSolid(c, row)) {
          this.y = row * T - this.h; this.vy = 0; this.onGround = true; break;
        }
      }
    } else if (this.vy < 0) {
      const row = Math.floor(this.y / T);
      const center = Math.floor((this.x + this.w / 2) / T);
      for (let c = left; c <= right; c++) {
        if (level.isSolid(c, row)) {
          this.y = (row + 1) * T; this.vy = 0;
          const hitCol = level.isSolid(center, row) ? center : c;
          this.coinsFromBlocks += level.hit(hitCol, row);
          break;
        }
      }
    }
  }

  overlaps(o) {
    return this.x < o.x + o.w && this.x + this.w > o.x &&
           this.y < o.y + o.h && this.y + this.h > o.y;
  }

  draw(ctx, camX, time) {
    const x = this.x - camX, y = this.y;
    ctx.save();
    ctx.translate(x + this.w / 2, y);
    ctx.scale(this.facing, 1);
    const ox = -this.w / 2;

    const walking = this.onGround && Math.abs(this.vx) > 0.4;
    const step = walking ? Math.floor(time / 5) % 2 : 0;

    // sepatu
    ctx.fillStyle = "#4a2a14";
    ctx.fillRect(ox + (step ? 0 : 4), y * 0 + 26, 10, 4);
    ctx.fillRect(ox + (step ? 14 : 10), 26, 10, 4);
    // celana (overall biru)
    ctx.fillStyle = "#2f6fe0"; ctx.fillRect(ox + 3, 15, 18, 12);
    // baju merah
    ctx.fillStyle = "#e8383d"; ctx.fillRect(ox + 1, 12, 22, 7);
    // lengan
    ctx.fillRect(ox + (this.onGround ? 20 : 21), this.onGround ? 14 : 8, 5, 7);
    // kepala
    ctx.fillStyle = "#ffcf9e"; ctx.fillRect(ox + 4, 3, 16, 11);
    // topi
    ctx.fillStyle = "#e8383d"; ctx.fillRect(ox + 3, 0, 18, 5); ctx.fillRect(ox + 12, 3, 11, 3);
    // mata & kumis
    ctx.fillStyle = "#000"; ctx.fillRect(ox + 15, 6, 3, 4);
    ctx.fillStyle = "#5a3418"; ctx.fillRect(ox + 11, 11, 10, 2);
    ctx.restore();
  }
}
