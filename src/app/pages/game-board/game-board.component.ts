import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MASTER_SONG_LIST, GAME_CONFIG, Song } from '../../data/songs.config';

interface BingoCell {
  song: Song;
  marked: boolean;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  // Signals
  gameId = signal<string>('');
  board = signal<BingoCell[]>([]);
  
  // Computed signals
  markedCount = computed(() => this.board().filter(cell => cell.marked).length);
  hasBingo = computed(() => this.checkBingo());

  ngOnInit() {
    // Obtener el ID del juego desde los query params
    this.route.queryParams.subscribe(params => {
      const id = params['id'] || this.generateGameId();
      this.gameId.set(id);
      this.generateBoard();
    });
  }

  private generateGameId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private generateBoard() {
    // Algoritmo: seleccionar 16 canciones aleatorias de la lista maestra
    const shuffled = [...MASTER_SONG_LIST].sort(() => Math.random() - 0.5);
    const selectedSongs = shuffled.slice(0, GAME_CONFIG.defaultBoardSize);
    
    const cells: BingoCell[] = selectedSongs.map(song => ({
      song,
      marked: false
    }));

    this.board.set(cells);
  }

  toggleCell(index: number) {
    const currentBoard = [...this.board()];
    currentBoard[index].marked = !currentBoard[index].marked;
    this.board.set(currentBoard);

    // Verificar si hay BINGO
    if (this.hasBingo()) {
      this.showBingoAlert();
    }
  }

  private checkBingo(): boolean {
    const size = 4; // 4x4 grid
    const board = this.board();
    
    // Verificar filas
    for (let i = 0; i < size; i++) {
      const row = board.slice(i * size, (i + 1) * size);
      if (row.every(cell => cell.marked)) return true;
    }

    // Verificar columnas
    for (let col = 0; col < size; col++) {
      const column = [];
      for (let row = 0; row < size; row++) {
        column.push(board[row * size + col]);
      }
      if (column.every(cell => cell.marked)) return true;
    }

    // Verificar diagonal principal
    const mainDiagonal = [];
    for (let i = 0; i < size; i++) {
      mainDiagonal.push(board[i * size + i]);
    }
    if (mainDiagonal.every(cell => cell.marked)) return true;

    // Verificar diagonal secundaria
    const antiDiagonal = [];
    for (let i = 0; i < size; i++) {
      antiDiagonal.push(board[i * size + (size - 1 - i)]);
    }
    if (antiDiagonal.every(cell => cell.marked)) return true;

    return false;
  }

  private showBingoAlert() {
    this.snackBar.open('🎉 ¡BINGO! ¡Has ganado!', 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['bingo-snackbar']
    });
  }

  shareGame() {
    const url = `${window.location.origin}/game?id=${this.gameId()}`;
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('¡Link copiado al portapapeles!', 'OK', { duration: 3000 });
    });
  }

  resetBoard() {
    const resetBoard = this.board().map(cell => ({ ...cell, marked: false }));
    this.board.set(resetBoard);
  }
}
