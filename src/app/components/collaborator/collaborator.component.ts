import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.css']
})
export class CollaboratorComponent implements OnInit {

  email: string = '';
  password: string = '';
  name: string = '';
  address: string = '';
  phone: number;
  cep: number;
  city: string = '';
  collaborator= true;
  selectedService = [];

dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  user_services = 'Todos';


  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'VOLUNTÁRIO' },
      { item_id: 2, item_text: 'JARDINEIRO' },
      { item_id: 3, item_text: 'LIMPEZA' },
      { item_id: 4, item_text: 'RECICLAGEM' },
      { item_id: 5, item_text: 'OUTRO(S)' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Todos',
      unSelectAllText: 'Selecionar Serviços',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  services = [
    { 'id': '1', 'name': 'VOLUNTÁRIO' },
    { 'id': '2', 'name': 'JARDINEIRO' },
    { 'id': '3', 'name': 'LIMPEZA' },
    { 'id': '4', 'name': 'RECICLAGEM' },
    { 'id': '5', 'name': 'OUTRO(S)' }
  ];


  redirect(){
    this.router.navigate(['/login']);
  }

  register() {
    let msg = '';
    console.log(this.selectedService)
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
      this.authService.registerUserCollaborator(
        this.email,
        this.password,
        this.name,
        this.city,
        this.phone,
        this.city,
        this.collaborator,
        this.user_services,
        this.selectedService
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
