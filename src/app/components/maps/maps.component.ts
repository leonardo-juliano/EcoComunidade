import { Component, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { RegisterService } from '../../services/register/register.service';
import { ToastrService } from 'ngx-toastr';

import * as L from 'leaflet';
import { MapService } from 'src/app/services/map/map.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CityService } from 'src/app/services/city/city.service';


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
  parametro = '';
  greenAreasRouter = [];
  lat = 0;
  long = 0;

  show: boolean = false;

  constructor(
    private registerService: RegisterService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private mapsservice: MapService,
    private router: Router,
    private route: ActivatedRoute,
    private cityService: CityService) {
  }
  ngOnInit(): void {
    this.getGreenAreas();

    this.afAuth.authState.subscribe(user => {
      if (user) {
      } else {
        this.toastr.error('Usuário não esta logado');
        this.router.navigate(['/login']);

      }
    });

    this.route.params.subscribe((params) => {
      this.parametro = params['id'];
    });
  }

  getGreenAreas() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreasRouter = data;
      this.greenAreasRouter = this.greenAreasRouter.filter(green => green.city == this.parametro);
      this.lat = this.greenAreasRouter[0].lat;
      this.long = this.greenAreasRouter[0].long;
      this.markercity(this.lat,this.long)
    });
  }

  markercity(Lat, Long){
    const map = L.map('map').setView([Lat, Long], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    this.mapsservice.getAllMarkers().subscribe(data => {
      data.forEach(markerData => {
        const marker = L.marker([markerData.lat, markerData.long]).addTo(map);

        marker.bindPopup(`
        <div style="background-color: #fff; padding: 10px;">
            <p>${markerData.Reference}</p>
            <p>${markerData.Location}</p>
            <button class="buttonResolv">Resolvido</button>
            <button class="buttonNoResolv">Não Resolvido</button>
        </div>
        <div style="background-color: #fff; padding: 10px;">
        <button class="buttonResolv">Resolvido</button>
        </div>
        <style>
        p{
          text-align: center;
        }
        .buttonResolv,
        .buttonNoResolv {
            display: inline-block;
            padding: 10px 20px;
            color: #fff; /* Cor do texto */
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            transition: background-color 0.3s ease; /* Transição suave na cor de fundo */
        }
        .buttonResolv {
            background-color: #4CAF50; /* Cor de fundo */
        }
        .buttonResolv:hover {
            background-color: #46a049; /* Cor de fundo alterada */
        }
        .buttonNoResolv {
            background-color: red /* Cor de fundo */
        }
        .buttonNoResolv:hover {
            background-color: red /* Cor de fundo alterada */
        }
    </style>
    `);
      });
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

//   popupContent = `
//   <div>
//       <h3 style="color: red;">Título do Local</h3>
//       <p style="font-size: 16px;">Descrição do local.</p>
//       <img src="caminho/para/sua/imagem.jpg" alt="Imagem do Local" width="200">
//       <button class="meuBotao">Resolvido</button>
//       <button class="btn-primary">Não Resolvido</button>
//   </div>
// `;

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
    } else {
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


