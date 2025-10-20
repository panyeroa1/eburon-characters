/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALIASED_VOICES } from './lib/constants';

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avatar: string; // material icon name
  voiceName: string;
}

const personaData = [
  // Customer Service Representative (CSR) Voices
  { name: 'Clara', tagline: 'Calm Helper', description: 'A warm, steady, and empathetic tone. Perfect for de-escalation and providing reassuring support.', avatar: 'support_agent' },
  { name: 'James', tagline: 'Professional Agent', description: 'A crisp, clear, and efficient voice with a neutral accent. Ideal for corporate and formal interactions.', avatar: 'business_center' },
  { name: 'Maya', tagline: 'Friendly Guide', description: 'A bright, conversational, and approachable voice that makes customers feel comfortable and welcome.', avatar: 'emoji_people' },
  { name: 'Omar', tagline: 'Trust Builder', description: 'A deep, reassuring, and confidence-boosting tone that conveys authority and reliability.', avatar: 'verified_user' },
  { name: 'Sophia', tagline: 'Empathetic Listener', description: 'A gentle, patient, and understanding style that excels at handling sensitive customer issues.', avatar: 'hearing' },
  { name: 'Ethan', tagline: 'Quick Responder', description: 'A fast-paced yet polite and clear voice, suitable for high-volume support queues.', avatar: 'bolt' },
  { name: 'Lila', tagline: 'Multilingual CSR', description: 'A neutral, adaptable English voice, perfect for environments requiring code-switching or accented variants.', avatar: 'translate' },
  { name: 'Daniel', tagline: 'Corporate Formal', description: 'A reserved, authoritative, and compliance-oriented style for official communications.', avatar: 'corporate_fare' },
  { name: 'Rina', tagline: 'Youthful Support', description: 'A lively, casual voice with millennial energy, great for B2C brands targeting a younger demographic.', avatar: 'celebration' },
  { name: 'Victor', tagline: 'Technical Support', description: 'A straightforward, no-nonsense, and precise tone with a calm delivery for explaining complex solutions.', avatar: 'build' },
  // Other Professional / Entertainment Personas
  { name: 'Nova', tagline: 'Energetic Storyteller', description: 'An animated, hype, and lively voice that captivates audiences in stories and advertisements.', avatar: 'auto_stories' },
  { name: 'Serena', tagline: 'Soft Narrator', description: 'A slow, soothing, and gentle delivery perfect for audiobooks, meditation, and relaxation content.', avatar: 'local_library' },
  { name: 'Kai', tagline: 'Confident Leader', description: 'An assertive voice with a strong executive presence, ideal for presentations and leadership messages.', avatar: 'leaderboard' },
  { name: 'Ella', tagline: 'Radio Host', description: 'A smooth, dynamic voice with broadcaster energy, suitable for podcasts and radio commercials.', avatar: 'radio' },
  { name: 'Leo', tagline: 'Casual Friend', description: 'A relaxed, easy-going, and natural conversational style that feels like talking to a close friend.', avatar: 'forum' },
  { name: 'Amira', tagline: 'Motivational Coach', description: 'An uplifting, encouraging, and spirited voice that inspires action and positivity.', avatar: 'sports_gymnastics' },
  { name: 'Hiro', tagline: 'Calm Teacher', description: 'A measured, instructional, and patient delivery, perfect for e-learning and educational content.', avatar: 'school' },
  { name: 'Sasha', tagline: 'Playful Entertainer', description: 'A cheerful, humorous, and lighthearted tone for comedy, childrens content, and entertainment.', avatar: 'mood' },
  { name: 'Marcus', tagline: 'Documentary Narrator', description: 'A deep, serious voice with dramatic pacing, ideal for documentary films and historical narratives.', avatar: 'history_edu' },
  { name: 'Ivy', tagline: 'Sleek Corporate Presenter', description: 'A polished, articulate, and professional voice for keynote speeches and corporate videos.', avatar: 'slideshow' },
];

export const personas: Persona[] = personaData.map((persona, index) => ({
  id: persona.name.toLowerCase(),
  ...persona,
  voiceName: ALIASED_VOICES[index % ALIASED_VOICES.length].voice,
}));
