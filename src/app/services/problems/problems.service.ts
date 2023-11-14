import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {

  constructor(
    private firestore: AngularFirestore
  ) { }


  getProblems(): Observable<any> {
    return this.firestore.collection('tasks', ref => ref.where('active', '==', 1)).snapshotChanges().pipe(map((problems) => {
      return problems.map((problem) => {
        return {
          id: problem.payload.doc.id,
          ...problem.payload.doc.data()
        }
      })
    }))
  }

  getProblemById(id): Observable<any> {
    return this.firestore.collection('tasks').doc(id).snapshotChanges().pipe(map((problem) => {
      return {
        id: problem.payload.id,
        ...problem.payload.data()
      }
  }))};

}
