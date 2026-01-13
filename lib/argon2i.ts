import argon2i from 'argon2';

export const ArgonHash = async (hash : string) => {
    try {
        await argon2i.hash(hash);
    } catch (e) {
        console.log(e)
        return "false"
    }
}

export const ArgonVerify = async (hash : string, verify : string) => {
     try {
        await argon2i.verify(hash, verify);
    } catch (e) {
        console.log(e)
        return "false"
    }
}