import { Component, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { RegisterService } from '../../services/register/register.service';
import { ToastrServiceService } from 'src/app/services/toastr/toastr-service.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent {

  location= "";
  reference = "";
  register_problem: string;
  register_solution:string;

  constructor(
    private registerService: RegisterService,
    private toastrService: ToastrServiceService) {
  }
  map: any;

  problem = [
    {'id': '1', 'name': 'Banco quebrado'},
    {'id': '2', 'name': 'Poluição'},
    {'id': '3', 'name': 'teste'}]

  solution = [
    {'id': '1', 'name': 'Banco quebrado'},
    {'id': '2', 'name': 'Poluição'},
    {'id': '3', 'name': 'teste'}]

  show: boolean = false;

  open () {
    this.show = true;
  }     
  endForm(){
    this.show = false;
  }

  ngOnInit(): void {
    const map = L.map('map').setView([-21.297604, -46.712075], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // L.marker([51.5, -0.09]).addTo(map)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup();
  }

  mostrarMensagem() {
    this.toastrService.showWarning('teste', 'Atenção!', {enableHTML: true});
    alert('teste');
  }

  CreateRegister() {

    try{
      let data = {};
      data['Location'] = this.location;
      data['Reference'] = this.reference;
      data['Register_problem'] = this.register_problem;
      data['Register_solution'] = this.register_solution;
      this.registerService.create_register(data).then(resp => {
        this.location="";
        this.reference= undefined;
        this.register_problem = "";
        this.register_solution = "";
    })
    .catch(error => {
      // this.toastr.errorToastr('This is error toast.', 'Oops!');
      // console.log(error);
    });
  }
  catch(error){
    // this.toastr.errorToastr('This is error toast.', 'Oops!');
    // console.log(error);
  }
  }
}


