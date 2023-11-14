import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProblemsService } from '../../services/problems/problems.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {
  problemsDetails = [];
  displayedColumns: string[] = ['type', 'local', 'urgente', 'status', 'date', 'image', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(); // Não precisa passar nada aqui
  show_details = false;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private problemsService: ProblemsService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.problemsService.getProblems().subscribe((problems) => {
      this.problemsDetails = problems;
      this.dataSource.data = problems; // Atualize os dados do MatTableDataSource aqui
      console.log('teste', this.problemsDetails);
    });
  }

  viewDetails(problem){
    this.problemsService.getProblemById(problem).subscribe((problems) => {
      this.problemsDetails = problems;
      console.log('teste', this.problemsDetails);
  });
  this.show_details = true; 
  }
}
