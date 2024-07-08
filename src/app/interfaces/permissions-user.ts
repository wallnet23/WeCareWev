import { Menu } from "./menu";

export interface PermissionsUser {
  menu: Menu[];
  //functions
  functionality: Authorization[];
}

interface Authorization{
  id: number;
  name: string;
}
