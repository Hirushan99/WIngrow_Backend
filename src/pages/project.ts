export interface MainCategory {
  id: string;
  category_name: string;
  visible: boolean;
}

export interface SubCategory {
  id: string;
  sub_category_name: string;
  main_category_id: string;
  main_category_name: string;
  visible: boolean;
}
