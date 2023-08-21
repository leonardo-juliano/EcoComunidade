import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private firestore: AngularFirestore
  ) {  }

  create_register(register){
    return this.firestore.collection('tasks').add(register);
  }
}
