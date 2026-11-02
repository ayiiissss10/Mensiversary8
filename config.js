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
      "Sayangku, aku ngga tau selama delapan bulan ini semua berjalan seperti yang kita bayangkan atau ngga. Mungkin ada banyak hal menyenangkan, cerita-cerita kecil yang masih aku ingat, momen yang membuat kita ketawa, tetapi ada juga beberapa hal yang ngga selalu mudah untuk dijalani. Kita punya cara berpikir yang berbeda, cara menghadapi masalah yang berbeda, dan mungkin ada beberapa hal dari diri masing-masing yang sampai sekarang masih perlu kita pahami.",
      "Tapi satu hal yang ingin aku sampaikan hari ini adalah aku bersyukur karena bisa mengenal dan menjalani sejauh ini bersamamu. Aku senang bisa mengenal lebih banyak bagian dari dirimu, termasuk hal-hal kecil yang mungkin menurutmu biasa saja, tetapi perlahan menjadi sesuatu yang aku kenali dan aku sukai. Aku senang punya seseorang yang bisa aku ajak berbagi cerita, seseorang yang ingin aku dengar kabarnya, dan seseorang yang kehadirannya punya tempat tersendiri dalam hari-hariku.",
      "Ada juga yang pengen aku ungkapin, aku sadar mungkin selama ini aku belum jadi seseorang yang cukup konsisten. aku tau kamu suka hal tersebut, bukan hanya kata kata tapi juga melalui tindakan dan sikap yang bisa kamu rasain setiap hari. Yang ngga nunjukin pas lagi pengen aja, ngga cuma berusaha pas lagi baik, dan ga cuma perlihatkan kesungguhan pas ada sesuatu yang buat hubungan ini terancam.",
      "Aku sadar kalo aku masih perlu banyak belajar dalam hadapi perasaan kamu, terutama kalo ada sesuatu yang buat kamu marah, bete, kesel, atau kecewa sama aku. Aku pengen belajar memahami kamu lebih baik lagi. Aku tahu proses memperbaki diri ga selalu mudah. Mungkin akan ada saat aku masih lakuin kesalahan, masih bingung menghadapi situasi tertentu, atau belum bisa ngasih respon seperti yang seharusnya. Tapi aku ingin belajar dari itu semua dan ga terus mengulangi kesalahan yang sama tanpa usaha untuk berubah.",
      "Aku pengen jadi seseorang yang bisa kamu andalkan. Aku pengen konsisten untuk hal hal sederhana, dalam komunikasi, perhatian, kepedulian, dan cara aku perlakukan kamu. Aku mau kamu merasa di sayangi bukan hanya dari apa yang aku bilang, tapi dari apa yang aku lakukan. Aku ingin kamu merasa dihargai, dan didengerin.",
      "Terima kasih ya udah jadi bagian dari perjalanan ini. Terima kasih untuk setiap cerita, waktu, perhatian, kesabaran, dan hal hal kecil yang udah kamu kasih ke aku. Aku mungkin ga selalu bisa mengungkapkan semuanya dengan baik, tapi bukan berarti aku ga menghargai apa yang kita jalanin.",
      "Aku pengen kamu tetap jadi diri kamu sendiri. Kamu ga harus baik baik aja, ga harus selalu menyenangkan, dan ga harus menyimpan sesuatu cuma karena takut buat aku ga nyaman. Aku pengen kita bisa saling cerita, saling mengingatkan, dan saling menyampaikan apa yang perlu kita perbaiki. Aku pengen hubungan ini jadi tempat yang nyaman buat kita berdua. tempat dimana kita bisa jadi diri sendiri. Aku ingin kita bisa bertumbuh bersama tanpa harus kehilangan diri sendiri.",
      "Sekali lagi, selamat tanggal 3 ke-8 ya sayangkuu. Semoga setelah bulan ini, kita selalu bisa bertemu bulan bulan selanjutnya. Bukan dengan hubungan yang harus selalu sempurna, tapi dengan dua orang yang sama sama punya kemauan untuk menjaga, memahami, dan memperbaiki apa yang mereka miliki.",
      "I love u, and I'm still looking forward to everything we haven't experienced together.",
    ],
    sign: "Dengan sepenuh hati, pacar kesayangan kecintaanmu, {from} ❤",
  },
};

/** Ganti placeholder {to} dan {from} pada teks. */
CONFIG.fill = (text) =>
  text.replace(/\{to\}/g, CONFIG.names.to).replace(/\{from\}/g, CONFIG.names.from);
