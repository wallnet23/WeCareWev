export interface Menu {
  voice: string;
  level: number;
  path: string | null;
  sub: Menu[] | null;
  // [number, number, string]
  link: any[] | null;
}
