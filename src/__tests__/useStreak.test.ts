import { describe, it, expect } from 'vitest';
import { calcStreak } from '../lib/utils';
import type { AppState } from '../types';

describe('useStreak', () => {
  const createMockState = (ticks: Record<string, boolean>): AppState => ({
    habits: [
      { id: 'habit-1', name: 'Exercise', cat: 'black', nonNeg: true, createdAt: new Date(), sortOrder: 0 },
      { id: 'habit-2', name: 'Meditate', cat: 'black', nonNeg: true, createdAt: new Date(), sortOrder: 1 },
      { id: 'habit-3', name: 'Procrastinate', cat: 'red', nonNeg: false, createdAt: new Date(), sortOrder: 2 },
    ],
    ticks,
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
  });

  it('should return 0 streak when no non-negative habits exist', () => {
    const appState = createMockState({});
    appState.habits = [];
    
    const streak = calcStreak(appState, 5);
    expect(streak).toBe(0);
  });

  it('should return correct streak for consecutive days', () => {
    const ticks = {
      'habit-1-5': true,
      'habit-2-5': true,
      'habit-1-4': true,
      'habit-2-4': true,
      'habit-1-3': true,
      'habit-2-3': true,
    };
    
    const state = createMockState(ticks);
    const streak = calcStreak(state, 5);
    
    expect(streak).toBe(3); // Days 5, 4, 3
  });

  it('should break streak when any non-negative habit is missing', () => {
    const ticks = {
      'habit-1-5': true,
      'habit-2-5': true,
      'habit-1-4': true,
      // habit-2-4 missing - breaks streak
    };
    
    const state = createMockState(ticks);
    const streak = calcStreak(state, 5);
    
    expect(streak).toBe(1); // Only day 5
  });

  it('should handle single day streak', () => {
    const ticks = {
      'habit-1-5': true,
      'habit-2-5': true,
    };
    
    const state = createMockState(ticks);
    const streak = calcStreak(state, 5);
    
    expect(streak).toBe(1);
  });

  it('should not count red habits towards streak', () => {
    const ticks = {
      'habit-1-5': true,
      'habit-2-5': true,
      'habit-3-5': true, // red habit tick should be ignored
    };
    
    const state = createMockState(ticks);
    const streak = calcStreak(state, 5);
    
    // Should count all days as streak only requires non-negative habits
    expect(streak).toBe(1);
  });
});
