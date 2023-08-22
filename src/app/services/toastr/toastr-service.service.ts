import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToastrServiceService {

  constructor(private toastr: ToastrManager) { }

  showSuccess(msg:string, header:string, option: any) {
    this.toastr.successToastr(msg, header, option);
  }

  showError(msg:string, header:string, option: any) {
    this.toastr.errorToastr(msg, header, option);
  }

  showWarning(msg:string, header:string, option: any) {
    this.toastr.warningToastr(msg, header, option);
  }
}
