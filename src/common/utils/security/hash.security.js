import bcrypt from "bcrypt"

export const Hash = ({plain_text,salt_rounds} = {}) => {
    return bcrypt.hashSync(plain_text , Number(salt_rounds))
}

export const Compare = ({plain_text,cipher_text} = {}) => {
    return bcrypt.compareSync(plain_text,cipher_text)
}