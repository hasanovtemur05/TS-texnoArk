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


