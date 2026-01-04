import { SignJWT, jwtVerify } from 'jose';
import { JWT_SEED } from '../config/config.js';

// Encode secret as Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SEED);

export class TokenHandler {

  static async generateToken(payload, duration = '14d') {
    try {
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(duration)
        .sign(secret);

      return token;
    } catch (err) {
      return null;
    }
  }

  static async validateToken(token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (err) {
      return null;
    }
  }

}
