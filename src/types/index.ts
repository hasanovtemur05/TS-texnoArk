import { SignIn } from '@pages';



export interface ParamsType {
    limit: number;
    search: string;
    page: number
}

export interface ModalProps {
    open: boolean;
    handleClose: ()=> void
    updare: unknown
} 

export interface SignIn {
    phone_number: string;
    password: string
}

export interface SignUp extends SignIn{
    first_name: string;
    last_name: string;
    email: string;

}

export interface AccessToken {
    access_token: string
}

export interface AuthRequest {
    sign_in: (data:SignIn)=> Promise<unknown>,
    sign_up: (data:SignUp)=> Promise<unknown> 
}

export interface Admin {
    content: string
    path: string
    icon: JSX.Element
}
export interface AuthResponse {
    tokens: {
        access_token: string;
        refresh_token?: string;
    };
}

// types.ts

// Category interfeýs
export interface Category {
    id: number;
    name: string;
    createdAt: number;
  }
  
  // API orqali keladigan Brand turi
  export interface BrandApiResponse {
    data: {
      brands: Brand[];
      count: number;
    };
  }
  
  // API uchun Brand turi
  export interface Brand {
    id: number;
    name: string;
    description: string;
    category_id: number;
    file?: string;
  }
  
  // Modal forma uchun Brand turi
  export interface BrandForm {
    id?: number;
    name: string;
    description: string;
    category_id: number;
    file?: File | null;
  }
  
  // Modal oynasi uchun props
  export interface BrandModalProps {
    open: boolean;
    handleClose: () => void;
    editingBrand: BrandForm | null;
    categories: Category[];
    getData: () => void;
  }
  
  // API chaqiriqlari uchun parametrlar
  export interface Params {
    search: string;
    page: number;
    limit: number;
  }
  

  