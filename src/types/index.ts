import { SignIn } from '@pages';


export interface ParamsType {
    limit: Number;
    search: string;
    page: Number
}

export interface ModalProps {
    open: boolean;
    handleClose: ()=> void
    updare: any
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
    sign_in: (data:SignIn)=> Promise<any>,
    sign_up: (data:SignUp)=> Promise<any> 
}


