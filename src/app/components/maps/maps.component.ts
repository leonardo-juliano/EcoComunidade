import { Component, ViewChild, ElementRef } from '@angular/core';
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
import 'leaflet.heat';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent {
  location = "";
  reference = "";
  register_problem: string;
  register_status: string;
  parametro = '';
  greenAreasRouter = [];
  lat = 0;
  long = 0;
  active = 1;
  currentMarkerData: any;
  user = '';

  show: boolean = false;
  show_details: boolean = false;

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
    //verificar usuario que esta logado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user.email
      }
    });
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
      if (this.parametro.length > 9) {
        let latLong = this.parametro.split(',');
        this.lat = Number(latLong[0]);
        this.long = Number(latLong[1]);
        this.markercity(this.lat, this.long)
      } else {
        this.greenAreasRouter = this.greenAreasRouter.filter(green => green.city == this.parametro);
        this.lat = this.greenAreasRouter[0].lat;
        this.long = this.greenAreasRouter[0].long;
        this.markercity(this.lat, this.long)
      }

    });
  }

  markercity(Lat, Long) {
    const map = L.map('map').setView([Lat, Long], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    const heat = L.heatLayer([], { radius: 25 }).addTo(map);
    const coordenadasAdicionadas = {}; // Objeto para rastrear coordenadas já adicionadas
  
    this.mapsservice.getAllMarkers().subscribe(data => {
      data.forEach(markerData => {
        if (markerData['active'] !== 0) {
          const latLngKey = `${markerData.lat}_${markerData.long}`;
  
          // Verifique se as coordenadas já foram adicionadas
          if (!coordenadasAdicionadas[latLngKey]) {
            // Adicione as coordenadas ao objeto rastreador
            coordenadasAdicionadas[latLngKey] = true;
  
            // Criar um marcador
            const marker = L.marker([markerData.lat, markerData.long]).addTo(map);
  
            // Associar um evento de clique ao marcador
            marker.on('click', () => {
              // Lógica a ser executada quando o marcador é clicado
              console.log(markerData); // Exemplo: exibir dados do marcador no console
            });
  
            // Atualizar a camada de mapa de calor com os dados do marcador
            heat.addLatLng([markerData.lat, markerData.long, 20]);
            
            // Definir o conteúdo do popup
            marker.bindPopup(`
              <div style="background-color: #fff; padding: 10px;">
                <p>${markerData.Register_problem}</p>
                <p>${markerData.status}</p>
                <button class="buttonResolv" id="buttonResolv">Resolvido</button>
                <button class="buttonNoResolv">Não Resolvido</button>
              </div>
              <div class="details">
                <button class="buttonDetails">Detalhes</button>
              </div>
              <style>
                    p{
                      text-align: center;
                    }
                    .buttonResolv,
                    .buttonNoResolv {
                        display: inline-block;
                        color: #fff; 
                        border: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        cursor: pointer;
                        font-size: 16px;
                        text-align: center;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .buttonDetails {
                      color: #fff; 
                      border: none;
                      border-radius: 5px;
                      padding: 10px 20px;
                      cursor: pointer;
                      font-size: 16px;
                      text-align: center;
                      text-decoration: none;
                      transition: background-color 0.3s ease;
                      background-color: #4F4F4F;
                    }
                    .details{
                      display: flex;
                      justify-content: center;
                    }
                    .buttonResolv {
                        background-color: #4CAF50; 
                    }
                    .buttonResolv:hover {
                        background-color: #46a049; 
                    }
                    .buttonNoResolv {
                        background-color: red
                    }
                    .buttonNoResolv:hover {
                        background-color: red 
                    }
                </style>
            `);
          } else {
            // As coordenadas já foram adicionadas, aumente a latitude em 200 unidades
            const randomIncrementLat = 0.0010 + Math.random() * 0.0010;
            const randomIncrement = 0.0005 + Math.random() * 0.0005;
            const marker = L.marker([markerData.lat + randomIncrementLat, markerData.long + randomIncrement]).addTo(map);
  
            // Definir o conteúdo do popup para o novo marcador
            marker.bindPopup(`
              <div style="background-color: #fff; padding: 10px;">
                <p>${markerData.Register_problem}</p>
                <p>${markerData.status}</p>
                <button class="buttonResolv" id="buttonResolv">Resolvido2</button>
                <button class="buttonNoResolv">Não Resolvido</button>
              </div>
              <div class="details">
                <button class="buttonDetails">Detalhes</button>
              </div>
              <style>
                    p{
                      text-align: center;
                    }
                    .buttonResolv,
                    .buttonNoResolv {
                        display: inline-block;
                        color: #fff; 
                        border: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        cursor: pointer;
                        font-size: 16px;
                        text-align: center;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .buttonDetails {
                      color: #fff; 
                      border: none;
                      border-radius: 5px;
                      padding: 10px 20px;
                      cursor: pointer;
                      font-size: 16px;
                      text-align: center;
                      text-decoration: none;
                      transition: background-color 0.3s ease;
                      background-color: #4F4F4F;
                    }
                    .details{
                      display: flex;
                      justify-content: center;
                    }
                    .buttonResolv {
                        background-color: #4CAF50; 
                    }
                    .buttonResolv:hover {
                        background-color: #46a049; 
                    }
                    .buttonNoResolv {
                        background-color: red
                    }
                    .buttonNoResolv:hover {
                        background-color: red 
                    }
                </style>
            `);
          }
        }
      });
    });
  }
  

  // markercity(Lat, Long) {
  //   const map = L.map('map').setView([Lat, Long], 17);
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors'
  //   }).addTo(map);

  //   const heat = L.heatLayer([], { radius: 25 }).addTo(map);
  //   const heatmapData = [
  //     [-21.2993976, -46.7188515, 5],
  //     [-21.2993976, -46.7188515, 5] // Exemplo de dado de mapa de calor
  //     // Adicione mais dados de mapa de calor aqui
  //   ];

  //   const coordenadasAdicionadas = {}; // Objeto para rastrear coordenadas já adicionadas

  //   this.mapsservice.getAllMarkers().subscribe(data => {
  //     data.forEach(markerData => {

  //       // const heatmapData = data.map((item) => [
  //       //   item.latitude,
  //       //   item.longitude,
  //       //   item.intensity,
  //       // ]);
  //       if (markerData['active'] !== 0) {
  //         const latLngKey = `${markerData.lat}_${markerData.long}`;

  //         // Verifique se as coordenadas já foram adicionadas
  //         if (!coordenadasAdicionadas[latLngKey]) {
  //           // Adicione as coordenadas ao objeto rastreador
  //           coordenadasAdicionadas[latLngKey] = true;

  //           const marker = L.marker([markerData.lat, markerData.long]).addTo(map);

  //           marker.bindPopup(`
  //           <div style="background-color: #fff; padding: 10px;">
  //           <p>${markerData.Register_problem}</p>
  //           <p>${markerData.status}</p>
  //           <button class="buttonResolv" id ="buttonResolv" (click)="teste(${markerData})">Resolvido</button>
  //           <button class="buttonNoResolv">Não Resolvido</button>
  //       </div>
  //       <div class="details">
  //       <button class="buttonDetails">Detalhes</button>
  //       </div>
  //       <style>
  //       p{
  //         text-align: center;
  //       }
  //       .buttonResolv,
  //       .buttonNoResolv {
  //           display: inline-block;
  //           color: #fff; 
  //           border: none;
  //           border-radius: 5px;
  //           padding: 10px 20px;
  //           cursor: pointer;
  //           font-size: 16px;
  //           text-align: center;
  //           text-decoration: none;
  //           transition: background-color 0.3s ease;
  //       }
  //       .buttonDetails {
  //         color: #fff; 
  //         border: none;
  //         border-radius: 5px;
  //         padding: 10px 20px;
  //         cursor: pointer;
  //         font-size: 16px;
  //         text-align: center;
  //         text-decoration: none;
  //         transition: background-color 0.3s ease;
  //         background-color: #4F4F4F;
  //       }
  //       .details{
  //         display: flex;
  //         justify-content: center;
  //       }
  //       .buttonResolv {
  //           background-color: #4CAF50; 
  //       }
  //       .buttonResolv:hover {
  //           background-color: #46a049; 
  //       }
  //       .buttonNoResolv {
  //           background-color: red
  //       }
  //       .buttonNoResolv:hover {
  //           background-color: red 
  //       }
  //   </style>
  //           `);
  //         } else {
  //           // As coordenadas já foram adicionadas, aumente a latitude em 200 unidades
  //           const randomIncrementLat = 0.0010 + Math.random() * 0.0010;
  //           const randomIncrement = 0.0005 + Math.random() * 0.0005;
  //           const marker = L.marker([markerData.lat + randomIncrementLat, markerData.long + randomIncrement]).addTo(map);

  //           marker.bindPopup(`
  //           <div style="background-color: #fff; padding: 10px;">
  //           <p>${markerData.Register_problem}</p>
  //           <p>${markerData.status}</p>
  //           <button class="buttonResolv" id ="buttonResolve">Resolvido2</button>
  //           <button class="buttonNoResolv" (click)="teste()>Não Resolvido</button>
  //                 </div>
  //                 <div class="details" (click)="teste()>
  //                 <button class="buttonDetails" (click)="teste()">Detalhes</button>
  //                 </div>
  //               <style>
  //               p{
  //                 text-align: center;
  //               }
  //               .buttonResolv,
  //               .buttonNoResolv {
  //                   display: inline-block;
  //                   color: #fff; 
  //                   border: none;
  //                   border-radius: 5px;
  //                   padding: 10px 20px;
  //                   cursor: pointer;
  //                   font-size: 16px;
  //                   text-align: center;
  //                   text-decoration: none;
  //                   transition: background-color 0.3s ease;
  //               }
  //               .buttonDetails {
  //                 color: #fff; 
  //                 border: none;
  //                 border-radius: 5px;
  //                 padding: 10px 20px;
  //                 cursor: pointer;
  //                 font-size: 16px;
  //                 text-align: center;
  //                 text-decoration: none;
  //                 transition: background-color 0.3s ease;
  //                 background-color: #4F4F4F;
  //               }
  //               .details{
  //                 display: flex;
  //                 justify-content: center;
  //               }
  //               .buttonResolv {
  //                   background-color: #4CAF50; 
  //               }
  //               .buttonResolv:hover {
  //                   background-color: #46a049; 
  //               }
  //               .buttonNoResolv {
  //                   background-color: red
  //               }
  //               .buttonNoResolv:hover {
  //                   background-color: red 
  //               }
  //           </style>

  //           `);
  //             }
  //       }
  //     });
  //   });
  // }

  
  

  teste(markerData) {
    // Aqui você pode acessar os valores do popup do marcador
    console.log('Registro do problema:', markerData.Register_problem);
    console.log('Status:', markerData.status);
  
    // Faça o que quiser com os valores do popup
  }
  problem = [
    { 'id': '1', 'name': 'POLUIÇÃO' },
    { 'id': '2', 'name': 'DEGRADAÇÃO' },
    { 'id': '3', 'name': 'LIXO E DESCARTE INADEQUADO DE LIXO' },
    { 'id': '4', 'name': 'BANCO QUEBRADO' },
    { 'id': '5', 'name': 'OUTRO(S)' }
  ]

  status = [
    { 'id': '1', 'name': 'RESOLVIDO' },
    { 'id': '2', 'name': 'NÃO RESOLVIDO' },
    { 'id': '3', 'name': 'EM ANDAMENTO' },
    { 'id': '4', 'name': 'OUTRO(S)' }
  ]

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  map: any;

  details(marker_data) {
    console.log(marker_data);
    this.open_details();
    this.end_details();
  }

  open() {
    this.show = true;
  };

  open_details() {
    this.show_details = true;
  }

  end_details() {
    this.show_details = false;
  }

  endForm() {
    this.show = false;
  };

  CreateRegister() {
    let msg = '';
    if (this.register_problem === '' || this.register_problem === undefined || this.register_problem === null) {
      msg += 'O campo <b>Tipo de Problema</b> é obrigatório.<br>';
    }
    console.log('user', this.auth)
    if (msg !== '') {
      this.toastr.success(msg, 'Atenção!', { enableHtml: true });
    } else {
      try {
        let data = {};
        data['lat'] = this.lat;
        data['long'] = this.long;
        data['Register_problem'] = this.register_problem;
        data['status'] = this.register_status;
        data['date'] = new Date();
        data['user'] = this.user;

        this.registerService.create_register(data).then(resp => {
          this.register_problem = '';
          this.register_status = '';
          this.endForm();
          this.toastr.success('Cadastrado com sucesso', 'Oops!');
          this.getGreenAreas()
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


