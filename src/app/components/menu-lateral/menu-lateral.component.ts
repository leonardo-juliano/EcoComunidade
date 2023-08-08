import { Component, OnInit } from '@angular/core';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  collapsed = false;
  navData = navbarData


  toggleCollapse(): void{
    this.collapsed = !this.collapsed
  }

  closeSidenav():void{
    this.collapsed = false
  }




 }
//   openNav() {
//     document.getElementById("menuOculto").style.width="250px"
//     document.getElementById("principal").style.marginLeft="250px"
//     document.getElementById("menuOculto").style.zIndex="1"
//   }
//   endNav() {
//   document.getElementById("menuOculto").style.width="0px"
//   document.getElementById("principal").style.marginLeft="0px" 
//   }
// }


