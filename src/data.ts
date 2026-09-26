import { PetCompanion, PetId, DayLog, CycleRecord, AppSettings } from './types';

export const pets: Record<PetId, PetCompanion> = {
  kitty: {
    id: 'kitty',
    name: 'Mimi',
    avatar: '🐱',
    personality: 'Sweet & Playful Kitten',
    greetings: {
      period: [
        'Meow~ Wrap yourself in a warm blanket today! 🍵',
        'Here is a warm purr for your cramps. Rest well! 💕',
        'Remember to drink warm water and take it easy, cutie! 🌸',
      ],
      fertile: [
        'Purr~ Your energy is shining bright today! ✨',
        'Fertile window is here! You look glowing! 💖',
        'Great day for light stretching and good vibes! 🌷',
      ],
      ovulation: [
        'Peak ovulation day today! High sparkle energy! 🌟',
        'Your body is at its peak harmony today! 💖',
      ],
      standard: [
        'Good morning, beautiful! Mimi is here with you! 🐾',
        'Stay happy and keep smiling today! 🌸',
        'Remember to log your mood today, nya~ ✨',
      ],
      waterGoal: [
        'Purr-fect! You finished your water goal today! 💧🎉',
        'Yay! Hydrated and radiant! Great job! 🌟',
      ],
    },
  },
  bunny: {
    id: 'bunny',
    name: 'Lulu',
    avatar: '🐰',
    personality: 'Gentle & Loving Bunny',
    greetings: {
      period: [
        'Sending soft bunny hugs for your period day! 🌷',
        'Rest your body, drink chamomile tea, and stay cozy! 🥕',
      ],
      fertile: [
        'Hoppy day! Estrogen is rising and you are vibrant! 🌺',
        'Such glowing energy today! Enjoy your day! ✨',
      ],
      ovulation: [
        'Ovulation day! You are at your peak radiance! 🌸',
      ],
      standard: [
        'Hop hop! Have a sweet and peaceful day! 🌿',
        'Sending love and positive thoughts your way! 💖',
      ],
      waterGoal: [
        'Hooray! Fresh and fully hydrated like a morning blossom! 💧🌸',
      ],
    },
  },
  puppy: {
    id: 'puppy',
    name: 'Coco',
    avatar: '🐶',
    personality: 'Enthusiastic & Cheerful Pup',
    greetings: {
      period: [
        'Woof! I am guarding you while you rest today! 🧸',
        'Take it slow today, friend! You are doing amazing! 🐾',
      ],
      fertile: [
        'High stamina day! Let us go for a nice stroll! 🏃‍♀️✨',
        'So much vitality! You are unstoppable today! 🎾',
      ],
      ovulation: [
        'Peak energy day! High five! 🌟🐾',
      ],
      standard: [
        'Woof! Always cheering for you every single day! 💖',
        'Did you take your vitamins today? Good job! 💊',
      ],
      waterGoal: [
        'Water goal unlocked! High paws! 💧🐾🎉',
      ],
    },
  },
  teddy: {
    id: 'teddy',
    name: 'Bibi',
    avatar: '🧸',
    personality: 'Cozy & Caring Bear',
    greetings: {
      period: [
        'Warm bear hugs! Put on warm socks and cuddle up. ☕',
        'I am here to keep you warm and cozy all day long. 🧸',
      ],
      fertile: [
        'A lovely breezy day filled with creative joy! 🌻',
      ],
      ovulation: [
        'Peak fertility today! Harmony in every step! 💫',
      ],
      standard: [
        'Take a deep breath and have a wonderful day! 🍃',
      ],
      waterGoal: [
        'Splendid! All 8 glasses complete! 💧🧸',
      ],
    },
  },
  flora: {
    id: 'flora',
    name: 'Flora',
    avatar: '🌸',
    personality: 'Blossoming Garden Fairy',
    greetings: {
      period: [
        'Every petal renews itself in quiet stillness. Rest gently. 🌺',
      ],
      fertile: [
        'In full bloom! Your creative power is flourishing! 🌷',
      ],
      ovulation: [
        'The golden blossom shines brightest today! 🌼✨',
      ],
      standard: [
        'May your day blossom with joy and peace! 💐',
      ],
      waterGoal: [
        'Your garden is fully watered and radiant! 💧🌱',
      ],
    },
  },
};

