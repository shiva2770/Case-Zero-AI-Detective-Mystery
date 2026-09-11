import { CasePackTheme, CaseModifier, CaseDifficulty } from '../types';

export interface CasePackConfig {
  id: CasePackTheme;
  title: string;
  era: string;
  description: string;
  badge: string;
  primaryColor: string;
  bgPattern: string;
  sampleWeapons: string[];
  sampleLocations: string[];
}

export const CASE_PACKS: Record<CasePackTheme, CasePackConfig> = {
  noir_1940s: {
    id: 'noir_1940s',
    title: 'Classic Noir (1940s)',
    era: '1947 New York / Los Angeles',
    description: 'Rain-slicked asphalt, shadows, whiskey bottles, jazz clubs, and secrets hidden in trench coats.',
    badge: 'Classic Detective',
    primaryColor: '#e2b36f', // warm brass
    bgPattern: 'smoky-dark',
    sampleWeapons: ['Snub-nosed .38 Revolver', 'Brass Knuckles with Engraved Monogram', 'Laced Brandy Decanter', 'Heavy Bronze Statuette', 'Razor-sharp Pearl Handle Knife'],
    sampleLocations: ['Victim\'s Private Office', 'Back Alley Behind The Velvet Lounge', 'Luxury Penthouse Suite', 'Dockside Warehouse #14', 'Dimly-Lit Speakeasy Booth']
  },
  cyberpunk_2099: {
    id: 'cyberpunk_2099',
    title: 'Neo-Tokyo 2099',
    era: '2099 High-Tech Metropolis',
    description: 'Neon holograms, neural exploits, synthetic body augmentations, corporate mega-towers, and digital hitmen.',
    badge: 'Cyber Sleuth',
    primaryColor: '#38bdf8', // electric cyan
    bgPattern: 'neon-grid',
    sampleWeapons: ['Thermal Plasma Scalpel', 'Corrupted Cyberware Overload Deck', 'Monofilament Garrote Wire', 'Neuro-Toxin EMP Injector', 'Heavy Kinetic Rail Pistol'],
    sampleLocations: ['Corporate Server Vault Floor 88', 'Underground Cyber-Mod Clinic', 'Neon Alley Noodle Stall', 'Sky-Deck Infinity Pool', 'Abandoned Android Recycling Bay']
  },
  locked_room_manor: {
    id: 'locked_room_manor',
    title: 'Locked-Room Manor',
    era: '1920s English Country Estate',
    description: 'A storm-bound aristocratic estate during a family reading of the will. The doors were bolted from inside.',
    badge: 'Aristocratic Sleuth',
    primaryColor: '#a7f3d0', // jade sage
    bgPattern: 'gothic-wood',
    sampleWeapons: ['Antique Dueling Pistol', 'Arsenic-Laced Earl Grey Tea', 'Heavy Silver Candlestick', 'Damascus Steel Letter Opener', 'Silk Velvet Bell Rope'],
    sampleLocations: ['Locked Study with Deadbolt Intact', 'Conservatory Greenhouse', 'Cellar Wine Vault', 'Grand Library Balcony', 'Servants\' Quarters']
  },
  cozy_coastal_village: {
    id: 'cozy_coastal_village',
    title: 'Cozy Coastal Village',
    era: 'Present Day Foggy Harbor',
    description: 'Quaint seaside town where everyone knows everyone... and everyone has a hidden vendetta.',
    badge: 'Town Investigator',
    primaryColor: '#fde047', // warm lantern amber
    bgPattern: 'foggy-coast',
    sampleWeapons: ['Custom Steel Oyster Knife', 'Heavy Brass Ship\'s Anchor Cleat', 'Digital Fish Finder Battery Spike', 'Nightshade-Infused Clam Chowder', 'Mooring Rope Knot'],
    sampleLocations: ['Harbor Master\'s Tower', 'Salty Dog Bakery & Cafe', 'Lighthouse Lamp Room', 'Fisherman\'s Wharf Dock 3', 'Victorian Bed & Breakfast Kitchen']
  },
  steampunk_express: {
    id: 'steampunk_express',
    title: 'Steampunk Express',
    era: '1888 Clockwork Orient Express',
    description: 'Steam engines, brass clockwork automations, secret train compartments, and high-stakes international intrigue.',
    badge: 'Iron Inspector',
    primaryColor: '#fb923c', // copper orange
    bgPattern: 'brass-cogs',
    sampleWeapons: ['Clockwork Spring Dagger', 'Pressurized Steam Valve Blaster', 'Cyanide-Dipped Fountain Pen', 'Heavy Brass Pocket Chronometer', 'Velvet Poison Needle Ring'],
    sampleLocations: ['First-Class Dining Car', 'Engine Room Boiler Deck', 'Observation Deck Car #4', 'Private Royal Compartment', 'Baggage Freight Vault']
  }
};

export const CASE_MODIFIERS: Record<CaseModifier, { name: string; description: string; xpBonus: number; icon: string }> = {
  none: {
    name: 'Standard Protocol',
    description: 'Standard investigation conditions with balanced evidence and clear testimonies.',
    xpBonus: 0,
    icon: 'ShieldCheck'
  },
  unreliable_witness: {
    name: 'Unreliable Witness',
    description: 'One of the non-culprit suspects is prone to misremembering times or embellishing statements.',
    xpBonus: 25,
    icon: 'EyeOff'
  },
  time_pressure: {
    name: 'Time Pressure',
    description: 'The Chief demands an indictment fast! Limited interrogation turns allowed.',
    xpBonus: 35,
    icon: 'Clock'
  },
  no_fingerprints: {
    name: 'Wiped Scene',
    description: 'The culprit wiped physical evidence cleanly. You must rely heavily on timeline contradictions & testimonial clues.',
    xpBonus: 40,
    icon: 'Fingerprint'
  },
  rival_detective: {
    name: 'Rival Detective',
    description: 'Rival Detective Vance is poking around the scene. Incorrect guesses incur steeper penalties.',
    xpBonus: 30,
    icon: 'UserX'
  },
  blackout_storm: {
    name: 'Blackout Storm',
    description: 'A raging storm cut power during the murder, forcing careful reconstruction of dark-room movements.',
    xpBonus: 45,
    icon: 'ZapOff'
  }
};

export const RECURRING_NPCS = {
  captainHayes: {
    name: 'Captain Marcus Hayes',
    title: 'Chief Bureau Investigator',
    bio: 'Gruff, coffee-chugging veteran police captain who expects facts, not fairy tales.',
    quotes: [
      "Keep your head on straight, Detective. The Mayor is breathing down my neck.",
      "Don't throw wild accusations without hard proof. Check your Corkboard first!",
      "Good work on that last file. But crime never sleeps in this city."
    ]
  },
  rivalVance: {
    name: 'Detective Julian Vance',
    title: 'Rival Private Eye',
    bio: 'Slick, arrogant detective who loves showing off and beating you to the headlines.',
    quotes: [
      "Still shuffling through bloodstains, rookie? I already know who did it.",
      "A real sleuth looks at motive, not just muddy boots.",
      "Let's see if your corkboard string theory holds any water."
    ]
  },
  snitchJoey: {
    name: 'Joey "Four-Eyes"',
    title: 'Local Informant & Snitch',
    bio: 'Always lurking in the shadows with an ear to the pavement.',
    quotes: [
      "Word on the street is someone bought a shiny new knife yesterday...",
      "For a double sawbuck, I can tell you who was seen sprinting past the alley.",
      "Watch out, Detective. Somebody's lying through their teeth."
    ]
  }
};
