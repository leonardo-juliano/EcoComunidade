import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private firestore: AngularFirestore
  ) {  }

  // Metodo para criar registros
  create_register(register){
    return this.firestore.collection('tasks').add(register);
  }
  getAll(): Observable<any[]> {
    return this.firestore.collection('tasks').valueChanges({ idField: 'customId' });
  }
  
}
