import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}

// var video = document.querySelector('video');

// navigator.mediaDevices.getUserMedia({video:true})
// .then(stream => {
//     video.srcObject = stream;
//     video.play();
// })
// .catch(error => {
//     console.log(error);
// })


// // just an interface for type safety.
// interface marker {
// 	lat: number;
// 	lng: number;
// 	label?: string;
// 	draggable: boolean;
// }


