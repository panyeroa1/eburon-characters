/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Default Live API model to use
 */
export const DEFAULT_LIVE_API_MODEL =
  'gemini-2.5-flash-native-audio-preview-09-2025';

export const DEFAULT_VOICE = 'Orus';

export const ALIASED_VOICES: { alias: string; voice: string }[] = [
  { alias: 'Orus', voice: 'Orus' },
  { alias: 'Sirius', voice: 'Zephyr' },
  { alias: 'Vega', voice: 'Puck' },
  { alias: 'Altair', voice: 'Charon' },
  { alias: 'Luna', voice: 'Luna' },
  { alias: 'Nova', voice: 'Nova' },
  { alias: 'Celeste', voice: 'Kore' },
  { alias: 'Polaris', voice: 'Fenrir' },
  { alias: 'Andromeda', voice: 'Leda' },
  { alias: 'Aria', voice: 'Aoede' },
  { alias: 'Rhea', voice: 'Callirrhoe' },
  { alias: 'Elara', voice: 'Autonoe' },
  { alias: 'Enceladus', voice: 'Enceladus' },
  { alias: 'Iapetus', voice: 'Iapetus' },
  { alias: 'Umbriel', voice: 'Umbriel' },
  { alias: 'Gold', voice: 'Algieba' },
  { alias: 'Silver', voice: 'Despina' },
  { alias: 'Platinum', voice: 'Erinome' },
  { alias: 'Palladium', voice: 'Algenib' },
  { alias: 'Rhodium', voice: 'Rasalgethi' },
  { alias: 'Iridium', voice: 'Laomedeia' },
  { alias: 'Osmium', voice: 'Achernar' },
  { alias: 'Comet', voice: 'Alnilam' },
  { alias: 'Nebula', voice: 'Schedar' },
  { alias: 'Galaxy', voice: 'Gacrux' },
  { alias: 'Pulsar', voice: 'Pulcherrima' },
  { alias: 'Quasar', voice: 'Achird' },
  { alias: 'Zenith', voice: 'Zubenelgenubi' },
  { alias: 'Vertex', voice: 'Vindemiatrix' },
  { alias: 'Solstice', voice: 'Sadachbia' },
  { alias: 'Stardust', voice: 'Sadaltager' },
  { alias: 'Supernova', voice: 'Sulafat' },
];