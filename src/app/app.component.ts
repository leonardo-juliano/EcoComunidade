import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // google maps zoom level
  zoom: number = 15;
  
  
  // initial center position for the map
  lat: number = -21.298382;
  lng: number = -46.711447;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }
  
  openForm(){
    document.getElementById("popup").classList.add("open");
  }

  endForm(){
    document.getElementById("popup").classList.remove("open");
    document.getElementById("popup").classList.add("end");
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  markers: marker[] = [
	  {
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
		  draggable: true
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
		  draggable: false
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
		  draggable: true
	  }
  ]

  marker_city(){
    this.markers.push(
      {lat: -21.297491,
		  lng:  -46.711780,
		  label: 'C',
		  draggable: true})
    console.log(this.markers)
  }
}

var video = document.querySelector('video');

navigator.mediaDevices.getUserMedia({video:true})
.then(stream => {
    video.srcObject = stream;
    video.play();
})
.catch(error => {
    console.log(error);
})


// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}


