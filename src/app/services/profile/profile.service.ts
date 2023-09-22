import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  buscarUsuarioPorEmail(email: string): Observable<any[]> {
    // Use o serviço AngularFirestore para criar uma consulta
    return this.firestore.collection('users', ref => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        // Mapeie os resultados para obter apenas os dados do documento
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
}
