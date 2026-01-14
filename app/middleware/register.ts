import { IRegister } from "@/app/interfaces/user";

export const MRegister = (user: IRegister) => {
  const { firstname, lastname, email, password, confirmPassword } = user;

  const errors: Array<{ error: true; message: string; code: string }> = [];

  if (!firstname || firstname.length < 2 || firstname.length > 50) {
    errors.push({ error: true, message: "Firstname must be between 2 and 50 characters", code: "101" });
  }

  if (!lastname || lastname.length < 2 || lastname.length > 50) {
    errors.push({ error: true, message: "Lastname must be between 2 and 50 characters", code: "102" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ error: true, message: "L'email n'est pas valide", code: "103" });
  }

  if (!password || password.length < 8) {
    errors.push({ error: true, message: "Le mot de passe doit contenir au moins 8 caractères", code: "104" });
  }

//   if (password != confirmPassword) {
//     console.log("iciiiiiiiiiiiiiiiiiiii", password, confirmPassword);
//     errors.push({ error: true, message: "Passwords do not match", code: "105" });
//   }

  return errors;
};
