import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  constructor(private cityService: CityService,
    private router: Router) { }

  items: any[];
  greenAreas = [];
  cities = [];
  citySelected = '';
  greenSelected = [];
  
  ngOnInit() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });

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

  sendPAram() {
    this.router.navigate(['maps', this.greenSelected]);
  }
}