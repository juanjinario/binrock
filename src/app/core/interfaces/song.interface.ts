export interface ISong {
  id: number;
  title: string;
  artist: string;
  genre: string;
}

export interface IGameConfig {
  defaultBoardSize: number;
  minBoardSize: number;
  maxBoardSize: number;
  freeSpace: boolean;
}

export interface IGameSettings {
  timestamp: string;
  boardSize: number;
  winningCount: number;
  showGenre: boolean;
  gameId: string;
}

export interface IBingoCell {
  song: ISong;
  marked: boolean;
}
