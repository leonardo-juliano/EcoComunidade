import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CityService } from 'src/app/services/city/city.service';


@Component({
  selector: 'app-public-area',
  templateUrl: './public-area.component.html',
  styleUrls: ['./public-area.component.css']
})
export class PublicAreaComponent implements OnInit {
  items: any[];
  greenAreas = [];
  cities = [];
  citySelected = '';
  name = '';
  adress = '';
  latitude = 0;
  longitude = 0;

  constructor(
    private cityService: CityService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.cityService.getCitys().subscribe(data => {
      this.cities = data;
    });
  }

  // getGrennAreas() {
  //   this.cityService.getGrennAreas().subscribe(data => {
  //     this.greenAreas = data;
  //   });

  //   this.greenSelected = this.greenAreas.filter(green => green.city == this.citySelected);
  // }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.toastr.success('Localização feita com sucesso !', 'Ebaa!');
      });
    } else {
      this.toastr.success('Erro ao buscar localização, Verifique a permissão de localização.', 'Oops!');
    }
  }

  registerGreenArea() {
    let msg = '';
    if (this.citySelected == '') {
      msg += 'Selecione uma cidade';
    }
    if (this.name == '') {
      msg += 'Informe o nome da área verde pública';
    }
    if (this.adress == '') {
      msg += 'Informe um endereço.';
    }
    if (msg === '') {
      if(this.latitude == 0 || this.longitude == 0){
        this.toastr.warning('Área verde pública terá que ser aceita por um dos colaboradores', 'Oops!');
      }
    this.cityService.createGreenArea({
      code : Math.floor(Math.random() * 10000),
      city: this.citySelected,
      name: this.name,
      adress: this.adress,
      lat: this.latitude,
      long: this.longitude
    }).then(() => {
      this.toastr.success('Área verde cadastrada com sucesso !', 'Ebaa!');
      this.redirect();
    }).catch(() => {
      this.toastr.error('Erro ao cadastrar área verde, tente novamente mais tarde.', 'Oops!');
    });
    } else {
      this.toastr.warning(msg, 'Verificar os seguintes campos!');
    }
  }

  redirect(){
    this.router.navigate(['/city']);
  }

}
