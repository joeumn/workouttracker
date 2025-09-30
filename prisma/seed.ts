// This file will be used to seed the database with demo data
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ironcircle.com' },
    update: {},
    create: {
      email: 'demo@ironcircle.com',
      username: 'demo_user',
      name: 'Demo User',
      xp: 1250,
      level: 5,
      streak: 7,
      lastCheckIn: new Date(),
    },
  })

  // Create demo groups
  const morningWarriors = await prisma.group.upsert({
    where: { id: 'group-1' },
    update: {},
    create: {
      id: 'group-1',
      name: 'Morning Warriors',
      description: 'Early birds who conquer their workouts before sunrise',
      ownerId: demoUser.id,
    },
  })

  const proteinHunters = await prisma.group.upsert({
    where: { id: 'group-2' },
    update: {},
    create: {
      id: 'group-2',
      name: 'Protein Hunters',
      description: 'Focused on hitting protein goals and building muscle',
      ownerId: demoUser.id,
    },
  })

  // Add user to groups
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: morningWarriors.id, userId: demoUser.id } },
    update: {},
    create: {
      groupId: morningWarriors.id,
      userId: demoUser.id,
      role: 'OWNER',
    },
  })

  // Create demo challenge
  const challenge = await prisma.challenge.upsert({
    where: { id: 'challenge-1' },
    update: {},
    create: {
      id: 'challenge-1',
      name: '28-Day Consistency Challenge',
      description: 'Complete workouts and track macros for 28 days straight',
      type: 'FOUR_WEEK',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-28'),
    },
  })

  // Add user to challenge
  await prisma.challengeParticipant.upsert({
    where: { challengeId_userId: { challengeId: challenge.id, userId: demoUser.id } },
    update: {},
    create: {
      challengeId: challenge.id,
      userId: demoUser.id,
      score: 150,
      progress: {
        week: 2,
        completedDays: 10,
        totalDays: 28,
      },
    },
  })

  // Create demo workouts
  const workouts = [
    {
      name: 'Push Day',
      description: 'Chest, Shoulders, Triceps',
      duration: 45,
      calories: 350,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    },
    {
      name: 'Pull Day',
      description: 'Back, Biceps',
      duration: 50,
      calories: 320,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      name: 'Leg Day',
      description: 'Squats, Deadlifts, Lunges',
      duration: 60,
      calories: 450,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  ]

  for (const workout of workouts) {
    await prisma.workout.create({
      data: {
        ...workout,
        userId: demoUser.id,
      },
    })
  }

  // Create demo macro entries
  const macroEntries = [
    { date: new Date(), protein: 95, carbs: 180, fat: 65, calories: 1520 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), protein: 110, carbs: 200, fat: 70, calories: 1680 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), protein: 88, carbs: 150, fat: 55, calories: 1380 },
  ]

  for (const entry of macroEntries) {
    await prisma.macroEntry.create({
      data: {
        ...entry,
        userId: demoUser.id,
      },
    })
  }

  // Create demo vibe packs
  const vibePacks = [
    {
      name: 'Beast Mode Playlist',
      description: 'High-energy tracks for intense workouts',
      type: 'SPOTIFY_PLAYLIST',
      url: 'https://open.spotify.com/playlist/example',
      isPublic: true,
    },
    {
      name: 'Focus Deep Work',
      description: 'Ambient sounds for concentration',
      type: 'FOCUS_VIDEO',
      url: 'https://youtube.com/watch?v=example',
      isPublic: true,
    },
    {
      name: 'Morning Motivation',
      description: 'Uplifting music to start your day',
      type: 'YOUTUBE_PLAYLIST',
      url: 'https://youtube.com/playlist?list=example',
      isPublic: true,
    },
  ]

  for (const vibe of vibePacks) {
    await prisma.vibePack.create({
      data: {
        ...vibe,
        userId: demoUser.id,
      },
    })
  }

  // Create demo check-ins
  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    await prisma.checkIn.create({
      data: {
        userId: demoUser.id,
        date,
        mood: Math.floor(Math.random() * 5) + 1,
        energy: Math.floor(Math.random() * 5) + 1,
        notes: i === 0 ? 'Feeling great today!' : undefined,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created user: ${demoUser.email}`)
  console.log(`🏃‍♂️ Created ${workouts.length} workouts`)
  console.log(`🥗 Created ${macroEntries.length} macro entries`)
  console.log(`🎵 Created ${vibePacks.length} vibe packs`)
  console.log(`👥 Created ${[morningWarriors, proteinHunters].length} groups`)
  console.log(`🏆 Created 1 challenge`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })