import { Component, OnInit } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
  }

  collapsed = false;
  navData = navbarData


  toggleCollapse(): void {
    this.collapsed = !this.collapsed
  }

  closeSidenav(): void {
    this.collapsed = false
  }




}


