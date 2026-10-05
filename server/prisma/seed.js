require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { CAMPAIGNS } = require("../data/campaigns");

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.typeUser.createMany({
    data: [
      { name: "porteur_campaign" },
      { name: "donateur" },
      { name: "administrateur" },
    ],
    skipDuplicates: true,
  });

  await prisma.typePiece.createMany({
    data: [
      { name: "CNI" },
      { name: "passeport" },
    ],
    skipDuplicates: true,
  });

  for (const campaign of CAMPAIGNS) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      create: {
        id: campaign.id,
        title: campaign.title,
        category: campaign.category,
        type: campaign.type,
        image: campaign.image || null,
        raised: campaign.raised,
        goal: campaign.goal,
        daysLeft: campaign.daysLeft,
        createdAt: new Date(campaign.createdAt),
      },
      update: {
        title: campaign.title,
        category: campaign.category,
        type: campaign.type,
        image: campaign.image || null,
        goal: campaign.goal,
        daysLeft: campaign.daysLeft,
        // raised non écrasé pour conserver les contributions déjà enregistrées
      },
    });
  }

  console.log(`Seed OK (${CAMPAIGNS.length} campagnes)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
