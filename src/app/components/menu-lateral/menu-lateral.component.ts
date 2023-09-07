import { Component, OnInit } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'; // Importe NavigationEnd

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  rotaAtual = '';
  collapsed = false;
  navData = navbarData;
  showMenu = true;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Assine as alterações de rota para atualizar this.rotaAtual
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.rotaAtual = event.url;
        this.getRouter(); // Chame a função após a atualização da rota
      }
    });
  }

  ngOnInit() {
    // Não é necessário chamar getRouter() aqui, pois já está sendo chamado no construtor
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  getRouter() {
    console.log('rota atual: ', this.rotaAtual);

    if (this.rotaAtual == '/login' || this.rotaAtual == '/user' || this.rotaAtual == '/city') {
      this.showMenu = false;
    }else{
      this.showMenu = true;
    }
  }

  closeSidenav(): void {
    this.collapsed = false;
  }
}
