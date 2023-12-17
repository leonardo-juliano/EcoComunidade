import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-loja',
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.css']
})
export class LojaComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
  }

  sendEmail(){
    this.toastr.success( 'Vamos enviar assim que uma loja se tornar parceira !', 'Fique atento ao seu email');

  }
}
