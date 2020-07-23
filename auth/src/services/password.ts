import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// turn scrypt from callback to promise based implementation
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    // static are methods we can use with out making an instance of a class
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
