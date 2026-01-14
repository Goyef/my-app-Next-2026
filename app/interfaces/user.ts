export interface IRegister {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILogin {
    email: string;
    password: string;
}