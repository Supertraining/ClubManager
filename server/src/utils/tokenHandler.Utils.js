import Jwt from "jsonwebtoken";
import { JWT_SEED } from '../config/config.js'


export class TokenHandler {

  static async generateToken(payload, duration) {
    return new Promise((resolve) => {
      Jwt.sign(payload, JWT_SEED, { expiresIn: Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60) || duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token)
      });
    });
  }

  static async validateToken(token) {
    return new Promise((resolve) => {
      Jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded)
      })
    })

  }

}