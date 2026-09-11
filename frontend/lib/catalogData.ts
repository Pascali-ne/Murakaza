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
  },
  {
    id: "sup-007",
    type: "SUPPLY",
    category: "stationery",
    priceRwf: 6500,
    amountCents: 650000,
    rating: 4.9,
    reviewsCount: 89,
    badge: "Essential",
    stock: 310,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Premium Ballpoint & Gel Pen Box (50-Pack)",
      rw: "Paki y'amakaramu meza y'umwimerere (Amakaramu 50)"
    },
    description: {
      en: "Smooth-flow 0.7mm quick-drying ballpoint pens (30 Blue, 15 Black, 5 Red). Smudge-proof ink formulated for examination answer booklets.",
      rw: "Amakaramu yandika neza kandi yuma vuba (30 y'ubururu, 15 y'umukara, 5 y'umutuku). Wino idapfa gusibama yagenewe ibizamini."
    },
    features: {
      en: [
        "Pack of 50 pens: 30 Blue, 15 Black, and 5 Red teacher/correction pens",
        "Tungsten carbide ball tip provides effortless writing without skipping",
        "Ventilated safety caps complying with international safety standards",
        "Long-write cartridge with over 1,500 meters of continuous ink"
      ],
      rw: [
        "Paki y'amakaramu 50: 30 y'ubururu, 15 y'umukara, na 5 y'umutuku yo gukosora",
        "Umutwe w'ikaramu ukomeye utuma yandika neza cyane idasiganwa",
        "Igifuniko gifite umwenge w'umutekano ku bana",
        "Yandika igihe kirekire kirenga metero 1,500 za wino"
      ]
    },
    specifications: {
      "Tip Size": "0.7 mm Medium",
      "Colors": "30 Blue, 15 Black, 5 Red",
      "Ink Type": "Oil-based Low Viscosity",
      "Certifications": "ISO 12757-2 Exam Compliant"
    }
  },
  {
    id: "sup-008",
    type: "SUPPLY",
    category: "instruments",
    priceRwf: 18500,
    amountCents: 1850000,
    rating: 4.95,
    reviewsCount: 42,
    badge: "Teacher Choice",
    stock: 35,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Oxford Classroom Blackboard Geometry Instruments Set",
      rw: "Ibikoresho bya mwarimu byo kwigisha imibare ku kibaho"
    },
    description: {
      en: "Large wooden & acrylic chalkboard tools for teachers and tutors: suction compass, 1-meter ruler, 60° triangle, and 180° protractor.",
      rw: "Ibikoresho by'umwimerere bya mwarimu: compas ifata ku kibaho n'isukisoni, rula ya metero 1, n'ibipimo by'inguni binini."
    },
    features: {
      en: [
        "Heavy-duty polished hardwood and shatterproof acrylic construction",
        "Rubber suction cup on compass pivot prevents chalkboard scratching",
        "Bold millimeter and degree graduation marks readable from 15 meters away",
        "Ergonomic center grab handles for stable drawing on vertical boards"
      ],
      rw: [
        "Bikoze mu mbaho zikomeye z'umwimerere n'ibikoresho bidapfa kumeneka",
        "Compas ifite gashanyarazi gafata ku kibaho kugira ngo itanyerera",
        "Imirongo n'imibare byanditswe binini ku buryo umunyeshuri wese abibona",
        "Bifite imifuniko yo gufataho yorohereza mwarimu gushushanya ku kibaho"
      ]
    },
    specifications: {
      "Components": "Compass, 1m Ruler, 60° Triangle, 45° Triangle, Protractor",
      "Material": "Seasoned Hardwood & High-Impact Acrylic",
      "Target Use": "Secondary Schools, TVET & Universities"
    }
  },
  {
    id: "sup-009",
    type: "SUPPLY",
    category: "art-craft",
    priceRwf: 8900,
    amountCents: 890000,
    rating: 4.85,
    reviewsCount: 61,
    badge: "Creative",
    stock: 75,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Complete Student Art & Technical Drawing Kit",
      rw: "Ibikoresho by'ubugeni no gushushanya by'abanyeshuri"
    },
    description: {
      en: "Includes 24 vibrant watercolor cakes, nylon brushes, drawing graphite pencils (2B-6B), kneaded eraser, and A4 heavyweight sketchpad.",
      rw: "Birimo amabara 24, amakarama yo gushushanya, uburonko bw'ubugeni, igihanagura, n'igitabo kinini cyo gushushanyiramo."
    },
    features: {
      en: [
        "24 highly pigmented, non-toxic watercolor pans with mixing lid",
        "6 sketch graphite pencils ranging from hard to soft shading grades",
        "A4 160gsm spiral-bound cold-press drawing paper book (40 sheets)",
        "Includes blending stump, pencil sharpener, and nylon art brush set"
      ],
      rw: [
        "Amabara 24 y'ubumenyi n'ubugeni atangiza ubuzima bw'abana",
        "Amakaramu 6 yo gushushanya mu byiciro bitandukanye by'umwijima",
        "Igitabo kinini gifite impapuro 40 zikomeye zo gushushanyiramo",
        "Kirimo n'uburoso bw'amabara hamwe n'icyerezo"
      ]
    },
    specifications: {
      "Sketchbook Paper": "160 gsm Cold Press Acid-Free",
      "Pencil Grades": "2H, HB, 2B, 4B, 6B, 8B",
      "Safety": "Non-Toxic ASTM D-4236 Certified"
    }
  },
  {
    id: "sup-010",
    type: "SUPPLY",
    category: "office-supplies",
    priceRwf: 7200,
    amountCents: 720000,
    rating: 4.75,
    reviewsCount: 48,
    badge: "Organized",
    stock: 140,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "A4 Heavy-Duty Document Ring Binder & Filing Set (6-Pack)",
      rw: "Amadosiye akomeye yo kubikamo inyandiko n'amasomo (Paki ya 6)"
    },
    description: {
      en: "Durable PVC lever-arch binders with reinforced metal corners, spine label holders, and 10-tab colored subject dividers.",
      rw: "Amadosiye akomeye afite ibyuma birinda impande n'udupapuro tugaragaza amasomo atandukanye ku banyeshuri n'amashuri."
    },
    features: {
      en: [
        "Pack of 6 distinct colors for multi-subject or office categorization",
        "Heavy-duty 2-ring lever-arch mechanism holds up to 500 sheets per binder",
        "Metal shoe protection prevents base wear and tear",
        "Includes customizable spine insert labels and 10-color index dividers"
      ],
      rw: [
        "Paki y'amadosiye 6 afite amabara atandukanye yo gutandukanya amasomo",
        "Ibyuma bikomeye bibika impapuro zigera kuri 500 muri buri dosiye",
        "Impande z'ibyuma zirinda dosiye gucika cyangwa kononekara",
        "Irimo udupapuro tw'amabara 10 two gutandukanya ibice by'amasomo"
      ]
    },
    specifications: {
      "Capacity": "500 Sheets (70mm Spine Width)",
      "Format": "A4 Compatible",
      "Cover": "FSC Certified Heavy Board with Wipe-Clean PVC"
    }
  },
  {
    id: "sup-011",
    type: "SUPPLY",
    category: "office-supplies",
    priceRwf: 5400,
    amountCents: 540000,
    rating: 4.8,
    reviewsCount: 52,
    badge: "Desk Neat",
    stock: 95,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Metal Mesh Study Desk Organizer & Stationery Caddy",
      rw: "Agakoresho ko gutondekamo amakaramu n'ibikoresho ku meza"
    },
    description: {
      en: "Multi-compartment organizer with dedicated slots for pens, sticky notes, paper clips, scissors, and phone/calculator stand.",
      rw: "Agakoresho k'icyuma gatuma ameza yo kwigiraho ahora ateguye neza, kabika amakaramu n'udukoresho duto twose."
    },
    features: {
      en: [
        "6 partitioned compartments + 1 pull-out sliding drawer for paperclips",
        "Sturdy steel mesh with powder-coated anti-scratch finish",
        "Anti-slip rubber feet pad protects wooden desks and prevents tipping",
        "Zero assembly required — ready to organize your study desk instantly"
      ],
      rw: [
        "Imyanya 6 yo gutondekamo ibintu n'akadirishya k'udushinge n'utwuma",
        "Gakoze mu cyuma gikomeye kidasigiriza ameza cyangwa ngo gafate umugese",
        "Gafite amapine ya gomma adashobora kunyerera ku meza",
        "Gahita gakoreshwa ako kanya nta bindi biteranywa"
      ]
    },
    specifications: {
      "Dimensions": "22 x 14 x 13 cm",
      "Material": "Carbon Mesh Steel",
      "Weight": "450 grams"
    }
  },
  {
    id: "sup-012",
    type: "SUPPLY",
    category: "stationery",
    priceRwf: 4800,
    amountCents: 480000,
    rating: 4.88,
    reviewsCount: 67,
    badge: "Top Utility",
    stock: 110,
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Heavy-Duty Dual-Hole Rotary Pencil Sharpener",
      rw: "Icyerezo gikomeye cy'amakaramu gifite imyanya ibiri"
    },
    description: {
      en: "High-grade alloy helical blade sharpener with transparent shavings reservoir and desk-clamp mount for classrooms and study desks.",
      rw: "Icyerezo gikomeye cy'icyuma gityaza amakaramu y'ubwoko bwose bitavunitse, gifite aho imyanda igwa hadasandara."
    },
    features: {
      en: [
        "Heavy-duty carbon alloy helical cutter core sharpens over 5,000 pencils",
        "Adjustable pencil tip selector: fine needlepoint to blunt colored pencil",
        "Auto-stop mechanism stops sharpening once the ideal point is reached",
        "Spacious see-through receptacle prevents frequent emptying"
      ],
      rw: [
        "Icyuma gityaza gikomeye cyane gishobora gutyaza amakaramu ibihumbi 5",
        "Ushobora guhitamo ubukire bw'umunwa w'ikaramu ushaka",
        "Kireka gutyaza iyo ikaramu igeze ku rugero rwiza kugira ngo itarangira",
        "Gifite aho imyanda ibikwa hagaragara neza"
      ]
    },
    specifications: {
      "Pencil Diameter": "6mm to 8.2mm (Graphite & Colored)",
      "Mounting": "Desk Clamp included",
      "Blade": "Heat-treated helical steel"
    }
  },
  {
    id: "sup-013",
    type: "SUPPLY",
    category: "electronics",
    priceRwf: 11500,
    amountCents: 1150000,
    rating: 4.92,
    reviewsCount: 93,
    badge: "Solar Ready",
    stock: 80,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Rechargeable Student Solar Desk Study Lamp",
      rw: "Itara ryo kwigiraho rikongerwamo umuriro n'izuba (LED)"
    },
    description: {
      en: "3-level touch dimming eye-caring LED lamp with flexible gooseneck, built-in rechargeable battery, and solar panel charging input.",
      rw: "Itara ryiza ritabangamira amaso, rifite batiri irambye n'ubushobozi bwo gucomekwa ku mirasire y'izuba cyangwa umuriro."
    },
    features: {
      en: [
        "Flicker-free blue-light filtered LED prevents eye strain during night study",
        "Built-in 2,000mAh lithium battery delivers up to 10 hours continuous light",
        "Dual charging: USB-C standard plug and auxiliary solar panel input",
        "360-degree flexible gooseneck directs light precisely where needed"
      ],
      rw: [
        "Urumuri rwa LED rurinda amaso kunanirwa mu gihe cyo kwiga nijoro",
        "Batiri ya 2,000mAh irambye imara amasaha agera ku 10 icometse",
        "Yuzuzwa n'umuriro w'amashanyarazi wa USB-C cyangwa imirasire y'izuba",
        "Ijosi ry'itara ririhina mu mpande zose ku buryo ryerekana aho ushaka"
      ]
    },
    specifications: {
      "Brightness Levels": "Low (Study), Medium (Reading), High (Precision)",
      "Battery Life": "Up to 10 Hours on single charge",
      "Color Temperature": "4000K Natural Daylight"
    }
  },
  {
    id: "sup-014",
    type: "SUPPLY",
    category: "lifestyle",
    priceRwf: 9800,
    amountCents: 980000,
    rating: 4.9,
    reviewsCount: 78,
    badge: "Eco-Friendly",
    stock: 130,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Insulated Stainless Steel Student Bottle & Bento Box (750ml)",
      rw: "Icupa ry'amazi rikomeye n'agasanduku k'ifunguro ry'umunyeshuri"
    },
    description: {
      en: "Food-grade double-walled stainless steel bottle that keeps drinks cold for 24h or hot for 12h, plus leak-proof bento lunch container.",
      rw: "Icupa n'agasanduku birinda ibiryo n'amazi gukonja cyangwa gushyuha, bikoze mu byuma bitangiza ubuzima (BPA Free)."
    },
    features: {
      en: [
        "18/8 food-grade stainless steel — zero plastic aftertaste and 100% BPA free",
        "Vacuum insulation keeps drinking water icy cold during hot afternoons",
        "Leak-proof silicone sealed cap with integrated carrying loop",
        "Bento box includes 3 portion-controlled compartments and fork/spoon set"
      ],
      rw: [
        "Bikoze mu byuma bikomeye bitangiza ibiribwa kandi bitera ubuzima bwiza",
        "Bifite tekinoloji igumisha amazi akonje umunsi wose ku mashuri",
        "Igifuniko gifunze neza kidashobora kumena amazi mu gikapu",
        "Agasanduku k'ibiryo gafite ibice 3 bitandukanye n'ikiyiko n'ikanya"
      ]
    },
    specifications: {
      "Bottle Volume": "750 ml",
      "Insulation": "Double-Wall Vacuum Insulation",
      "Bento Capacity": "1,000 ml with silicone leak-proof seals"
    }
  },
  {
    id: "sup-015",
    type: "SUPPLY",
    category: "stationery",
    priceRwf: 6000,
    amountCents: 600000,
    rating: 4.82,
    reviewsCount: 45,
    badge: "Curriculum",
    stock: 160,
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Classroom Educational Wall Maps: Rwanda (30 Districts) & East Africa",
      rw: "Ikarita y'u Rwanda (Uturere 30) n'Afurika y'Iburasirazuba"
    },
    description: {
      en: "Laminated write-and-wipe large geographical & administrative wall poster with up-to-date Rwandan district boundaries and EAC capitals.",
      rw: "Ikarita nini igaragaza uturere 30 tw'u Rwanda n'imbibi z'ibihugu bituranye, ikoze mu buryo bwandikwaho bukanahanagurika."
    },
    features: {
      en: [
        "Detailed administrative divisions featuring all 30 districts and provincial capitals",
        "Heavy 250gsm cardstock sealed with double-sided glossy wipe-clean laminate",
        "Includes topography, national parks (Akagera, Nyungwe, Volcanoes), lakes, and rivers",
        "Reverse side features comprehensive East African Community (EAC) regional map"
      ],
      rw: [
        "Igaragaza uturere 30 twose n'imijyi mikuru y'intara mu Rwanda",
        "Impapuro zikomeye zometseho pulasitiki ku buryo ushobora kwandikaho ukahanagura",
        "Irimo pariki z'igihugu, ibiyaga, n'imisozi y'u Rwanda",
        "Inyuma yayo hari ikarita y'umuryango wa Afurika y'Iburasirazuba (EAC)"
      ]
    },
    specifications: {
      "Dimensions": "100 x 70 cm (Poster size)",
      "Lamination": "30 Micron High-Gloss Film",
      "Compliance": "Rwanda Basic Education Board Geography Standards"
    }
  },
  {
    id: "sup-016",
    type: "SUPPLY",
    category: "stem",
    priceRwf: 28500,
    amountCents: 2850000,
    rating: 4.96,
    reviewsCount: 39,
    badge: "Robotics Kit",
    stock: 45,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    title: {
      en: "Solar STEM Robotics & Electronics Breadboard Starter Kit",
      rw: "Ibikoresho by'ubumenyi bw'ikoranabuhanga n'ingufu z'izuba (Robotics)"
    },
    description: {
      en: "Complete hands-on electronics project kit: mini solar panel, breadboard, DC motors, LEDs, buzzer, and Rwandan beginner project guide.",
      rw: "Kit ifasha abanyeshuri kurema ibikoresho by'ikoranabuhanga bibyaza umuriro imirasire y'izuba no kwiga ubumenyi bwa electronics."
    },
    features: {
      en: [
        "No soldering required — plug-and-play jumper wires and solderless breadboard",
        "Build 15+ guided projects: solar rover car, light-sensitive alarm, Morse code beeper",
        "Includes DC motors, mini 6V solar cell, light sensors (LDRs), LEDs, and switches",
        "Step-by-step illustrated manual with Kinyarwanda & English circuit diagrams"
      ],
      rw: [
        "Nta gusudira bisaba — ibisinga bicomekwa mu buryo bworoshye ku bana",
        "Gukora imishinga irenga 15 y'ikoranabuhanga n'imodoka zigendeshwa n'izuba",
        "Irimo moteri, imirasire y'izuba ya 6V, amatoroshi, n'udupfunyiko two gucomeka",
        "Igitabo kiyobora cyanditse mu Kinyarwanda no mu Cyongereza n'ibishushanyo"
      ]
    },
    specifications: {
      "Projects Included": "15 Guided Experiments",
      "Breadboard": "830-Tie Point Solderless Breadboard",
      "Solar Panel": "6V 150mA Monocrystalline",
      "Age Range": "Ages 10 through Secondary S6"
    },
    certification: {
      body: "REB",
      label: { en: "REB STEM Innovation Endorsed", rw: "Byemewe na REB mu buvumbuzi bwa STEM" }
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
