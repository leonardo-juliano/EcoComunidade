import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private firestore: AngularFirestore) {}

  getAllMarkers(): Observable<any[]> {
    return this.firestore.collection('tasks').valueChanges();
  }
}
