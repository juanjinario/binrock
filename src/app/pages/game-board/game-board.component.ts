import { Component, OnInit, computed, inject, signal, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SONGS_DATA, GAME_CONFIG } from '../../data/songs.config';
import { ISong } from '../../core/interfaces/song.interface';
import { StorageService } from '../../services/storage.service';

interface BingoCell {
  song: ISong;
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
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  animations: [
    trigger('boardAnimation', [
      transition(':enter', [
        query('.song-cell', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(30, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class GameBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private storage = inject(StorageService);

  constructor(@Inject(SONGS_DATA) private songs: ISong[]) {}

  // Signals
  gameId = signal<string>('');
  board = signal<BingoCell[]>([]);
  hasGeneratedBoard = signal<boolean>(false);
  
  // Computed signals
  markedCount = computed(() => this.board().filter(cell => cell.marked).length);
  hasBingo = computed(() => this.checkBingo());

  ngOnInit() {
    // Limpiar juegos antiguos al cargar
    this.storage.cleanOldGames();

    // Obtener el ID del juego desde los query params
    this.route.queryParams.subscribe(params => {
      const id = params['id'] || this.generateGameId();
      this.gameId.set(id);
      
      // Verificar si ya existe un tablero guardado
      this.loadOrWaitForBoard();
    });
  }

  private loadOrWaitForBoard() {
    const savedState = this.storage.getGameState(this.gameId());
    
    if (savedState) {
      // Cargar tablero existente desde localStorage
      this.loadBoardFromState(savedState);
      this.hasGeneratedBoard.set(true);
    } else {
      // Esperando a que el usuario genere su cartón
      this.hasGeneratedBoard.set(false);
    }
  }

  private loadBoardFromState(state: any) {
    const cells: BingoCell[] = state.boardData.map((songId: number, index: number) => {
      const song = this.songs.find(s => s.id === songId);
      return {
        song: song!,
        marked: state.markedCells[index]
      };
    });
    this.board.set(cells);
  }

  generateNewBoard() {
    if (this.hasGeneratedBoard()) {
      this.snackBar.open('Ya tienes un cartón generado para esta partida', 'OK', { duration: 3000 });
      return;
    }

    this.generateBoard();
    this.hasGeneratedBoard.set(true);
    this.snackBar.open('¡Cartón generado! Buena suerte 🎵', 'OK', { duration: 2000 });
  }

  private generateGameId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private generateBoard() {
    // Algoritmo: seleccionar 16 canciones aleatorias de la lista maestra
    const shuffled = [...this.songs].sort(() => Math.random() - 0.5);
    const selectedSongs = shuffled.slice(0, GAME_CONFIG.defaultBoardSize);
    
    const cells: BingoCell[] = selectedSongs.map(song => ({
      song,
      marked: false
    }));

    this.board.set(cells);
    
    // Guardar en localStorage
    const boardData = cells.map(cell => cell.song.id);
    const markedCells = cells.map(cell => cell.marked);
    this.storage.saveGameState(this.gameId(), boardData, markedCells);
  }

  toggleCell(index: number) {
    const currentBoard = [...this.board()];
    currentBoard[index].marked = !currentBoard[index].marked;
    this.board.set(currentBoard);

    // Guardar estado actualizado
    const markedCells = currentBoard.map(cell => cell.marked);
    this.storage.updateMarkedCells(this.gameId(), markedCells);

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
    if (confirm('¿Estás seguro? Esto borrará todas tus marcas.')) {
      const resetBoard = this.board().map(cell => ({ ...cell, marked: false }));
      this.board.set(resetBoard);
      
      // Actualizar localStorage
      const markedCells = resetBoard.map(cell => cell.marked);
      this.storage.updateMarkedCells(this.gameId(), markedCells);
    }
  }

  deleteBoard() {
    if (confirm('¿Eliminar tu cartón? Tendrás que generar uno nuevo.')) {
      this.storage.clearGameState(this.gameId());
      this.board.set([]);
      this.hasGeneratedBoard.set(false);
      this.snackBar.open('Cartón eliminado', 'OK', { duration: 2000 });
    }
  }
}
