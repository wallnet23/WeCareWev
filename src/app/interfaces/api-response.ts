export interface ApiResponse<T> {
  code: number;
  data: T;
  title: string;
  message: string;
}
