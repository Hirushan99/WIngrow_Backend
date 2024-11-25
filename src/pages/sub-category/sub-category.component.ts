import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MainCategory, SubCategory } from '../project';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent implements OnInit {

  idExists = false;
  mainCategories$: Observable<MainCategory[]> | null = null;
  subCategories$: Observable<SubCategory[]> | null = null;

  newSubCategory: Partial<SubCategory> = {
    id: '',
    sub_category_name: '',
    main_category_id: '',
  };
  isEditing = false;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const mainCategoryCollection = collection(this.firestore, 'main category');
    this.mainCategories$ = collectionData<MainCategory>(mainCategoryCollection);

    const subCategoryCollection = collection(this.firestore, 'sub category');
    const visibleSubCategoryQuery = query(subCategoryCollection, where('visible', '==', true));
    this.subCategories$ = collectionData<SubCategory>(visibleSubCategoryQuery, { idField: 'id' });
  }

  async checkIfIdExists(): Promise<void> {
    if (this.newSubCategory.id) {
      const subCategoryDoc = doc(collection(this.firestore, 'sub category'), this.newSubCategory.id);
      const snapshot = await getDoc(subCategoryDoc);
      this.idExists = snapshot.exists();
    } else {
      this.idExists = false;
    }
  }

  async createSubCategory(): Promise<void> {
    if (!this.idExists && this.newSubCategory.id && this.newSubCategory.sub_category_name && this.newSubCategory.main_category_name) {
      try {
        const subCategoryDoc = doc(collection(this.firestore, 'sub category'), this.newSubCategory.id);

        await setDoc(subCategoryDoc, {
          sub_category_name: this.newSubCategory.sub_category_name,
          main_category_name: this.newSubCategory.main_category_name,
          visible: true,
        });

        alert('Sub Category created successfully!');
        this.resetForm();
      } catch (error) {
        console.error('Error creating sub-category:', error);
      }
    }
  }

  async editSubCategory(): Promise<void> {
    if (this.newSubCategory.id && this.newSubCategory.sub_category_name && this.newSubCategory.main_category_name) {
      try {
        const subCategoryDoc = doc(collection(this.firestore, 'sub category'), this.newSubCategory.id);

        await updateDoc(subCategoryDoc, {
          sub_category_name: this.newSubCategory.sub_category_name,
          main_category_id: this.newSubCategory.main_category_id || null,
          main_category_name: this.newSubCategory.main_category_name,
          visible: true,
        });

        alert('Sub Category updated successfully!');
        this.resetForm();
        this.isEditing = false;
      } catch (error) {
        console.error('Error updating sub-category:', error);
        alert('An error occurred while updating the sub-category.');
      }
    } else {
      alert('Please ensure all required fields are filled in.');
    }
  }


  startEdit(subCategory: SubCategory): void {
    this.newSubCategory = {
      id: subCategory.id,
      sub_category_name: subCategory.sub_category_name,
      main_category_id: subCategory.main_category_id,
      main_category_name: subCategory.main_category_name,
    };
    this.isEditing = true;
  }


  async deleteSubCategory(subCategoryId: string): Promise<void> {
    const confirmDelete = window.confirm(
      'Are you sure you want to hide this sub-category?'
    );

    if (confirmDelete) {
      const subCategoryDoc = doc(collection(this.firestore, 'sub category'), subCategoryId);
      await updateDoc(subCategoryDoc, { visible: false });
      alert('Sub Category hidden successfully!');
    } else {
      alert('Action canceled.');
    }
  }


  async getMainCategory(mainCategoryId: string): Promise<MainCategory> {
    const mainCategoryDoc = doc(collection(this.firestore, 'main category'), mainCategoryId);
    const snapshot = await getDoc(mainCategoryDoc);

    if (!snapshot.exists()) {
      throw new Error(`Main category with ID '${mainCategoryId}' does not exist.`);
    }

    return snapshot.data() as MainCategory;
  }


  resetForm(): void {
    this.newSubCategory = { id: '', sub_category_name: '', main_category_id: '' };
    this.isEditing = false;
    this.idExists = false;
  }
}
