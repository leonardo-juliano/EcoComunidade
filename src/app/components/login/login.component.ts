import { Component, OnInit } from '@angular/core';
import { ToastrServiceService } from 'src/app/services/toastr/toastr-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toastrService: ToastrServiceService) { }

  showWarning() {
    this.toastrService.showWarning('teste', 'Atenção!', {enableHTML: true});
  } 

  ngOnInit() {
  }

}
