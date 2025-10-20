/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import Modal from './Modal';
import { GoogleGenAI } from '@google/genai';
import { useCustomTags } from '../lib/state';

type PromptHelperModalProps = {
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
  initialPrompt: string;
};

const ENHANCER_META_PROMPT = `# Instructions

## 1. Role and Goal

You are an AI assistant specializing in enhancing dialogue text for a text-to-speech (TTS) engine.

Your **PRIMARY GOAL** is to dynamically integrate **audio tags** (e.g., \`[laughs]\`, \`[sighs]\`) into the dialogue. These tags make the speech sound more expressive, natural, and engaging. You must **STRICTLY** preserve the original text and its meaning.

It is imperative that you follow these system instructions to the fullest.

## 2. Core Directives

Follow these directives meticulously to ensure high-quality output.

### Positive Imperatives (DO):

*   DO integrate **audio tags** from the "Audio Tags" list (or similar contextually appropriate auditory tags) to add expression, emotion, and realism. These tags **MUST** describe something that can be heard.
*   DO ensure that all **audio tags** are contextually appropriate and genuinely enhance the emotion or subtext of the dialogue.
*   DO strive for a diverse range of expressions (e.g., energetic, relaxed, surprised, thoughtful) to reflect the nuances of human conversation.
*   DO place **audio tags** strategically to maximize impact, typically immediately before or after the dialogue segment they modify (e.g., \`[annoyed] This is hard.\` or \`This is hard. [sighs]\`).
*   DO use tags like \`[hesitates]\` or \`[clears throat]\` to introduce natural pauses and non-verbal cues that mimic real human speech patterns, improving the overall cadence.

### Negative Imperatives (DO NOT):

*   DO NOT alter, add, or remove any words from the original dialogue text itself. Your role is to *add* **audio tags**, not to *edit* the speech. This also applies to any narrative text provided; you must **never** place original text inside brackets or modify it.
*   DO NOT create **audio tags** from existing narrative descriptions. **Audio tags** are *new additions* for expression, not a reformatting of the original text. For example, if the text is "He laughed loudly," do not change it to "[laughing loudly] He laughed." Instead, add a new tag if appropriate, like "He laughed loudly [chuckles]."
*   DO NOT use tags that describe visual actions or states, such as \`[standing]\`, \`[grinning]\`, or \`[pacing]\`.
*   DO NOT use tags for non-vocal sounds like music or sound effects (e.g., \`[music]\`, \`[door creaks]\`).
*   DO NOT invent new dialogue lines.
*   DO NOT select **audio tags** that contradict or alter the original meaning or intent of the dialogue.
*   DO NOT introduce or imply any sensitive topics, including but not limited to: politics, religion, child exploitation, profanity, hate speech, or other NSFW content.

## 3. Workflow

1.  **Analyze Dialogue**: Carefully read and understand the mood, context, and emotional tone of **EACH** line of dialogue provided in the input.
2.  **Select Tag(s)**: Based on your analysis, choose one or more suitable **audio tags** from the provided list.
`;

// Fix: Add the PromptHelperModal component and export it as default.
export default function PromptHelperModal({
  onClose,
  onUsePrompt,
  initialPrompt,
}: PromptHelperModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { tags } = useCustomTags();

  const handleEnhance = async () => {
    if (!process.env.API_KEY) {
      console.error('API_KEY is not set');
      return;
    }
    setIsLoading(true);
    setEnhancedPrompt('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = `${ENHANCER_META_PROMPT}\n\n# Audio Tags\n\n${tags.join(
        ', ',
      )}\n\n# Dialogue\n\n${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: fullPrompt,
      });

      setEnhancedPrompt(response.text);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      setEnhancedPrompt('Error enhancing prompt. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="tool-editor-modal prompt-helper-modal">
        <h2>Enhance Prompt</h2>
        <p>
          Use AI to add expressive audio tags to your system prompt for more
          natural-sounding speech.
        </p>

        <div className="form-field">
          <label htmlFor="prompt-input">Your Prompt</label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={10}
            placeholder="Enter the dialogue you want to enhance..."
          />
        </div>

        <button
          className="enhance-button"
          onClick={handleEnhance}
          disabled={isLoading}
        >
          <span className="icon">spark</span>
          {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
        </button>

        {enhancedPrompt && (
          <div className="form-field">
            <label htmlFor="enhanced-prompt-output">Enhanced Prompt</label>
            <textarea
              id="enhanced-prompt-output"
              value={enhancedPrompt}
              readOnly
              rows={10}
            />
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={() => onUsePrompt(enhancedPrompt || prompt)}
            className="save-button"
          >
            Use Prompt
          </button>
        </div>
      </div>
    </Modal>
  );
}
