import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onFilterJobs(typeId: number, categoryId: number) {
    this.router.navigate(['/jobs'], {
      state: {
        typeId: typeId,
        categoryId: categoryId
      }
    });
  }
}
