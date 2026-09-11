// Murakaza Catalog Controller — School supplies and educator-led courses
// Supports filtering by type (SUPPLY, COURSE), category, and search query.

const CATALOG_ITEMS = [
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
      en: "Precision Mathematical Geometry Set",
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

// GET /api/catalog — list supplies and courses with filters
async function getCatalog(req, res) {
  try {
    const { type, category, q } = req.query;
    let filtered = CATALOG_ITEMS;

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
          i.title.en.toLowerCase().includes(search) ||
          i.title.rw.toLowerCase().includes(search) ||
          i.description.en.toLowerCase().includes(search) ||
          i.description.rw.toLowerCase().includes(search)
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
  const item = CATALOG_ITEMS.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Catalog item not found." });
  }
  res.json({ item });
}

module.exports = {
  getCatalog,
  getCatalogItem,
  CATALOG_ITEMS,
};
