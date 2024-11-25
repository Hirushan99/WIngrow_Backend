import { Routes } from '@angular/router';
import { MainCategoryComponent } from '../pages/main-category/main-category.component';
import { SubCategoryComponent } from '../pages/sub-category/sub-category.component';

export const routes: Routes = [
  {
    path: 'main-category',
    component: MainCategoryComponent
  },
  {
    path: 'sub-category',
    component: SubCategoryComponent
  }
];
