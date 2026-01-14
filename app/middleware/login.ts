import { ILogin } from "@/app/interfaces/user";

export const MLogin = (user : ILogin) => {
    const {email, password} = user

    const errors: any[] = []

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || email.length < 3 || email.length > 255 || !emailRegex.test(email)) {
        errors.push({error: true, message: "L'email n'est pas correct", code: "V01"})
    }

    // Basic password validation
    if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
        errors.push({error: true, message: "Mot de passe incorrect (min 8 caractères)", code: "V02"})
    }

    return errors;
} 