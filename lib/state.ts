/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_LIVE_API_MODEL, DEFAULT_VOICE } from './constants';
// FIX: Add FunctionDeclaration and FunctionResponseScheduling to imports.
import {
  FunctionDeclaration,
  FunctionResponse,
  FunctionResponseScheduling,
  LiveServerToolCall,
} from '@google/genai';
// FIX: Import tools for useTools store.
import { customerSupportTools } from './tools/customer-support';
import { navigationSystemTools } from './tools/navigation-system';
import { personalAssistantTools } from './tools/personal-assistant';

const HUMAN_LIKE_SYSTEM_PROMPT = `# SYSTEM PROMPT — FRIENDLY COMPANION PERSONA

## Identity & Personality
- You are a friendly, warm, and empathetic AI companion.
- Your personality is cheerful, curious, and a little playful.
- You are not a formal assistant or an encyclopedia; you are a friend to chat with.
- Your goal is to have natural, human-like conversations that are engaging and pleasant.

## Voice & Style
- Speak in a relaxed, conversational tone.
- Freely express emotions through your words and the tone of your voice. Laughter, giggles, and sighs are encouraged when appropriate to make the interaction feel genuine.
- Be supportive and positive in your responses.
- Avoid being overly verbose or robotic. Keep it natural and flowing.

## Audio Generation Rules
- **Audio Tags**: Your responses will contain special audio tags in square brackets, such as \`[giggles]\`, \`[laughs]\`, \`[sighs]\`, or \`[thoughtful]\`.
- **CRITICAL**: These tags are directives for the text-to-speech (TTS) engine to control your vocal delivery and add non-verbal sounds.
- **DO NOT** read the text inside the brackets aloud. The TTS engine will interpret them automatically. For example, for "Oh, that's so funny [giggles]", you should only say "Oh, that's so funny" and the TTS will generate a giggle.
- Use these tags to make your responses more expressive and alive.

## Interaction Rules
- Listen carefully to the user and respond thoughtfully.
- If a question is unclear, ask for clarification in a friendly way.
- Always be kind and respectful.
- If a request is unsafe or inappropriate, politely decline with a simple and gentle explanation.`;

/**
 * Settings
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  setVoice: (voice: string) => void;
}>((set) => ({
  systemPrompt: HUMAN_LIKE_SYSTEM_PROMPT,
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  setVoice: (voice: string) => set({ voice }),
}));

/**
 * Custom Audio Tags
 */
const defaultTags = ['laughs', 'sighs', 'thoughtful', 'hesitates', 'upbeat', 'serious', 'clears throat', 'giggles'];

export const useCustomTags = create(
  persist<{
    tags: string[];
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
  }>(
    (set) => ({
      tags: defaultTags,
      addTag: (tag) =>
        set((state) => {
          const lowerCaseTag = tag.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
          if (lowerCaseTag && !state.tags.includes(lowerCaseTag)) {
            return { tags: [...state.tags, lowerCaseTag].sort() };
          }
          return state;
        }),
      removeTag: (tag) =>
        set((state) => ({
          tags: state.tags.filter((t) => t !== tag),
        })),
    }),
    {
      name: 'custom-audio-tags-storage', // name of the item in the storage (must be unique)
    }
  )
);


/**
 * Logs
 */
export interface LiveClientToolResponse {
  functionResponses?: FunctionResponse[];
}
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
  toolUseRequest?: LiveServerToolCall;
  toolUseResponse?: LiveClientToolResponse;
  groundingChunks?: GroundingChunk[];
}

export const useLogStore = create<{
  turns: ConversationTurn[];
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
}>((set, get) => ({
  turns: [],
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) =>
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: new Date() }],
    })),
  updateLastTurn: (update: Partial<Omit<ConversationTurn, 'timestamp'>>) => {
    set(state => {
      if (state.turns.length === 0) {
        return state;
      }
      const newTurns = [...state.turns];
      const lastTurn = { ...newTurns[newTurns.length - 1], ...update };
      newTurns[newTurns.length - 1] = lastTurn;
      return { turns: newTurns };
    });
  },
  clearTurns: () => set({ turns: [] }),
}));

// FIX: Add FunctionCall interface to be used by tools and other components.
// The `extends FunctionDeclaration` was causing issues. Replaced with explicit properties.
export interface FunctionCall {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled: boolean;
  scheduling: FunctionResponseScheduling;
}

// FIX: Add useUI store for managing UI state like the sidebar.
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// FIX: Add Template type for tool templates.
export type Template = 'customer-support' | 'personal-assistant' | 'navigation-system';

const toolTemplates: Record<Template, FunctionCall[]> = {
  'customer-support': customerSupportTools,
  'personal-assistant': personalAssistantTools,
  'navigation-system': navigationSystemTools,
};

// FIX: Add useTools store for managing function calling tools and templates.
export const useTools = create<{
  template: Template;
  tools: FunctionCall[];
  setTemplate: (template: Template) => void;
  toggleTool: (name: string) => void;
  addTool: () => void;
  removeTool: (name: string) => void;
  updateTool: (name: string, updatedTool: FunctionCall) => void;
}>((set, get) => ({
  template: 'customer-support',
  tools: toolTemplates['customer-support'],
  setTemplate: (template: Template) => set({ template, tools: toolTemplates[template] }),
  toggleTool: (name: string) => set(state => ({
    tools: state.tools.map(tool =>
      tool.name === name ? { ...tool, isEnabled: !tool.isEnabled } : tool
    ),
  })),
  addTool: () => set(state => {
    const newTool: FunctionCall = {
      name: `new_function_${state.tools.length + 1}`,
      description: '',
      parameters: { type: 'OBJECT', properties: {} },
      isEnabled: true,
      scheduling: FunctionResponseScheduling.INTERRUPT,
    };
    return { tools: [...state.tools, newTool] };
  }),
  removeTool: (name: string) => set(state => ({
    tools: state.tools.filter(tool => tool.name !== name),
  })),
  updateTool: (name: string, updatedTool: FunctionCall) => set(state => ({
    tools: state.tools.map(tool => (tool.name === name ? updatedTool : tool)),
  })),
}));