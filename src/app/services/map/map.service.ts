import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    ) {}

  getAllMarkers(): Observable<any[]> {
    return this.firestore.collection('tasks').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        });
      })
    );
  }

  async getImageUrl(nomeDaImagem: string): Promise<string> {
    const ref = this.storage.storage.refFromURL(nomeDaImagem);
    try {
      const url = await ref.getDownloadURL();
      return url;
    } catch (error) {
      // Lida com erros aqui, se necessário.
      console.error('Erro ao buscar URL da imagem:', error);
      throw error;
    }
  }
}
