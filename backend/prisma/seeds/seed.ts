import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for OSSD#13...");

  // 1️⃣ Create Admin User (Organizer)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ossd13.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "OSSD",
      email: "admin@ossd13.com",
      avatar: "https://via.placeholder.com/150",
    },
  });

  // 2️⃣ Create Event for OSSD#13
  const event = await prisma.event.create({
    data: {
      name: "OSSD#13",
      description: "งานค่าย OSSD ครั้งที่ 13",
      userId: admin.id,
    },
  });

  // 3️⃣ Create Polls (Best Presentation & Popular Vote)
  const bestPresentationPoll = await prisma.poll.create({
    data: {
      question: "ทีมไหนมีการนำเสนอที่ดีที่สุด?",
      description: "โหวต Best Presentation สำหรับ OSSD#13",
      isPublic: true,
      startVoteAt: new Date(),
      endVoteAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // โหวตได้ภายใน 2 วัน
      isVoteEnd: false,
      eventId: event.id,
      userId: admin.id,
    },
  });

  const popularVotePoll = await prisma.poll.create({
    data: {
      question: "ทีมไหนได้รับความนิยมสูงสุด?",
      description: "โหวต Popular Vote สำหรับ OSSD#13",
      isPublic: true,
      startVoteAt: new Date(),
      endVoteAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isVoteEnd: false,
      eventId: event.id,
      userId: admin.id,
    },
  });

  // 4️⃣ Add Options for Each Poll (ใช้ข้อมูล names)
  const clusters = [
    { id: 0, cluster: "Cluster 0", company: "Clicknext Bangsean", color1: "#002449", color2: "#868990", img: "/src/assets/images/logo_cluster/logo-cluster-0.png" },
    { id: 1, cluster: "Cluster 1", company: "นางฟ้าบางแสน", color1: "#360305", color2: "#F6AC1E", img: "/src/assets/images/logo_cluster/logo-cluster-1.png" },
    { id: 2, cluster: "Cluster 2", company: "TTT Brother", color1: "#000000", color2: "#FFFFFF", img: "/src/assets/images/logo_cluster/logo-cluster-2.png" },
    { id: 3, cluster: "Cluster 3", company: "Clicknext Bangkok", color1: "#2F275F", color2: "#2D3087", img: "/src/assets/images/logo_cluster/logo-cluster-3.png" },
    { id: 4, cluster: "Cluster 4", company: "IV Soft", color1: "#939599", color2: "#EFAB00", img: "/src/assets/images/logo_cluster/logo-cluster-4.png" },
    { id: 5, cluster: "Cluster 5", company: "TTT Brother", color1: "#5B8CDD", color2: "#BD73BF", img: "/src/assets/images/logo_cluster/logo-cluster-5.png" },
    { id: 6, cluster: "Cluster 6", company: "Clicknext Bangkok", color1: "#6996B7", color2: "#E00024", img: "/src/assets/images/logo_cluster/logo-cluster-6.png" },
    { id: 7, cluster: "Cluster 7", company: "นางฟ้าบางแสน", color1: "#000000", color2: "#017F8D", img: "/src/assets/images/logo_cluster/logo-cluster-7.png" },
    { id: 8, cluster: "Cluster 8", company: "IV Soft", color1: "#000000", color2: "#D72027", img: "/src/assets/images/logo_cluster/logo-cluster-8.png" },
    { id: 9, cluster: "Cluster 9", company: "Clicknext Bangsean", color1: "#232323", color2: "#FFFFFF", img: "/src/assets/images/logo_cluster/logo-cluster-9.png" },
  ];

  for (const cluster of clusters) {
    await prisma.option.createMany({
      data: [
        {
          text: `${cluster.cluster} - ${cluster.company}`,
          banner: cluster.img,
          pollId: bestPresentationPoll.id,
        },
        {
          text: `${cluster.cluster} - ${cluster.company}`,
          banner: cluster.img,
          pollId: popularVotePoll.id,
        },
      ],
    });
  }

  // 5️⃣ Create Guests (สำหรับการโหวต)
  const guestCount = 10; // จำนวน Guest ที่ต้องการสร้าง
  for (let i = 0; i < guestCount; i++) {
    await prisma.guest.create({
      data: {
        name: `Guest-${i + 1}`,
        key: randomUUID(), // ใช้ UUID เป็น Key สำหรับ Guest
        eventId: event.id,
      },
    });
  }

  console.log("✅ Seeding complete for OSSD#13!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
