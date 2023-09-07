import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  constructor(private cityService: CityService) { }

  items: any[];
  greenAreas = [];
  cities = [];
  citySelected='';
  greenSelected = [];

  ngOnInit() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });

    this.cityService.getCitys().subscribe(data => {
      this.cities = data;
    });
    this.onCityChange()
  }

  onCityChange() {
    console.log(this.citySelected);
  }

  getGrennAreas() {
    this.cityService.getGrennAreas().subscribe(data => {
      this.greenAreas = data;
    });
    
    this.greenSelected = this.greenAreas.filter(green => green.city == this.citySelected);

    console.log(this.greenSelected);

}
}