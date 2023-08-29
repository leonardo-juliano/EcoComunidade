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

  // metodo para buscar registros
  // read_register(){
  //   return this.firestore.collection('tasks').snapshotChanges();
  // }
  // getAll() {
  //   return this.firestore.collection('tasks')
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => {
  //         return changes.map(c => ({ location: c.location ...c.location.val() }));
  //       })
  //     );
  // }
  getAll(): Observable<any[]> {
    return this.firestore.collection('tasks').valueChanges({ idField: 'customId' });
  }
  
}
