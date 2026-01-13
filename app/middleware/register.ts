import { IRegister } from "@/app/interfaces/user";

export const MRegister = (user : IRegister) => {
    const {firstname, lastname, email, password, confirmPassword} = user

    const a = []

    if (firstname.length >= 2 && firstname.length <=20) {
        a.push({error: true, message: "Firstname is not correct", code: "101"})
    }
    if (lastname.length >= 2 && lastname.length <=20) {
        a.push({error: true, message: "Lastname is not correct", code: "101"})
    }
    if (email.length >= 2 && email.length <=20) {
        a.push({error: true, message: "Email is not correct", code: "101"})
    }
    if (password.length >= 2 && password.length <=20) {
        a.push({error: true, message: "Password is not correct", code: "101"})
    }
    if (password != confirmPassword) {
        a.push({error: true, message: "Password is not correct", code: "101"})
    }

    return a;
}