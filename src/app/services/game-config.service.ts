import { Injectable } from '@angular/core';
import { IGameSettings } from '../core/interfaces/song.interface';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private readonly DEFAULT_BOARD_SIZE = 16;
  private readonly DEFAULT_WINNING_COUNT = 16;
  private readonly MIN_BOARD_SIZE = 9;
  private readonly MAX_BOARD_SIZE = 25;

  /**
   * Genera un nuevo ID de juego codificado con la configuración
   */
  generateGameId(boardSize: number, winningCount: number): string {
    const timestamp = Date.now().toString(36);
    const data = `${timestamp}_${boardSize}_${winningCount}`;
    return btoa(data);
  }

  /**
   * Decodifica un ID de juego y retorna la configuración
   * Si el ID es inválido, retorna configuración por defecto
   */
  decodeGameId(gameId: string): IGameSettings {
    try {
      const decoded = atob(gameId);
      const parts = decoded.split('_');
      
      if (parts.length !== 3) {
        throw new Error('Invalid format');
      }

      const [timestamp, boardSizeStr, winningCountStr] = parts;
      const boardSize = parseInt(boardSizeStr, 10);
      const winningCount = parseInt(winningCountStr, 10);

      // Validar que los valores sean correctos
      if (
        isNaN(boardSize) || 
        isNaN(winningCount) || 
        boardSize < this.MIN_BOARD_SIZE || 
        boardSize > this.MAX_BOARD_SIZE || 
        winningCount < 1 || 
        winningCount > boardSize
      ) {
        throw new Error('Invalid config values');
      }

      return {
        timestamp,
        boardSize,
        winningCount,
        gameId
      };
    } catch (error) {
      // Fallback: Si falla la decodificación, usar valores por defecto
      console.warn('Invalid gameId, using default configuration', error);
      const defaultGameId = this.generateGameId(this.DEFAULT_BOARD_SIZE, this.DEFAULT_WINNING_COUNT);
      
      return {
        timestamp: Date.now().toString(36),
        boardSize: this.DEFAULT_BOARD_SIZE,
        winningCount: this.DEFAULT_WINNING_COUNT,
        gameId: defaultGameId
      };
    }
  }

  /**
   * Calcula el número de columnas para el grid basado en el tamaño del tablero
   */
  getGridColumns(boardSize: number): number {
    const gridColumnsMap: Record<number, number> = {
      9: 3,
      16: 4,
      25: 5
    };
    
    return gridColumnsMap[boardSize] ?? 4;
  }

  /**
   * Valida que la configuración sea correcta
   */
  isValidConfig(boardSize: number, winningCount: number): boolean {
    return (
      boardSize >= this.MIN_BOARD_SIZE &&
      boardSize <= this.MAX_BOARD_SIZE &&
      winningCount >= 1 &&
      winningCount <= boardSize &&
      [9, 16, 25].includes(boardSize)
    );
  }
}
