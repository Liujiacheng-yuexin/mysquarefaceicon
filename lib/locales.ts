export const siteUrl = "https://mysquarefaceicon.com";

export const localeCodes = ["en", "es", "vi", "ja", "th", "ar", "ru", "id"] as const;

export type LocaleCode = (typeof localeCodes)[number];

type Step = {
  title: string;
  text: string;
};

type Card = {
  title: string;
  text: string;
};

type Faq = {
  question: string;
  answer: string;
};

export type LocaleContent = {
  code: LocaleCode;
  label: string;
  shortLabel: string;
  path: string;
  dir: "ltr" | "rtl";
  title: string;
  description: string;
  nav: {
    generator: string;
    howTo: string;
    comments: string;
    faq: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    text: string;
  };
  sections: {
    howEyebrow: string;
    howTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryNote: string;
    featuresEyebrow: string;
    featuresTitle: string;
    useEyebrow: string;
    useTitle: string;
    commentsEyebrow: string;
    commentsTitle: string;
    faqEyebrow: string;
    faqTitle: string;
  };
  steps: Step[];
  features: Card[];
  useCases: Card[];
  faq: Faq[];
  share: {
    label: string;
    copy: string;
    copied: string;
    native: string;
  };
  comments: {
    intro: string;
    name: string;
    email: string;
    rating: string;
    comment: string;
    image: string;
    submit: string;
    pending: string;
    error: string;
    empty: string;
    loadError: string;
  };
  footer: {
    description: string;
    privacy: string;
    terms: string;
  };
};

const sharedFeatures = {
  en: [
    {
      title: "Simple & Fun",
      text: "Open the square face generator, press Start Game, and begin making a cute icon without a long setup flow."
    },
    {
      title: "Free to Use",
      text: "The generator is free to play in your browser and does not require signup, payment, or an installed app."
    },
    {
      title: "Original Game Feel",
      text: "The main tool keeps the familiar Flash avatar maker interaction by running the authorized SWF through Ruffle."
    },
    {
      title: "Browser Friendly",
      text: "Ruffle lets modern browsers play the generator without installing the old Flash Player plugin."
    },
    {
      title: "Fallback Available",
      text: "If Ruffle or the SWF cannot load, a lightweight HTML5 Canvas fallback can still create a square icon."
    },
    {
      title: "Made for Profile Icons",
      text: "The square layout works well for Discord, TikTok, YouTube, forums, game profiles, and small account avatars."
    }
  ],
  es: [
    { title: "Funciona en navegadores modernos", text: "Ruffle ejecuta el SWF autorizado sin instalar el antiguo plugin de Flash." },
    { title: "Sensacion del juego original", text: "La herramienta conserva la interaccion del juego Flash original." },
    { title: "Alternativa disponible", text: "Si Ruffle no carga, el generador HTML5 Canvas puede crear un icono simple." },
    { title: "Sin registro", text: "Empieza a crear un icono de perfil sin cuenta." }
  ],
  vi: [
    { title: "Chay tren trinh duyet hien dai", text: "Ruffle chay SWF duoc phep ma khong can plugin Flash cu." },
    { title: "Cam giac game goc", text: "Cong cu giu trai nghiem Flash quen thuoc." },
    { title: "Co ban du phong", text: "Neu Ruffle khong tai duoc, ban Canvas HTML5 van co the tao icon." },
    { title: "Khong can dang ky", text: "Mo trinh tao va tao anh dai dien ngay lap tuc." }
  ],
  ja: [
    { title: "最新ブラウザで動作", text: "Ruffle により、古い Flash Player を入れずに認可済み SWF を実行できます。" },
    { title: "元のゲーム感", text: "Flash 版の操作感をできるだけ保ったまま遊べます。" },
    { title: "代替ツール付き", text: "Ruffle が読み込めない場合は HTML5 Canvas 版を表示します。" },
    { title: "登録不要", text: "アカウントなしですぐにアイコンを作れます。" }
  ],
  th: [
    { title: "ใช้ได้บนเบราว์เซอร์สมัยใหม่", text: "Ruffle ช่วยเล่นไฟล์ SWF ที่ได้รับอนุญาตโดยไม่ต้องติดตั้ง Flash Player เก่า" },
    { title: "ความรู้สึกแบบเกมต้นฉบับ", text: "ยังคงประสบการณ์ของเกม Flash เดิมไว้" },
    { title: "มีตัวสำรอง", text: "ถ้า Ruffle โหลดไม่ได้ จะมีตัวสร้าง HTML5 Canvas สำรอง" },
    { title: "ไม่ต้องสมัคร", text: "เริ่มสร้างไอคอนโปรไฟล์ได้ทันที" }
  ],
  ar: [
    { title: "يعمل في المتصفحات الحديثة", text: "يشغل Ruffle ملف SWF المصرح به دون الحاجة إلى إضافة Flash القديمة." },
    { title: "إحساس اللعبة الأصلية", text: "تحافظ الأداة على تجربة لعبة Flash المألوفة." },
    { title: "بديل متاح", text: "إذا تعذر تحميل Ruffle، يظهر مولد HTML5 Canvas كخيار احتياطي." },
    { title: "بدون تسجيل", text: "ابدأ إنشاء أيقونة شخصية مباشرة دون حساب." }
  ],
  ru: [
    { title: "Работает в современных браузерах", text: "Ruffle запускает разрешенный SWF без старого плагина Flash Player." },
    { title: "Ощущение оригинальной игры", text: "Инструмент сохраняет знакомое взаимодействие Flash-игры." },
    { title: "Есть запасной вариант", text: "Если Ruffle не загрузится, появится генератор HTML5 Canvas." },
    { title: "Без регистрации", text: "Создавайте иконку профиля сразу, без аккаунта." }
  ],
  id: [
    { title: "Berjalan di browser modern", text: "Ruffle menjalankan SWF berizin tanpa plugin Flash lama." },
    { title: "Rasa game asli", text: "Alat utama mempertahankan interaksi Flash yang familiar." },
    { title: "Fallback tersedia", text: "Jika Ruffle gagal dimuat, generator HTML5 Canvas tetap bisa digunakan." },
    { title: "Tanpa daftar", text: "Mulai membuat ikon profil tanpa akun." }
  ]
} satisfies Record<LocaleCode, Card[]>;

