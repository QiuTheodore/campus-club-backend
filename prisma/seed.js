const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/password");

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword("123456");

  const superAdmin = await prisma.user.upsert({
    where: {
      email: "super@wku.edu.cn",
    },
    update: {
      password,
      role: "super_admin",
      name: "Super Admin",
      studentId: "9000001",
      major: "Administration",
      grade: "Staff",
      bio: "System super administrator.",
    },
    create: {
      email: "super@wku.edu.cn",
      password,
      role: "super_admin",
      name: "Super Admin",
      studentId: "9000001",
      major: "Administration",
      grade: "Staff",
      bio: "System super administrator.",
    },
  });

  const clubAdmin = await prisma.user.upsert({
    where: {
      email: "clubadmin@wku.edu.cn",
    },
    update: {
      password,
      role: "student",
      name: "Club Admin Candidate",
      studentId: "9000002",
      major: "Computer Science",
      grade: "Senior",
      bio: "Demo club admin candidate.",
    },
    create: {
      email: "clubadmin@wku.edu.cn",
      password,
      role: "student",
      name: "Club Admin Candidate",
      studentId: "9000002",
      major: "Computer Science",
      grade: "Senior",
      bio: "Demo club admin candidate.",
    },
  });

  const student1 = await prisma.user.upsert({
    where: {
      email: "student1@wku.edu.cn",
    },
    update: {
      password,
      role: "student",
      name: "Student One",
      studentId: "9000003",
      major: "Computer Science",
      grade: "Junior",
      bio: "Demo student account.",
    },
    create: {
      email: "student1@wku.edu.cn",
      password,
      role: "student",
      name: "Student One",
      studentId: "9000003",
      major: "Computer Science",
      grade: "Junior",
      bio: "Demo student account.",
    },
  });

  const student2 = await prisma.user.upsert({
    where: {
      email: "student2@wku.edu.cn",
    },
    update: {
      password,
      role: "student",
      name: "Student Two",
      studentId: "9000004",
      major: "Marketing",
      grade: "Sophomore",
      bio: "Another demo student account.",
    },
    create: {
      email: "student2@wku.edu.cn",
      password,
      role: "student",
      name: "Student Two",
      studentId: "9000004",
      major: "Marketing",
      grade: "Sophomore",
      bio: "Another demo student account.",
    },
  });

  console.log("Seed completed.");
  console.log({
    superAdmin,
    clubAdmin,
    student1,
    student2,
  });
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });