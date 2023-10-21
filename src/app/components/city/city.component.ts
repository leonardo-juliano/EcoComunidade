import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  constructor(
    private cityService: CityService,
    private router: Router,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,

    ) { }

  items: any[];
  greenAreas = [];
  cities = [];
  citySelected = '';
  greenSelected = [];
  lat: number;
  long: number;
  
  ngOnInit() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });

    this.cityService.getCitys().subscribe(data => {
      this.cities = data;
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
      } else {
        this.toastr.error('Usuário não esta logado');
        this.router.navigate(['/login']);
      }
    });
  }

  getGrennAreas() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });

    this.greenSelected = this.greenAreas.filter(green => green.city == this.citySelected);
  }

  sendParam() {
    if(this.greenSelected.length == 0 || this.citySelected === '') {
      this.toastr.warning('Preencha os campos corretamente');
    }else{
      this.router.navigate(['maps', this.greenSelected]);
    }
  }

  sendParam2() {
    this.router.navigate(['maps', this.lat + "," + this.long]);
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.sendParam2()
        this.toastr.success('Localização feita com sucesso !', 'Ebaa!');
      });
    } else {
      this.toastr.success('Erro ao buscar localização, Verifique a permissão de localização.', 'Oops!');
    }
  }

  redirect(){
    this.router.navigate(['/public_area']);
  }
}