const sharedFaq = {
  en: [
    { question: "What is My Square Face Icon?", answer: "My Square Face Icon is a free square face generator for creating cute square avatar icons in the browser." },
    { question: "Is this Square Face Generator completely free?", answer: "Yes. You can start the generator and create square face icons without signup or payment." },
    { question: "What size are Square Face Generator avatars?", answer: "The original game is designed around small square profile icons. Use the in-game save option when available, or use the HTML5 fallback for a downloadable canvas icon." },
    { question: "Can I use Square Face Generator avatars commercially?", answer: "You can use your generated icons for personal profiles, communities, and most small projects. Avoid using the tool to imitate trademarks, copyrighted characters, or another person's identity." },
    { question: "Does Square Face Generator need installation?", answer: "No. The page runs in the browser with Ruffle for the authorized SWF and does not require installing Flash Player." },
    { question: "Does Square Face Generator work on mobile?", answer: "The website is responsive, but the original SWF is easiest to use on screens with enough room for the full game interface." },
    { question: "How many square face icons can I create?", answer: "You can keep creating new combinations with the game controls. The exact options depend on the original generator interface." },
    { question: "Is My Square Face Icon privacy protected?", answer: "The generator loads in your browser. Comments and optional uploads are reviewed before publishing, and email addresses are not shown publicly." },
    { question: "Is Square Face Generator like Picrew?", answer: "It has a similar avatar-maker purpose, but this site focuses on a square face icon game experience rather than copying Picrew's platform or artwork." },
    { question: "Why does it use Ruffle?", answer: "Ruffle lets modern browsers play the authorized SWF without installing the old Flash plugin." }
  ],
  es: [
    { question: "Que es My Square Face Icon?", answer: "Es un generador gratis que ejecuta un juego Flash autorizado con Ruffle." },
    { question: "Es gratis?", answer: "Si. Puedes crear iconos sin registro." },
    { question: "Por que usa Ruffle?", answer: "Ruffle permite jugar el SWF autorizado en navegadores modernos." },
    { question: "Puedo comentar con imagen?", answer: "Si. Los comentarios se revisan antes de publicarse." },
    { question: "Funciona en movil?", answer: "La pagina es adaptable; el SWF se disfruta mejor con suficiente espacio." }
  ],
  vi: [
    { question: "My Square Face Icon la gi?", answer: "Day la trinh tao square face mien phi chay SWF duoc phep bang Ruffle." },
    { question: "Co mien phi khong?", answer: "Co. Ban co the tao icon ma khong can dang ky." },
    { question: "Tai sao dung Ruffle?", answer: "Ruffle giup trinh duyet hien dai chay SWF ma khong can Flash cu." },
    { question: "Co dang binh luan kem anh duoc khong?", answer: "Co. Binh luan se duoc duyet truoc khi hien thi." },
    { question: "Co dung tren dien thoai khong?", answer: "Trang co responsive, nhung SWF phu hop hon voi man hinh rong." }
  ],
  ja: [
    { question: "My Square Face Icon とは？", answer: "Ruffle で認可済み Flash アバターゲームを動かす無料の四角顔ジェネレーターです。" },
    { question: "無料ですか？", answer: "はい。登録なしでアイコン作成を始められます。" },
    { question: "なぜ Ruffle を使うのですか？", answer: "古い Flash プラグインなしで SWF を現代ブラウザ上で動かすためです。" },
    { question: "画像付きコメントはできますか？", answer: "できます。コメントは承認後に公開されます。" },
    { question: "スマホで使えますか？", answer: "ページはレスポンシブですが、SWF は広い画面の方が快適です。" }
  ],
  th: [
    { question: "My Square Face Icon คืออะไร?", answer: "เป็นตัวสร้างไอคอนหน้าสี่เหลี่ยมฟรีที่เล่นเกม Flash ผ่าน Ruffle" },
    { question: "ใช้ฟรีไหม?", answer: "ใช้ฟรีและไม่ต้องสมัครสมาชิก" },
    { question: "ทำไมใช้ Ruffle?", answer: "เพื่อให้เบราว์เซอร์สมัยใหม่เล่น SWF ได้โดยไม่ต้องใช้ Flash Player เก่า" },
    { question: "คอมเมนต์พร้อมรูปได้ไหม?", answer: "ได้ แต่ต้องผ่านการตรวจสอบก่อนเผยแพร่" },
    { question: "ใช้บนมือถือได้ไหม?", answer: "หน้าเว็บรองรับมือถือ แต่ SWF เหมาะกับหน้าจอที่กว้างกว่า" }
  ],
  ar: [
    { question: "ما هو My Square Face Icon؟", answer: "مولد مجاني لأيقونات الوجه المربع يشغل لعبة Flash مصرحا بها عبر Ruffle." },
    { question: "هل هو مجاني؟", answer: "نعم، يمكنك إنشاء الأيقونات دون تسجيل." },
    { question: "لماذا يستخدم Ruffle؟", answer: "حتى تعمل ملفات SWF في المتصفحات الحديثة دون Flash Player القديم." },
    { question: "هل يمكن إضافة تعليق مع صورة؟", answer: "نعم، لكن التعليقات تظهر بعد المراجعة فقط." },
    { question: "هل يعمل على الهاتف؟", answer: "الصفحة متجاوبة، لكن اللعبة الأصلية أفضل على شاشة أوسع." }
  ],
  ru: [
    { question: "Что такое My Square Face Icon?", answer: "Это бесплатный генератор квадратных аватаров, запускающий разрешенную Flash-игру через Ruffle." },
    { question: "Это бесплатно?", answer: "Да. Можно создавать иконки без регистрации." },
    { question: "Зачем нужен Ruffle?", answer: "Он позволяет запускать SWF в современных браузерах без старого Flash Player." },
    { question: "Можно оставить комментарий с изображением?", answer: "Да. Комментарии публикуются только после проверки." },
    { question: "Работает ли на телефоне?", answer: "Страница адаптивная, но SWF удобнее на широком экране." }
  ],
  id: [
    { question: "Apa itu My Square Face Icon?", answer: "Generator wajah kotak gratis yang menjalankan game Flash berizin lewat Ruffle." },
    { question: "Apakah gratis?", answer: "Ya. Kamu bisa membuat ikon tanpa daftar." },
    { question: "Mengapa memakai Ruffle?", answer: "Agar SWF bisa dimainkan di browser modern tanpa Flash Player lama." },
    { question: "Bisa komentar dengan gambar?", answer: "Bisa. Komentar akan ditinjau sebelum tampil publik." },
    { question: "Apakah bekerja di ponsel?", answer: "Halaman responsif, tetapi SWF lebih nyaman di layar luas." }
  ]
} satisfies Record<LocaleCode, Faq[]>;

