import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  address: string = '';
  phone: number;
  cep: number;
  city: string = '';
  collaborator= false;


  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  redirect(){
    this.router.navigate(['/login']);
  }

  register() {
    let msg = '';
    if (this.name === '' || this.name === undefined || this.name === null) {
      msg += 'O campo <b>NOME</b> é obrigatório.<br>';
    }
    if (this.phone === undefined || this.phone === null) {
      msg += 'O campo <b>TELEFONE</b> é obrigatório.<br>';
    }
    if (this.email === '' || this.email === undefined || this.email === null) {
      msg += 'O campo <b>EMAIL</b> é obrigatório.<br>';
    }
    if (this.password === '' || this.password === undefined || this.password === null) {
      msg += 'O campo <b>SENHA</b> é obrigatório.<br>';
    }
    if (msg !== '') {
      this.toastr.warning(msg, 'Atenção!', { enableHtml: true });
    } else {
      this.authService.registerUser(
        this.email,
        this.password,
        this.name,
        this.city,
        this.phone,
        this.city,
        this.collaborator
      )
        .then(() => {
          this.toastr.success('Usuário registrado com sucesso!');
          this.router.navigate(['/login']);          
        })
        .catch(error => {
          this.toastr.success('Erro inesperado!');
        });
    }
  }

}
