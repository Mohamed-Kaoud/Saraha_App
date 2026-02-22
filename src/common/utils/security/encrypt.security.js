import crypto from "node:crypto"
import { ENCRYPTION_KEY } from "../../../../config/config.service.js"

const ENCRYPTION_KEY_Buffer = crypto
  .createHash("sha256")
  .update(ENCRYPTION_KEY)
  .digest()
const IV_LENGTH = 16

export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv("aes-256-cbc",ENCRYPTION_KEY_Buffer,iv)

    let encrypted = cipher.update(text,"utf8","hex")

    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
}

export function decrypt(text) {
    const [ivHex,encryptedText] = text.split(":")

    const iv = Buffer.from(ivHex,"hex")

    const decipher = crypto.createDecipheriv("aes-256-cbc",ENCRYPTION_KEY_Buffer,iv)

    let decrypted = decipher.update(encryptedText,"hex","utf8")

    decrypted += decipher.final("utf8")

    return decrypted
}

//Asymmetric encryption & decryption after search
const PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1L0q4Ev1Cn0Wd+3+UEGx
kMcbAQXWkFGP0TZ+IUl3zxQkccqZ9L/3U8lU9FhZ7/Ymv6tPZqZyD9ZVn9TpMJlT
9uN9H5g+cFOdUo9sXaxP+Gd5dY5e0jCmF6Z8gQyF+0+kbL0nOSNVG4EBkWnZyEd9
lQlBqYtE+Tn7F0yQ5tBChn+zI59Hgy30EcdGf5fU1X+jA4gk2YlFqN8j4jMJ+3Mw
VcfVJgUQ0sK9k6R0qKnCn1B+ISpP1qxE5yP2zUj3VHwqRfM0Vq1RtDqHTQ+J+jli
w7hXK3fDjk7BGN+OQvFzOBy2q3NKn6JhIXbZ3nV9eN1Z4Yk+0cv+4L1+aHGGJd0s
6wIDAQAB
-----END PUBLIC KEY-----
`;

const PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUvSrgS/UKfRZ3
7f5QQbGQxxsBBeaQUY/ RNl4hSXfPFCRxypn0v/dTyVT0WFnv9ia/q09mpnIP1lWf
1OkwmVP241fD+YPnBTnVKO2xdrE/4Z3l1jl7SMKYXpn yBDIX7T6RsvSc5I1UbgQG
RadhR33ZUCUGpi0T5OfsXTIQ5tBChn+zI59Hgy30EcdGf5fU1X+jA4gk2YlFqN8j4
jMJ+3MwVcfVJgUQ0sK9k6R0qKnCn1B+ISpP1qxE5yP2zUj3VHwqRfM0Vq1RtDqHT
Q+J+jliw7hXK3fDjk7BGN+OQvFzOBy2q3NKn6JhIXbZ3nV9eN1Z4Yk+0cv+4L1+a
HGGJd0s6wIDAQABAoIBAQCdTkrYg8h4uYdU7HTbb+4uJr2gK88hLr5aY7vR91hQc
kL57V4Hk9C8vEoUGuhGk7+L5RjvlVZ+lKkVlUu9Dpz1OPL8uRlp6XQOnR7Y93eU3
2Kvq1dxPZqI47q1K3/OX6hlvZ37zv2PQ6i4+Z7MTs4bIoSjjKK5+4c/Xx6m+T6y9
x88F1P/s+qz1ZdyPBBTFXo/IW1x2h8pNuZz8l3iH4vyWjXicKdx5T5Nz9zJyz0aC
G3vV7WZIXR1QX2xzz+T5H5nJd5Urk5H4xAzZy5sM5Qq9qgF2Y0Of7hL2KGwUpxJE
Rk5WZWUgl/9l60kAhHgCQZHz4NROxRIp5JJ0N99I4DqBAoGBAO4g6n5H+mO+xNHc
h1QnJksN9zGykbMSO4cJ0e1b3q9vf5D3zVH9CnZZv6BmyxF6Y3IGR5tEer5r1Z7l
lB71A++GfZPz1G0WTZV5vCq0h7r92OzoOGKxW3Jw5yU6KihPzCjvKldqxMn+kQZx
fGkY6ZV5dKqF2LfvlbX5lAdZp2FlAoGBAOqw1oRtF1IFfK0YURvOwOFTGkO0MiYF
yR18NZH4V0Xk3R0z9E/7k/py5P0Sk6rNYYHwXb9h8lHE+20vX/2j1PP9iVvUp3Dw
5nQ4T9XkW9rZzw1Ff6mK2HgV+9q2Yk9I7EebFwvhzNR9pLQhM2S+fp8FLVXZfLkT
a8v7u/AoGBAL6P3VXZsfaQ0pPi1nD+uvOFi/+e3r/MjQvI2dS1y+jz7UtbMSkqRM
gqci5zX/0Z1tbaxpD8CKf3T5nXeOAKoi3nR3iJxMtyN1oI0q2nI4LkV6rXabWxCt
1wnZGnP42v1+0Q+z2o2b0z7/e+FZptq0C1a7uDK2k3VqrcEfrlE+2LRAoGBAKj5+
FNN3eVU3LClmM2kDHX8J7T8zL9GqZ3kY1HLb1XYw8Ce6J1Q9JYbR4c9r9eQKp2yf
ybfNyx3FQ3Z1QDR+Hn1oZtZ05O+7Z72bJXkBz6KlM2b8NN+GbTj0ikQ==
-----END PRIVATE KEY-----
`;

export function AsymmetricEncrypt(text) {
  const buffer = Buffer.from(text, "utf8");

  const encrypted = crypto.publicEncrypt(
    {
      key: PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return encrypted.toString("base64"); 
}

export function AsymmetricDecrypt(encryptedText) {
  const buffer = Buffer.from(encryptedText, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return decrypted.toString("utf8");
}
