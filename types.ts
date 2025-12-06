export interface SongSuggestion {
  title: string;
  artist: string;
  reason: string;
}

export interface VideoAnalysisResult {
  summary: string;
  songs: SongSuggestion[];
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
  size: number;
}
