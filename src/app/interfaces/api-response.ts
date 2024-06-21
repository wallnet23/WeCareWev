export interface ApiResponse<T> {
  // 200: success, 511: warning
  code: number;
  data: T;
  title: string;
  message: string;
  // 1: toast se null o altro apre il dialog
  type_alert?: number;
  obj_toast?: {
    closeButton?: number;
    disableTimeOut?: number;
  };
  obj_dialog?: {

  }
}
