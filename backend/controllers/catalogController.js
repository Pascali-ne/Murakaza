// Murakaza Catalog Controller — School supplies, office materials, and courses
// Supports filtering, search, and dynamic Admin CRUD persisted via Prisma/Neon CMS.

const prisma = require("../config/db");

const BASE_CATALOG_ITEMS = [
  // --- School Supplies & Office Tools ---
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
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Standard Curriculum Exercise Books Pack (12-Pack)",
      rw: "Ibitabo by'imyitozo by'integanyanyigisho (Paki ya 12)"
    },
    description: {
      en: "High-quality 96-page squared and ruled exercise books aligned with Rwanda Basic Education Board (REB) standards.",
      rw: "Ibitabo bifite paji 96 biri mu murongo no muri kare byujuje ubuziranenge bwa REB ku banyeshuri."
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
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Precision Mathematical Geometry Set (Boîte Géométrique)",
      rw: "Agasanduku k'ibikoresho bya Matematika (Boîte Géométrique)"
    },
    description: {
      en: "Durable metal tin containing compass, dividers, 15cm ruler, set squares, and 180° protractor. Approved for national exams.",
      rw: "Ibikoresho birambye birimo compas, ibipimo, rula y'ibice 15cm, na raporter byemewe mu bizamini bya Leta."
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Waterproof Ergonomic Student Backpack",
      rw: "Igikapu cy'ishuri gikomeye kandi kidasohora amazi"
    },
    description: {
      en: "Spacious multi-compartment bag with padded shoulder straps, night reflective strips, and water bottle side pockets.",
      rw: "Igikapu gifite imyanya myinshi, imikandara yorohereza intugu, n'ibimenyetso bibona mu mwijima ku mutekano."
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
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Approved Scientific Calculator FX-82MS",
      rw: "Imashini ibara y'ikoranabuhanga (Calculatrice Scientifique)"
    },
    description: {
      en: "240 functions, two-line clear display. Authorized by NESA for O-Level and A-Level STEM national examinations.",
      rw: "Imashini ifite imikorere 240, yemewe na NESA gukoreshwa mu bizamini bya Leta by'ikoranabuhanga n'imibare."
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
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Standard School Uniform Voucher Package",
      rw: "Icyemezo cyo kudonderwa umwambaro w'ishuri"
    },
    description: {
      en: "Redeemable at registered tailors across Kigali, Musanze, Huye, and Rubavu. Breathable, colorfast fabric.",
      rw: "Ushobora kuyidondera ku badozi bafatanyabikorwa i Kigali, Musanze, Huye, na Rubavu. Imyenda ikomeye."
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
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Secondary Science Lab & Microscopy Explorer Kit",
      rw: "Ibikoresho by'ubumenyi n'ubushakashatsi (Kit ya Laboratwari)"
    },
    description: {
      en: "Safe handheld microscope (up to 120x zoom), prepared specimen slides, pipettes, and Rwandan biology guide.",
      rw: "Icyuma cyagura ibitagaragara (microscope), ibipimo byo gusuzuma, n'igitabo kiyobora amasomo y'ibinyabuzima."
    }
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
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Premium Ballpoint & Gel Pen Box (50-Pack)",
      rw: "Paki y'amakaramu meza y'umwimerere (Amakaramu 50)"
    },
    description: {
      en: "Smooth flow 0.7mm quick-drying ballpoint pens (30 Blue, 15 Black, 5 Red). Smudge-proof and long-lasting ink.",
      rw: "Amakaramu yandika neza kandi yuma vuba (30 y'ubururu, 15 y'umukara, 5 y'umutuku). Wino irambye cyane."
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
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Oxford Classroom Blackboard Geometry Instruments Set",
      rw: "Ibikoresho bya mwarimu byo kwigisha imibare ku kibaho"
    },
    description: {
      en: "Large wooden & acrylic chalkboard tools for instructors: suction compass, 1-meter ruler, 60° triangle, and large protractor.",
      rw: "Ibikoresho by'umwimerere bya mwarimu: compas ifata ku kibaho, rula ya metero 1, n'ibipimo by'inguni binini."
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
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Complete Student Art & Technical Drawing Kit",
      rw: "Ibikoresho by'ubugeni no gushushanya by'abanyeshuri"
    },
    description: {
      en: "Includes 24 vibrant watercolor cakes, nylon brushes, drawing pencils (2B-6B), kneaded eraser, and A4 heavyweight sketchpad.",
      rw: "Birimo amabara 24, amakarama yo gushushanya, uburonko bw'ubugeni, igihanagura, n'igitabo kinini cyo gushushanyiramo."
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
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "A4 Heavy-Duty Document Ring Binder & Filing Set (6-Pack)",
      rw: "Amadosiye akomeye yo kubikamo inyandiko n'amasomo (Paki ya 6)"
    },
    description: {
      en: "Durable PVC lever-arch binders with reinforced metal corners, spine label holders, and 10-tab colored subject dividers.",
      rw: "Amadosiye akomeye afite ibyuma birinda impande n'udupapuro tugaragaza amasomo atandukanye ku banyeshuri n'amashuri."
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
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Metal Mesh Study Desk Organizer & Stationery Caddy",
      rw: "Agakoresho ko gutondekamo amakaramu n'ibikoresho ku meza"
    },
    description: {
      en: "Multi-compartment organizer with dedicated slots for pens, sticky notes, paper clips, scissors, and phone/calculator stand.",
      rw: "Agakoresho k'icyuma gatuma ameza yo kwigiraho ahora ateguye neza, kabika amakaramu n'udukoresho duto twose."
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
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Heavy-Duty Dual-Hole Rotary Pencil Sharpener",
      rw: "Icyerezo gikomeye cy'amakaramu gifite imyanya ibiri"
    },
    description: {
      en: "High-grade alloy helical blade sharpener with transparent shavings reservoir and desk-clamp mount for classrooms and study desks.",
      rw: "Icyerezo gikomeye cy'icyuma gityaza amakaramu y'ubwoko bwose bitavunitse, gifite aho imyanda igwa hadasandara."
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
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Rechargeable Student Solar Desk Study Lamp",
      rw: "Itara ryo kwigiraho rikongerwamo umuriro n'izuba (LED)"
    },
    description: {
      en: "3-level touch dimming eye-caring LED lamp with flexible gooseneck, built-in rechargeable battery, and solar panel charging input.",
      rw: "Itara ryiza ritabangamira amaso, rifite batiri irambye n'ubushobozi bwo gucomekwa ku mirasire y'izuba cyangwa umuriro."
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
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Insulated Stainless Steel Student Bottle & Bento Box (750ml)",
      rw: "Icupa ry'amazi rikomeye n'agasanduku k'ifunguro ry'umunyeshuri"
    },
    description: {
      en: "Food-grade double-walled stainless steel bottle that keeps drinks cold for 24h or hot for 12h, plus leak-proof bento lunch container.",
      rw: "Icupa n'agasanduku birinda ibiryo n'amazi gukonja cyangwa gushyuha, bikoze mu byuma bitangiza ubuzima (BPA Free)."
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
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Classroom Educational Wall Maps: Rwanda (30 Districts) & East Africa",
      rw: "Ikarita y'u Rwanda (Uturere 30) n'Afurika y'Iburasirazuba"
    },
    description: {
      en: "Laminated write-and-wipe large geographical & administrative wall poster with up-to-date Rwandan district boundaries and EAC capitals.",
      rw: "Ikarita nini igaragaza uturere 30 tw'u Rwanda n'imbibi z'ibihugu bituranye, ikoze mu buryo bwandikwaho bukanahanagurika."
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
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Solar STEM Robotics & Electronics Breadboard Starter Kit",
      rw: "Ibikoresho by'ubumenyi bw'ikoranabuhanga n'ingufu z'izuba (Robotics)"
    },
    description: {
      en: "Complete hands-on electronics project kit: mini solar panel, breadboard, DC motors, LEDs, buzzer, and Rwandan beginner guide.",
      rw: "Kit ifasha abanyeshuri kurema ibikoresho by'ikoranabuhanga bibyaza umuriro imirasire y'izuba no kwiga ubumenyi bwa electronics."
    }
  },

  // --- Guided Courses ---
  {
    id: "crs-001",
    type: "COURSE",
    category: "exam-prep",
    priceRwf: 15000,
    amountCents: 1500000,
    rating: 4.95,
    reviewsCount: 215,
    badge: "Top Rated",
    instructor: "Mwalimu Jean-Paul N. (Ex-NESA Examiner)",
    duration: "6 Weeks (Live & Recorded)",
    level: "Primary (P6)",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Primary Leaving Exam (PLE) Complete Sprint",
      rw: "Itegure neza ikizamini cya Leta cy'amashuri abanza (P6)"
    },
    description: {
      en: "Comprehensive review of Mathematics, Science & Elementary Technology, Social Studies, and English past papers with step-by-step guidance.",
      rw: "Kusubiramo imibare, SET, ubumenyi bw'isi n'amateka, n'Icyongereza hamwe n'ingero z'ibizamini bya Leta bishize."
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
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "O-Level Mathematics & Physics Breakthrough",
      rw: "Gutsinda neza Imibare n'Ubugenge mu Cyiciro rusange (S1-S3)"
    },
    description: {
      en: "Transform math anxiety into confidence. Covers algebra, geometry, trigonometry, kinematics, and electricity with practical Rwandan examples.",
      rw: "Amasomo asobanutse neza mu mibare n'ubugenge mu Kinyarwanda no mu Cyongereza, kugira ngo utsinde neza ikizamini cya Leta."
    }
  },
  {
    id: "crs-003",
    type: "COURSE",
    category: "ict",
    priceRwf: 22000,
    amountCents: 2200000,
    rating: 4.92,
    reviewsCount: 130,
    badge: "Future Ready",
    instructor: "Eric Habimana (Software Engineer, Kigali)",
    duration: "10 Weeks (Project Based)",
    level: "All Students (Age 11+)",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "Python & Web Coding for Rwandan Youth",
      rw: "Kumenya Porogaramu n'Ikoranabuhanga rya Mudasobwa (Coding)"
    },
    description: {
      en: "Hands-on programming from Scratch to building your first interactive web apps and games. Low-data consumption mode available.",
      rw: "Kwiga kwandika code za mudasobwa uhereye ku ntangiriro kugeza wubatse urubuga rwawe na porogaramu zifatika."
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
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    title: {
      en: "English Fluency & Academic Essay Writing",
      rw: "Kuvuga no Kwandika Icyongereza cy'umwimerere"
    },
    description: {
      en: "Designed specifically for French/Kinyarwanda background students aiming to excel in English-medium classrooms and exams.",
      rw: "Gufasha abanyeshuri kumenya kuvuga no kwandika Icyongereza giteye imbere byoroshye kandi nta bwoba."
    }
  }
];

