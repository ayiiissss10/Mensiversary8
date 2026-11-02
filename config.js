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
    from: "Ebie",       // nama pengirim
    to: "Sayang",       // ganti dengan nama pasangan
  },
  message: {
    title: "Selamat Tanggal 3 ke-8, {to}! 💖",
    paragraphs: [
      "Yeyyy kamu berhasil lewatin setiap rintangannya sayangg... aku tau pacarku ini hebatt, rintangan sesulit apapun pasti kamu bisa lewatin seperti banyaknya rintangan di hubungan kita. walaupun disini kamu mainnya sendiri, tapi ada aku yang selalu dukung kamu, selalu nyemangatin kamu dan selalu temenin kamu. ",
      "Delapan bulan bukan waktu yang singkat buat kita. Ada banyak hari yang biasa saja yang terasa istimewa hanya karena ada kamu. Terima kasih sudah sabar, sudah bertahan, dan tetap memilih aku di setiap level yang kita lewati.",
      "Kalau hidup ini sebuah permainan, aku bersyukur kamu adalah pemain kedua yang selalu ada di sampingku. Koin terbaik yang pernah kutemukan bukan yang ada di dalam kotak, tapi senyummu.",
      "Semoga tahun-tahun berikutnya kita terus berjalan bersama, saling menjaga, dan makin kuat di setiap level baru. Aku cinta kamu, hari ini dan seterusnya.",
    ],
    sign: "Dengan sepenuh hati, pacar kesayangan kecintaanmu {from} ❤",
  },
};

/** Ganti placeholder {to} dan {from} pada teks. */
CONFIG.fill = (text) =>
  text.replace(/\{to\}/g, CONFIG.names.to).replace(/\{from\}/g, CONFIG.names.from);
