import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomMenuItem } from 'src/app/core/models/custom-menu-item.model';

@Injectable({
  providedIn: 'root',
})
/**
 * menu data service
 */
export class MenuDataService {
  toggleMenuBar: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getMenuList(): CustomMenuItem[] {
    return [
      {
        label: 'Página Inicial',
        icon: 'pi pi-home',
        routerLink: '/backoffice/inicio',
        roles: ['ALL'],
        childs: null,
        isChildVisible: false
      },
      {
        label: 'Utilizadores',
        icon: 'pi pi-id-card',
        routerLink: null,
        roles: ['A'],
        childs: [
          {
            label: 'Listagem',
            icon: 'pi pi-list',
            routerLink: '/backoffice/utilizador/listagem',
            roles: ['A'],
            childs: null,
            isChildVisible: false,
          },
          {
            label: 'Registo',
            icon: 'pi pi-plus',
            routerLink: '/backoffice/utilizador/registar',
            roles: ['A'],
            childs: null,
            isChildVisible: false,
          },
        ],
        isChildVisible: true,
      },
      {
        label: 'Streams',
        icon: 'pi pi-id-card',
        routerLink: null,
        roles: ['ALL'],
        childs: [
          {
            label: 'Listagem',
            icon: 'pi pi-list',
            routerLink: '/backoffice/stream/listagem',
            roles: ['ALL'],
            childs: null,
            isChildVisible: false,
          },
          {
            label: 'Registo',
            icon: 'pi pi-plus',
            routerLink: '/backoffice/stream/registar',
            roles: ['A', 'W'],
            childs: null,
            isChildVisible: false,
          },
        ],
        isChildVisible: true,
      }
    ];
  }
}
