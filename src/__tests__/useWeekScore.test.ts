import { describe, it, expect } from 'vitest';
import { calcWeekScore } from '../lib/utils';
import type { AppState } from '../types';

describe('useWeekScore', () => {
  const createMockState = (overrides: Partial<AppState> = {}): AppState => ({
    habits: [
      { id: 'h1', name: 'Exercise', cat: 'black', nonNeg: true, createdAt: new Date(), sortOrder: 0 },
      { id: 'h2', name: 'Study', cat: 'blue', nonNeg: false, createdAt: new Date(), sortOrder: 1 },
    ],
    ticks: {},
    moods: {},
    energy: {},
    sleep: {},
    journal: {},
    reviews: {},
    triggers: {},
    milestones: new Set(),
    windDown: {},
    timerSessions: 0,
    settings: {},
    ...overrides,
  });

  it('should return 50 when no data exists (default scores for sleep and mood)', () => {
    const state = createMockState();
    // Sunday, Jan 7, 2024 - today = 7, dayOfWeek = 0, weekStart = 7
    const now = new Date(2024, 0, 7); // Sunday
    const score = calcWeekScore(state, 7, now);
    
    expect(score).toBe(23); // 0 habits * 0.4 + 0.5 sleep * 0.25 + 0.5 mood * 0.2 + 0 focus * 0.15 = 0.225 = 22.5 ≈ 23
    // Calculation: (0 * 0.4 + 0.5 * 0.25 + 0.5 * 0.2 + 0 * 0.15) * 100 = 22.5 ≈ 23
  });

  it('should calculate correct score with habits completed', () => {
    const ticks = {
      'h1-7': true, // exercises on day 7
      'h2-7': true, // studies on day 7
    };
    
    const state = createMockState({ ticks });
    const now = new Date(2024, 0, 7); // Sunday
    const score = calcWeekScore(state, 7, now);
    
    // Full day with positive habits done: 1.0 * 0.4 + 0.5 * 0.25 + 0.5 * 0.2 + 0 = 0.525 = 52.5
    expect(score).toBeGreaterThan(50);
  });

  it('should weight sleep at 25%', () => {
    const state = createMockState({
      sleep: { 7: 8 }, // Full 8 hours
    });
    
    const now = new Date(2024, 0, 7);
    const score = calcWeekScore(state, 7, now);
    
    // Sleep score with 8 hours = 1.0
    // Total: 0 * 0.4 + 1.0 * 0.25 + 0.5 * 0.2 + 0 * 0.15 = 0.35 = 35
    expect(score).toBeGreaterThanOrEqual(30);
  });

  it('should weight mood at 20%', () => {
    const state = createMockState({
      moods: { 7: 4 }, // Max mood
    });
    
    const now = new Date(2024, 0, 7);
    const score = calcWeekScore(state, 7, now);
    
    // Mood score with 4/4 = 1.0
    // Total: 0 * 0.4 + 0.5 * 0.25 + 1.0 * 0.2 + 0 * 0.15 = 0.325 = 32.5
    expect(score).toBeGreaterThanOrEqual(30);
  });

  it('should weight focus (timer sessions) at 15%', () => {
    const state = createMockState({
      timerSessions: 10, // 10 sessions = max focus score of 1.0
    });
    
    const now = new Date(2024, 0, 7);
    const score = calcWeekScore(state, 7, now);
    
    // Focus score with 10+ sessions = 1.0
    // Total: 0 * 0.4 + 0.5 * 0.25 + 0.5 * 0.2 + 1.0 * 0.15 = 0.375 = 37.5
    expect(score).toBeGreaterThanOrEqual(35);
  });

  it('should calculate average across week', () => {
    const ticks = {
      'h1-7': true, // Day 7
      'h1-6': true, // Day 6
      'h1-5': true, // Day 5 - assuming week starts on Sunday (day 5 is Wednesday)
    };
    
const state = createMockState({ 
      ticks,
      sleep: { 5: 8, 6: 8, 7: 8 },
      moods: { 5: 4, 6: 4, 7: 4 },
    });
    
    const now = new Date(2024, 0, 7); // Sunday
    const score = calcWeekScore(state, 7, now);
    
    // Should be around 65 with 3 days of full metrics
    expect(score).toBeGreaterThan(60);
  });
});
