require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

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

  console.log("Seed OK");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
