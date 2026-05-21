const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/utils/password");

async function main() {
  const defaultPassword = await hashPassword("123456");

  const users = [
    {
      email: "super@wku.edu.cn",
      password: defaultPassword,
      role: "super_admin",
      name: "Super Admin",
      studentId: "9000001",
      major: "Administration",
      grade: "Staff",
      bio: "System super administrator.",
    },
    {
      email: "clubadmin@wku.edu.cn",
      password: defaultPassword,
      role: "student",
      name: "Club Admin Candidate",
      studentId: "9000002",
      major: "Computer Science",
      grade: "Senior",
      bio: "This account will be promoted to club admin during demo.",
    },
    {
      email: "student1@wku.edu.cn",
      password: defaultPassword,
      role: "student",
      name: "Student One",
      studentId: "9000003",
      major: "Computer Science",
      grade: "Junior",
      bio: "Demo student account one.",
    },
    {
      email: "student2@wku.edu.cn",
      password: defaultPassword,
      role: "student",
      name: "Student Two",
      studentId: "9000004",
      major: "Business",
      grade: "Sophomore",
      bio: "Demo student account two.",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        role: user.role,
        name: user.name,
        studentId: user.studentId,
        major: user.major,
        grade: user.grade,
        bio: user.bio,
      },
      create: user,
    });
  }

  console.log("Demo users created successfully.");
  console.log("Password for all demo users: 123456");
  console.log("super@wku.edu.cn -> super_admin");
  console.log("clubadmin@wku.edu.cn -> student, promote it during demo");
  console.log("student1@wku.edu.cn -> student");
  console.log("student2@wku.edu.cn -> student");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });