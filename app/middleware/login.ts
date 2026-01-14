import { ILogin } from "@/app/interfaces/user";

export const MLogin = (user : ILogin) => {
    const {email, password} = user

    const a = []

    if (email.length >= 2 && email.length <=20) {
        a.push({error: true, message: "Email is not correct", code: "101"})
    }
  
    if (password.length >= 2 && password.length <=20) {
        a.push({error: true, message: "Password is not correct", code: "101"})
    }

    return a;
}