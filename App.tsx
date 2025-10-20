/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { personas, Persona } from './personas';
import PersonaCard from './components/PersonaCard';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('Missing required environment variable: API_KEY');
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Audio decoding utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  // Raw PCM data from the API is 16-bit, 24kHz, single-channel
  const sampleRate = 24000;
  const numChannels = 1;

  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface TranscriptEntry {
  personaName: string;
  script: string;
}

function App() {
  const [loadingPersona, setLoadingPersona] = useState<string | null>(null);
  const [playingPersona, setPlayingPersona] = useState<string | null>(null);
  const [errorPersona, setErrorPersona] = useState<string | null>(null);
  const [activeTranscript, setActiveTranscript] = useState<TranscriptEntry | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopCurrentAudio = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    setPlayingPersona(null);
  }, []);

  const generateScriptForPersona = async (persona: Persona): Promise<string> => {
    // The first 10 personas in the personas.ts file are CSRs.
    const isCSR = personas.findIndex(p => p.id === persona.id) < 10;
    
    const context = isCSR 
      ? `The persona is a customer service representative. The monologue should reflect a customer-centric, supportive, and helpful tone, with an emphasis on customer excellence.`
      : `The monologue should fit the persona's professional or entertainment role.`;

    const systemPrompt = `You are an expert scriptwriter for a voice persona showcase. Your task is to generate a short, engaging, 2-3 sentence monologue for a voice persona.

      Instructions:
      1.  The monologue must be something this persona would realistically say, perfectly capturing their described personality and role.
      2.  It MUST include at least one, but preferably two, expressive, audible, non-speech audio tags in square brackets (e.g., [sighs], [chuckles], [thoughtful], [clears throat]).
      3.  The text should be natural and conversational.
      4.  Do not introduce the persona (e.g., "Hello, I'm..."). Just provide the monologue itself.

      **Persona Details:**
      - **Name:** ${persona.name}
      - **Role/Vibe:** ${persona.tagline}
      - **Description:** ${persona.description}
      - **Scenario Context:** ${context}

      Generate the monologue now.`;
      
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
    });
    return response.text.trim();
  };

  const handlePlay = useCallback(async (persona: Persona) => {
    if (loadingPersona) return;
    if (playingPersona === persona.id) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    setLoadingPersona(persona.id);
    setErrorPersona(null);

    // Create AudioContext on user interaction
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        setLoadingPersona(null);
        setErrorPersona(persona.id);
        return;
      }
    }
    // Resume context if it's suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      // Step 1: Generate a dynamic script for the persona
      const sampleText = await generateScriptForPersona(persona);
      const newTranscript: TranscriptEntry = { personaName: persona.name, script: sampleText };
      setActiveTranscript(newTranscript);
      setTranscriptHistory(prev => [...prev, newTranscript]);
      
      // Step 2: Use the generated script for TTS
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: sampleText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: persona.voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('No audio data received from API.');
      }

      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();

      audioSourceRef.current = source;
      setPlayingPersona(persona.id);

      source.onended = () => {
        if (audioSourceRef.current === source) {
          setPlayingPersona(null);
          audioSourceRef.current = null;
        }
      };

    } catch (err) {
      console.error(`Error generating audio for ${persona.name}:`, err);
      setErrorPersona(persona.id);
    } finally {
      setLoadingPersona(null);
    }
  }, [loadingPersona, playingPersona, stopCurrentAudio]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Eburon Voice Persona Studio</h1>
        <p>An interactive studio to explore and sample AI voice personas generated by the Gemini API.</p>
         {transcriptHistory.length > 0 && (
          <button className="history-toggle-button" onClick={() => setShowHistory(!showHistory)}>
            <span className="icon">history</span>
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        )}
      </header>

      {activeTranscript && (
        <section className="active-transcript-container">
          <h2>Transcript ({activeTranscript.personaName})</h2>
          <p>{activeTranscript.script}</p>
        </section>
      )}

      {showHistory && (
         <section className="history-container">
            <h2>Transcription History</h2>
            <ul className="history-list">
              {transcriptHistory.map((item, index) => (
                <li key={index} className="history-item">
                  <strong>{item.personaName}:</strong>
                  <p>{item.script}</p>
                </li>
              ))}
            </ul>
         </section>
      )}

      <main>
        <div className="personas-grid">
          {personas.map(persona => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              isLoading={loadingPersona === persona.id}
              isPlaying={playingPersona === persona.id}
              hasError={errorPersona === persona.id}
              onPlay={() => handlePlay(persona)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;