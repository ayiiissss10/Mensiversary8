/**
 * config.js — semua pengaturan yang mungkin ingin Anda ubah ada di sini.
 * Ganti nama & isi pesan di bagian MESSAGE. Tanda {to} dan {from} otomatis diganti.
 */
const CONFIG = {
  // ---------- Gameplay ----------
  tileSize: 32,
  gravity: 0.55,
  walkSpeed: 0.5,       // percepatan jalan
  maxWalk: 3.2,
  maxRun: 5.2,
  friction: 0.82,
  jumpPower: 11.2,
  lives: 5,

  // ---------- Pesan hari jadi ----------
  years: 8,
  names: {
    from: "Aish",       // nama pengirim
    to: "Sayang",       // ganti dengan nama pasangan
  },
  message: {
    title: "Selamat Hari Jadi ke-8, {to}! 💖",
    paragraphs: [
      "Kamu berhasil sampai ke bendera terakhir! Tapi perjalanan yang sebenarnya jauh lebih panjang dari level ini, dan sudah delapan tahun kita melewatinya bersama: naik-turun, lubang yang hampir bikin jatuh, juga rintangan yang ternyata bisa kita lompati berdua.",
      "Delapan tahun bukan waktu yang singkat. Ada banyak hari yang biasa saja yang terasa istimewa hanya karena ada kamu. Terima kasih sudah sabar, sudah bertahan, dan tetap memilih aku di setiap level yang kita lewati.",
      "Kalau hidup ini sebuah permainan, aku bersyukur kamu adalah pemain kedua yang selalu ada di sampingku. Koin terbaik yang pernah kutemukan bukan yang ada di dalam kotak, tapi senyummu.",
      "Semoga tahun-tahun berikutnya kita terus berjalan bersama, saling menjaga, dan makin kuat di setiap level baru. Aku cinta kamu, hari ini dan seterusnya.",
    ],
    sign: "Dengan sepenuh hati, {from} ❤",
  },
};

/** Ganti placeholder {to} dan {from} pada teks. */
CONFIG.fill = (text) =>
  text.replace(/\{to\}/g, CONFIG.names.to).replace(/\{from\}/g, CONFIG.names.from);
