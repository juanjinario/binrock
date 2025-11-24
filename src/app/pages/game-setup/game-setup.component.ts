import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { GameConfigService } from '../../services/game-config.service';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule
  ],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss'
})
export class GameSetupComponent {
  private router = inject(Router);
  private gameConfigService = inject(GameConfigService);

  boardSize = signal<number>(16);
  winningCount = signal<number>(16);

  boardSizeOptions = [
    { value: 9, label: '3x3 (9 canciones)', description: 'Juego rápido' },
    { value: 16, label: '4x4 (16 canciones)', description: 'Clásico' },
    { value: 25, label: '5x5 (25 canciones)', description: 'Experto' }
  ];

  onBoardSizeChange(size: number) {
    this.boardSize.set(size);
    // Si winningCount es mayor que el nuevo tamaño, ajustarlo
    if (this.winningCount() > size) {
      this.winningCount.set(size);
    }
  }

  onWinningCountChange(count: number) {
    // Asegurar que no sea mayor que boardSize
    const validCount = Math.min(Math.max(1, count), this.boardSize());
    this.winningCount.set(validCount);
  }

  createGame() {
    const gameId = this.gameConfigService.generateGameId(
      this.boardSize(),
      this.winningCount()
    );
    
    this.router.navigate(['/game'], { 
      queryParams: { id: gameId } 
    });
  }

  getWinPercentage(): number {
    return Math.round((this.winningCount() / this.boardSize()) * 100);
  }
}
