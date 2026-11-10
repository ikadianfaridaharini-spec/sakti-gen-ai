// Materi CP/TP SAKTI GEN-AI.
const learningInfoByGame = {
  "maze": {
    "title": "Labirin Jejak Cahaya Pagi",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali kebiasaan baik yang dilakukan pada pagi hari.",
      "Mengikuti jalur labirin berdasarkan petunjuk dan arah gerak secara bertahap.",
      "Mengenali arah atas, bawah, kanan, dan kiri dalam menentukan jalur perjalanan.",
      "Mengembangkan kemampuan menghitung langkah, mengamati rintangan, dan memecahkan masalah sederhana.",
      "Menunjukkan ketelitian, ketekunan, kemandirian, dan percaya diri saat menyelesaikan labirin."
    ],
    "deep": [
      "Anak memperhatikan arah, menghitung langkah, mengenali rintangan, dan menentukan jalur secara hati-hati.",
      "Anak menghubungkan perjalanan dalam labirin dengan kegiatan bangun pagi, kemampuan mengikuti petunjuk, dan kebiasaan bertindak teratur.",
      "Anak menjelajahi labirin fantasi, menentukan arah perjalanan, dan merasakan keberhasilan ketika mencapai tujuan."
    ],
    "habit": "Bangun Pagi — Mengenalkan pembiasaan bangun pagi dan memulai hari dengan kegiatan positif, teratur, serta mandiri melalui petualangan yang menyenangkan.",
    "indicator": [
      "Mengikuti jalur labirin sesuai petunjuk.",
      "Mengenali dan menggunakan arah atas, bawah, kanan, dan kiri.",
      "Menghitung langkah sesuai aktivitas yang tersedia dalam game.",
      "Memilih jalur dengan memperhatikan rintangan.",
      "Menyelesaikan perjalanan menuju tujuan sesuai kemampuan, dengan bantuan jika diperlukan."
    ],
    "note": "Guru dapat mengamati cara anak memilih arah, menghitung langkah, dan mencoba jalur lain. Penghitung permainan hanya mencatat langkah yang berhasil."
  },
  "morningChoice": {
    "title": "Pilih Kebiasaan Pagi",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali contoh kebiasaan baik pada pagi hari.",
      "Membedakan kegiatan pagi yang sesuai dan kurang sesuai.",
      "Memilih gambar berdasarkan petunjuk.",
      "Menghubungkan kebiasaan pagi dengan kemandirian.",
      "Menunjukkan keberanian mengambil keputusan."
    ],
    "deep": [
      "memperhatikan pilihan sebelum menentukan jawaban.",
      "mengaitkan gambar dengan kebiasaan di rumah.",
      "memilih kartu melalui permainan interaktif."
    ],
    "habit": "Bangun Pagi — membangun pembiasaan memulai hari secara teratur.",
    "indicator": "Anak memilih gambar kebiasaan pagi yang tepat dan menyebutkan satu contoh kegiatan yang dapat dilakukan di rumah."
  },
  "reflection": {
    "title": "Urutkan Kegiatan Pagi",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali urutan kegiatan pagi.",
      "Mengurutkan empat gambar sesuai alur permainan.",
      "Mengembangkan kemampuan berpikir runtut.",
      "Menggunakan koordinasi mata dan tangan saat menyusun kartu.",
      "Menceritakan kembali urutan kegiatan sederhana."
    ],
    "deep": [
      "memperhatikan hubungan antarurutan.",
      "menghubungkan susunan gambar dengan rutinitas pribadi.",
      "menyusun kartu melalui aktivitas bermain."
    ],
    "habit": "Bangun Pagi — membangun kebiasaan mengawali hari secara teratur.",
    "indicator": "Anak menyusun empat kegiatan pagi sesuai urutan permainan. Guru mengamati kemampuan anak saat menjelaskan kembali urutan itu secara sederhana."
  },
  "worshipQuiz": {
    "title": "Pilih Kegiatan Ibadah",
    "cp": "Nilai Agama dan Budi Pekerti; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali gambar kegiatan berdoa, salat berjamaah, dan mengaji bersama keluarga.",
      "Membedakan kegiatan ibadah dari kegiatan lainnya.",
      "Memilih gambar sesuai petunjuk.",
      "Menumbuhkan sikap positif terhadap kegiatan ibadah.",
      "Menghubungkan kegiatan ibadah dengan pengalaman sehari-hari."
    ],
    "deep": [
      "memperhatikan gambar dan petunjuk.",
      "mengenali kegiatan ibadah yang dilakukan bersama keluarga.",
      "belajar melalui pilihan gambar interaktif."
    ],
    "habit": "Beribadah — mengenalkan pembiasaan ibadah sesuai agama dan keyakinan.",
    "indicator": "Anak memilih gambar berdoa, salat berjamaah, dan mengaji bersama keluarga dari pilihan yang tersedia."
  },
  "worshipOrder": {
    "title": "Urutkan Kegiatan Ibadah",
    "cp": "Nilai Agama dan Budi Pekerti; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali kegiatan wudu, salat, dan berdoa.",
      "Mengurutkan ketiga gambar sesuai alur permainan.",
      "Mengembangkan kemampuan berpikir runtut.",
      "Melatih koordinasi mata dan tangan.",
      "Menunjukkan ketelitian saat menyusun kartu."
    ],
    "deep": [
      "memperhatikan urutan yang ditampilkan.",
      "menghubungkan permainan dengan pengalaman beribadah.",
      "menyusun kartu bergambar secara interaktif."
    ],
    "habit": "Beribadah — membiasakan anak mengenal aktivitas ibadah dalam kehidupan sehari-hari.",
    "indicator": "Anak mengurutkan gambar wudu, salat, dan berdoa sesuai alur permainan.",
    "note": "Urutan ini merupakan alur aktivitas dalam game, bukan ketentuan bahwa seluruh ibadah selalu harus dilakukan dalam urutan tersebut."
  },
  "worshipBenefits": {
    "title": "Pasangkan Manfaat Ibadah",
    "cp": "Nilai Agama dan Budi Pekerti; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali manfaat sederhana dari kegiatan ibadah.",
      "Menghubungkan wudu dengan kebersihan diri.",
      "Mengenali berdoa sebagai bentuk permohonan dan rasa syukur.",
      "Memasangkan gambar kegiatan dengan manfaatnya.",
      "Menumbuhkan sikap positif terhadap kebiasaan beribadah."
    ],
    "deep": [
      "mengamati hubungan gambar dan makna.",
      "mengaitkan ibadah dengan kebersihan, ketenangan, dan rasa syukur.",
      "memasangkan kartu melalui permainan."
    ],
    "habit": "Beribadah — mengenalkan nilai positif dan makna pembiasaan ibadah.",
    "indicator": "Anak memasangkan kegiatan ibadah dengan manfaat yang sesuai dan mengungkapkan alasan sederhana."
  },
  "sportCards": {
    "title": "Kenali Kegiatan Olahraga",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali berbagai kegiatan olahraga.",
      "Membedakan aktivitas olahraga dari aktivitas bukan olahraga.",
      "Memilih gambar sesuai petunjuk.",
      "Mengenali manfaat bergerak bagi kesehatan.",
      "Menunjukkan ketelitian dan percaya diri saat memilih."
    ],
    "deep": [
      "mengamati gambar sebelum memilih.",
      "menghubungkan olahraga dengan kebiasaan hidup sehat.",
      "mengenali olahraga melalui kartu interaktif."
    ],
    "habit": "Berolahraga — mengenalkan aktivitas fisik sebagai kebiasaan menjaga kesehatan.",
    "indicator": "Anak memilih gambar kegiatan olahraga dengan tepat dan menyebutkan salah satu manfaat bergerak."
  },
  "sportMoves": {
    "title": "Ayo Ikuti Gerak SAGI",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali contoh aktivitas olahraga melalui dua video gerak SAGI.",
      "Mengamati dan menirukan gerakan sesuai kemampuan.",
      "Melatih koordinasi tubuh, keseimbangan, dan kelenturan.",
      "Menunjukkan keberanian dan partisipasi saat bergerak dengan aman.",
      "Mengenali aktivitas fisik sebagai kebiasaan yang menyenangkan."
    ],
    "deep": [
      "Memperhatikan contoh dan menyesuaikan gerakan dengan kondisi tubuh.",
      "Mengaitkan gerak aktif dengan kegiatan olahraga sehari-hari.",
      "Bergerak bersama SAGI dan mengulang video bila ingin berlatih lagi."
    ],
    "habit": "Berolahraga — mempraktikkan kebiasaan berolahraga melalui gerakan sederhana yang aman dan menyenangkan.",
    "indicator": "Guru mengamati partisipasi, koordinasi, dan kemampuan anak menirukan gerakan sesuai tahap perkembangannya. Status video hanya mencatat pemutaran dan penyelesaian tahap permainan."
  },
  "shelf": {
    "title": "Pilih Buku Pengetahuan",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni; Jati Diri.",
    "goals": [
      "Menunjukkan minat terhadap buku dan pengetahuan.",
      "Mengenali tema buku berdasarkan gambar.",
      "Memilih buku sesuai ketertarikan.",
      "Mengungkapkan pilihan secara sederhana.",
      "Menunjukkan rasa ingin tahu terhadap informasi baru."
    ],
    "deep": [
      "memperhatikan gambar dan menentukan pilihan.",
      "menghubungkan isi buku dengan pengalaman anak.",
      "menjelajahi pilihan buku yang menarik."
    ],
    "habit": "Gemar Belajar — menumbuhkan minat dan rasa ingin tahu untuk belajar.",
    "indicator": "Anak memilih buku atau tema pengetahuan dan menunjukkan ketertarikan untuk mengeksplorasinya."
  },
  "habitat": {
    "title": "Pasangkan Hewan dan Habitat",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali beberapa jenis hewan.",
      "Mengenali tempat hidup hewan.",
      "Memasangkan hewan dengan habitat yang sesuai.",
      "Mengembangkan kemampuan mengamati dan mengelompokkan.",
      "Menunjukkan rasa ingin tahu terhadap alam."
    ],
    "deep": [
      "mengamati ciri gambar sebelum memasangkan.",
      "menghubungkan hewan dengan lingkungan tempat hidupnya.",
      "memasangkan kartu melalui permainan eksplorasi."
    ],
    "habit": "Gemar Belajar — mengembangkan keingintahuan terhadap hewan dan alam.",
    "indicator": "Anak memasangkan gambar hewan dengan habitat yang sesuai dan menyebutkan alasan sederhana."
  },
  "letters": {
    "title": "Susun Huruf Menjadi Kata",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali simbol huruf.",
      "Mengamati hubungan huruf dengan kata.",
      "Menyusun huruf sesuai kata sasaran.",
      "Mengembangkan koordinasi mata dan tangan.",
      "Menunjukkan minat pada kegiatan pramembaca."
    ],
    "deep": [
      "memperhatikan bentuk dan susunan huruf.",
      "menghubungkan kata dengan gambar atau benda.",
      "bereksperimen menyusun huruf melalui permainan."
    ],
    "habit": "Gemar Belajar — menumbuhkan minat terhadap huruf dan kata.",
    "indicator": "Anak menyusun huruf menjadi kata sederhana dengan dukungan sesuai tahap perkembangannya."
  },
  "plate": {
    "title": "Piring Sehatku",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali nasi, ikan, sayur, buah, susu, dan air putih.",
      "Mencocokkan gambar makanan dan minuman dengan siluet.",
      "Mengembangkan kemampuan mengamati bentuk.",
      "Melatih koordinasi mata dan tangan.",
      "Mengenali pentingnya makanan beragam dan air putih."
    ],
    "deep": [
      "memperhatikan bentuk dan posisi gambar.",
      "menghubungkan makanan dengan kebutuhan tubuh.",
      "menyusun piring sehat melalui permainan interaktif."
    ],
    "habit": "Makan Sehat dan Bergizi — mengenalkan kebiasaan mengonsumsi makanan beragam dan minuman yang mendukung kesehatan.",
    "indicator": "Anak mencocokkan keenam kartu dengan siluet yang tepat dan menyebutkan contoh makanan atau minuman sehat."
  },
  "basket": {
    "title": "Keranjang Sehat",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali berbagai makanan dan minuman.",
      "Membedakan pilihan sehari-hari dan pilihan yang perlu dibatasi.",
      "Mengelompokkan kartu ke keranjang yang sesuai.",
      "Mengembangkan kemampuan membandingkan dan mengambil keputusan.",
      "Mengenali kebiasaan memilih makanan secara bijak."
    ],
    "deep": [
      "memperhatikan jenis makanan sebelum memilih.",
      "menghubungkan pilihan makanan dengan kebiasaan di rumah.",
      "mengelompokkan makanan melalui permainan."
    ],
    "habit": "Makan Sehat dan Bergizi — membiasakan pemilihan makanan dan minuman yang mendukung kesehatan.",
    "indicator": "Anak mengelompokkan kartu ke kategori Sehat Sehari-hari atau Perlu Dibatasi secara tepat dan menyebutkan alasan sederhana."
  },
  "socialBoard": {
    "title": "Papan Sahabat",
    "cp": "Nilai Agama dan Budi Pekerti; Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali contoh sikap baik terhadap orang lain.",
      "Membedakan perilaku baik dan tidak baik.",
      "Mengelompokkan gambar ke papan yang sesuai.",
      "Mengembangkan kepedulian dan tanggung jawab.",
      "Menunjukkan pemahaman tentang aturan sederhana dalam kehidupan bersama."
    ],
    "deep": [
      "mempertimbangkan akibat dari perilaku.",
      "menghubungkan gambar dengan pengalaman bersama teman.",
      "memilih dan mengelompokkan kartu secara interaktif."
    ],
    "habit": "Bermasyarakat — membiasakan sikap peduli, tertib, dan bertanggung jawab.",
    "indicator": "Anak mengelompokkan kartu ke papan SIKAP BAIK atau SIKAP TIDAK BAIK secara tepat dan menyebutkan satu contoh sikap baik."
  },
  "socialQuiz": {
    "title": "Pilih Sikap dalam Situasi",
    "cp": "Nilai Agama dan Budi Pekerti; Jati Diri.",
    "goals": [
      "Mengenali situasi ketika teman membutuhkan bantuan.",
      "Menunjukkan kepedulian terhadap teman yang terjatuh.",
      "Membedakan tindakan menolong dari tindakan yang tidak tepat.",
      "Memilih tindakan yang menunjukkan empati.",
      "Mengungkapkan alasan sederhana untuk membantu teman."
    ],
    "deep": [
      "memperhatikan keadaan teman dan pilihan tindakan.",
      "menghubungkan situasi dengan pengalaman di sekolah.",
      "belajar mengambil keputusan melalui cerita bergambar."
    ],
    "habit": "Bermasyarakat — membiasakan empati dan saling menolong.",
    "indicator": "Anak memilih tindakan menolong teman yang terjatuh dan menjelaskan alasan sederhana."
  },
  "night": {
    "title": "Urutkan Kegiatan Sebelum Tidur",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali kebiasaan baik sebelum tidur.",
      "Mengurutkan kegiatan merapikan mainan, menggosok gigi, berdoa, dan tidur.",
      "Mengembangkan kemampuan berpikir runtut.",
      "Melatih kemandirian dalam rutinitas malam.",
      "Mengenali pentingnya tidur tepat waktu bagi kesehatan."
    ],
    "deep": [
      "memperhatikan urutan kegiatan sebelum tidur.",
      "menghubungkan permainan dengan kebiasaan malam di rumah.",
      "menyusun kartu melalui permainan interaktif."
    ],
    "habit": "Tidur Cepat — membangun kebiasaan tidur tepat waktu dan mempersiapkan diri untuk beristirahat.",
    "indicator": "Anak menyusun empat kartu sesuai urutan permainan dan menceritakan kembali rutinitas sebelum tidur."
  },
  "puzzle": {
    "title": "Puzzle Pagi Ajaib",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengamati warna, bentuk, dan rincian pada gambar petunjuk.",
      "Menghubungkan empat keping dengan gambar utuh.",
      "Memindahkan keping ke kotak yang sesuai dengan koordinasi mata dan tangan.",
      "Memeriksa posisi dan mencoba kembali ketika keping belum pas."
    ],
    "deep": [
      "Memusatkan perhatian pada bagian gambar yang menjadi petunjuk posisi.",
      "Menghubungkan ilustrasi dengan pengalaman bangun pagi.",
      "Menemukan tempat setiap keping hingga gambar utuh terlihat."
    ],
    "habit": "Bangun Pagi — menggunakan gambar pagi sebagai pemantik percakapan tentang kegiatan setelah bangun.",
    "indicator": "Anak memasang keempat keping pada posisi yang tepat. Guru dapat mengamati petunjuk visual yang digunakan anak."
  },
  "memory": {
    "title": "Memory Game Pasangan Pagi Ceria",
    "cp": "Jati Diri; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni.",
    "goals": [
      "Mengenali gambar kegiatan pagi yang muncul pada kartu.",
      "Mengingat letak kartu setelah kartu ditutup kembali.",
      "Memasangkan tiga pasang gambar yang sama.",
      "Menunggu hasil pemeriksaan pasangan sebelum memilih kartu berikutnya."
    ],
    "deep": [
      "Memusatkan perhatian pada gambar dan mengingat letaknya.",
      "Mengaitkan gambar dengan kegiatan yang pernah dilakukan anak pada pagi hari.",
      "Membuka kartu dan menemukan pasangan melalui percobaan yang menyenangkan."
    ],
    "habit": "Bangun Pagi — menguatkan pengenalan gambar rutinitas pagi melalui permainan pasangan.",
    "indicator": "Anak menemukan tiga pasangan gambar dan, melalui observasi guru, dapat menyebutkan satu kegiatan pagi yang dikenali."
  },
  "worshipMatch": {
    "title": "Pilih Perlengkapan Ibadah",
    "cp": "Nilai Agama dan Budi Pekerti; Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni",
    "goals": [
      "Mengenali sajadah, mukena, Al-Qur’an, tasbih, dan kopiah.",
      "Membedakan perlengkapan ibadah dari mainan atau tas.",
      "Memilih lima gambar perlengkapan yang sesuai.",
      "Menghubungkan satu perlengkapan dengan kegunaannya melalui percakapan bersama guru."
    ],
    "deep": [
      "Mengamati ciri benda sebelum memilih.",
      "Mengaitkan gambar dengan perlengkapan yang dijumpai saat beribadah.",
      "Menemukan perlengkapan melalui pilihan bergambar dan umpan balik SAGI."
    ],
    "habit": "Beribadah — mengenalkan perlengkapan ibadah yang dapat dijumpai dalam keseharian.",
    "indicator": "Anak memilih lima perlengkapan yang tepat. Guru dapat meminta anak menjelaskan kegunaan salah satunya."
  },
  "panen": {
    "title": "Ayo, Memanen Apel",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni; Jati Diri.",
    "goals": [
      "Mengenali bilangan dan lambang bilangan sesuai rentang angka dalam permainan.",
      "Menghitung jumlah apel melalui kegiatan memanen secara interaktif.",
      "Menghubungkan banyaknya apel dengan lambang bilangan yang sesuai.",
      "Mengembangkan koordinasi mata dan tangan saat memilih atau memindahkan apel.",
      "Menunjukkan ketelitian, ketekunan, dan percaya diri dalam menyelesaikan tantangan berhitung."
    ],
    "deep": [
      "Anak memperhatikan jumlah apel, menghitung satu per satu, dan memeriksa hasil hitungannya.",
      "Anak memahami bahwa bilangan digunakan untuk menyatakan jumlah benda dalam kehidupan sehari-hari.",
      "Anak belajar matematika awal melalui kegiatan memanen apel dalam lingkungan permainan fantasi yang menarik."
    ],
    "habit": "Gemar Belajar — Menumbuhkan rasa ingin tahu dan minat belajar matematika awal melalui kegiatan menghitung buah secara konkret dan menyenangkan.",
    "indicator": [
      "Menghitung jumlah apel sesuai rentang bilangan yang digunakan.",
      "Mengenali lambang bilangan yang ditampilkan.",
      "Mencocokkan jumlah apel dengan lambang bilangan yang sesuai.",
      "Menyelesaikan tantangan memanen apel dengan ketelitian sesuai tahap perkembangannya."
    ],
    "note": "Permainan memeriksa jumlah apel untuk tiga target berurutan, yaitu 3, 4, dan 5 apel. Guru dapat mengamati cara anak menghitungnya."
  },
  "pola": {
    "title": "Tentukan Polanya",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni",
    "goals": [
      "Mengamati urutan gambar bintang dan hati.",
      "Mengenali pengulangan sederhana pada pola AB dan AAB.",
      "Memilih gambar yang melengkapi pola, lalu memeriksa jawaban.",
      "Mencoba pilihan lain setelah menerima petunjuk."
    ],
    "deep": [
      "Memperhatikan urutan gambar dari awal sebelum memilih.",
      "Mengaitkan pola gambar dengan pengulangan pada benda di sekitar anak.",
      "Melengkapi pola melalui kartu berwarna dan umpan balik yang ramah."
    ],
    "habit": "Gemar Belajar — menumbuhkan rasa ingin tahu tentang keteraturan dan pengulangan.",
    "indicator": "Anak melengkapi dua pola gambar. Guru dapat meminta anak menunjukkan bagian yang berulang."
  },
  "tempat": {
    "title": "Di Mana Tempatnya?",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni; Jati Diri.",
    "goals": [
      "Mengenali gambar benda atau objek yang ditampilkan dalam permainan.",
      "Mengidentifikasi hubungan antara benda dan tempat yang sesuai.",
      "Mengamati petunjuk visual untuk menentukan pasangan yang tepat.",
      "Mengembangkan kemampuan mengelompokkan, menghubungkan informasi, dan berpikir logis sederhana.",
      "Menunjukkan ketelitian, rasa ingin tahu, dan percaya diri dalam menentukan pilihan."
    ],
    "deep": [
      "Anak memperhatikan ciri gambar dan petunjuk sebelum menentukan tempat yang sesuai.",
      "Anak menghubungkan objek pada permainan dengan benda dan lingkungan yang dikenalnya dalam kehidupan sehari-hari.",
      "Anak menemukan tempat yang sesuai melalui aktivitas mencocokkan gambar secara interaktif."
    ],
    "habit": "Gemar Belajar — Mengembangkan rasa ingin tahu, kemampuan mengamati, dan keterampilan menghubungkan informasi melalui permainan eksplorasi.",
    "indicator": [
      "Mengenali objek yang ditampilkan.",
      "Memilih tempat yang sesuai berdasarkan petunjuk permainan.",
      "Memasangkan objek dan tempat secara tepat.",
      "Mengungkapkan alasan sederhana mengenai pilihannya, dengan bantuan guru jika diperlukan."
    ],
    "note": "Anak menghubungkan gambar buku, pensil, bola, dan balok dengan tempat penyimpanannya. Guru dapat meminta anak menjelaskan pilihannya."
  },
  "syllables": {
    "title": "Level 2 — Sempurnakan Suku Kata",
    "cp": "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni; Jati Diri.",
    "goals": [
      "Mengenali bunyi yang diucapkan guru atau orang tua serta bentuk suku kata sederhana.",
      "Mengamati hubungan antara bunyi, suku kata, dan kata yang ditampilkan.",
      "Memilih dan menyusun kepingan suku kata sesuai contoh kata sederhana.",
      "Mengembangkan kemampuan literasi awal melalui pengenalan pola bunyi bahasa.",
      "Menunjukkan ketelitian, ketekunan, dan percaya diri saat menyelesaikan tantangan."
    ],
    "deep": [
      "Anak memperhatikan bunyi, susunan huruf, dan bagian kata yang belum lengkap sebelum memilih jawaban.",
      "Anak menghubungkan suku kata dengan kata yang dikenal dalam kehidupan sehari-hari.",
      "Anak menyempurnakan kata melalui permainan interaktif yang memberikan pengalaman keberhasilan dan umpan balik positif."
    ],
    "habit": "Gemar Belajar — Menumbuhkan minat terhadap bahasa dan literasi awal melalui aktivitas mengenali bunyi, memilih suku kata, dan melengkapi kata sederhana.",
    "indicator": [
      "Mengenali bentuk suku kata yang tersedia.",
      "Menghubungkan bunyi yang didengar dengan pilihan suku kata, melalui pendampingan guru atau orang tua.",
      "Menyusun kepingan suku kata sesuai contoh kata yang ditampilkan.",
      "Menyelesaikan tantangan sesuai tahap perkembangan dan dukungan yang diperlukan."
    ],
    "note": "Guru atau orang tua mendampingi pengucapan bunyi. Permainan memeriksa susunan kepingan suku kata."
  }
};
