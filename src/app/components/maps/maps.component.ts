import { Component, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { RegisterService } from '../../services/register/register.service';
import { ToastrService } from 'ngx-toastr';

import * as L from 'leaflet';
import { MapService } from 'src/app/services/map/map.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent {

  location = "";
  reference = "";
  register_problem: string;
  register_solution: string;

  constructor(
    private registerService: RegisterService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private mapsservice: MapService,
    private router: Router ) {
  }
  ngOnInit(): void {
    const map = L.map('map').setView([-21.297604, -46.712075], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    this.mapsservice.getAllMarkers().subscribe(data => {
      data.forEach(markerData => {
        const marker = L.marker([markerData.lat, markerData.long]).addTo(map);
        
        marker.bindPopup(`
        <b>${markerData.Reference}</b>
        <br>${markerData.Location}</b><br>
        <button class="meuBotao">Resolvido</button>
        <button class="btn-primary">Não Resolvido</button>`);
      });
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('usuario esta logado')
        
      } else {
        this.toastr.error('Usuário não esta logado');
        this.router.navigate(['/login']);
        
      }
    });
  }

  problem = [
    { 'id': '1', 'name': 'Banco quebrado' },
    { 'id': '2', 'name': 'Poluição' },
    { 'id': '3', 'name': 'teste' }]

  solution = [
    { 'id': '1', 'name': 'Banco quebrado' },
    { 'id': '2', 'name': 'Poluição' },
    { 'id': '3', 'name': 'teste' }]
  map: any;

  popupContent = `
    <div>
        <h3>Título do Local</h3>
        <p>Descrição do local.</p>
        <img src="caminho/para/sua/imagem.jpg" alt="Imagem do Local" width="200">
        <button id="meuBotao">Resolvido</button>
        <button id="meuBotao">Não Resolvido</button>
    </div>
`;


  show: boolean = false;

  open() {
    this.show = true;
  }
  endForm() {
    this.show = false;
  }

  CreateRegister() {
    let msg = '';
    if (this.location === '' || this.location === undefined || this.location === null) {
      msg += 'O campo <b>Localização</b> é obrigatório.<br>';
    } 
    if (this.reference === '' || this.reference === undefined || this.reference === null) {
      msg += 'O campo <b>Referência</b> é obrigatório.<br>';
    }
    if (this.register_problem === '' || this.register_problem === undefined || this.register_problem === null) {
      msg += 'O campo <b>Tipo de Problema</b> é obrigatório.<br>';
    }
    if (msg !== '') {
      this.toastr.success(msg, 'Atenção!', { enableHtml: true });
    } else{
      try {
        let data = {};
        data['Location'] = this.location;
        data['Reference'] = this.reference;
        data['Register_problem'] = this.register_problem;
        data['Register_solution'] = this.register_solution;
        this.registerService.create_register(data).then(resp => {
          this.location = "";
          this.reference = undefined;
          this.register_problem = "";
          this.register_solution = "";
  
          this.toastr.success('Cadastrado com sucesso', 'Oops!');
        })
          .catch(error => {
            this.toastr.error('This is error toast.', 'Oops!');
            console.log(error);
          });
      }
      catch (error) {
        this.toastr.error('This is error toast.', 'Oops!');
        console.log(error);
      }
    }
    }
}


