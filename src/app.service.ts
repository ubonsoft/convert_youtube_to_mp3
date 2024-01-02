import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // generatename(length): string {
  //   const characters = 'abcdefghijklmnopqrstuvwxyz';
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     const randomIndex = Math.floor(Math.random() * characters.length);
  //     result += characters.charAt(randomIndex);
  //   }
  //   return result;
  // }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
