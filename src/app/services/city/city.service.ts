import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private firestore: AngularFirestore) { }

  getGrennAreas(): Observable<any[]> {
    return this.firestore.collection('green_area').valueChanges();
  }

  getCitys(): Observable<any[]> {
    return this.firestore.collection('city').valueChanges();
  }
}
