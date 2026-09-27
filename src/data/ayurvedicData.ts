export interface AyurvedicRemedyItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: 'remedy' | 'diet' | 'yoga' | 'lifestyle';
  icon: string; // emoji or image
  ingredients?: string[];
  preparationSteps?: string[];
  dosage?: string;
  bestTime?: string;
  benefits?: string[];
}

export interface AyurvedicConcern {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'cramps' | 'flower' | 'calendar' | 'pcos' | 'bloating' | 'acne' | 'balance' | 'bleeding' | 'discharge';
  iconEmoji: string;
  avatarUrl: string;
  colorBg: string;
  colorText: string;
  summary: string;
  remedies: AyurvedicRemedyItem[];
  doctorAdvice: {
    title: string;
    warningPoints: string[];
  };
}

export const ayurvedicConcerns: AyurvedicConcern[] = [
  {
    id: 'period-pain',
    title: 'Period Pain',
    subtitle: 'Natural remedies to reduce cramps and relax your body',
    iconType: 'cramps',
    iconEmoji: '⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-rose-50',
    colorText: 'text-rose-600',
    summary: 'Dysmenorrhea in Ayurveda is linked to aggravated Vata dosha obstructing the downward flow of Apana Vayu. Warming, antispasmodic herbs soothe pelvic contractions.',
    remedies: [
      {
        id: 'ginger-tea',
        name: 'Ginger Tea (Adrak Chai)',
        shortDesc: 'Drink warm ginger tea twice a day to reduce cramps.',
        fullDesc: 'Fresh ginger root contains gingerols and shogaols which inhibit prostaglandin synthesis, significantly easing severe uterine muscle contractions and pelvic soreness.',
        category: 'remedy',
        icon: '🫖',
        ingredients: ['1 inch fresh crushed ginger', '1.5 cups water', '1 tsp honey', 'Pinch of black pepper'],
        preparationSteps: [
          'Crush fresh ginger root and add to boiling water.',
          'Simmer on low heat for 5-7 minutes until water turns golden.',
          'Strain into a cup and stir in 1 tsp pure honey once warm.',
          'Sip slowly 2-3 times daily, starting 2 days before your period.'
        ],
        dosage: '1-2 cups daily',
        bestTime: 'Morning after breakfast & Late Afternoon',
        benefits: ['Reduces prostaglandin pain triggers', 'Relieves nausea and bloating', 'Promotes smooth pelvic circulation']
      },
      {
        id: 'ajwain-water',
        name: 'Ajwain Water (Carom Seeds)',
        shortDesc: 'Boil ajwain in water and sip warm for pain relief.',
        fullDesc: 'Ajwain contains thymol, an Ayurvedic powerhouse with instant antispasmodic properties that relax tight uterine muscles and expel trapped abdominal gas.',
        category: 'remedy',
        icon: '🥣',
        ingredients: ['1 tsp ajwain (carom seeds)', '2 cups filtered water', 'Pinch of black rock salt (optional)'],
        preparationSteps: [
          'Add ajwain seeds to water in a saucepan.',
          'Boil for 8 minutes until water reduces slightly and turns aromatic light brown.',
          'Strain and drink warm, preferably with a pinch of rock salt for rapid relief.'
        ],
        dosage: '1 cup during acute cramping',
        bestTime: 'Empty stomach or during active spasms',
        benefits: ['Instant relief from sudden lower abdominal cramps', 'Relieves gas and gastric pressure', 'Warm carminative effect']
      },
      {
        id: 'dashmool-tea',
        name: 'Dashmool Tea',
        shortDesc: 'Dashmool tea is an Ayurvedic herbal preparation traditionally used for Vata balance.',
        fullDesc: 'Dashmool is a classical Ayurvedic formulation of 10 healing roots renowned for restoring Apana Vata, eliminating deep pelvic inflammation, and soothing lower back aches.',
        category: 'remedy',
        icon: '🌿',
        ingredients: ['1 tsp Dashmoola powder / decoction', '1.5 cups water', '1/2 tsp organic jaggery'],
        preparationSteps: [
          'Add Dashmoola herbal blend to boiling water.',
          'Boil gently until reduced to half its original volume.',
          'Strain and sweeten lightly with organic jaggery.'
        ],
        dosage: '1 cup daily during luteal and period phases',
        bestTime: 'Evening before bed',
        benefits: ['Balances Apana Vata', 'Relieves radiating lower back and thigh pain', 'Deep neuromuscular relaxation']
      },
      {
        id: 'castor-oil-pack',
        name: 'Warm Castor Oil Compress',
        shortDesc: 'Apply warm castor oil with hot water compress over lower abdomen.',
        fullDesc: 'Ricinoleic acid in castor oil deeply penetrates pelvic tissues, stimulating lymphatic drainage, easing pelvic congestion, and soothing spasming muscles.',
        category: 'lifestyle',
        icon: '🧴',
        ingredients: ['2 tbsp pure organic castor oil', 'Cotton flannel cloth', 'Hot water bottle / heating pad'],
        preparationSteps: [
          'Warm the castor oil gently and massage onto lower abdomen in clockwise circles.',
          'Place a soft flannel cloth over the area.',
          'Apply the warm hot water bag on top for 20-30 minutes while resting.'
        ],
        dosage: 'Once daily during cycle days 1-3',
        bestTime: 'Before bedtime',
        benefits: ['Relaxes tight uterine walls', 'Increases localized healing blood flow', 'Calms nervous system']
      },
      {
        id: 'balasana-pose',
        name: 'Child\'s Pose (Balasana)',
        shortDesc: 'Restorative yoga stretch to release lower back & sacral pressure.',
        fullDesc: 'Gentle compression of the abdomen combined with deep diaphragm breathing stimulates parasympathetic relaxation and relieves sacral nerve pinching.',
        category: 'yoga',
        icon: '🧘‍♀️',
        preparationSteps: [
          'Kneel on a soft yoga mat with big toes touching and knees hip-width apart.',
          'Fold torso forward between thighs, resting forehead gently on the mat.',
          'Extend arms forward or rest them alongside body.',
          'Hold and take 10 slow, deep diaphragmatic breaths.'
        ],
        dosage: 'Hold for 3-5 minutes',
        bestTime: 'Whenever cramping flares up',
        benefits: ['Stretches hips, thighs, and ankles', 'Calms the mind and relieves fatigue', 'Relieves tension in pelvic floor']
      },
      {
        id: 'anti-inflammatory-diet',
        name: 'Warm Jaggery & Sesame Snack',
        shortDesc: 'Eat small portion of warm jaggery and sesame seeds for iron and magnesium.',
        fullDesc: 'Rich in bioavailable iron, magnesium, and healthy fats that facilitate smooth menstruation and replenish lost vitality.',
        category: 'diet',
        icon: '🍯',
        dosage: '1-2 tsp daily',
        bestTime: 'Post-lunch snack',
        benefits: ['Prevents menstrual fatigue', 'Natural magnesium reduces muscle spasms']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Cramps so intense they prevent normal daily activities despite remedies.',
        'Pain accompanied by fever, chills, or sudden unusual foul discharge.',
        'Cramps that started becoming progressively worse over the last few months.',
        'Bleeding that requires changing pads/tampons every 1 hour for consecutive hours.'
      ]
    }
  },
  {
    id: 'pms',
    title: 'PMS & Mood',
    subtitle: 'Holistic calm for irritability, mood swings, and breast tenderness',
    iconType: 'flower',
    iconEmoji: '🌸',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-600',
    summary: 'Premenstrual tension results from Pitta and Vata aggravation in the late luteal phase. Cooling, adaptogenic herbs help stabilize neurotransmitters.',
    remedies: [
      {
        id: 'chamomile-ashwagandha',
        name: 'Ashwagandha & Chamomile Elixir',
        shortDesc: 'Calms emotional volatility and lowers luteal cortisol levels.',
        fullDesc: 'Ashwagandha is an adaptogen that modulates cortisol while Chamomile provides apigenin, an antioxidant that binds to brain receptors to promote serene calm.',
        category: 'remedy',
        icon: '☕',
        ingredients: ['1/2 tsp Ashwagandha root powder', '1 chamomile tea bag', '1 cup warm oat or almond milk', '1/4 tsp cinnamon'],
        preparationSteps: [
          'Steep chamomile in 1/2 cup boiling water for 5 minutes.',
          'Warm milk and whisk in Ashwagandha powder and cinnamon.',
          'Combine both and sip warm before sleep.'
        ],
        dosage: '1 cup nightly during the 7 days before period',
        bestTime: '30 minutes before sleep',
        benefits: ['Reduces anxiety & irritability', 'Improves REM sleep quality', 'Soothes hormonal headaches']
      },
      {
        id: 'shatavari-tonic',
        name: 'Shatavari Golden Milk',
        shortDesc: 'Ancient Queen of Herbs for female hormonal balance.',
        fullDesc: 'Shatavari (Asparagus racemosus) contains steroidal saponins that nourish reproductive tissues, balance estrogen-progesterone flux, and soothe breast tenderness.',
        category: 'remedy',
        icon: '🥛',
        dosage: '1/2 tsp in warm milk daily',
        bestTime: 'Morning or Bedtime',
        benefits: ['Relieves breast tenderness', 'Smooths mood swings', 'Nourishes reproductive vitality']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Severe depressive episodes or PMDD (Premenstrual Dysphoric Disorder) thoughts.',
        'Sudden extreme breast lumps or asymmetric discharge.',
        'PMS symptoms persisting throughout the entire month without relief.'
      ]
    }
  },
  {
    id: 'irregular-periods',
    title: 'Irregular Periods',
    subtitle: 'Herbal rhythms to encourage regular, predictable monthly cycles',
    iconType: 'calendar',
    iconEmoji: '📅',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-600',
    summary: 'Irregular cycles often stem from Kapha-Vata blockage of Artava Vaha Srotas (reproductive channels). Warming circulatory stimulants help restore predictable follicular development.',
    remedies: [
      {
        id: 'cinnamon-water',
        name: 'Cinnamon Infusion',
        shortDesc: 'Regulates insulin sensitivity and cycle regularity.',
        fullDesc: 'Ceylon cinnamon helps improve insulin receptor sensitivity, facilitating regular ovulation in women with irregular cycles and delayed periods.',
        category: 'remedy',
        icon: '🪵',
        dosage: '1/2 tsp boiled in water daily',
        bestTime: 'First thing in morning on empty stomach',
        benefits: ['Improves ovarian blood supply', 'Enhances insulin signaling', 'Encourages consistent ovulation']
      },
      {
        id: 'papaya-enzymes',
        name: 'Ripe & Raw Papaya Tonic',
        shortDesc: 'Contains carotene and papain to gently stimulate uterine contractions.',
        fullDesc: 'Unripe papaya stimulates estrogen production and gentle contractions in the muscle fibers of the uterus, helping bring on delayed menstruation naturally.',
        category: 'diet',
        icon: '🍈',
        dosage: '1 small bowl daily mid-morning',
        bestTime: 'Mid-morning snack',
        benefits: ['Supports regular cycle timing', 'Aids sluggish digestion', 'Cleanses lymphatic channels']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Absence of menstruation (Amenorrhea) for more than 90 consecutive days.',
        'Cycles consistently shorter than 21 days or longer than 45 days.',
        'Sudden onset of irregular bleeding between periods.'
      ]
    }
  },
  {
    id: 'pcos',
    title: 'PCOS & Metabolism',
    subtitle: 'Nourishing protocols for ovarian health, androgens & insulin',
    iconType: 'pcos',
    iconEmoji: '🔬',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-600',
    summary: 'In Ayurveda, PCOS is viewed as Kapha accumulation obstructing the ovarian channels and impairing Agni (metabolic fire). Bitter and pungent herbs clear metabolic debris (Ama).',
    remedies: [
      {
        id: 'fenugreek-seeds',
        name: 'Methi (Fenugreek) Soaked Water',
        shortDesc: 'Supports glucose metabolism and reduces luteinizing hormone surge.',
        fullDesc: 'Fenugreek seeds are packed with galactomannan and 4-hydroxyisoleucine, which regulate glucose uptake and support normal ovarian follicle maturation.',
        category: 'remedy',
        icon: '🌱',
        ingredients: ['1 tsp organic fenugreek seeds', '1 glass room temperature water'],
        preparationSteps: [
          'Soak fenugreek seeds overnight in 1 glass of water.',
          'In the morning, drink the infused water and chew the softened seeds.'
        ],
        dosage: '1 glass daily',
        bestTime: 'Empty stomach upon waking',
        benefits: ['Improves glucose tolerance', 'Reduces excess androgen synthesis', 'Supports healthy ovarian morphology']
      },
      {
        id: 'spearmint-tea',
        name: 'Spearmint Herbal Tea',
        shortDesc: 'Natural anti-androgenic herbal tea to reduce unwanted facial hair and acne.',
        fullDesc: 'Clinical studies demonstrate that spearmint tea possesses significant anti-androgenic properties, lowering free testosterone levels in women with PCOS.',
        category: 'remedy',
        icon: '🍃',
        dosage: '2 cups daily',
        bestTime: 'After lunch and after dinner',
        benefits: ['Lowers excess androgens', 'Clears hormonal cystic acne', 'Calms hirsutism symptoms']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Persistent rapid weight gain, severe hirsutism, or thinning hair.',
        'Difficulty conceiving after 6–12 months of timed intercourse.',
        'Persistent elevated fasting blood glucose or Acanthosis nigricans.'
      ]
    }
  },
  {
    id: 'bloating',
    title: 'Bloating & Digestion',
    subtitle: 'Herbal digestive carminatives for a flat, comfortable stomach',
    iconType: 'bloating',
    iconEmoji: '🫧',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-cyan-50',
    colorText: 'text-cyan-600',
    summary: 'Luteal water retention and progesterone slow down gut motility (Samana Vayu sluggishness). CCF tea (Cumin, Coriander, Fennel) rekindles gentle digestive fire without overheating.',
    remedies: [
      {
        id: 'ccf-tea',
        name: 'CCF Tea (Cumin, Coriander, Fennel)',
        shortDesc: 'The gold standard Ayurvedic tri-seed digestive detox tea.',
        fullDesc: 'A balanced combination of 3 seeds that stimulates gastric enzymes, eliminates water retention, and dispels gas without creating acidity.',
        category: 'remedy',
        icon: '🫖',
        ingredients: ['1/2 tsp Cumin seeds', '1/2 tsp Coriander seeds', '1/2 tsp Fennel seeds', '3 cups water'],
        preparationSteps: [
          'Add all three whole seeds to boiling water in a teapot.',
          'Simmer for 10 minutes, strain into a thermos.',
          'Sip warm throughout the day.'
        ],
        dosage: 'Sip 2-3 cups daily',
        bestTime: 'Throughout the day between meals',
        benefits: ['Eliminates water retention', 'Relieves bloating and fullness', 'Gently detoxifies kidney and liver']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Severe abdominal distension accompanied by persistent vomiting or inability to keep food down.',
        'Sharp localized pain in lower right abdomen (possible appendicitis).',
        'Unexplained rapid weight loss alongside digestive issues.'
      ]
    }
  },
  {
    id: 'acne',
    title: 'Hormonal Acne',
    subtitle: 'Blood purifying botanicals for radiant, clear cycle skin',
    iconType: 'acne',
    iconEmoji: '✨',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-pink-50',
    colorText: 'text-pink-600',
    summary: 'Premenstrual acne is attributed to Pitta-Rakta vitiation. Cooling blood purifiers like Neem, Manjistha, and Turmeric cool inflammation and clear skin pores.',
    remedies: [
      {
        id: 'turmeric-sandalwood',
        name: 'Kasturi Turmeric & Sandalwood Pack',
        shortDesc: 'Cooling topical spot treatment for inflamed hormonal breakouts.',
        fullDesc: 'Wild kasturi manjal and pure red sandalwood soothe inflamed cystic acne bumps, inhibit acne bacteria, and prevent post-inflammatory hyperpigmentation.',
        category: 'remedy',
        icon: '🥣',
        ingredients: ['1/2 tsp Kasturi Turmeric powder', '1/2 tsp Sandalwood powder', '1 tbsp Pure Rose Water'],
        preparationSteps: [
          'Mix powders with rose water into a smooth, fragrant paste.',
          'Apply as a spot treatment on active acne or thin mask over T-zone.',
          'Leave on for 15 minutes, then rinse gently with cool water.'
        ],
        dosage: '2-3 times weekly',
        bestTime: 'Evening skincare routine',
        benefits: ['Rapidly cools angry red blemishes', 'Lightens stubborn dark acne spots', 'Unclogs pores without drying skin']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Severe cystic nodules that cause deep scarring and do not respond to topical care.',
        'Signs of skin infection such as spreading redness, heat, or systemic fever.'
      ]
    }
  },
  {
    id: 'hormonal-balance',
    title: 'Hormonal Imbalance',
    subtitle: 'Endocrine harmony through adaptogenic herbs and lifestyle sync',
    iconType: 'balance',
    iconEmoji: '⚖️',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-600',
    summary: 'Balances Tridosha and enhances Ojas (vital vigor). Harmonizes hypothalamic-pituitary-ovarian axis.',
    remedies: [
      {
        id: 'maca-shatavari',
        name: 'Adaptogen Harmony Latte',
        shortDesc: 'Blend of Shatavari, Maca, and Cardamom for adrenal-ovarian support.',
        fullDesc: 'Provides nourishing plant phytoestrogens and adrenal adaptogens to smooth hormonal transitions across the 4 cycle phases.',
        category: 'remedy',
        icon: '🧋',
        dosage: '1 cup in morning',
        bestTime: 'Breakfast time',
        benefits: ['Sustained vitality', 'Thyroid and adrenal harmony', 'Radiant skin and hair luster']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Unexplained extreme exhaustion, heat/cold intolerance, or dramatic hair shedding.',
        'Known history of thyroid disorder or metabolic anomalies.'
      ]
    }
  },
  {
    id: 'heavy-bleeding',
    title: 'Heavy Bleeding (Raktapradara)',
    subtitle: 'Cooling astringents to moderate flow and replenish vital iron',
    iconType: 'bleeding',
    iconEmoji: '🩸',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-red-50',
    colorText: 'text-red-600',
    summary: 'Excessive menstrual flow (Menorrhagia/Raktapradara) is driven by aggravated Pitta in the blood channels. Cooling Kashaya (astringent) herbs gently tighten vascular tone.',
    remedies: [
      {
        id: 'amla-pomegranate',
        name: 'Fresh Amla & Pomegranate Juice',
        shortDesc: 'High Vitamin C + iron tonic to stem excess flow and prevent anemia.',
        fullDesc: 'Pomegranate and Indian Gooseberry provide high natural tannins that possess natural hemostatic properties while Vitamin C boosts iron absorption.',
        category: 'diet',
        icon: '🥤',
        dosage: '1 glass daily during period',
        bestTime: 'Mid-day with lunch',
        benefits: ['Replenishes lost hemoglobin', 'Cooling astringent stops prolonged spotting', 'Fights menstrual fatigue']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Passing blood clots larger than a quarter (coin).',
        'Feeling lightheaded, dizzy, or shortness of breath while standing up.',
        'Bleeding lasting longer than 7 full consecutive days.'
      ]
    }
  },
  {
    id: 'white-discharge',
    title: 'Healthy Flora & Yoni Care',
    subtitle: 'Natural balance for vaginal flora, pH, and optimal comfort',
    iconType: 'discharge',
    iconEmoji: '💧',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-600',
    summary: 'Excessive discharge (Leucorrhea/Shwetapradara) is linked to Kapha aggravation. Triphala washes and probiotic diets rebalance beneficial microflora.',
    remedies: [
      {
        id: 'triphala-wash',
        name: 'Triphala Gentle Herbal Rinse',
        shortDesc: 'Natural antimicrobial herbal rinse for external intimate comfort.',
        fullDesc: 'Triphala possesses powerful natural astringent and antibacterial properties that soothe external irritation without disturbing natural pH.',
        category: 'remedy',
        icon: '🍵',
        dosage: 'External wash once daily',
        bestTime: 'During morning shower',
        benefits: ['Maintains natural acidic pH', 'Relieves itching and discomfort', 'Antimicrobial defense']
      }
    ],
    doctorAdvice: {
      title: 'When to consult a doctor?',
      warningPoints: [
        'Discharge that is greenish, frothy, or has a strong fishy odor.',
        'Accompanied by burning pain during urination or pelvic soreness.',
        'Severe vaginal redness, swelling, or blistering.'
      ]
    }
  }
];
