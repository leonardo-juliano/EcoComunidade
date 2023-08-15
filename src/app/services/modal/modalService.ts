import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private RegisterComponent: any;

  setModalComponent(component: any) {
    this.RegisterComponent = component;
  }

  openModal() {
    if (this.RegisterComponent) {
      this.RegisterComponent.open();
    }
  }
}