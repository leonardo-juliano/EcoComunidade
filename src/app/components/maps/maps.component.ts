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
import { AngularFireStorage } from '@angular/fire/storage';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';



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
  photo = false;
  imageName = 'imageTeste';
  imageFormat = 'image/jpeg';

  //variaveis do detalhes
  name_problems: string;
  status_problems: string;
  date_problems: string;
  user_problems: string;
  name_description: string;
  lat_problem: string;
  long_problem: string;

  selectedFile: File;
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage = null;



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
    private cityService: CityService,
    private storage: AngularFireStorage) {
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

  photoPrint() {
    this.photo = true;
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  // handleImage(webcamImage: WebcamImage): void {
  //   console.info('Saved webcam image', webcamImage);
  //   this.webcamImage = webcamImage;
  //   // this.uploadImageFromURL(this.webcamImage.imageAsDataUrl, 'gs://eco-comunidade.appspot.com/');
  //   this.handleCapturedImage(webcamImage);
  // }

  // handleCapturedImage(webcamImage: WebcamImage) {
  //   this.webcamImage = webcamImage;
  //   const arr = this.webcamImage.imageAsDataUrl.split(",");
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   const u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   const file: File = new File([u8arr], this.imageName, { type: this.imageFormat })
  //   console.log(file);  
  //   this.uploadImageFromURL(file);
  // }

  // uploadImageFromURL(url) {
  //   // Crie uma referência para o local no Firebase Storage onde deseja salvar a imagem
  //   console.log(url)
  //   const filename = `gs://eco-comunidade.appspot.com`;
  //   const storageRef = this.storage.ref(filename);
  //   console.log(storageRef)

  //   // Use o método `putString` para salvar a imagem da URL no Firebase Storage
  //   fetch(url)
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const file = new File([blob], filename);
  //       return storageRef.put(file);
  //     })
  //     .then(uploadTask => {
  //       // A imagem foi salva com sucesso no Firebase Storage
  //       console.log('Imagem salva com sucesso:', uploadTask);
  //     })
  //     .catch(error => {
  //       // Trate qualquer erro que possa ocorrer
  //       console.error('Erro ao salvar a imagem:', error);
  //     });
  // }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  markercity(Lat, Long) {
    const map = L.map('map').setView([Lat, Long], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const heat = L.heatLayer([], { radius: 25 }).addTo(map);
    const coordenadasAdicionadas = {}; // Objeto para rastrear coordenadas já adicionadas

    this.mapsservice.getAllMarkers().subscribe(data => {
      console.log('testeee',data)
      data.forEach(markerData => {
        console.log('testeee',markerData)
        

        if (markerData.data['active'] !== 0) {
          heat.addLatLng([markerData.data.lat, markerData.data.long, 7]);

          const latLngKey = `${markerData.data.lat}_${markerData.data.long}`;
          if (!coordenadasAdicionadas[latLngKey]) {
            coordenadasAdicionadas[latLngKey] = true;
            const marker = L.marker([markerData.data.lat, markerData.data.long]).addTo(map);
            marker.bindPopup(`
              <div style="background-color: #fff; padding: 10px;">
                <p><strong>Problema: </strong> ${markerData.data.Register_problem}</p>
                <p><strong>Status: </strong> ${markerData.data.status}</p>
                <button class="buttonResolv">Resolvido</button>
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

            marker.on('click', () => {
              let markerDetails2 = markerData;

              const popup = marker.getPopup();
              // Adicione ouvintes de eventos aos botões dentro do popup
              const buttonResolv = popup.getElement().querySelector('.buttonResolv');
              const buttonNoResolv = popup.getElement().querySelector('.buttonNoResolv');
              const buttonDetails = popup.getElement().querySelector('.buttonDetails');

              buttonResolv.addEventListener('click', () => {
                this.problemResolv(markerDetails2);
              });
              buttonNoResolv.addEventListener('click', () => {
                this.problemNoResolv(markerDetails2);
              });
              buttonDetails.addEventListener('click', () => {
                this.problemDetails(markerDetails2);
              }
              );
            });
          } else {
            const randomIncrementLat = 0.0010 + Math.random() * 0.0010;
            const randomIncrement = 0.0005 + Math.random() * 0.0005;

            const marker = L.marker([markerData.data.lat + randomIncrementLat, markerData.data.long + randomIncrement]).addTo(map);

            heat.addLatLng([markerData.data.lat, markerData.data.long, 7]);

            marker.bindPopup(`
              <div style="background-color: #fff; padding: 10px;">
                <p><strong>Problema: </strong>${markerData.data.Register_problem}</p>
                <p><strong>Status: </strong>${markerData.data.status}</p>
                <button class="buttonResolv" id="buttonResolv" (click)="testando()">Resolvido</button>
                <button class="buttonNoResolv" (click)="testando()">Não Resolvido</button>
              </div>
              <div class="details">
                <button class="buttonDetails" (click)="testando()">Detalhes</button>
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
            marker.on('click', () => {
              console.log(markerData);
              let markerDetails2 = markerData;

              const popup = marker.getPopup();
              // Adicione ouvintes de eventos aos botões dentro do popup
              const buttonResolv = popup.getElement().querySelector('.buttonResolv');
              const buttonNoResolv = popup.getElement().querySelector('.buttonNoResolv');
              const buttonDetails = popup.getElement().querySelector('.buttonDetails');

              buttonResolv.addEventListener('click', () => {
                this.problemResolv(markerDetails2);
              });
              buttonNoResolv.addEventListener('click', () => {
                this.problemNoResolv(markerDetails2);
              });
              buttonDetails.addEventListener('click', () => {
                this.problemDetails(markerDetails2);
              }
              );
            });
          }
        }
      });
    });
  }

  problemDetails(markerData) {
    this.show_details = true;
    this.name_problems = markerData.data.Register_problem;
    this.status_problems = markerData.data.status;
    this.date_problems = markerData.data.date;
    this.user_problems = markerData.data.user;
    this.lat_problem = markerData.data.lat;
    this.long_problem = markerData.data.long;


  }
  problemNoResolv(markerData) {

  }

  problemResolv(markerData) {
    console.log('entrei')
    this.registerService.update(markerData.id).then(resp => {
      this.toastr.success('Atualizado com sucesso', 'Oops!');
    }
    )
      .catch(error => {
        this.toastr.error('This is error toast.', 'Oops!');
        console.log(error);
      });
  }


  handleButtonClick(action: string) {
    if (action === 'resolvido') {
      // Lógica quando o botão "Resolvido" é clicado
      console.log('Marcador resolvido.');
    } else if (action === 'naoresolvido') {
      // Lógica quando o botão "Não Resolvido" é clicado
      console.log('Marcador não resolvido.');
    }
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
          this.toastr.success('Cadastrado com sucesso');
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


