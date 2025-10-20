/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const personalAssistantTools: FunctionCall[] = [
  {
    name: 'create_calendar_event',
    description: 'Creates a new event in the user\'s calendar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        summary: {
          type: 'STRING',
          description: "A short, descriptive title for the calendar event. For example, 'Quarterly Business Review'.",
        },
        location: {
          type: 'STRING',
          description: "The physical address or virtual meeting link for the event. Examples: '123 Main St, Anytown, USA' or 'https://meet.example.com/xyz-abc'.",
        },
        startTime: {
          type: 'STRING',
          description: "The event's start date and time in ISO 8601 format. Example: '2024-09-27T10:00:00-07:00'.",
        },
        endTime: {
          type: 'STRING',
          description: "The event's end date and time in ISO 8601 format. Example: '2024-09-27T11:00:00-07:00'.",
        },
      },
      required: ['summary', 'startTime', 'endTime'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'send_email',
    description: 'Sends an email to a specified recipient.',
    parameters: {
      type: 'OBJECT',
      properties: {
        recipient: {
          type: 'STRING',
          description: "The primary recipient's email address. Must be a valid email format, e.g., 'john.smith@example.com'.",
        },
        subject: {
          type: 'STRING',
          description: "The text for the email's subject line. Should be concise and relevant to the email's content.",
        },
        body: {
          type: 'STRING',
          description: "The full content of the email's body. Can include line breaks for paragraphs.",
        },
      },
      required: ['recipient', 'subject', 'body'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'set_reminder',
    description: 'Sets a reminder for the user.',
    parameters: {
      type: 'OBJECT',
      properties: {
        task: {
          type: 'STRING',
          description: "A short description of the task the user wants to be reminded of. For example, 'Pick up dry cleaning' or 'Call the doctor'.",
        },
        time: {
          type: 'STRING',
          description: "The date and time to trigger the reminder, specified in ISO 8601 format. Example: '2024-09-28T17:00:00-07:00'.",
        },
      },
      required: ['task', 'time'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];