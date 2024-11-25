import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface MainCategory {
  id: string; // Document ID
  category_name: string; // Category name
  visible: boolean; // Visibility status
}

@Component({
  selector: 'app-main-category',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule for two-way binding
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss'],
})
export class MainCategoryComponent implements OnInit {
  categories$: Observable<MainCategory[]> | null = null;
  newCategory = { id: '', category_name: '' }; // Form data
  idExists = false; // Flag to track if ID exists
  isEditing = false; // Flag to track if editing mode is active

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    // Fetch data from 'main category' collection and filter visible categories
    const mainCategoryCollection = collection(this.firestore, 'main category');
    this.categories$ = collectionData<MainCategory>(mainCategoryCollection, { idField: 'id' }).pipe(
      map((categories: MainCategory[]) => categories.filter((category) => category.visible)) // Filter visible categories
    );
  }

  async checkIdExists(): Promise<void> {
    if (this.newCategory.id) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);

      // Check if the document exists
      const docSnapshot = await getDoc(categoryDoc);
      this.idExists = docSnapshot.exists(); // Update the flag based on the result
    } else {
      this.idExists = false; // Reset the flag if ID is empty
    }
  }

  async createCategory(): Promise<void> {
    if (this.newCategory.id && this.newCategory.category_name && !this.idExists) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);

      // Set the document with the specified ID and data
      await setDoc(categoryDoc, {
        category_name: this.newCategory.category_name,
        visible: true, // Default visibility
      });

      // Display success alert
      alert('Category created successfully!');

      // Clear the form
      this.resetForm();
    }
  }

  async editCategory(): Promise<void> {
    if (this.newCategory.id && this.newCategory.category_name) {
      const mainCategoryCollection = collection(this.firestore, 'main category');
      const categoryDoc = doc(mainCategoryCollection, this.newCategory.id);

      // Update the document
      await setDoc(categoryDoc, {
        category_name: this.newCategory.category_name,
        visible: true, // Keep visibility unchanged
      });

      // Display success alert
      alert('Category updated successfully!');

      // Clear the form and exit editing mode
      this.resetForm();
      this.isEditing = false;
    }
  }

  startEdit(category: MainCategory): void {
    this.newCategory = { id: category.id, category_name: category.category_name };
    this.isEditing = true;
    this.idExists = true; // Prevent category ID from being edited
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const mainCategoryCollection = collection(this.firestore, 'main category');
    const categoryDoc = doc(mainCategoryCollection, categoryId);

    // Update the visible property to false instead of deleting the document
    await updateDoc(categoryDoc, { visible: false });

    alert('Category hidden successfully!');
  }

  resetForm(): void {
    this.newCategory = { id: '', category_name: '' };
    this.idExists = false;
    this.isEditing = false;
  }
}
