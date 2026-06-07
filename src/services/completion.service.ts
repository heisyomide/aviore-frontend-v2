// src/services/completion.service.ts

import { CompletionEngineResponse } from '../types/completion.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shopaviore.store'; // Adjust to your backend URL

export async function getCompletionStatus(track: 'customer' | 'vendor', token: string): Promise<CompletionEngineResponse> {
  const response = await fetch(`${API_BASE_URL}/completion/${track}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 0 }, // Ensure fresh data on dashboard reloads
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${track} completion onboarding parameters.`);
  }

  return response.json();
}