// Helper: load and merge catalog items with database modifications
async function getMergedCatalog() {
  try {
    const cmsEntry = await prisma.contentCMS.findUnique({
      where: { key: "catalog.custom_items" },
    });

    if (cmsEntry && cmsEntry.localizedFields) {
      const payload = cmsEntry.localizedFields;
      const customItems = Array.isArray(payload.items) ? payload.items : [];
      const deletedIds = new Set(Array.isArray(payload.deletedIds) ? payload.deletedIds : []);

      const modifiedMap = new Map();
      customItems.forEach((item) => modifiedMap.set(item.id, item));

      const merged = [];
      for (const baseItem of BASE_CATALOG_ITEMS) {
        if (deletedIds.has(baseItem.id)) continue;
        if (modifiedMap.has(baseItem.id)) {
          merged.push(modifiedMap.get(baseItem.id));
          modifiedMap.delete(baseItem.id);
        } else {
          merged.push(baseItem);
        }
      }

      // Append any completely new items created by admin
      for (const newItem of modifiedMap.values()) {
        merged.push(newItem);
      }

      return merged;
    }
  } catch (err) {
    console.warn("Could not fetch custom catalog from DB, using baseline:", err.message);
  }
  return BASE_CATALOG_ITEMS;
}

// GET /api/catalog — list supplies and courses with filters
async function getCatalog(req, res) {
  try {
    const { type, category, q } = req.query;
    const allItems = await getMergedCatalog();
    let filtered = allItems;

    if (type && type !== "ALL") {
      filtered = filtered.filter((i) => i.type.toUpperCase() === type.toUpperCase());
    }

    if (category && category !== "all") {
      filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      const search = q.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.title?.en && i.title.en.toLowerCase().includes(search)) ||
          (i.title?.rw && i.title.rw.toLowerCase().includes(search)) ||
          (i.description?.en && i.description.en.toLowerCase().includes(search)) ||
          (i.description?.rw && i.description.rw.toLowerCase().includes(search))
      );
    }

    res.json({
      total: filtered.length,
      supplies: filtered.filter((i) => i.type === "SUPPLY"),
      courses: filtered.filter((i) => i.type === "COURSE"),
      items: filtered,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve catalog." });
  }
}

