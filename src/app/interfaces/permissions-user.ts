import { Menu } from "./menu";

export interface PermissionsUser {
  menu: Menu[];
  //functions
  functionality: Authorization[];
  pages_access: Pages[];
}

interface Authorization {
  id: number;
  name: string;
  readonly: number;
}
interface Pages {
  path: string;
  title: string;
  readonly: number;
}
