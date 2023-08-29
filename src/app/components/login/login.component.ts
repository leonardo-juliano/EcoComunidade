import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '' as string;
  password = '' as string;

  constructor(
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Usuário está logado, redirecionar para a página desejada
        console.log('usuario esta logado')
        this.router.navigate(['/']);
      } else {
        console.log('usuario não esta logado')
        // Usuário não está logado
      }
    });
  }

  redirect(){
    this.router.navigate(['/user']);
  }

}