const baseUseCases = {
  en: [
    { title: "Social Media Profiles", text: "Create a playful square face icon for TikTok, YouTube, Instagram, X, or any profile page that uses a small avatar." },
    { title: "Game Profiles", text: "Use a simple character icon for game accounts, lobbies, clans, and casual player communities." },
    { title: "Team & Community", text: "Make matching square avatars for friend groups, chat servers, classroom projects, or small online communities." },
    { title: "Creative Projects", text: "Use a cute square face as a placeholder character, profile badge, mood board detail, or lightweight visual identity." }
  ],
  es: [
    { title: "Apps de chat", text: "Crea un icono para Discord, Slack o foros." },
    { title: "Redes sociales", text: "Usa una imagen divertida para TikTok, YouTube, Instagram o X." },
    { title: "Juegos", text: "Crea un personaje simple para perfiles y comunidades." }
  ],
  vi: [
    { title: "Ung dung chat", text: "Tao icon cho Discord, Slack hoac dien dan." },
    { title: "Mang xa hoi", text: "Dung anh dai dien de thuong cho TikTok, YouTube, Instagram hoac X." },
    { title: "Game", text: "Dung icon nhan vat cho ho so va cong dong game." }
  ],
  ja: [
    { title: "チャットアプリ", text: "Discord、Slack、フォーラム用のアイコンに使えます。" },
    { title: "SNS", text: "TikTok、YouTube、Instagram、X のプロフィールに。" },
    { title: "ゲーム", text: "ゲームプロフィールやコミュニティ用のキャラアイコンに。" }
  ],
  th: [
    { title: "แชต", text: "สร้างไอคอนสำหรับ Discord, Slack หรือเว็บบอร์ด" },
    { title: "โซเชียล", text: "ใช้เป็นรูปโปรไฟล์บน TikTok, YouTube, Instagram หรือ X" },
    { title: "เกม", text: "ใช้เป็นไอคอนตัวละครสำหรับโปรไฟล์เกม" }
  ],
  ar: [
    { title: "تطبيقات الدردشة", text: "اصنع أيقونة مميزة لديسكورد أو المنتديات." },
    { title: "الشبكات الاجتماعية", text: "استخدم صورة مرحة لتيك توك ويوتيوب وإنستغرام و X." },
    { title: "الألعاب", text: "استخدم أيقونة شخصية بسيطة للملفات والمجتمعات." }
  ],
  ru: [
    { title: "Чаты", text: "Создайте заметную иконку для Discord, Slack или форумов." },
    { title: "Соцсети", text: "Сделайте веселый аватар для TikTok, YouTube, Instagram или X." },
    { title: "Игры", text: "Используйте простой персонажный значок для игровых профилей." }
  ],
  id: [
    { title: "Aplikasi chat", text: "Buat ikon untuk Discord, Slack, atau forum." },
    { title: "Media sosial", text: "Pakai gambar profil lucu untuk TikTok, YouTube, Instagram, atau X." },
    { title: "Game", text: "Gunakan ikon karakter sederhana untuk profil dan komunitas game." }
  ]
} satisfies Record<LocaleCode, Card[]>;

