  export class CustomMenuItem {
  label: string;
  icon?: string;
  routerLink: string;
  roles: string[];
  childs: CustomMenuItem[];
  isChildVisible: boolean;

  constructor() {
    this.label = null;
    this.icon = null;
    this.routerLink = null;
    this.roles = [];
    this.childs = null;
    this.isChildVisible = false;
  }
}
