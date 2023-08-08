import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  problem = ['Banco Quebrado','Mato grande', 'Falta de manutenção adequada', 'Descarte inadequado de lixo']

  mostrar: boolean = false;

  toggle () {
    console.log('clicou')
    this.mostrar = !this.mostrar;
  }
  constructor() { }

  ngOnInit() {
  }

}