export const locales: Record<LocaleCode, LocaleContent> = {
  en: {
    code: "en",
    label: "English",
    shortLabel: "EN",
    path: "/",
    dir: "ltr",
    title: "My Square Face Icon - Free Square Face Generator Online",
    description: "Play a free square face generator online. Create cute square face icons in a Ruffle-powered avatar game with an HTML5 fallback.",
    nav: { generator: "Generator", howTo: "How to Use", comments: "Comments", faq: "FAQ" },
    hero: { eyebrow: "Free Ruffle-powered avatar game", h1: "Square Face Generator", text: "Play the square face avatar maker in your browser. Start the game, customize a cute icon, and share your creation with the community." },
    sections: { howEyebrow: "Simple workflow", howTitle: "How It Works", galleryEyebrow: "Guide", galleryTitle: "What Is a Square Face Generator?", galleryNote: "Learn how this browser-based generator helps create cute square profile icons without installing anything.", featuresEyebrow: "Built for quick profiles", featuresTitle: "Why Use This Square Face Generator?", useEyebrow: "Perfect for", useTitle: "Perfect For", commentsEyebrow: "Community", commentsTitle: "Share Your Creation", faqEyebrow: "FAQ", faqTitle: "Frequently Asked Questions" },
    steps: [{ title: "Choose face parts", text: "Press Start Game and use the original tabs to choose face parts, hair, eyes, mouth, clothes, and accessories." }, { title: "Adjust colors & styles", text: "Try different combinations until your square face icon matches the mood you want for your profile or project." }, { title: "Save your square face icon", text: "Use the game save option when supported. If Ruffle cannot load the SWF, use the included HTML5 Canvas fallback." }],
    features: sharedFeatures.en,
    useCases: baseUseCases.en,
    faq: sharedFaq.en,
    share: { label: "Share", copy: "Copy link", copied: "Copied", native: "Share" },
    comments: { intro: "Share feedback or your square face creation. Comments are reviewed before publishing.", name: "Your name", email: "Your email", rating: "Rating", comment: "Write a comment", image: "Optional image", submit: "Submit comment", pending: "Thanks. Your comment is waiting for review.", error: "Something went wrong. Please try again.", empty: "No approved comments yet.", loadError: "Could not load comments." },
    footer: { description: "Free square face generator for quick profile icons.", privacy: "Privacy Policy", terms: "Terms of Service" }
  },
  es: makeLocale("es", "Español", "ES", "/es", "My Square Face Icon - Generador gratis de caras cuadradas", "Juega un generador gratis de caras cuadradas en linea con Ruffle y alternativa HTML5.", "Generador de caras cuadradas"),
  vi: makeLocale("vi", "Tiếng Việt", "VI", "/vi", "My Square Face Icon - Trinh tao square face mien phi", "Choi trinh tao square face mien phi tren trinh duyet voi Ruffle va ban du phong HTML5.", "Square Face Generator"),
  ja: makeLocale("ja", "日本語", "JA", "/ja", "My Square Face Icon - 無料の四角顔ジェネレーター", "Ruffle で遊べる無料の四角顔アイコンジェネレーター。HTML5 代替版もあります。", "四角顔ジェネレーター"),
  th: makeLocale("th", "ไทย", "TH", "/th", "My Square Face Icon - ตัวสร้างหน้าสี่เหลี่ยมฟรี", "เล่นตัวสร้างไอคอนหน้าสี่เหลี่ยมฟรีผ่าน Ruffle พร้อมตัวสำรอง HTML5", "ตัวสร้างหน้าสี่เหลี่ยม"),
  ar: makeLocale("ar", "العربية", "AR", "/ar", "My Square Face Icon - مولد وجه مربع مجاني", "شغل مولد وجه مربع مجاني عبر Ruffle مع بديل HTML5.", "مولد الوجه المربع", "rtl"),
  ru: makeLocale("ru", "Русский", "RU", "/ru", "My Square Face Icon - Бесплатный генератор квадратного лица", "Играйте в бесплатный генератор квадратных аватаров через Ruffle с запасным HTML5-вариантом.", "Генератор квадратного лица"),
  id: makeLocale("id", "Bahasa Indonesia", "ID", "/id", "My Square Face Icon - Generator wajah kotak gratis", "Mainkan generator wajah kotak gratis lewat Ruffle dengan fallback HTML5.", "Generator Wajah Kotak")
};

