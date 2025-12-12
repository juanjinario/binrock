import { Injectable } from '@angular/core';

export interface GameState {
  gameId: string;
  boardData: number[];
  markedCells: boolean[];
  boardSize: number;
  winningCount: number;
  showGenre: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'binrock_game_';

  saveGameState(
    gameId: string, 
    boardData: number[], 
    markedCells: boolean[], 
    boardSize: number, 
    winningCount: number,
    showGenre: boolean
  ): void {
    const state: GameState = {
      gameId,
      boardData,
      markedCells,
      boardSize,
      winningCount,
      showGenre,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY + gameId, JSON.stringify(state));
  }

  getGameState(gameId: string): GameState | null {
    const data = localStorage.getItem(this.STORAGE_KEY + gameId);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as GameState;
    } catch {
      return null;
    }
  }

  updateMarkedCells(gameId: string, markedCells: boolean[]): void {
    const state = this.getGameState(gameId);
    if (state) {
      state.markedCells = markedCells;
      state.timestamp = Date.now();
      localStorage.setItem(this.STORAGE_KEY + gameId, JSON.stringify(state));
    }
  }

  /** Clean games older than 7 days */
  cleanOldGames(): void {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const state = JSON.parse(data) as GameState;
            if (state.timestamp < sevenDaysAgo) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }
}