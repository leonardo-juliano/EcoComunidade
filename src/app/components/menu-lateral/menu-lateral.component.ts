import { Component, OnInit } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'; // Importe NavigationEnd
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';


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
  user = '';
  profile = [];
  colaborador = false;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.rotaAtual = event.url;
        this.getRouter(); 
      }
    });
  }

  async ngOnInit() {
    await this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user.email
        this.getUser();
      }
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  getRouter() {
    if (this.rotaAtual == '/login' || this.rotaAtual == '/user' || this.rotaAtual == '/city' || this.rotaAtual == '/collaborator' || this.rotaAtual == '/public_area' || this.rotaAtual == '/') {
      this.showMenu = false;
    }else{
      this.showMenu = true;
    }
  }

  getUser() {
    this.profileService.buscarUsuarioPorEmail(this.user)
      .subscribe(data => {
        this.profile = data
        if(this.profile[0].collaborator == true){
          this.colaborador = true;
        }else{
          this.colaborador = false;
        }
      });
  }

  redirectProblems(){
    this.router.navigate(['/problems']);
  }

  closeSidenav(): void {
    this.collapsed = false;
  }
}
