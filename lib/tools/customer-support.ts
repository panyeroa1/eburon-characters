/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const customerSupportTools: FunctionCall[] = [
  {
    name: 'start_return',
    description: 'Starts the return process for an item, collecting necessary details from the user.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: {
          type: 'STRING',
          description: "The unique identifier for the customer's order, typically found in their confirmation email. For example, 'ORD-12345'.",
        },
        itemName: {
          type: 'STRING',
          description: "The specific name of the product the customer wishes to return, as it appears on their order. For example, 'Model X Wireless Mouse'.",
        },
        reason: {
          type: 'STRING',
          description: "A detailed explanation from the customer explaining why they are returning the item. Capture as much detail as possible, e.g., 'item arrived damaged' or 'wrong size'.",
        },
      },
      required: ['orderId', 'itemName', 'reason'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_order_status',
    description: 'Provides the current status of a user\'s order, searching by order ID or customer details.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: {
          type: 'STRING',
          description: "The unique identifier for the customer's order. This is the preferred way to look up an order. Example: 'ORD-12345'.",
        },
        customerName: {
          type: 'STRING',
          description: 'The full name of the customer. Use as a fallback for lookup only if the order ID is not provided.',
        },
        customerEmail: {
          type: 'STRING',
          description: "The customer's email address. Use as a fallback for lookup only if the order ID is not provided. Must be a valid email format, e.g., 'jane.doe@example.com'.",
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'speak_to_representative',
    description: 'Escalates the conversation to a human customer support representative.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: {
          type: 'STRING',
          description: "A concise summary of the customer's problem and the reason for escalation. This will be passed to the human agent to provide context. For example, 'Customer is asking for a refund on a damaged item but the system is not processing it'.",
        },
      },
      required: ['reason'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];