// GET /api/catalog/:id — get item details
async function getCatalogItem(req, res) {
  try {
    const allItems = await getMergedCatalog();
    const item = allItems.find((i) => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Catalog item not found." });
    }
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve catalog item." });
  }
}

// POST /api/catalog — Admin creates a new product/supply
async function createCatalogItem(req, res) {
  try {
    const data = req.body;
    if (!data.title?.en || !data.priceRwf) {
      return res.status(400).json({ error: "Title (EN) and Price (RWF) are required." });
    }

    const newItem = {
      id: data.id || `sup-${Date.now().toString().slice(-6)}`,
      type: data.type || "SUPPLY",
      category: data.category || "stationery",
      priceRwf: Number(data.priceRwf),
      amountCents: Number(data.priceRwf) * 100,
      rating: Number(data.rating || 5.0),
      reviewsCount: Number(data.reviewsCount || 0),
      badge: data.badge || "New",
      stock: Number(data.stock || 50),
      featuredInHero: Boolean(data.featuredInHero),
      image: data.image || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      title: {
        en: data.title.en,
        rw: data.title.rw || data.title.en,
      },
      description: {
        en: data.description?.en || "",
        rw: data.description?.rw || data.description?.en || "",
      },
    };

    // Load existing custom CMS record
    const existing = await prisma.contentCMS.findUnique({
      where: { key: "catalog.custom_items" },
    });

    const currentItems = existing?.localizedFields?.items ? [...existing.localizedFields.items] : [];
    const deletedIds = existing?.localizedFields?.deletedIds ? [...existing.localizedFields.deletedIds] : [];

    // Remove if already exists with same ID, then push
    const updatedItems = currentItems.filter((i) => i.id !== newItem.id);
    updatedItems.push(newItem);

    await prisma.contentCMS.upsert({
      where: { key: "catalog.custom_items" },
      update: {
        localizedFields: {
          items: updatedItems,
          deletedIds,
        },
        updatedBy: req.user?.id,
      },
      create: {
        key: "catalog.custom_items",
        type: "PAGE_COPY",
        isPublished: true,
        localizedFields: {
          items: updatedItems,
          deletedIds,
        },
        updatedBy: req.user?.id,
      },
    });

    res.status(201).json({ item: newItem, message: "Material added successfully." });
  } catch (err) {
    console.error("Failed to create catalog item:", err);
    res.status(500).json({ error: "Failed to create catalog item." });
  }
}

