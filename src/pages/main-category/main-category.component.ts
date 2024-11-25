import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MainCategory } from '../project';

@Component({
  selector: 'app-main-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss'],
})
export class MainCategoryComponent implements OnInit {
  categories$: Observable<MainCategory[]> | null = null;
  newCategory = { id: '', category_name: '' };
  idExists = false;
  isEditing = false;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {

    const mainCategoryCollection = collection(this.firestore, 'main category');
    this.categories$ = collectionData<MainCategory>(mainCategoryCollection, { idField: 'id' }).pipe(
      map((categories: MainCategory[]) => categories.filter((category) => category.visible))
    );
  }

  async checkIdExists(): Promise<void> {
    if (this.newCategory.id) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);


      const docSnapshot = await getDoc(categoryDoc);
      this.idExists = docSnapshot.exists();
    } else {
      this.idExists = false;
    }
  }

  async createCategory(): Promise<void> {
    if (this.newCategory.id && this.newCategory.category_name && !this.idExists) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);

      await setDoc(categoryDoc, {
        category_name: this.newCategory.category_name,
        visible: true,
      });

      alert('Category created successfully!');

      this.resetForm();
    }
  }

  async editCategory(): Promise<void> {
    if (this.newCategory.id && this.newCategory.category_name) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);


      await setDoc(categoryDoc, {
        category_name: this.newCategory.category_name,
        visible: true,
      });

      alert('Category updated successfully!');

      this.resetForm();
      this.isEditing = false;
    }
  }

  startEdit(category: MainCategory): void {
    this.newCategory = { id: category.id, category_name: category.category_name };
    this.isEditing = true;
    this.idExists = true;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const mainCategoryCollection = collection(this.firestore, 'main category');
    const categoryDoc = doc(mainCategoryCollection, categoryId);

    await updateDoc(categoryDoc, { visible: false });

    alert('Category hidden successfully!');
  }

  resetForm(): void {
    this.newCategory = { id: '', category_name: '' };
    this.idExists = false;
    this.isEditing = false;
  }
}
