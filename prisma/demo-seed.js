const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/password");

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.clubGalleryImage.deleteMany();
  await prisma.clubComment.deleteMany();
  await prisma.eventSignup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.clubApplication.deleteMany();
  await prisma.clubMember.deleteMany();
  await prisma.club.deleteMany();

  await prisma.user.deleteMany({
    where: {
      role: {
        not: "super_admin",
      },
    },
  });
}

async function ensureSuperAdmin(passwordHash) {
  const superAdmin = await prisma.user.findFirst({
    where: {
      role: "super_admin",
    },
  });

  if (superAdmin) {
    return superAdmin;
  }

  return prisma.user.create({
    data: {
      email: "super@wku.edu.cn",
      password: passwordHash,
      role: "super_admin",
      name: "Super Admin",
      studentId: "9000001",
      major: "Administration",
      grade: "Staff",
      bio: "System super administrator.",
    },
  });
}

async function createUsers(passwordHash) {
  const users = [
    {
      email: "1235882@wku.edu.cn",
      password: passwordHash,
      role: "club_admin",
      name: "Ethan Miller",
      studentId: "1235882",
      major: "Communication",
      grade: "Senior",
      bio: "Club administrator for performance and student engagement activities.",
    },
    {
      email: "1235883@wku.edu.cn",
      password: passwordHash,
      role: "club_admin",
      name: "Sophia Johnson",
      studentId: "1235883",
      major: "Marketing",
      grade: "Junior",
      bio: "Club administrator interested in food culture, events, and community building.",
    },
    {
      email: "1235884@wku.edu.cn",
      password: passwordHash,
      role: "club_admin",
      name: "Liam Anderson",
      studentId: "1235884",
      major: "Psychology",
      grade: "Senior",
      bio: "Club administrator focused on emotional support, growth, and peer connection.",
    },
    {
      email: "1235885@wku.edu.cn",
      password: passwordHash,
      role: "club_admin",
      name: "Olivia Brown",
      studentId: "1235885",
      major: "English",
      grade: "Junior",
      bio: "Club administrator passionate about language learning and cultural exchange.",
    },
    {
      email: "1235886@wku.edu.cn",
      password: passwordHash,
      role: "club_admin",
      name: "Noah Wilson",
      studentId: "1235886",
      major: "Computer Science",
      grade: "Senior",
      bio: "Club administrator focused on programming, technology, and innovation.",
    },
    {
      email: "1235887@wku.edu.cn",
      password: passwordHash,
      role: "student",
      name: "Ava Martinez",
      studentId: "1235887",
      major: "Computer Science",
      grade: "Sophomore",
      bio: "Student user for testing club applications, comments, and event signups.",
    },
    {
      email: "1235888@wku.edu.cn",
      password: passwordHash,
      role: "student",
      name: "Lucas Thompson",
      studentId: "1235888",
      major: "Global Business",
      grade: "Freshman",
      bio: "Student user for testing club discovery and participation features.",
    },
  ];

  const createdUsers = {};

  for (const user of users) {
    createdUsers[user.email] = await prisma.user.create({
      data: user,
    });
  }

  return createdUsers;
}

async function createClubWithContent({
  sourceId,
  createdBy,
  commenter,
  name,
  chineseName,
  englishName,
  description,
  purpose,
  mission,
  category,
  joinInfo,
  reviewer,
  event,
  announcement,
  comment,
}) {
  const club = await prisma.club.create({
    data: {
      sourceId,
      name,
      chineseName,
      englishName,
      description,
      purpose,
      mission,
      category,
      joinInfo,
      reviewer,
      status: "active",
      createdById: createdBy.id,
    },
  });

  await prisma.clubMember.create({
    data: {
      clubId: club.id,
      userId: createdBy.id,
      role: "president",
    },
  });

  await prisma.event.create({
    data: {
      clubId: club.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime),
      capacity: event.capacity,
      status: "published",
    },
  });

  await prisma.announcement.create({
    data: {
      clubId: club.id,
      createdById: createdBy.id,
      title: announcement.title,
      content: announcement.content,
      status: "published",
      isPinned: announcement.isPinned,
    },
  });

  await prisma.clubComment.create({
    data: {
      clubId: club.id,
      userId: commenter.id,
      content: comment,
    },
  });

  return club;
}

