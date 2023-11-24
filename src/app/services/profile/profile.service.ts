import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  buscarUsuarioPorEmail(email: string): Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }


  // gamificação
  buscarPontosPorUsuario(id: string): Observable<any[]> {
    return this.firestore.collection('users').doc(id).collection('pontos').snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }


  addPoints(email: string, pontos: number) {
    const query = this.firestore.collection('users', ref => ref.where('email', '==', email));
  
    query.get().pipe(
      take(1),
      switchMap((querySnapshot: any) => {
        if (querySnapshot && !querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const userPoints = 'pontos' in userData ? userData.pontos : 0;
          const totalPoints = userPoints + pontos;
  
          return userDoc.ref.update({ pontos: totalPoints });
        } else {
          console.error('Usuário não encontrado.');
          return [];
        }
      })
    ).subscribe(
      () => console.log('Pontos atualizados com sucesso.'),
      error => console.error('Erro ao atualizar pontos:', error)
    );
  }

  getUserByEmail(email): Observable<any> {
    return this.firestore.collection('users').doc(email).snapshotChanges().pipe(map((user) => {
      return {
        id: user.payload.id,
        ...user.payload.data()
      }
  }))};

  putColaborrator(email: string) {
    return this.firestore.collection('users').doc(email).update({
      colaborador: true,
    });
  }

}
