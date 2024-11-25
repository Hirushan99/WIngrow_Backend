import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainCategoryComponent } from '../pages/main-category/main-category.component';
import { SubCategoryComponent } from '../pages/sub-category/sub-category.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MainCategoryComponent,
    SubCategoryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wingrow_backend';
}