async function createClubs(users) {
  const ava = users["1235887@wku.edu.cn"];
  const lucas = users["1235888@wku.edu.cn"];

  const clubs = [
    {
      sourceId: 101,
      createdBy: users["1235882@wku.edu.cn"],
      commenter: ava,
      name: "Street Dance Club",
      chineseName: "街舞社",
      englishName: "Street Dance Club",
      description:
        "Learn cool moves, explore styles like hip-hop and popping, and connect with dance lovers. No experience is needed—only your energy and passion.",
      purpose:
        "To provide an open and energetic space for students to express themselves through street dance.",
      mission:
        "Street Dance Club helps students build confidence, creativity, teamwork, and stage presence through regular practice, workshops, and performances.",
      category: "Arts & Performance",
      joinInfo:
        "Open to all WKU students. Members can join weekly practice sessions and performance rehearsals.",
      reviewer: "Ethan Miller",
      event: {
        title: "Open Dance Jam Night",
        description:
          "A casual dance night for beginners and experienced dancers to learn basic moves and freestyle together.",
        location: "Student Activity Center",
        startTime: "2026-06-03T18:30:00.000Z",
        endTime: "2026-06-03T20:30:00.000Z",
        capacity: 40,
      },
      announcement: {
        title: "Street Dance Club welcomes new members",
        content:
          "No previous dance experience is required. Bring comfortable shoes and join our next practice session.",
        isPinned: true,
      },
      comment:
        "The club looks super energetic. I would love to join one of the open practice sessions.",
    },
    {
      sourceId: 102,
      createdBy: users["1235883@wku.edu.cn"],
      commenter: lucas,
      name: "Food Lovers Club",
      chineseName: "美食爱好者社",
      englishName: "Food Lovers Club",
      description:
        "Hungry for more? Discover new tastes, learn cooking secrets, and share unforgettable meals with friends who love food just as much as you do.",
      purpose:
        "To connect students through food, cooking, cultural exchange, and shared dining experiences.",
      mission:
        "Food Lovers Club creates a welcoming community where students explore different cuisines, organize tasting events, and learn practical cooking skills.",
      category: "Culture & Lifestyle",
      joinInfo:
        "Students can apply online. Members will be invited to tasting events, cooking workshops, and food culture sharing sessions.",
      reviewer: "Sophia Johnson",
      event: {
        title: "International Snack Sharing",
        description:
          "Students bring snacks from different cultures and share the stories behind them.",
        location: "GEH Common Area",
        startTime: "2026-06-05T12:00:00.000Z",
        endTime: "2026-06-05T14:00:00.000Z",
        capacity: 50,
      },
      announcement: {
        title: "Bring your favorite snack this Friday",
        content:
          "Our first snack sharing event is open for registration. Please bring one small snack and a short story about it.",
        isPinned: true,
      },
      comment:
        "This sounds delicious. Food events are probably the easiest way to make new friends on campus.",
    },
    {
      sourceId: 103,
      createdBy: users["1235884@wku.edu.cn"],
      commenter: ava,
      name: "Light by Light Psychology Club",
      chineseName: "微光心理社",
      englishName: "Light by Light Psychology Club",
      description:
        "This is your spiritual harbor. We listen to each other's stories, share the power of growth, and discover another possibility of life together.",
      purpose:
        "To build a supportive peer community where students can discuss emotions, stress, relationships, and personal growth.",
      mission:
        "Light by Light Psychology Club promotes mental well-being through peer sharing, themed workshops, reflective activities, and campus care campaigns.",
      category: "Wellbeing & Psychology",
      joinInfo:
        "Open to students interested in psychology, self-growth, and peer support. Applications are reviewed by the club administrator.",
      reviewer: "Liam Anderson",
      event: {
        title: "Stress Relief Circle",
        description:
          "A guided peer-sharing session about stress management, emotional balance, and healthy campus routines.",
        location: "Library Seminar Room",
        startTime: "2026-06-07T15:00:00.000Z",
        endTime: "2026-06-07T16:30:00.000Z",
        capacity: 25,
      },
      announcement: {
        title: "Stress Relief Circle is now open",
        content:
          "Join us for a quiet and supportive conversation about stress, growth, and self-care.",
        isPinned: false,
      },
      comment:
        "I like the idea of having a calm and safe place to talk with others.",
    },
    {
      sourceId: 104,
      createdBy: users["1235885@wku.edu.cn"],
      commenter: lucas,
      name: "French Club",
      chineseName: "法语社",
      englishName: "French Club",
      description:
        "Say bonjour to new experiences! Dive into French language, films, and culture with a group of passionate Francophiles.",
      purpose:
        "To introduce French language and culture to students through relaxed, interactive, and enjoyable activities.",
      mission:
        "French Club encourages cultural curiosity by organizing language corners, film nights, cultural festivals, and beginner-friendly French learning sessions.",
      category: "Language & Culture",
      joinInfo:
        "No French background is required. Beginners are welcome to apply and participate in language activities.",
      reviewer: "Olivia Brown",
      event: {
        title: "French Movie Night",
        description:
          "A cozy movie night featuring a French film, snacks, and a short discussion after the screening.",
        location: "CBPM Lecture Hall",
        startTime: "2026-06-10T18:00:00.000Z",
        endTime: "2026-06-10T20:30:00.000Z",
        capacity: 60,
      },
      announcement: {
        title: "Bonjour! French Movie Night is coming",
        content:
          "Join our first French Movie Night. Beginners are welcome, and subtitles will be provided.",
        isPinned: true,
      },
      comment:
        "I have never learned French before, but this club feels very beginner-friendly.",
    },
    {
      sourceId: 105,
      createdBy: users["1235886@wku.edu.cn"],
      commenter: ava,
      name: "Turing Computer Club",
      chineseName: "图灵计算机社",
      englishName: "Turing Computer Club",
      description:
        "A student-led technology club for coding, software development, AI exploration, hackathons, and peer learning.",
      purpose:
        "To help WKU students improve practical computing skills and connect with peers interested in technology.",
      mission:
        "Turing Computer Club supports students through coding workshops, project collaboration, technical talks, interview preparation, and innovation challenges.",
      category: "Technology & Innovation",
      joinInfo:
        "Open to students from all majors. Members can join workshops, coding sessions, project groups, and technical sharing events.",
      reviewer: "Noah Wilson",
      event: {
        title: "AI Tools for Student Projects",
        description:
          "A beginner-friendly workshop on using AI tools for coding, research, presentation design, and project development.",
        location: "STEM Building Lab 204",
        startTime: "2026-06-12T14:00:00.000Z",
        endTime: "2026-06-12T16:00:00.000Z",
        capacity: 35,
      },
      announcement: {
        title: "Turing Computer Club recruitment is open",
        content:
          "Students interested in coding, AI, software engineering, or technical projects are welcome to apply.",
        isPinned: true,
      },
      comment:
        "This is exactly the kind of club I want to join for coding practice and project experience.",
    },
  ];

  const createdClubs = [];

  for (const club of clubs) {
    createdClubs.push(await createClubWithContent(club));
  }

  return createdClubs;
}

async function main() {
  const passwordHash = await hashPassword("123456");

  console.log("Clearing old demo data...");
  await clearDatabase();

  console.log("Ensuring super admin exists...");
  const superAdmin = await ensureSuperAdmin(passwordHash);

  console.log("Creating demo users...");
  const users = await createUsers(passwordHash);

  console.log("Creating demo clubs...");
  const clubs = await createClubs(users);

  console.log("Demo database is ready.");
  console.log("Super admin:");
  console.log({
    email: superAdmin.email,
    role: superAdmin.role,
  });

  console.log("Created users:");
  Object.values(users).forEach((user) => {
    console.log({
      email: user.email,
      password: "123456",
      role: user.role,
      name: user.name,
    });
  });

  console.log("Created clubs:");
  clubs.forEach((club) => {
    console.log({
      id: club.id,
      englishName: club.englishName,
      chineseName: club.chineseName,
      createdById: club.createdById,
    });
  });
}

main()
  .catch((error) => {
    console.error("Demo seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });