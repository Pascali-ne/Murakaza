import { CatalogItem } from "./api";

export interface DetailedCatalogItem extends CatalogItem {
  features?: { en: string[]; rw: string[] };
  specifications?: Record<string, string>;
  syllabus?: {
    en: { module: string; topics: string[] }[];
    rw: { module: string; topics: string[] }[];
  };
  certification?: {
    body: "REB" | "NESA" | "MINEDUC" | "MURAKAZA";
    label: { en: string; rw: string };
  };
}

export const CATALOG_ITEMS: DetailedCatalogItem[] = [
  // --- School Supplies ---
  {
    id: "sup-001",
    type: "SUPPLY",
    category: "stationery",
    priceRwf: 4500,
    amountCents: 450000,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Popular",
    stock: 250,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Standard Curriculum Exercise Books Pack (12-Pack)",
      rw: "Ibitabo by'imyitozo by'integanyanyigisho (Paki ya 12)"
    },
    description: {
      en: "High-quality 96-page squared and ruled exercise books aligned with Rwanda Basic Education Board (REB) standards. Thick, ink-bleed resistant pages perfect for ballpoint and fountain pens.",
      rw: "Ibitabo bifite paji 96 biri mu murongo no muri kare byujuje ubuziranenge bwa REB ku banyeshuri. Impapuro zikomeye zidasohora wino."
    },
    features: {
      en: [
        "12 books per pack (6 ruled for languages/humanities, 6 squared for math/sciences)",
        "Durable laminated water-resistant cover with subject and student name space",
        "Acid-free 70gsm smooth white paper approved for primary and secondary schools",
        "Includes standard multiplication table and metric conversion charts on back cover"
      ],
      rw: [
        "Ibitabo 12 muri paki (6 biri mu mirongo, 6 biri muri kare)",
        "Igifuniko gikomeye cyirinda amazi gifite umwanya w'amazina n'isomo",
        "Impapuro zujuje ubuziranenge z'amashuri abanza n'ayisumbuye",
        "Bifite imbonerahamwe y'imibare n'ibipimo inyuma"
      ]
    },
    specifications: {
      "Page Count": "96 Pages per Book",
      "Format": "A5 (148 x 210 mm)",
      "Ruling": "8mm Ruled & 5mm Squared",
      "Paper Weight": "70 gsm White Offset",
      "Cover": "200 gsm Coated Gloss"
    },
    certification: {
      body: "REB",
      label: { en: "REB Standard Approved", rw: "Byemewe n'Integanyanyigisho ya REB" }
    }
  },
  {
    id: "sup-002",
    type: "SUPPLY",
    category: "instruments",
    priceRwf: 3200,
    amountCents: 320000,
    rating: 4.8,
    reviewsCount: 98,
    badge: "Essential",
    stock: 180,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Precision Mathematical Geometry Set (Boîte Géométrique)",
      rw: "Agasanduku k'ibikoresho bya Matematika (Boîte Géométrique)"
    },
    description: {
      en: "Durable metal tin containing heavy-duty compass, dividers, 15cm bevelled ruler, 45° & 60° set squares, 180° protractor, eraser, pencil, and mini pencil sharpener. Authorized for national examinations.",
      rw: "Agasanduku k'ibyuma karimo compas, ibipimo, rula ya 15cm, ibipimo bibiri by'inguni, raporter ya 180°, igihanagura, n'ikaramu. Byemewe mu bizamini bya Leta."
    },
    features: {
      en: [
        "Strict compliance with NESA exam room regulations",
        "Non-rust zinc die-cast compass with secure locking mechanism",
        "Clear, high-contrast metric millimeter graduations",
        "Embossed protective tin protects contents in backpacks"
      ],
      rw: [
        "Byujuje amabwiriza agenga ibizamini bya Leta bya NESA",
        "Compas ikoze mu cyuma kidafata umugese kandi ifunga neza",
        "Imirongo y'ibipimo igaragara neza cyane",
        "Agasanduku gakomeye kirinda ibikoresho kumeneka"
      ]
    },
    specifications: {
      "Case Material": "Embossed Tinplate",
      "Components": "9 Precision Instruments",
      "Ruler Length": "15 cm (mm accuracy)",
      "Safety": "Blunt-point divider for student safety"
    },
    certification: {
      body: "NESA",
      label: { en: "Authorized for National Exams", rw: "Byemewe mu Bizamini bya Leta" }
    }
  },
  {
    id: "sup-003",
    type: "SUPPLY",
    category: "backpacks",
    priceRwf: 14500,
    amountCents: 1450000,
    rating: 4.9,
    reviewsCount: 76,
    badge: "Durable",
    stock: 65,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Waterproof Ergonomic Student Backpack",
      rw: "Igikapu cy'ishuri gikomeye kandi kidasohora amazi"
    },
    description: {
      en: "Spacious multi-compartment bag crafted from rugged water-repellent nylon. Features orthopedic lumbar padding, night-reflective safety strips, padded laptop/tablet sleeve, and reinforced double stitching.",
      rw: "Igikapu gifite imyanya myinshi, kidapfumurwa n'imvura. Gifite umusego urinda umugongo, imikandara yoroshye, n'ibimenyetso bibona mu mwijima ku mutekano w'abanyeshuri."
    },
    features: {
      en: [
        "Rainproof coated polyester protects books during Rwandan rainy seasons",
        "Anatomical S-curve shoulder straps distribute weight evenly across spine",
        "Reinforced base with rubber studs to resist ground wear",
        "Dual elastic side pockets for water bottle and umbrella"
      ],
      rw: [
        "Irinda ibitabo imvura muri ibi bihe by'imvura",
        "Imikandara yoroshye igabanya uburemere ku mugongo",
        "Hasi hakomejwe ku buryo kidapfa gucika",
        "Ibyicaro bibiri byo ku mpande by'icupa ry'amazi n'umutaka"
      ]
    },
    specifications: {
      "Capacity": "28 Liters",
      "Material": "Waterproof 900D Oxford Cloth",
      "Weight": "650 grams",
      "Dimensions": "45 x 30 x 18 cm"
    }
  },
  {
    id: "sup-004",
    type: "SUPPLY",
    category: "electronics",
    priceRwf: 12500,
    amountCents: 1250000,
    rating: 4.7,
    reviewsCount: 110,
    badge: "O/A-Level",
    stock: 90,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Approved Scientific Calculator FX-82MS",
      rw: "Imashini ibara y'ikoranabuhanga (Calculatrice Scientifique)"
    },
    description: {
      en: "240 functions with dual-line clear dot-matrix display. Authorized by NESA for O-Level and A-Level STEM national examinations. Includes robust slide-on hard case.",
      rw: "Imashini ifite imikorere 240, yemewe na NESA gukoreshwa mu bizamini bya Leta by'ikoranabuhanga n'imibare. Ifite agafuniko gakomeye cyane karinda ikirahuri."
    },
    features: {
      en: [
        "NESA exam-compliant non-programmable model",
        "Two-line display shows formula and result simultaneously",
        "Statistical calculations (standard deviation, regression analysis)",
        "Long battery life with automatic power-off saving mode"
      ],
      rw: [
        "Yemewe mu bizamini bya NESA kuko idafite porogaramu zibitswamo",
        "Yerekana imibare yose n'igisubizo icyarimwe ku mirongo ibiri",
        "Ikora imibare yose y'ibarurishamibare (Statistique)",
        "Bateri imara igihe kirekire cyane kandi irizima"
      ]
    },
    specifications: {
      "Display": "2-Line Dot Matrix (10+2 Digits)",
      "Functions": "240 Scientific & Statistical Functions",
      "Power": "1x AAA Battery (Included)",
      "Case": "Slide-on protective hard case"
    },
    certification: {
      body: "NESA",
      label: { en: "NESA Examination Approved", rw: "Yemewe mu Bizamini bya Leta na NESA" }
    }
  },
  {
    id: "sup-005",
    type: "SUPPLY",
    category: "uniforms",
    priceRwf: 9500,
    amountCents: 950000,
    rating: 4.8,
    reviewsCount: 54,
    badge: "Custom Fit",
    stock: 120,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Standard School Uniform Voucher Package",
      rw: "Icyemezo cyo kudonderwa umwambaro w'ishuri"
    },
    description: {
      en: "Redeemable at verified partner tailors across Kigali, Musanze, Huye, Rubavu, and Rwamagana. Breathable, colorfast poly-cotton blend tailored to your school's exact regulations.",
      rw: "Ushobora kuyidondera ku badozi b'abafatanyabikorwa i Kigali, Musanze, Huye, Rubavu, na Rwamagana. Imyenda ikomeye, idacika amabara, idozwe neza ku mabwiriza y'ishuri ryawe."
    },
    features: {
      en: [
        "Valid across 45+ accredited tailors nationwide",
        "Includes standard shirt/blouse plus trousers or pleated skirt",
        "Double-hemmed seams and tear-resistant pocket linings",
        "Free size exchange within 14 days of tailoring"
      ],
      rw: [
        "Yakirwa ku badozi barenga 45 bafitanye amasezerano mu gihugu hose",
        "Irimo ishati/ishati y'abakobwa n'ipantalo cyangwa ijipo",
        "Idozwe neza mu buryo budapfa gucika",
        "Guhindura ingano ku buntu mu minsi 14"
      ]
    },
    specifications: {
      "Fabric": "65% Polyester, 35% Combed Cotton",
      "Sizes": "Primary & Secondary Custom Fitting",
      "Validity": "Voucher valid for 90 days from purchase"
    }
  },
  {
    id: "sup-006",
    type: "SUPPLY",
    category: "stem",
    priceRwf: 24000,
    amountCents: 2400000,
    rating: 5.0,
    reviewsCount: 33,
    badge: "STEM Kit",
    stock: 40,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Secondary Science Lab & Microscopy Explorer Kit",
      rw: "Ibikoresho by'ubumenyi n'ubushakashatsi (Kit ya Laboratwari)"
    },
    description: {
      en: "Safe LED illuminated optical microscope (up to 120x zoom), prepared specimen slides (plant and insect biology), graduated droppers, petri dish, and bilingual guide aligned with REB science curricula.",
      rw: "Icyuma cyagura ibitagaragara (microscope) ifite urumuri rwa LED, ibipimo byo gusuzuma ibinyabuzima, n'igitabo kiyobora amasomo y'ubumenyi mu Kinyarwanda no mu Cyongereza."
    },
    features: {
      en: [
        "Battery-powered LED light suitable for non-electrified study environments",
        "Includes 5 prepared biological slides and 5 blank glass slides with coverslips",
        "Compact shockproof padded carry case for school transit",
        "Designed to bring practical STEM laboratory experiments straight to the home"
      ],
      rw: [
        "Urumuri rwa LED rukoresha bateri ku buryo no mu cyaro rwakoreshwa",
        "Harimo ibizamini 5 byateguwe by'ibinyabuzima n'ibirahure 5 byo gukoreraho",
        "Agasanduku gakomeye kirinda ibikoresho kumeneka mu rugendo",
        "Gufasha abanyeshuri gukora ubushakashatsi bwa STEM mu rugo"
      ]
    },
    specifications: {
      "Magnification": "40x - 120x Optical Zoom",
      "Illumination": "Top & Bottom White LED",
      "Power": "2x AA Batteries",
      "Target Curriculum": "Primary 6 & Secondary S1-S4"
    },
    certification: {
      body: "REB",
      label: { en: "REB STEM Curriculum Companion", rw: "Ishingiye ku nteganyanyigisho ya REB" }
    }
  },

  // --- Guided Courses ---
  {
    id: "crs-001",
    type: "COURSE",
    category: "stem",
    priceRwf: 15000,
    amountCents: 1500000,
    rating: 4.95,
    reviewsCount: 215,
    badge: "Top Rated",
    instructor: "Mwalimu Jean-Paul N. (Ex-NESA Examiner)",
    duration: "6 Weeks (Live & Recorded)",
    level: "Primary (P6)",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Primary Leaving Exam (PLE) Complete Sprint",
      rw: "Itegure neza ikizamini cya Leta cy'amashuri abanza (P6)"
    },
    description: {
      en: "Comprehensive exam preparation covering Mathematics, Science & Elementary Technology (SET), Social Studies, and English past papers with step-by-step guidance from former national examiners.",
      rw: "Kusubiramo imibare, SET, ubumenyi bw'isi n'amateka, n'Icyongereza hamwe n'ingero z'ibizamini bya Leta bishize, wungurwa ubumenyi n'abahoze bakosora ibizamini bya Leta."
    },
    features: {
      en: [
        "Weekly live Q&A sessions on Sunday afternoons + replay recordings",
        "Downloadable PDF study summaries formatted for mobile and offline revision",
        "Simulated mock examinations with personalized feedback and grading",
        "Telegram & WhatsApp study group support with teacher assistants"
      ],
      rw: [
        "Amasomo y'imbona-nkubone ku cyumweru na videwo zifatika zo gusubiramo",
        "Impapuro z'incamake ziri muri PDF ushobora gusomera kuri telefone nta internet",
        "Ibizamini by'igeragezwa hamwe no gukosorerwa no kubwirwa aho gukosora",
        "Itsinda rya WhatsApp na Telegram rifasha umunyeshuri umunsi ku wundi"
      ]
    },
    syllabus: {
      en: [
        { module: "Module 1: High-Yield Math Formulas", topics: ["Fractions & Percentages", "Algebraic Word Problems", "Geometry & Angles"] },
        { module: "Module 2: SET Science Deep Dive", topics: ["Digestive & Circulatory Systems", "Electricity & Simple Machines", "Environmental Science"] },
        { module: "Module 3: Social Studies & Civics", topics: ["History of Rwanda & Heroes", "East African Community", "Map Reading Skills"] },
        { module: "Module 4: Exam Strategy & Time Management", topics: ["Answering Multiple Choice Fast", "Handling Section B Essays", "Full Mock PLE Test"] }
      ],
      rw: [
        { module: "Igice cya 1: Amategeko y'Ingirakamaro mu Mibare", topics: ["Imibare y'ibice n'ijana", "Ibibazo by'amagambo", "Inguni n'ubuso bw'ibintu"] },
        { module: "Igice cya 2: SET n'Ubumenyi", topics: ["Umubiri w'umuntu", "Amashanyarazi n'imashini zoroshye", "Kurengera ibidukikije"] },
        { module: "Igice cya 3: Ubumenyi bw'Isi n'Amateka", topics: ["Amateka y'u Rwanda n'Intwari", "Umuryango wa Afurika y'Iburasirazuba (EAC)", "Gusoma amakarita"] },
        { module: "Igice cya 4: Amayeri yo Gutsinda Ikizamini", topics: ["Guhitamo igisubizo nyacyo vuba", "Kwandika ibisubizo birambuye", "Gukora ikizamini cy'igeragezwa"] }
      ]
    },
    certification: {
      body: "MURAKAZA",
      label: { en: "Murakaza PLE Certificate", rw: "Icyemezo cya Murakaza cyo Kurangiza Isomo" }
    }
  },
  {
    id: "crs-002",
    type: "COURSE",
    category: "stem",
    priceRwf: 18000,
    amountCents: 1800000,
    rating: 4.9,
    reviewsCount: 168,
    badge: "Bestseller",
    instructor: "Eng. Diane Uwase & Team",
    duration: "8 Weeks (Interactive)",
    level: "Ordinary Level (S1 - S3)",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "O-Level Mathematics & Physics Breakthrough",
      rw: "Gutsinda neza Imibare n'Ubugenge mu Cyiciro rusange (S1-S3)"
    },
    description: {
      en: "Transform STEM anxiety into high performance. Covers linear equations, quadratic functions, trigonometry, vectors, kinematics, Newton's laws, and circuit electricity with engaging, intuitive explanations.",
      rw: "Amasomo asobanutse neza mu mibare n'ubugenge mu Kinyarwanda no mu Cyongereza, kugira ngo wumve neza ibintu bikomeye kandi utsinde neza ikizamini cya Leta cy'icyiciro rusange (O-Level)."
    },
    features: {
      en: [
        "16 core video modules with bilingual annotations (EN & RW)",
        "Over 300 solved practice problems with step-by-step breakdown",
        "Dedicated homework help forum answered within 2 hours",
        "Certificate of completion honored for school honors placement"
      ],
      rw: [
        "Amasomo 16 asobanutse mu mashusho mu Kinyarwanda no mu Cyongereza",
        "Imyitozo irenga 300 yakorewe mu buryo bworoshye cyane",
        "Umwanya wo kubaza ibibazo ukagusubizwa mu masaha abiri gusa",
        "Icyemezo cy'uko watsinze isomo gishobora kwerekwa ku ishuri"
      ]
    },
    syllabus: {
      en: [
        { module: "Week 1-2: Foundations of Algebra", topics: ["Factorization & Expansion", "Simultaneous Linear Equations", "Inequalities & Graphs"] },
        { module: "Week 3-4: Geometry & Trigonometry", topics: ["Pythagoras & Sine/Cosine Rules", "Circles & Theorems", "Vectors in 2D"] },
        { module: "Week 5-6: Physics Mechanics", topics: ["Speed, Velocity, Acceleration", "Newton's Laws & Friction", "Work, Energy & Power"] },
        { module: "Week 7-8: Electricity & Waves", topics: ["Ohm's Law & Series/Parallel Circuits", "Light Reflection & Refraction", "NESA Final Exam Paper Practice"] }
      ],
      rw: [
        { module: "Icyumweru 1-2: Imibare n'Algebra", topics: ["Gusesengura no koroshya", "Kugena ibitazwi bibiri", "Imirongo y'ingano"] },
        { module: "Icyumweru 3-4: Ubumenyi bw'Inguni (Trigonometry)", topics: ["Amategeko ya Pythagoras na Sinus", "Ibigereranyo by'uruziga", "Vekiteri"] },
        { module: "Icyumweru 5-6: Ubugenge bw'Imikorere (Mécanique)", topics: ["Umuvuduko n'ingufu", "Amategeko ya Newton", "Akazi n'Ingufu"] },
        { module: "Icyumweru 7-8: Amashanyarazi n'Urumuri", topics: ["Itegeko rya Ohm n'imiyoboro", "Urumuri n'indorerwamo", "Gukora ikizamini cya NESA cyo mu myaka ishize"] }
      ]
    },
    certification: {
      body: "MURAKAZA",
      label: { en: "Murakaza STEM Honors Certificate", rw: "Icyemezo cy'Ubuhanga muri STEM" }
    }
  },
  {
    id: "crs-003",
    type: "COURSE",
    category: "coding",
    priceRwf: 22000,
    amountCents: 2200000,
    rating: 4.92,
    reviewsCount: 130,
    badge: "Future Ready",
    instructor: "Eric Habimana (Software Engineer, Kigali)",
    duration: "10 Weeks (Project Based)",
    level: "All Students (Age 11+)",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Python & Web Coding for Rwandan Youth",
      rw: "Kumenya Porogaramu n'Ikoranabuhanga rya Mudasobwa (Coding)"
    },
    description: {
      en: "Hands-on programming from Scratch to building your first interactive web apps and Python games. Low-data consumption mode available for students on limited mobile data packages.",
      rw: "Kwiga kwandika code za mudasobwa uhereye ku ntangiriro kugeza wubatse urubuga rwawe na porogaramu zifatika. Bikoresha interineti nkeya cyane ku banyeshuri bafite amapaki aciriritse."
    },
    features: {
      en: [
        "No prior coding experience required — starts with Scratch visual logic",
        "Learn Python basics, conditional loops, functions, and file management",
        "Build 3 real portfolio projects: Quiz App, SMS Reminder Bot, School Website",
        "Offline-capable coding environment that runs in any browser"
      ],
      rw: [
        "Nta bumenyi bwa mbere bwa mudasobwa bukenewe",
        "Kwiga imiterere ya Python n'uburyo imashini zitekereza",
        "Kubaka imishinga 3 ifatika: Ikinamico y'ibibazo, Ubutumwa bwa SMS, n'urubuga rw'ishuri",
        "Gukoresha porogaramu zikora no mu gihe internet yacitse"
      ]
    },
    syllabus: {
      en: [
        { module: "Module 1: Computational Thinking", topics: ["How Computers Think", "Algorithms & Scratch Logic", "Variables & Decisions"] },
        { module: "Module 2: Python Fundamentals", topics: ["Data Types & Lists", "Loops & Logic Gates", "Functions & Code Reusability"] },
        { module: "Module 3: Web Basics", topics: ["HTML Structure", "Styling with Modern CSS", "Interactive JavaScript"] },
        { module: "Module 4: Capstone Showcase", topics: ["Hosting your site for free", "Pitching your project", "Final Graduation & Badge"] }
      ],
      rw: [
        { module: "Igice cya 1: Imitekerereze ya Mudasobwa", topics: ["Uko mudasobwa ikora", "Amategeko y'ingenzi muri Scratch", "Gufata ibyemezo muri porogaramu"] },
        { module: "Igice cya 2: Intangiriro za Python", topics: ["Ubwoko bw'amakuru", "Inzira z'isubiramo (Loops)", "Gukora porogaramu nto"] },
        { module: "Igice cya 3: Kubaka Urubuga rwa Interineti", topics: ["Imiterere ya HTML", "Gushyiraho amabara n'ubukaka muri CSS", "Guhuza urubuga n'umukoresha"] },
        { module: "Igice cya 4: Umushinga Usoza Isomo", topics: ["Gushyira urubuga rwawe kuri interineti ku buntu", "Kwereka abandi ibyo wakoze", "Guhembwa impamyabushobozi"] }
      ]
    },
    certification: {
      body: "MURAKAZA",
      label: { en: "Certified Junior Web Developer", rw: "Impamyabushobozi y'Ikoranabuhanga" }
    }
  },
  {
    id: "crs-004",
    type: "COURSE",
    category: "languages",
    priceRwf: 12000,
    amountCents: 1200000,
    rating: 4.85,
    reviewsCount: 88,
    badge: "Confidence",
    instructor: "Sister Mary K. & Patrick M.",
    duration: "5 Weeks",
    level: "All Grades",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "English Fluency & Academic Essay Writing",
      rw: "Kuvuga no Kwandika Icyongereza cy'umwimerere"
    },
    description: {
      en: "Designed specifically for French- and Kinyarwanda-speaking background students aiming to excel in English-medium classrooms, national exams, and international scholarships.",
      rw: "Isomo ryagenewe by'umwihariko abanyeshuri b'Abanyarwanda bashaka kumenya kuvuga no kwandika Icyongereza cyiza mu ishuri no mu bizamini bya Leta nta soni cyangwa ubwoba."
    },
    features: {
      en: [
        "Pronunciation drills targeting common phonetics challenges for Rwandan speakers",
        "Essay structure formulas for narrative, argumentative, and scientific writing",
        "Weekly audio feedback on your voice recordings from certified language tutors",
        "Extensive vocabulary bank for national curriculum exams"
      ],
      rw: [
        "Imyitozo yo gutunganya imvugire y'amagambo y'Icyongereza",
        "Uburyo bwo kwandika inyandiko ndende (Essay) yuje ubuhanga",
        "Gufata amajwi no gukosorwa n'umwarimu w'inzobere",
        "Amagambo y'ingenzi y'ibizamini bya Leta"
      ]
    },
    syllabus: {
      en: [
        { module: "Week 1: Spoken English & Confidence", topics: ["Phonetics & Silent Letters", "Classroom Participation Phrases", "Overcoming Hesitation"] },
        { module: "Week 2: Advanced Grammar in Use", topics: ["Tenses & Subject-Verb Agreement", "Prepositions & Articles", "Active vs. Passive Voice"] },
        { module: "Week 3: Academic Essay Craft", topics: ["Introduction & Thesis Statements", "Developing Cohesive Body Paragraphs", "Compelling Conclusions"] },
        { module: "Week 4-5: Exam & Letter Writing", topics: ["Formal Letters & Applications", "NESA English Past Papers", "Final Oral & Written Assessment"] }
      ],
      rw: [
        { module: "Icyumweru 1: Kuvuga Icyongereza nta bwoba", topics: ["Imivugirwe y'amagambo", "Interuro zo gukoresha mu ishuri", "Kwigirira icyizere"] },
        { module: "Icyumweru 2: Imyandikire n'Amategeko y'Ururimi", topics: ["Ibihe by'Icyongereza (Tenses)", "Gukoresha inyangingo neza", "Kuvuga mu buryo bweruye"] },
        { module: "Icyumweru 3: Kwandika Inyandiko Ndetse (Essays)", topics: ["Intangiriro y'inyandiko", "Gusobanura ingingo z'ingenzi", "Umusozo w'inyandiko"] },
        { module: "Icyumweru 4-5: Kwandika Amabaruwa no Kwitegura Ibizamini", topics: ["Amabaruwa asaba akazi cyangwa umwanya", "Gukora ibizamini bya Leta byashize", "Isuzuma rya nyuma ry'amagambo n'inyandiko"] }
      ]
    },
    certification: {
      body: "MURAKAZA",
      label: { en: "English Proficiency Certificate", rw: "Impamyabushobozi y'Icyongereza" }
    }
  }
];