// PUT /api/catalog/:id — Admin updates an existing product
async function updateCatalogItem(req, res) {
  try {
    const { id } = req.params;
    const patch = req.body;

    const allItems = await getMergedCatalog();
    const existingItem = allItems.find((i) => i.id === id);
    if (!existingItem) {
      return res.status(404).json({ error: "Catalog item not found." });
    }

    const updatedItem = {
      ...existingItem,
      ...patch,
      id,
      priceRwf: patch.priceRwf !== undefined ? Number(patch.priceRwf) : existingItem.priceRwf,
      amountCents: patch.priceRwf !== undefined ? Number(patch.priceRwf) * 100 : existingItem.amountCents,
      stock: patch.stock !== undefined ? Number(patch.stock) : existingItem.stock,
      title: {
        en: patch.title?.en ?? existingItem.title?.en,
        rw: patch.title?.rw ?? existingItem.title?.rw,
      },
      description: {
        en: patch.description?.en ?? existingItem.description?.en,
        rw: patch.description?.rw ?? existingItem.description?.rw,
      },
    };

    const existingRecord = await prisma.contentCMS.findUnique({
      where: { key: "catalog.custom_items" },
    });

    const currentItems = existingRecord?.localizedFields?.items ? [...existingRecord.localizedFields.items] : [];
    const deletedIds = existingRecord?.localizedFields?.deletedIds ? [...existingRecord.localizedFields.deletedIds] : [];

    const updatedItems = currentItems.filter((i) => i.id !== id);
    updatedItems.push(updatedItem);

    await prisma.contentCMS.upsert({
      where: { key: "catalog.custom_items" },
      update: {
        localizedFields: {
          items: updatedItems,
          deletedIds,
        },
        updatedBy: req.user?.id,
      },
      create: {
        key: "catalog.custom_items",
        type: "PAGE_COPY",
        isPublished: true,
        localizedFields: {
          items: updatedItems,
          deletedIds,
        },
        updatedBy: req.user?.id,
      },
    });

    res.json({ item: updatedItem, message: "Material updated successfully." });
  } catch (err) {
    console.error("Failed to update catalog item:", err);
    res.status(500).json({ error: "Failed to update catalog item." });
  }
}

// DELETE /api/catalog/:id — Admin deletes a product
async function deleteCatalogItem(req, res) {
  try {
    const { id } = req.params;

    const existingRecord = await prisma.contentCMS.findUnique({
      where: { key: "catalog.custom_items" },
    });

    const currentItems = existingRecord?.localizedFields?.items ? [...existingRecord.localizedFields.items] : [];
    const currentDeleted = existingRecord?.localizedFields?.deletedIds ? [...existingRecord.localizedFields.deletedIds] : [];

    const updatedItems = currentItems.filter((i) => i.id !== id);
    const updatedDeleted = Array.from(new Set([...currentDeleted, id]));

    await prisma.contentCMS.upsert({
      where: { key: "catalog.custom_items" },
      update: {
        localizedFields: {
          items: updatedItems,
          deletedIds: updatedDeleted,
        },
        updatedBy: req.user?.id,
      },
      create: {
        key: "catalog.custom_items",
        type: "PAGE_COPY",
        isPublished: true,
        localizedFields: {
          items: updatedItems,
          deletedIds: updatedDeleted,
        },
        updatedBy: req.user?.id,
      },
    });

    res.json({ message: "Material removed successfully.", id });
  } catch (err) {
    console.error("Failed to delete catalog item:", err);
    res.status(500).json({ error: "Failed to delete catalog item." });
  }
}

module.exports = {
  getCatalog,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  BASE_CATALOG_ITEMS,
};