export interface SymptomItem {
  id: string;
  name: string;
  emoji: string;
  category: 'body' | 'skin' | 'digestion' | 'other';
}

export const symptomList: SymptomItem[] = [
  { id: 'cramps', name: 'Cramps', emoji: '⚡', category: 'body' },
  { id: 'tender_breasts', name: 'Tender Breasts', emoji: '🍈', category: 'body' },
  { id: 'headache', name: 'Headache', emoji: '🤕', category: 'body' },
  { id: 'backache', name: 'Backache', emoji: '🦴', category: 'body' },
  { id: 'fatigue', name: 'Fatigue', emoji: '😴', category: 'body' },
  { id: 'bloating', name: 'Bloating', emoji: '🎈', category: 'body' },
  { id: 'nausea', name: 'Nausea', emoji: '🤢', category: 'body' },
  { id: 'insomnia', name: 'Insomnia', emoji: '🌙', category: 'body' },
  { id: 'hot_flashes', name: 'Hot Flashes', emoji: '🔥', category: 'body' },
  { id: 'dizziness', name: 'Dizziness', emoji: '💫', category: 'body' },
  { id: 'ovulation_pain', name: 'Mittelschmerz', emoji: '✨', category: 'body' },

  { id: 'acne', name: 'Acne / Breakout', emoji: '🧖‍♀️', category: 'skin' },
  { id: 'oily_skin', name: 'Oily Skin', emoji: '✨', category: 'skin' },
  { id: 'dry_skin', name: 'Dry Skin', emoji: '🍂', category: 'skin' },
  { id: 'glowing_skin', name: 'Glowing Skin', emoji: '🌟', category: 'skin' },

  { id: 'cravings_sweet', name: 'Sweet Cravings', emoji: '🍫', category: 'digestion' },
  { id: 'cravings_salty', name: 'Salty Cravings', emoji: '🍟', category: 'digestion' },
  { id: 'constipation', name: 'Constipation', emoji: '🪨', category: 'digestion' },
  { id: 'diarrhea', name: 'Diarrhea', emoji: '💧', category: 'digestion' },
  { id: 'gas', name: 'Gas / Indigestion', emoji: '💨', category: 'digestion' },
  { id: 'high_appetite', name: 'Increased Appetite', emoji: '🍔', category: 'digestion' },

  { id: 'chills', name: 'Chills', emoji: '🥶', category: 'other' },
  { id: 'swelling', name: 'Water Retention', emoji: '💦', category: 'other' },
  { id: 'restless_legs', name: 'Restless Legs', emoji: '🦵', category: 'other' },
];

