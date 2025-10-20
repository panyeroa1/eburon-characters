/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const navigationSystemTools: FunctionCall[] = [
  {
    name: 'find_route',
    description: 'Finds a route to a specified destination.',
    parameters: {
      type: 'OBJECT',
      properties: {
        destination: {
          type: 'STRING',
          description: "The target address, landmark, or point of interest. Can be a full address like '456 Oak Ave, Springfield, USA' or a name like 'City Central Library'.",
        },
        modeOfTransport: {
          type: 'STRING',
          description: "The desired method of travel. Common values include 'driving', 'walking', 'bicycling', or 'transit'. If not specified, 'driving' is the default.",
        },
      },
      required: ['destination'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'find_nearby_places',
    description: 'Finds nearby places of a certain type.',
    parameters: {
      type: 'OBJECT',
      properties: {
        placeType: {
          type: 'STRING',
          description: "The category of place the user is looking for. Examples: 'coffee shop', 'post office', 'ATM', 'park', 'sushi restaurant'.",
        },
        radius: {
          type: 'NUMBER',
          description: "The maximum distance in kilometers to search from the user's current location. If not specified, a default radius of 5 km will be used.",
        },
      },
      required: ['placeType'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_traffic_info',
    description: 'Gets real-time traffic information for a specified location.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: {
          type: 'STRING',
          description: "The specific area, route, or address for which to retrieve traffic conditions. Examples: 'Highway 101 North', 'downtown', or 'the route to the airport'.",
        },
      },
      required: ['location'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];