function makeLocale(
  code: Exclude<LocaleCode, "en">,
  label: string,
  shortLabel: string,
  path: string,
  title: string,
  description: string,
  h1: string,
  dir: "ltr" | "rtl" = "ltr"
): LocaleContent {
  const generic = {
    es: {
      nav: { generator: "Generador", howTo: "Como usar", comments: "Comentarios", faq: "FAQ" },
      hero: { eyebrow: "Juego de avatar con Ruffle", text: "Juega en tu navegador, crea un icono cute de cara cuadrada y comparte tu creacion." },
      sections: ["Flujo simple", "Como usar el generador", "Ejemplos", "Ideas de iconos", "Ejemplos visuales del estilo del generador.", "Hecho para perfiles", "Por que usar My Square Face Icon?", "Usos", "Avatares cuadrados para cada perfil", "Comunidad", "Comentarios", "FAQ", "Preguntas frecuentes"],
      steps: [{ title: "Inicia el juego", text: "Pulsa Start Game para cargar el SWF autorizado con Ruffle." }, { title: "Personaliza la cara", text: "Usa los controles originales para elegir partes, pelo, ropa y colores." }, { title: "Guarda o usa la alternativa", text: "Si Ruffle falla, usa el generador HTML5 Canvas incluido." }],
      share: { label: "Compartir", copy: "Copiar enlace", copied: "Copiado", native: "Compartir" },
      comments: { intro: "Comparte tu opinion o creacion. Los comentarios se revisan antes de publicarse.", name: "Tu nombre", email: "Tu email", rating: "Valoracion", comment: "Escribe un comentario", image: "Imagen opcional", submit: "Enviar comentario", pending: "Gracias. Tu comentario esta en revision.", error: "Algo salio mal.", empty: "Aun no hay comentarios aprobados.", loadError: "No se pudieron cargar los comentarios." },
      footer: { description: "Generador gratis de caras cuadradas para perfiles.", privacy: "Privacidad", terms: "Terminos" }
    },
    vi: {
      nav: { generator: "Trinh tao", howTo: "Cach dung", comments: "Binh luan", faq: "FAQ" },
      hero: { eyebrow: "Game avatar chay bang Ruffle", text: "Choi tren trinh duyet, tao icon square face de thuong va chia se voi cong dong." },
      sections: ["Quy trinh don gian", "Cach dung trinh tao", "Vi du", "Y tuong icon square face", "Cac vi du CSS don gian theo phong cach cong cu.", "Cho anh dai dien nhanh", "Ly do dung My Square Face Icon", "Truong hop su dung", "Avatar vuong cho moi ho so", "Cong dong", "Binh luan", "FAQ", "Cau hoi thuong gap"],
      steps: [{ title: "Bat dau game", text: "Bam Start Game de tai SWF duoc phep bang Ruffle." }, { title: "Tuy chinh khuon mat", text: "Dung dieu khien goc de chon toc, mat, phu kien va mau." }, { title: "Luu hoac dung fallback", text: "Neu Ruffle loi, dung ban HTML5 Canvas du phong." }],
      share: { label: "Chia se", copy: "Sao chep link", copied: "Da sao chep", native: "Chia se" },
      comments: { intro: "Chia se phan hoi hoac hinh tao duoc. Binh luan can duyet truoc.", name: "Ten", email: "Email", rating: "Danh gia", comment: "Viet binh luan", image: "Anh tuy chon", submit: "Gui binh luan", pending: "Cam on. Binh luan dang cho duyet.", error: "Da co loi.", empty: "Chua co binh luan duoc duyet.", loadError: "Khong tai duoc binh luan." },
      footer: { description: "Trinh tao square face mien phi cho avatar.", privacy: "Bao mat", terms: "Dieu khoan" }
    },
    ja: {
      nav: { generator: "生成", howTo: "使い方", comments: "コメント", faq: "FAQ" },
      hero: { eyebrow: "Ruffle で動くアバターゲーム", text: "ブラウザで遊び、かわいい四角顔アイコンを作って共有できます。" },
      sections: ["簡単な流れ", "使い方", "例", "四角顔アイコンのアイデア", "ジェネレーター風のシンプルな例です。", "プロフィール向け", "My Square Face Icon を使う理由", "用途", "あらゆるプロフィールに", "コミュニティ", "ユーザーコメント", "FAQ", "よくある質問"],
      steps: [{ title: "ゲームを開始", text: "Start Game を押して Ruffle で SWF を読み込みます。" }, { title: "顔をカスタム", text: "元のゲーム操作で髪、表情、服、色を選びます。" }, { title: "保存または代替版", text: "Ruffle が失敗した場合は HTML5 Canvas 版を使えます。" }],
      share: { label: "共有", copy: "リンクをコピー", copied: "コピー済み", native: "共有" },
      comments: { intro: "感想や作成したアイコンを共有できます。公開前に確認されます。", name: "名前", email: "メール", rating: "評価", comment: "コメントを書く", image: "任意の画像", submit: "コメント送信", pending: "ありがとうございます。承認待ちです。", error: "エラーが発生しました。", empty: "承認済みコメントはまだありません。", loadError: "コメントを読み込めませんでした。" },
      footer: { description: "プロフィール用の無料四角顔ジェネレーター。", privacy: "プライバシー", terms: "利用規約" }
    },
    th: {
      nav: { generator: "ตัวสร้าง", howTo: "วิธีใช้", comments: "ความคิดเห็น", faq: "FAQ" },
      hero: { eyebrow: "เกมอวาตาร์ผ่าน Ruffle", text: "เล่นในเบราว์เซอร์ สร้างไอคอนหน้าสี่เหลี่ยมน่ารัก และแชร์กับชุมชน" },
      sections: ["ขั้นตอนง่าย", "วิธีใช้ตัวสร้าง", "ตัวอย่าง", "ไอเดียไอคอน", "ตัวอย่างภาพแบบง่ายตามสไตล์เครื่องมือ", "สำหรับโปรไฟล์", "ทำไมต้องใช้ My Square Face Icon", "การใช้งาน", "อวาตาร์สำหรับทุกโปรไฟล์", "ชุมชน", "ความคิดเห็นผู้ใช้", "FAQ", "คำถามที่พบบ่อย"],
      steps: [{ title: "เริ่มเกม", text: "กด Start Game เพื่อโหลด SWF ผ่าน Ruffle" }, { title: "ปรับแต่งใบหน้า", text: "ใช้เมนูเดิมเพื่อเลือกทรงผม สี เสื้อผ้า และอุปกรณ์" }, { title: "บันทึกหรือใช้ตัวสำรอง", text: "ถ้า Ruffle โหลดไม่ได้ ให้ใช้ HTML5 Canvas สำรอง" }],
      share: { label: "แชร์", copy: "คัดลอกลิงก์", copied: "คัดลอกแล้ว", native: "แชร์" },
      comments: { intro: "แชร์ความคิดเห็นหรือผลงานของคุณ ความคิดเห็นจะถูกตรวจสอบก่อนเผยแพร่", name: "ชื่อ", email: "อีเมล", rating: "คะแนน", comment: "เขียนความคิดเห็น", image: "รูปภาพ (ไม่บังคับ)", submit: "ส่งความคิดเห็น", pending: "ขอบคุณ ความคิดเห็นรอตรวจสอบ", error: "เกิดข้อผิดพลาด", empty: "ยังไม่มีความคิดเห็นที่อนุมัติ", loadError: "โหลดความคิดเห็นไม่ได้" },
      footer: { description: "ตัวสร้างหน้าสี่เหลี่ยมฟรีสำหรับโปรไฟล์", privacy: "ความเป็นส่วนตัว", terms: "ข้อกำหนด" }
    },
    ar: {
      nav: { generator: "المولد", howTo: "طريقة الاستخدام", comments: "التعليقات", faq: "الأسئلة" },
      hero: { eyebrow: "لعبة أفاتار عبر Ruffle", text: "شغل اللعبة في المتصفح وأنشئ أيقونة وجه مربع لطيفة وشاركها." },
      sections: ["خطوات بسيطة", "طريقة استخدام المولد", "أمثلة", "أفكار أيقونات", "أمثلة بسيطة على نمط المولد.", "مناسب للملفات الشخصية", "لماذا تستخدم My Square Face Icon؟", "الاستخدامات", "أفاتارات مربعة لكل ملف", "المجتمع", "تعليقات المستخدمين", "FAQ", "أسئلة شائعة"],
      steps: [{ title: "ابدأ اللعبة", text: "اضغط Start Game لتحميل ملف SWF عبر Ruffle." }, { title: "خصص الوجه", text: "استخدم عناصر التحكم الأصلية لاختيار الشعر والتعبير والملابس والألوان." }, { title: "احفظ أو استخدم البديل", text: "إذا فشل Ruffle، استخدم مولد HTML5 Canvas البديل." }],
      share: { label: "مشاركة", copy: "نسخ الرابط", copied: "تم النسخ", native: "مشاركة" },
      comments: { intro: "شارك رأيك أو صورتك. تتم مراجعة التعليقات قبل النشر.", name: "الاسم", email: "البريد", rating: "التقييم", comment: "اكتب تعليقا", image: "صورة اختيارية", submit: "إرسال", pending: "شكرا، تعليقك بانتظار المراجعة.", error: "حدث خطأ.", empty: "لا توجد تعليقات معتمدة بعد.", loadError: "تعذر تحميل التعليقات." },
      footer: { description: "مولد مجاني لأيقونات الوجه المربع.", privacy: "الخصوصية", terms: "الشروط" }
    },
    ru: {
      nav: { generator: "Генератор", howTo: "Как использовать", comments: "Комментарии", faq: "FAQ" },
      hero: { eyebrow: "Аватар-игра через Ruffle", text: "Играйте в браузере, создавайте милую квадратную иконку и делитесь ею." },
      sections: ["Простой процесс", "Как пользоваться генератором", "Примеры", "Идеи квадратных иконок", "Простые примеры в стиле генератора.", "Для быстрых профилей", "Почему My Square Face Icon", "Сценарии", "Аватары для любого профиля", "Сообщество", "Комментарии", "FAQ", "Частые вопросы"],
      steps: [{ title: "Запустите игру", text: "Нажмите Start Game, чтобы загрузить SWF через Ruffle." }, { title: "Настройте лицо", text: "Используйте оригинальные элементы управления для волос, выражения, одежды и цветов." }, { title: "Сохраните или используйте запасной вариант", text: "Если Ruffle не загрузится, используйте HTML5 Canvas." }],
      share: { label: "Поделиться", copy: "Скопировать ссылку", copied: "Скопировано", native: "Поделиться" },
      comments: { intro: "Поделитесь отзывом или созданной иконкой. Комментарии проходят проверку.", name: "Имя", email: "Email", rating: "Оценка", comment: "Напишите комментарий", image: "Изображение необязательно", submit: "Отправить", pending: "Спасибо. Комментарий ожидает проверки.", error: "Что-то пошло не так.", empty: "Одобренных комментариев пока нет.", loadError: "Не удалось загрузить комментарии." },
      footer: { description: "Бесплатный генератор квадратных аватаров.", privacy: "Политика конфиденциальности", terms: "Условия" }
    },
    id: {
      nav: { generator: "Generator", howTo: "Cara pakai", comments: "Komentar", faq: "FAQ" },
      hero: { eyebrow: "Game avatar dengan Ruffle", text: "Main di browser, buat ikon wajah kotak lucu, dan bagikan dengan komunitas." },
      sections: ["Alur sederhana", "Cara menggunakan generator", "Contoh", "Ide ikon wajah kotak", "Contoh visual sederhana dari gaya generator.", "Untuk profil cepat", "Mengapa memakai My Square Face Icon?", "Kegunaan", "Avatar kotak untuk setiap profil", "Komunitas", "Komentar pengguna", "FAQ", "Pertanyaan umum"],
      steps: [{ title: "Mulai game", text: "Tekan Start Game untuk memuat SWF lewat Ruffle." }, { title: "Sesuaikan wajah", text: "Gunakan kontrol asli untuk memilih rambut, ekspresi, pakaian, aksesori, dan warna." }, { title: "Simpan atau pakai fallback", text: "Jika Ruffle gagal, gunakan generator HTML5 Canvas." }],
      share: { label: "Bagikan", copy: "Salin tautan", copied: "Disalin", native: "Bagikan" },
      comments: { intro: "Bagikan komentar atau ikon buatanmu. Komentar ditinjau sebelum tampil.", name: "Nama", email: "Email", rating: "Rating", comment: "Tulis komentar", image: "Gambar opsional", submit: "Kirim komentar", pending: "Terima kasih. Komentar menunggu review.", error: "Terjadi kesalahan.", empty: "Belum ada komentar disetujui.", loadError: "Tidak dapat memuat komentar." },
      footer: { description: "Generator wajah kotak gratis untuk ikon profil.", privacy: "Privasi", terms: "Ketentuan" }
    }
  }[code];

  const sections = generic.sections;
  return {
    code,
    label,
    shortLabel,
    path,
    dir,
    title,
    description,
    nav: generic.nav,
    hero: { eyebrow: generic.hero.eyebrow, h1, text: generic.hero.text },
    sections: {
      howEyebrow: sections[0],
      howTitle: sections[1],
      galleryEyebrow: sections[2],
      galleryTitle: sections[3],
      galleryNote: sections[4],
      featuresEyebrow: sections[5],
      featuresTitle: sections[6],
      useEyebrow: sections[7],
      useTitle: sections[8],
      commentsEyebrow: sections[9],
      commentsTitle: sections[10],
      faqEyebrow: sections[11],
      faqTitle: sections[12]
    },
    steps: generic.steps,
    features: sharedFeatures[code],
    useCases: baseUseCases[code],
    faq: sharedFaq[code],
    share: generic.share,
    comments: generic.comments,
    footer: generic.footer
  };
}

export function getLocalePath(locale: LocaleCode) {
  return locales[locale].path;
}

export function getLocaleUrl(locale: LocaleCode) {
  return `${siteUrl}${getLocalePath(locale) === "/" ? "" : getLocalePath(locale)}`;
}

export function isLocaleCode(value: string): value is Exclude<LocaleCode, "en"> {
  return value !== "en" && localeCodes.includes(value as LocaleCode);
}

export function getLanguageAlternates() {
  return Object.fromEntries(localeCodes.map((locale) => [locale, getLocaleUrl(locale)]));
}
