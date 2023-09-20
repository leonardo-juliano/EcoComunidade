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
  greenSelected = [];
  latitude: number;
  longitude: number;

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

  getGrennAreas() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });

    this.greenSelected = this.greenAreas.filter(green => green.city == this.citySelected);
  }

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

  redirect(){
    this.router.navigate(['/city']);
  }

}
