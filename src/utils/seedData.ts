import { DataService } from '../services/dataService';
import { User, League, Challenge, Meal, Post, BuddyMatch, WorkoutEntry, MacroTargets, WeeklyGoal } from '../models/types';

export function seedDatabase(dataService: DataService): void {
  // Clear existing data
  dataService.clearAll();

  // Create 3 users
  const users: User[] = [
    {
      id: 'user_1',
      username: 'fitness_mike',
      email: 'mike@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      createdAt: new Date('2024-01-01'),
      totalScore: 0,
      weeklyScore: 0
    },
    {
      id: 'user_2',
      username: 'healthy_sarah',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Williams',
      createdAt: new Date('2024-01-02'),
      totalScore: 0,
      weeklyScore: 0
    },
    {
      id: 'user_3',
      username: 'strong_alex',
      email: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Chen',
      createdAt: new Date('2024-01-03'),
      totalScore: 0,
      weeklyScore: 0
    }
  ];

  users.forEach(user => dataService.createUser(user));

  // Create demo league
  const demoLeague: League = {
    id: 'league_demo',
    name: 'Fitness Champions League',
    description: 'A competitive league for fitness enthusiasts to track progress and compete in challenges',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    participants: ['user_1', 'user_2', 'user_3'],
    isActive: true
  };

  dataService.createLeague(demoLeague);

  // Create 4-week challenge
  const weeklyGoals: WeeklyGoal[] = [
    {
      week: 1,
      workoutTarget: 3,
      calorieTarget: 2000,
      macroTargets: { protein: 150, carbs: 200, fat: 80, calories: 2000 }
    },
    {
      week: 2,
      workoutTarget: 4,
      calorieTarget: 2100,
      macroTargets: { protein: 160, carbs: 210, fat: 85, calories: 2100 }
    },
    {
      week: 3,
      workoutTarget: 4,
      calorieTarget: 2200,
      macroTargets: { protein: 170, carbs: 220, fat: 90, calories: 2200 }
    },
    {
      week: 4,
      workoutTarget: 5,
      calorieTarget: 2300,
      macroTargets: { protein: 180, carbs: 230, fat: 95, calories: 2300 }
    }
  ];

  const challenge: Challenge = {
    id: 'challenge_4week',
    leagueId: 'league_demo',
    name: 'New Year Transformation Challenge',
    description: 'A 4-week intensive challenge to kickstart your fitness journey',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-28'),
    weeklyGoals,
    participants: ['user_1', 'user_2', 'user_3']
  };

  dataService.createChallenge(challenge);

  // Create 7 days of meals for each user
  const mealTemplates = [
    { name: 'Protein Pancakes', calories: 350, macros: { protein: 25, carbs: 30, fat: 12, calories: 350 } },
    { name: 'Greek Yogurt Bowl', calories: 280, macros: { protein: 20, carbs: 25, fat: 8, calories: 280 } },
    { name: 'Chicken Salad', calories: 420, macros: { protein: 35, carbs: 15, fat: 22, calories: 420 } },
    { name: 'Grilled Salmon', calories: 380, macros: { protein: 30, carbs: 10, fat: 25, calories: 380 } },
    { name: 'Quinoa Bowl', calories: 450, macros: { protein: 18, carbs: 60, fat: 15, calories: 450 } },
    { name: 'Protein Smoothie', calories: 320, macros: { protein: 28, carbs: 20, fat: 10, calories: 320 } },
    { name: 'Turkey Wrap', calories: 390, macros: { protein: 25, carbs: 35, fat: 18, calories: 390 } }
  ];

  users.forEach((user, userIndex) => {
    for (let day = 0; day < 7; day++) {
      const date = new Date('2024-01-01');
      date.setDate(date.getDate() + day);
      
      ['breakfast', 'lunch', 'dinner'].forEach((mealType, mealIndex) => {
        const template = mealTemplates[(day * 3 + mealIndex + userIndex) % mealTemplates.length];
        const meal: Meal = {
          id: `meal_${user.id}_${day}_${mealType}`,
          userId: user.id,
          date,
          mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
          name: template.name,
          calories: template.calories,
          macros: template.macros
        };
        dataService.createMeal(meal);
      });
    }
  });

  // Create sample workouts
  const workoutTypes = ['Cardio', 'Strength Training', 'Yoga', 'HIIT', 'Running'];
  users.forEach((user, userIndex) => {
    for (let day = 0; day < 7; day++) {
      if (day % 2 === userIndex % 2) { // Vary workout frequency per user
        const date = new Date('2024-01-01');
        date.setDate(date.getDate() + day);
        
        const workout: WorkoutEntry = {
          id: `workout_${user.id}_${day}`,
          userId: user.id,
          date,
          type: workoutTypes[day % workoutTypes.length],
          duration: 30 + (day * 10),
          caloriesBurned: 200 + (day * 50),
          notes: `Great ${workoutTypes[day % workoutTypes.length].toLowerCase()} session!`
        };
        dataService.createWorkout(workout);
      }
    }
  });

  // Create sample posts
  const posts: Post[] = [
    {
      id: 'post_1',
      userId: 'user_1',
      content: 'Just completed my first workout of the challenge! Feeling motivated! 💪',
      type: 'workout',
      timestamp: new Date('2024-01-01T08:00:00'),
      likes: ['user_2', 'user_3'],
      comments: [
        {
          id: 'comment_1',
          userId: 'user_2',
          content: 'Great job! Keep it up!',
          timestamp: new Date('2024-01-01T08:15:00')
        }
      ]
    },
    {
      id: 'post_2',
      userId: 'user_2',
      content: 'Meal prep Sunday complete! Ready for a healthy week ahead 🥗',
      type: 'meal',
      timestamp: new Date('2024-01-01T14:30:00'),
      likes: ['user_1'],
      comments: []
    },
    {
      id: 'post_3',
      userId: 'user_3',
      content: 'Week 1 progress: Lost 2 pounds and feeling stronger! This challenge is amazing!',
      type: 'progress',
      timestamp: new Date('2024-01-07T19:00:00'),
      likes: ['user_1', 'user_2'],
      comments: [
        {
          id: 'comment_2',
          userId: 'user_1',
          content: 'Awesome progress! Inspiring!',
          timestamp: new Date('2024-01-07T19:05:00')
        },
        {
          id: 'comment_3',
          userId: 'user_2',
          content: 'You\'re doing great! Keep pushing!',
          timestamp: new Date('2024-01-07T19:10:00')
        }
      ]
    },
    {
      id: 'post_4',
      userId: 'user_1',
      content: 'Anyone else struggling with meal prep? Looking for some easy healthy recipes!',
      type: 'general',
      timestamp: new Date('2024-01-05T16:20:00'),
      likes: [],
      comments: [
        {
          id: 'comment_4',
          userId: 'user_2',
          content: 'I love overnight oats for breakfast! Super easy and filling.',
          timestamp: new Date('2024-01-05T16:25:00')
        }
      ]
    }
  ];

  posts.forEach(post => dataService.createPost(post));

  // Create 2 buddy matches
  const buddyMatches: BuddyMatch[] = [
    {
      id: 'buddy_1',
      user1Id: 'user_1',
      user2Id: 'user_2',
      matchedAt: new Date('2024-01-01'),
      isActive: true,
      compatibilityScore: 85
    },
    {
      id: 'buddy_2',
      user1Id: 'user_2',
      user2Id: 'user_3',
      matchedAt: new Date('2024-01-02'),
      isActive: true,
      compatibilityScore: 92
    }
  ];

  buddyMatches.forEach(match => dataService.createBuddyMatch(match));

  console.log('Database seeded successfully!');
  console.log(`- ${users.length} users created`);
  console.log(`- 1 demo league created`);
  console.log(`- 1 four-week challenge created`);
  console.log(`- ${users.length * 7 * 3} meals created (7 days × 3 meals per user)`);
  console.log(`- ${posts.length} sample posts created`);
  console.log(`- ${buddyMatches.length} buddy matches created`);
}