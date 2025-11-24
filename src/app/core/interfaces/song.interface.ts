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
