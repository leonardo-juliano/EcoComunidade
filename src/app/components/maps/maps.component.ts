import { Component, ViewChild, ElementRef } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { RegisterService } from '../../services/register/register.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';


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
  greenActive = '';
  currentMarkerData: any;
  user = '';
  photo = false;
  imageName = 'imageTeste';
  imageFormat = 'image/jpeg';
  dataFormatada = '';

  //variaveis do detalhes
  name_problems: string;
  description_details: string;
  status_problems: string;
  date_problems: string;
  user_problems: string;
  description_problem: string;
  lat_problem: string;
  long_problem: string;

  imageUrl: string;

  map: any;

  selectedImage: File | null = null;


  selectedFile: File;
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage = null;
  imageUrls: string[] = [];


  imageSrc: Observable<string | null>;

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
    private locations: Location,
    private storage: AngularFireStorage,) {
    // this.loadImages();
    // const imagePath = '/images/Capturar-removebg-preview (1).png'; // O caminho da imagem no Firebase Storage
    // const imageRef = this.storage.ref(imagePath);
    // this.imageSrc = imageRef.getDownloadURL(); // Obtém o URL de download da imagem

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
    const imagePath = 'gs://eco-comunidade.appspot.com/images/16953520157182170911817861569941.jpg';
    this.registerService.getImageUrl(imagePath).subscribe((url) => {
      this.imageUrl = 'gs://eco-comunidade.appspot.com/images/16953520157182170911817861569941.jpg';
    });
  }



  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  uploadImage(): void {
    if (this.selectedImage) {
      const filePath = `/images/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).then(() => {
        console.log('Imagem enviada com sucesso!');
      });
    } else {
      console.error('Nenhuma imagem selecionada.');
    }
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
        this.greenAreasRouter = this.greenAreasRouter.filter(green => green.code == this.parametro);
        this.greenActive = this.greenAreasRouter[0].name;
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

  markercity(Lat, Long) {
    const map = L.map('map').setView([Lat, Long], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const heat = L.heatLayer([], { radius: 25 }).addTo(map);
    const coordenadasAdicionadas = {};

    this.mapsservice.getAllMarkers().subscribe(data => {
      data.forEach(markerData => {
        if (markerData.data['active'] !== 0) {
          const latLngKey = `${markerData.data.lat}_${markerData.data.long}`;
          if (!coordenadasAdicionadas[latLngKey]) {
            coordenadasAdicionadas[latLngKey] = true;
            const marker = L.marker([markerData.data.lat, markerData.data.long]).addTo(map);
            heat.addLatLng([markerData.data.lat, markerData.data.long, 2]);

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
                const date = markerDetails2.data.date.toDate();
                this.dataFormatada = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                this.problemDetails(markerDetails2);
              }
              );
            });
          } else {
            const randomIncrementLat = 0.0001 + Math.random() * 0.0001;
            const randomIncrement = 0.0001 + Math.random() * 0.0001;
            const marker = L.marker([markerData.data.lat + randomIncrementLat, markerData.data.long + randomIncrement]).addTo(map);
            heat.addLatLng([markerData.data.lat, markerData.data.long, 4]);

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
    this.description_details = markerData.data.description;
    this.status_problems = markerData.data.status;
    this.date_problems = markerData.data.date;
    this.user_problems = markerData.data.user;
    this.lat_problem = markerData.data.lat;
    this.long_problem = markerData.data.long;
    // if(markerData.data.image){
    //   const imagePath = 'gs://eco-comunidade.appspot.com/images/' + markerData.data.image;
    //   console.log(imagePath)
    //   this.registerService.getImageUrl(imagePath).subscribe((url) => {
    //     this.imageUrl = 'gs://eco-comunidade.appspot.com/images/' + markerData.data.image;
    //   })
    // }
  }

  // loadImages() {
  //   // Chame o serviço para obter as URLs das imagens no Firebase Storage
  //   this.registerService.getDownloadURL('/image/').subscribe((url) => {
  //     if (url) {
  //       this.imageUrls.push(url);
  //     }
  //   });
  // }
  problemNoResolv(markerData) {

    this.toastr.warning('Obrigado pelo Feedback.', 'Vamos colocar em nossa lista de prioridades !');

  }

  problemResolv(markerData) {
    this.registerService.update(markerData.id).then(resp => {
      this.toastr.success('Atualizado com sucesso', 'Obrigado por resolver o problema !');
      this.reloadPage();
    }
    )
      .catch(error => {
        this.toastr.error('This is error toast.', 'Oops!');
        console.log(error);
      });
  }

  reloadPage() {
    this.locations.go(this.locations.path());
  }

  problem = [
    { 'id': '1', 'name': 'POLUIÇÃO' },
    { 'id': '2', 'name': 'DEGRADAÇÃO' },
    { 'id': '3', 'name': 'LIXO E DESCARTE INADEQUADO DE LIXO' },
    { 'id': '4', 'name': 'FOGO' },
    { 'id': '5', 'name': 'ACESSIBILIDADE' },
    { 'id': '6', 'name': 'MANUTENÇÃO' },
    { 'id': '7', 'name': 'OUTRO(S)' }
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


  details(marker_data) {
    console.log(marker_data)
    const date = marker_data.data.date.toDate();
    this.dataFormatada = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

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
    if (msg !== '') {
      this.toastr.success(msg, 'Atenção!', { enableHtml: true });
    } else {
      try {
        let data = {};
        data['lat'] = this.lat;
        data['long'] = this.long;
        data['Register_problem'] = this.register_problem;
        data['date'] = new Date();
        data['user'] = this.user;
        data['description'] = this.description_problem
        if (this.greenActive) {
          data['greenArea'] = this.greenActive;
        }
        data['status'] = 'PENDENTE';
        if (this.selectedImage) {
          data['image'] = this.selectedImage.name;
        }

        this.registerService.create_register(data).then(resp => {
          this.register_problem = '';
          this.register_status = '';
          this.description_problem = '';

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


