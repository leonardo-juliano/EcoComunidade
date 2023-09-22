import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  error: any;

  constructor(
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
  ) {}
  registerUser(email: string, password: string, name: string, address: string, phone: number, city: string, collaborator: boolean) {
    return auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
  
        // Salvar informações adicionais no Firestore
        return this.firestore.collection('users').doc(user.uid).set({
          name: name,
          address: address,
          phone: phone,
          city: city,
          email: email,
          collaborator: collaborator,
        });
      });
  }
  registerUserCollaborator(email: string, password: string, name: string, address: string, phone: number, city: string, collaborator: boolean, user_services: string, selectedService: any) {
    return auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
  
        // Salvar informações adicionais no Firestore
        return this.firestore.collection('users').doc(user.uid).set({
          name: name,
          address: address,
          phone: phone,
          city: city,
          email: email,
          collaborator: collaborator,
          user_services: user_services,
          selectedService: selectedService,
        });
      });
  }

  getUid() {
    return this.auth.auth.currentUser.uid;
  }




  async login(email: string, password: string) {
    try {
      const result = await this.auth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.toastr.success('Usuário Logado com sucesso');
      return result;
    } catch (error) {
      this.toastr.error('Preencher Email e Senha');
      this.error = error;
    }
  }

  async signOut() {
    try {
      await this.auth.auth.signOut();
    } catch (error) {
      this.toastr.error('Erro ao deslogar');
      this.error = error;
    }
  }
}
