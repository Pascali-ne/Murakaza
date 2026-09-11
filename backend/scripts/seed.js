require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../config/db");

async function main() {
  console.log("🌱 Starting Murakaza database seed...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@murakaza.rw";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      fullName: "Murakaza Administrator",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (Password: ${adminPassword})`);

  // 2. Seed Default CMS Content
  const heroCms = await prisma.contentCMS.upsert({
    where: { key: "hero.video" },
    update: {},
    create: {
      key: "hero.video",
      type: "HERO_VIDEO",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43187-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      isPublished: true,
      localizedFields: {
        en: {
          title: "Everything your student needs, in one welcoming place",
          subtitle: "Murakaza connects Rwandan families to affordable school supplies and guided courses — with local pickup, Mobile Money checkout, and support in Kinyarwanda and English.",
        },
        rw: {
          title: "Ibyo umunyeshuri wawe akeneye byose, ahantu hamwe",
          subtitle: "Murakaza ihuza imiryango y'Abanyarwanda n'ibikoresho by'ishuri bihendutse n'amasomo ayoboye — hamwe no gutwara ibintu hafi, kwishyura ukoresheje Mobile Money, no gufashwa mu Kinyarwanda no mu Cyongereza.",
        },
      },
      updatedBy: admin.id,
    },
  });

  console.log(`✅ CMS default block seeded: ${heroCms.key}`);

  // 3. Seed Sample Feedback
  const existingFeedback = await prisma.feedback.findFirst({
    where: { authorName: "Diane Uwase (Parent, Kigali)" },
  });

  if (!existingFeedback) {
    await prisma.feedback.createMany({
      data: [
        {
          authorName: "Diane Uwase (Parent, Kigali)",
          rating: 5,
          comment: "The exercise books and geometry set arrived within 24 hours in Kimironko. Payment via MTN MoMo was super smooth.",
          isApproved: true,
          isHidden: false,
        },
        {
          authorName: "Jean Damascene (Educator, Huye)",
          rating: 5,
          comment: "Curriculum-aligned books that meet REB criteria. My students love the quality.",
          isApproved: true,
          isHidden: false,
        },
      ],
    });
    console.log("✅ Verified feedback samples seeded.");
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
