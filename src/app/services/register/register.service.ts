import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  storage: any;

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
  delete(id: string): Promise<void> {
    return this.firestore.collection('tasks').doc(id).delete();
  }
  update(id: string): Promise<void> {
    return this.firestore.collection('tasks').doc(id).update({active : 0});
  }
  getImageUrl(path: string) {
    return this.storage.ref(path).getDownloadURL();
  }
  
}
