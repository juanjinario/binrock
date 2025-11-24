import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'game-setup', 
    loadComponent: () => import('./pages/game-setup/game-setup.component').then(m => m.GameSetupComponent)
  },
  { 
    path: 'game', 
    loadComponent: () => import('./pages/game-board/game-board.component').then(m => m.GameBoardComponent)
  },
  { path: '**', redirectTo: '' }
];
