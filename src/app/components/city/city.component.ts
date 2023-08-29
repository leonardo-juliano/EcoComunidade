import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  constructor() { }
  items: any[];

  ngOnInit() {
  }


  cities = [
    {
      'name': 'Guaxupé - MG',
      id: 1,
      lat: -21.3050,
      Long: -46.7090,
    },
    {
      'name': 'Muzambinho - MG',
      id: 2,
      lat: -21.3050,
      Long: -46.7090,
    },
  ];
  squares = [
    {
      'name': 'Praça da Mogiana',
      id: 1,
      lat: -21.3050,
      Long: -46.7090,
    },
    {
      'name': 'Praça da do Centro',
      id: 2,
      lat: -21.3050,
      Long: -46.7090,
    },
  ]

}
