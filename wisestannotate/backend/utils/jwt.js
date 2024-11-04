// utils/jwt.js
import jwt from 'jsonwebtoken';

const secretKey = "KLJZXLKC87#^#^@*JHSAKJDFHSDKJF#JJzbSooqwesdfjkhasf";

export const generateToken = (user) => {
  return jwt.sign(user, secretKey, { expiresIn: '3h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