export interface MoodItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const moodList: MoodItem[] = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD54F' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#81C784' },
  { id: 'in_love', name: 'In Love', emoji: '🥰', color: '#FF80AB' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡', color: '#FFB74D' },
  { id: 'playful', name: 'Playful', emoji: '🥳', color: '#BA68C8' },
  { id: 'sensitive', name: 'Sensitive', emoji: '🥺', color: '#4FC3F7' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#90CAF9' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#E0E0E0' },
  { id: 'irritable', name: 'Irritable', emoji: '😤', color: '#FF8A65' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#E57373' },
  { id: 'stressed', name: 'Stressed', emoji: '🤯', color: '#B0BEC5' },
  { id: 'tired', name: 'Exhausted', emoji: '🥱', color: '#A1887F' },
  { id: 'confused', name: 'Brain Fog', emoji: '😶‍🌫️', color: '#CE93D8' },
  { id: 'mood_swings', name: 'Mood Swings', emoji: '🎭', color: '#F06292' },
  { id: 'sensual', name: 'Sensual', emoji: '💋', color: '#E91E63' },
  { id: 'confident', name: 'Confident', emoji: '💅', color: '#AB47BC' },
];

export const defaultSettings: AppSettings = {
  cycleLength: 28,
  periodLength: 5,
  lutealLength: 14,
  tempUnit: 'F',
  weightUnit: 'kg',
  waterGoalGlasses: 8,
  theme: 'blossom',
  pet: 'kitty',
  pinLockEnabled: false,
  pinCode: '1234',
  isPregnancyMode: false,
  pregnancyDueDate: '2027-05-18',
  pregnancyStartDate: '2026-08-11',
  userAge: 25,
  userHeight: 160,
  userWeight: 60,
  remindPeriodDaysBefore: 2,
  remindPeriodEnabled: true,
  remindOvulationEnabled: true,
  remindPillEnabled: true,
  remindPillTime: '21:00',
  remindWaterEnabled: true,
};

export const sampleCycles: CycleRecord[] = [
  { id: 'c1', startDate: '2026-04-10', endDate: '2026-05-07', cycleLength: 28, periodLength: 5, ovulationDate: '2026-04-24' },
  { id: 'c2', startDate: '2026-05-08', endDate: '2026-06-05', cycleLength: 29, periodLength: 5, ovulationDate: '2026-05-23' },
  { id: 'c3', startDate: '2026-06-06', endDate: '2026-07-03', cycleLength: 28, periodLength: 4, ovulationDate: '2026-06-20' },
  { id: 'c4', startDate: '2026-07-04', endDate: '2026-07-31', cycleLength: 28, periodLength: 5, ovulationDate: '2026-07-18' },
  { id: 'c5', startDate: '2026-08-01', endDate: '2026-08-28', cycleLength: 28, periodLength: 5, ovulationDate: '2026-08-15' },
];

// Initial seeded day logs around August & September 2026
export const sampleLogs: Record<string, DayLog> = {
  '2026-08-01': {
    date: '2026-08-01',
    isPeriod: true,
    flow: 'heavy',
    symptoms: ['cramps', 'bloating', 'fatigue'],
    moods: ['sensitive', 'tired'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '21:15',
    waterGlasses: 8,
    temperature: 97.4,
    weight: 58.6,
    cervicalMucus: 'dry',
    notes: 'First day of period. Warm tea and hot water bottle helped immensely.',
  },
  '2026-08-02': {
    date: '2026-08-02',
    isPeriod: true,
    flow: 'medium',
    symptoms: ['cramps', 'headache'],
    moods: ['calm'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '21:00',
    waterGlasses: 7,
    temperature: 97.3,
    weight: 58.4,
    notes: 'Flow eased up by evening.',
  },
  '2026-08-03': {
    date: '2026-08-03',
    isPeriod: true,
    flow: 'medium',
    symptoms: ['tender_breasts'],
    moods: ['happy'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '21:30',
    waterGlasses: 8,
    temperature: 97.5,
    weight: 58.2,
    notes: '',
  },
  '2026-08-04': {
    date: '2026-08-04',
    isPeriod: true,
    flow: 'light',
    symptoms: [],
    moods: ['happy', 'calm'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '21:00',
    waterGlasses: 8,
    temperature: 97.5,
    weight: 58.0,
    notes: 'Energy returning nicely!',
  },
  '2026-08-05': {
    date: '2026-08-05',
    isPeriod: true,
    flow: 'spotting',
    symptoms: [],
    moods: ['energetic'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '20:50',
    waterGlasses: 8,
    temperature: 97.6,
    weight: 57.9,
    notes: 'Period ended.',
  },
  '2026-08-14': {
    date: '2026-08-14',
    isPeriod: false,
    flow: 'none',
    symptoms: ['glowing_skin'],
    moods: ['in_love', 'sensual', 'happy'],
    intimacy: ['protected', 'high_desire'],
    orgasms: 2,
    pillTaken: true,
    waterGlasses: 8,
    temperature: 97.8,
    weight: 57.8,
    cervicalMucus: 'egg_white',
    notes: 'Fertile window peak.',
  },
  '2026-08-15': {
    date: '2026-08-15',
    isPeriod: false,
    flow: 'none',
    symptoms: ['ovulation_pain', 'glowing_skin'],
    moods: ['energetic', 'confident'],
    intimacy: ['protected'],
    orgasms: 1,
    pillTaken: true,
    waterGlasses: 8,
    temperature: 98.1,
    weight: 57.8,
    cervicalMucus: 'egg_white',
    notes: 'Ovulation Day! Slight pinch on left side.',
  },
  '2026-08-28': {
    date: '2026-08-28',
    isPeriod: false,
    flow: 'none',
    symptoms: ['bloating', 'cravings_sweet'],
    moods: ['calm', 'sensitive'],
    intimacy: ['none'],
    orgasms: 0,
    pillTaken: true,
    pillTime: '21:00',
    waterGlasses: 5,
    temperature: 98.4,
    weight: 58.2,
    cervicalMucus: 'sticky',
    notes: 'Luteal phase. Period anticipated in 1 day.',
  },
};
