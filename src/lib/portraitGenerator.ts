import { Suspect, CasePackTheme } from '../types';

// Curated high-res noir-style photo seeds for varied suspect demographics and themes
const NOIR_PORTRAIT_COLLECTION = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', // Male business/associate
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', // Female elegant
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', // Young male/relative
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', // Professional female doctor/lawyer
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop', // Older gentleman/butler
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', // Detective/industrialist
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop', // Mysterious woman
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop'  // Brooding male
];

export function generateSuspectPortraitPrompt(
  suspect: Partial<Suspect>,
  theme: CasePackTheme = 'noir_1940s'
): string {
  const name = suspect.name || 'Suspect';
  const age = suspect.age || 40;
  const title = suspect.title || 'Person of Interest';
  const personality = suspect.personality || 'stoic, secretive';

  switch (theme) {
    case 'cyberpunk_2099':
      return `A gritty cyberpunk noir portrait of ${name}, age ${age}, ${title}. Cybernetic ocular implant, neon rain reflections on dark leather trench jacket, high contrast rim lighting, dark futuristic alley, moody 2099 aesthetic, photorealistic 3:4 portrait.`;
    case 'locked_room_manor':
      return `A dramatic 1920s gothic manor portrait of ${name}, age ${age}, ${title}. Dark oil painting chiaroscuro style, aristocratic attire, dim candlelight shadows, stern secretive expression, classic mystery novel aesthetic, 3:4 portrait.`;
    case 'cozy_coastal_village':
      return `A weathered coastal noir portrait of ${name}, age ${age}, ${title}. Heavy wool coat, misty sea fog background, rain-slicked dock lights, subtle suspicion in expression, realistic cinematic lighting, 3:4 portrait.`;
    case 'steampunk_express':
      return `A sepia-toned steampunk noir portrait of ${name}, age ${age}, ${title}. Brass goggles, tailored Victorian vest, steam engine cabin backdrop, shadowy vintage atmosphere, dramatic chiaroscuro, 3:4 portrait.`;
    case 'noir_1940s':
    default:
      return `A classic 1940s film noir black and white mugshot style portrait of ${name}, age ${age}, ${title}. Shadow of venetian blinds cast across face, trench coat, fedora hat, cigarette smoke haze, dramatic lighting, intense calculating expression, 3:4 portrait.`;
  }
}

export function generateSuspectPortraitUrl(
  suspect: Partial<Suspect>,
  theme: CasePackTheme = 'noir_1940s',
  index: number = 0
): string {
  // Generate deterministic prompt
  const prompt = generateSuspectPortraitPrompt(suspect, theme);
  const seed = (suspect.name || `suspect-${index}`).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 17;

  // Pollinations AI generator URL with safety seed and prompt
  const encodedPrompt = encodeURIComponent(prompt);
  const aiGeneratedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&nologo=true&seed=${seed}`;

  // Fallback photo from curated collection
  const fallbackUrl = NOIR_PORTRAIT_COLLECTION[index % NOIR_PORTRAIT_COLLECTION.length];

  // Return AI generated endpoint URL with seed
  return aiGeneratedUrl || fallbackUrl;
}

export function ensureSuspectPortraits(
  suspects: Suspect[],
  theme: CasePackTheme = 'noir_1940s'
): Suspect[] {
  return suspects.map((suspect, idx) => {
    const prompt = suspect.imagePrompt || generateSuspectPortraitPrompt(suspect, theme);
    const imageUrl = suspect.imageUrl || generateSuspectPortraitUrl(suspect, theme, idx);

    return {
      ...suspect,
      imagePrompt: prompt,
      imageUrl: imageUrl
    };
  });
}
