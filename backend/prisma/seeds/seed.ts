import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

function getRandomDateInPastDays(days = 30) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
  return pastDate;
}

async function main() {
  console.log("🌱 Seeding database...");

  try {
    await prisma.$transaction(async (prisma) => {
      // 1️⃣ Create Users
      const users = await Promise.all(
        ["admin@ossd13.com", "user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com", "user5@example.com", "user6@example.com", "user7@example.com"].map(
          async (email, index) =>
            prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                firstName: `User${index + 1}`,
                lastName: "Test",
                email,
                avatar: `https://via.placeholder.com/150?text=User${index + 1}`,
              },
            })
        )
      );

      const admin = users[0];

      // 2️⃣ Create Events
      const events = await Promise.all(
        ["OSSD#13", "Tech Conference", "Hackathon", "AI Summit", "Cybersecurity Forum", "Web Dev Expo", "Data Science Meetup"].map(async (name) =>
          prisma.event.create({
            data: {
              name,
              description: `Description for ${name}`,
              userId: admin.id,
              createdAt: getRandomDateInPastDays(90),
            },
          })
        )
      );

      // 3️⃣ Create Polls
      const polls = await Promise.all(
        events.map(async (event) => {
          const startVoteAt = getRandomDateInPastDays(60);
          return prisma.poll.create({
            data: {
              question: `Poll for ${event.name}`,
              description: `Vote on ${event.name}`,
              isPublic: true,
              startVoteAt,
              endVoteAt: new Date(startVoteAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
              isVoteEnd: false,
              eventId: event.id,
              userId: admin.id,
            },
          });
        })
      );

      // 4️⃣ Create Options for Each Poll
      const options = await Promise.all(
        polls.flatMap((poll) =>
          ["Option A", "Option B", "Option C", "Option D", "Option E"].map((text) =>
            prisma.option.create({
              data: {
                text,
                pollId: poll.id,
              },
            })
          )
        )
      );

      // 5️⃣ Create Whitelist Users
      const whitelistUsers = await Promise.all(
        users.slice(1).map(async (user) => {
          let event;
          let retries = 10;
          do {
            event = events[Math.floor(Math.random() * events.length)];
            retries--;
          } while (await prisma.whitelistUser.findUnique({ where: { userId_eventId: { userId: user.id, eventId: event.id } } }) && retries > 0);
          
          return prisma.whitelistUser.upsert({
            where: {
              userId_eventId: {
                userId: user.id,
                eventId: event.id,
              },
            },
            update: {},
            create: {
              userId: user.id,
              eventId: event.id,
              point: Math.floor(Math.random() * 10),
            },
          });
        })
      );

      // 6️⃣ Create Guests
      const guests = await Promise.all(
        Array.from({ length: 15 }).map((_, i) => {
          const event = events[Math.floor(Math.random() * events.length)];
          return prisma.guest.create({
            data: {
              name: `Guest-${i + 1}`,
              key: `GUEST-${(i + 1).toString().padStart(3, '0')}-${randomUUID().slice(0, 8).toUpperCase()}`,
              eventId: event.id,
            },
          });
        })
      );

      // 7️⃣ Create Votes
      const votes = await Promise.all(
        users.flatMap((user) =>
          options.map((option) =>
            prisma.vote.create({
              data: {
                pollId: option.pollId,
                optionId: option.id,
                userId: user.id,
                guestId: null,
                createdAt: getRandomDateInPastDays(30),
              },
            })
          )
        ).concat(
          guests.flatMap((guest) =>
            options.map((option) =>
              prisma.vote.create({
                data: {
                  pollId: option.pollId,
                  optionId: option.id,
                  userId: null,
                  guestId: guest.id,
                  createdAt: getRandomDateInPastDays(30),
                },
              })
            )
          )
        )
      );

      // 8️⃣ Create Vote Restrictions
      const voteRestrictions = await Promise.all(
        options.map((option) =>
          prisma.voteRestriction.create({
            data: {
              userId: Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)].id : null,
              guestId: Math.random() > 0.5 ? guests[Math.floor(Math.random() * guests.length)].id : null,
              pollId: option.pollId,
              optionId: option.id,
              createdAt: getRandomDateInPastDays(30),
            },
          })
        )
      );
    });

    console.log("✅ Seeding complete!");
  } catch (e) {
    console.error("❌ Error seeding database, rolling back:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
