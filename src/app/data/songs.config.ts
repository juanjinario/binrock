import { InjectionToken } from '@angular/core';
import { ISong, IGameConfig } from '../core/interfaces/song.interface';

export const GAME_CONFIG: IGameConfig = {
  defaultBoardSize: 16,
  minBoardSize: 9,
  maxBoardSize: 25,
  freeSpace: false
};

export const MASTER_SONG_LIST: ISong[] = [
  // Rock 80s
  { id: 1, title: 'Livin\' on a Prayer', artist: 'Bon Jovi', genre: 'Rock 80s' },
  { id: 2, title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', genre: 'Rock 80s' },
  { id: 3, title: 'Eye of the Tiger', artist: 'Survivor', genre: 'Rock 80s' },
  { id: 4, title: 'Don\'t Stop Believin\'', artist: 'Journey', genre: 'Rock 80s' },
  { id: 5, title: 'Take On Me', artist: 'A-ha', genre: 'Rock 80s' },
  
  // Salsa
  { id: 6, title: 'Vivir Mi Vida', artist: 'Marc Anthony', genre: 'Salsa' },
  { id: 7, title: 'La Vida es un Carnaval', artist: 'Celia Cruz', genre: 'Salsa' },
  { id: 8, title: 'Aguanile', artist: 'Héctor Lavoe', genre: 'Salsa' },
  { id: 9, title: 'Llorarás', artist: 'Oscar D\'León', genre: 'Salsa' },
  
  // Reggaeton
  { id: 10, title: 'Gasolina', artist: 'Daddy Yankee', genre: 'Reggaeton' },
  { id: 11, title: 'Danza Kuduro', artist: 'Don Omar', genre: 'Reggaeton' },
  { id: 12, title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', genre: 'Reggaeton' },
  { id: 13, title: 'Tusa', artist: 'Karol G ft. Nicki Minaj', genre: 'Reggaeton' },
  { id: 14, title: 'Safaera', artist: 'Bad Bunny', genre: 'Reggaeton' },
  { id: 41, title: 'Lo Que Pasó, Pasó', artist: 'Daddy Yankee', genre: 'Reggaeton' },

  // Metal
  { id: 15, title: 'Enter Sandman', artist: 'Metallica', genre: 'Metal' },
  { id: 16, title: 'Chop Suey!', artist: 'System of a Down', genre: 'Metal' },
  { id: 17, title: 'Master of Puppets', artist: 'Metallica', genre: 'Metal' },
  { id: 18, title: 'Painkiller', artist: 'Judas Priest', genre: 'Metal' },
  { id: 43, title: 'The Beautiful People', artist: 'Marilyn Manson', genre: 'Metal Industrial' },

  // Pop Español
  { id: 19, title: 'Corazón Partío', artist: 'Alejandro Sanz', genre: 'Pop Español' },
  { id: 21, title: 'Hijo de la Luna', artist: 'Mecano', genre: 'Pop Español' },

  // Rock Español
  { id: 20, title: 'La Flaca', artist: 'Jarabe de Palo', genre: 'Rock Español' },
  { id: 22, title: 'Me Gustas Tú', artist: 'Manu Chao', genre: 'Rock Español' },
  { id: 23, title: 'Rayando el Sol', artist: 'Maná', genre: 'Rock Español' },
  { id: 46, title: 'Clavado en un Bar', artist: 'Maná', genre: 'Rock Español' },

  // Pop Internacional
  { id: 24, title: 'Dancing Queen', artist: 'ABBA', genre: 'Disco' },
  { id: 25, title: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop' },
  { id: 26, title: 'Wannabe', artist: 'Spice Girls', genre: 'Pop 90s' },
  { id: 27, title: 'I Will Survive', artist: 'Gloria Gaynor', genre: 'Disco' },
  { id: 28, title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' },
  { id: 29, title: 'Shake It Off', artist: 'Taylor Swift', genre: 'Pop' },

  // Rock Alternativo
  { id: 30, title: 'Mr. Brightside', artist: 'The Killers', genre: 'Indie Rock' },
  { id: 31, title: 'Wonderwall', artist: 'Oasis', genre: 'Britpop' },
  { id: 32, title: 'Seven Nation Army', artist: 'The White Stripes', genre: 'Rock Alternativo' },
  { id: 33, title: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'Grunge' },
  { id: 42, title: 'Don\'t Speak', artist: 'No Doubt', genre: 'Rock Alternativo' },

  // Cumbia
  { id: 35, title: 'El Listón de Tu Pelo', artist: 'Los Ángeles Azules', genre: 'Cumbia' },
  { id: 47, title: 'Una Canción', artist: 'Los de Adentro', genre: 'Cumbia' },

  // Regional Mexicano
  { id: 34, title: 'La Chona', artist: 'Los Tucanes de Tijuana', genre: 'Regional Mexicano' },

  // Pop Latino
  { id: 36, title: 'Amor a la Mexicana', artist: 'Thalía', genre: 'Pop Latino' },
  { id: 44, title: 'Pegate', artist: 'Ricky Martin', genre: 'Pop Latino' },

  // Hip Hop
  { id: 37, title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip Hop' },
  { id: 39, title: 'In Da Club', artist: '50 Cent', genre: 'Hip Hop' },

  // R&B
  { id: 38, title: 'Crazy in Love', artist: 'Beyoncé ft. Jay-Z', genre: 'R&B' },

  // Funk
  { id: 40, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk' },

  // K-Pop
  { id: 45, title: 'Gangnam Style', artist: 'PSY', genre: 'K-Pop' }
];

export const SONGS_DATA = new InjectionToken<ISong[]>('SONGS_DATA', {
  providedIn: 'root',
  factory: () => MASTER_SONG_LIST
});
