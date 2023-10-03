import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import MetisMenu from 'metismenujs/dist/metismenujs';
import { EventService } from '../../core/services/event.service';
import { Router, NavigationEnd } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { MENU, MENU_ASIS_FINAN, MENU_JEFE_DEPTO, MENU_JEFE_FINAN, MENU_SECRE_DECA, MENU_USER, MENU_VIGILANTE } from './menu';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import { SolicitudVehiculoService } from 'src/app/modules/solicitud-vehiculo/services/solicitud-vehiculo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef;
  @Input() isCondensed = false;
  menu: any;
  data: any;
  lstusuario : Usuario ;
  menuItems = [];
  usuariojson : any;
  rol : string = "ADMIN";

  @ViewChild('sideMenu') sideMenu: ElementRef;


  constructor(private eventService: EventService, private router: Router, public translate: TranslateService, private http: HttpClient,
    private solicituVService : SolicitudVehiculoService, private userService: UsuarioService) {
this.usuariojson = this.userService.usuarioJSON;
    //this.lstusuario = this.userService.usuario;

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit() {
    this.userService.getUsuario();
  console.log(this.usuariojson);
    this.initialize();
    this._scrollElement();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0]['offsetTop'];
        if (currentPosition > 500)
        if(this.scrollRef.SimpleBar !== null)
          this.scrollRef.SimpleBar.getScrollElement().scrollTop =
            currentPosition + 300;
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
      }
    }

  }

  /**
   * Initialize
   */
  initialize(): void {



   switch (this.usuariojson.role){
    case "JEFE_DEPTO" : {
      this.menuItems = MENU_JEFE_DEPTO
        break;
    }
    case "SECR_DECANATO" : {
      this.menuItems = MENU_SECRE_DECA
        break;
    }
    case "DECANO" : {
        this.menuItems = MENU_JEFE_DEPTO
        break;
    }
    case "ASIS_FINANCIERO" : {
        this.menuItems = MENU_ASIS_FINAN
        break;
    }
    case "JEFE_FINANACIERO" : {
        this.menuItems = MENU_JEFE_FINAN
        break;
    }
    case "VIGILANTE" : {
      this.menuItems = MENU_VIGILANTE
        break;
    }
    case "ADMIN" : {
      this.menuItems = MENU
        break;
    }
    default:{
      this.menuItems = MENU_USER
        break;
    }

  }

   // this.menuItems = this.filterMenuByRole(MENU, this.usuariojson.role);
  }
/*
  filterMenuByRole(menu: MenuItem[], userRole: string): MenuItem[] {
    // Filtrar el menú según el rol del usuario
    return menu.filter((item) => {
      if (item.role) {
        return item.role.includes(userRole);
      }
      // Si el elemento no tiene roles definidos, se muestra para todos los roles.
      return true;
    });
  }
*/

//this.usuariojson.codigoUsario

  obtenerUsuarioActivo(){
    // Suscríbete al Observable para obtener el usuario
    let resp ;
    this.solicituVService.getUsuarioSV().subscribe((user: Usuario) => {
      resp = user.role;


    });
    console.log("rol en el metodo:",resp);
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }
}
