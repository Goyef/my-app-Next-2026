import argon2i from 'argon2';

export const ArgonHash = async (password: string) => {
  try {
    const hashed = await argon2i.hash(password);
    return hashed;
  } catch (e) {
    console.log(e);
    return "false";
  }
};

export const ArgonVerify = async (hash: string, verify: string) => {
  try {
    const ok = await argon2i.verify(hash, verify);
    return !!ok;
  } catch (e) {
    console.log(e);
    return false;
  }
};