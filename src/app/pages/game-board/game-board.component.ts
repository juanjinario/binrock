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
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SONGS_DATA } from '../../data/songs.config';
import { ISong, IGameSettings, IBingoCell } from '../../core/interfaces/song.interface';
import { StorageService } from '../../services/storage.service';
import { GameConfigService } from '../../services/game-config.service';

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
  private gameConfigService = inject(GameConfigService);

  constructor(@Inject(SONGS_DATA) private songs: ISong[]) {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        takeUntilDestroyed()
      )
      .subscribe(() => this.checkIfMobile());
  }

  // Signals
  gameId = signal<string>('');
  board = signal<IBingoCell[]>([]);
  hasGeneratedBoard = signal<boolean>(false);
  gameSettings = signal<IGameSettings>({
    timestamp: '',
    boardSize: 16,
    winningCount: 16,
    showGenre: true,
    gameId: ''
  });
  isMobile = signal<boolean>(false);
  
  // Computed signals
  markedCount = computed(() => this.board().filter(cell => cell.marked).length);
  hasBingo = computed(() => this.markedCount() >= this.gameSettings().winningCount);
  gridCols = computed(() => {
    // En móviles siempre 3 columnas, en desktop usar el tamaño configurado
    if (this.isMobile()) {
      return 3;
    }
    return this.gameConfigService.getGridColumns(this.gameSettings().boardSize);
  });

  ngOnInit() {
    // Detectar si es móvil
    this.checkIfMobile();

    // Limpiar juegos antiguos al cargar
    this.storage.cleanOldGames();

    // Obtener el ID del juego desde los query params
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      
      if (!id) {
        // Si no hay ID, usar configuración por defecto
        const defaultConfig = this.gameConfigService.decodeGameId('');
        this.gameSettings.set(defaultConfig);
        this.gameId.set(defaultConfig.gameId);
      } else {
        // Decodificar la configuración desde el ID
        const config = this.gameConfigService.decodeGameId(id);
        this.gameSettings.set(config);
        this.gameId.set(id);
      }
      
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
    // Actualizar configuración si está guardada en localStorage
    if (state.boardSize && state.winningCount) {
      this.gameSettings.update(settings => ({
        ...settings,
        boardSize: state.boardSize,
        winningCount: state.winningCount,
        showGenre: state.showGenre ?? true // Fallback para partidas antiguas
      }));
    }

    const cells: IBingoCell[] = state.boardData.map((songId: number, index: number) => {
      const song = this.songs.find(song => song.id === songId);
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

  private generateBoard() {
    // Algoritmo: seleccionar N canciones aleatorias según boardSize usando Fisher-Yates
    const shuffled = this.fisherYatesShuffle([...this.songs]);
    const selectedSongs = shuffled.slice(0, this.gameSettings().boardSize);
    
    const cells: IBingoCell[] = selectedSongs.map(song => ({
      song,
      marked: false
    }));

    this.board.set(cells);
    
    // Guardar en localStorage con configuración completa
    const boardData = cells.map(cell => cell.song.id);
    const markedCells = cells.map(cell => cell.marked);
    this.storage.saveGameState(
      this.gameId(), 
      boardData, 
      markedCells,
      this.gameSettings().boardSize,
      this.gameSettings().winningCount,
      this.gameSettings().showGenre
    );
  }

  private fisherYatesShuffle<T>(array: T[]): T[] {
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
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

  private checkIfMobile() {
    this.isMobile.set(window.innerWidth <= 768);
  }
}
