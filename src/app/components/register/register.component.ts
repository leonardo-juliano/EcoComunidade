import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  mostrar: boolean = false;

  toggle () {
    console.log('clicou')
    this.mostrar = !this.mostrar;
  }
  constructor() { }

  ngOnInit() {
  }

}
