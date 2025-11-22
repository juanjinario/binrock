import { Injectable } from '@angular/core';

export interface GameState {
  gameId: string;
  boardData: number[]; // IDs de las canciones en el tablero
  markedCells: boolean[]; // Estado de cada celda
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'binrock_game_';

  // Guardar estado del juego
  saveGameState(gameId: string, boardData: number[], markedCells: boolean[]): void {
    const state: GameState = {
      gameId,
      boardData,
      markedCells,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY + gameId, JSON.stringify(state));
  }

  // Obtener estado del juego por ID
  getGameState(gameId: string): GameState | null {
    const data = localStorage.getItem(this.STORAGE_KEY + gameId);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as GameState;
    } catch {
      return null;
    }
  }

  // Verificar si ya existe un cartón para este juego
  hasBoard(gameId: string): boolean {
    return this.getGameState(gameId) !== null;
  }

  // Actualizar solo las celdas marcadas
  updateMarkedCells(gameId: string, markedCells: boolean[]): void {
    const state = this.getGameState(gameId);
    if (state) {
      state.markedCells = markedCells;
      state.timestamp = Date.now();
      localStorage.setItem(this.STORAGE_KEY + gameId, JSON.stringify(state));
    }
  }

  // Limpiar juegos antiguos (más de 7 días)
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

  // Resetear el tablero (para debugging o reiniciar)
  clearGameState(gameId: string): void {
    localStorage.removeItem(this.STORAGE_KEY + gameId);
  }
}
