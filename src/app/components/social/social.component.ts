import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

  constructor() { }
  cards = [
    { title: 'Card 1', description: 'Description of Card 1', author: 'Author 1' },
    { title: 'Card 2', description: 'Description of Card 2', author: 'Author 2' },
    { title: 'Card 3', description: 'Description of Card 3', author: 'Author 3' }
  ];
  ngOnInit() {
  }

}
