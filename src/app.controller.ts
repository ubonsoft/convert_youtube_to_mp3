import { Controller, Get,Post,Body,Res,Render} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as path from 'path';

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('removefile')
  async delFile(){
    let _Dir = 'public/storage'
    fs.readdir(_Dir, (err, files) => {
      if (err) {
        console.error('มีข้อผิดพลาดในการอ่านไฟล์:', err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(_Dir, file), (err) => {
          if (err) {
            console.error('มีข้อผิดพลาดในการลบไฟล์:', err);
            return;
          }
          console.log(`ไฟล์ ${file} ถูกลบเรียบร้อยแล้ว`);
        });
      }
    });
  }

  @Get()
  async getMyPage(@Res() res: Response) {
    const filePath = path.resolve(__dirname, '..', 'public', 'youtube.html');
    return res.sendFile(filePath);
  }

  @Post('api') // Query
  async postfrom(@Res() res : Response ,@Body() data : any){
    let _folder = 'public/storage';
    if(await ytdl.validateURL(data.youtube)){
      //get data from youtube
      let video = await ytdl(data.youtube, { quality: 'highest' });
      let createnewname = await ytdl.getURLVideoID(data.youtube);
      let resp = await video.pipe(await fs.createWriteStream(`${_folder}/${createnewname}.mp4`));
      let inputVideo = resp.path;
      let outputAudio = resp.path+'.mp3';
      await this.appService.delay(5000);
      console.log('Converting......');
      await ffmpeg().input(inputVideo).output(outputAudio).audioCodec('libmp3lame').on('end', () => {
        console.log('Finish');
        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่ก่อนที่จะทำการลบ
        if (fs.existsSync(inputVideo)) {
          fs.unlink(inputVideo, (err) => {
            if (err) {
              console.error('มีข้อผิดพลาดในการลบไฟล์:', err);
              return;
            }
            console.log('ไฟล์ถูกลบเรียบร้อยแล้ว');
          });
        } else {
          console.log('ไฟล์ที่ต้องการลบไม่มีอยู่');
        }
        return res.redirect(`storage/${createnewname}.mp4.mp3`);
      }).on('error', (err) => {
        console.error('เกิดข้อผิดพลาดในการแปลงเสียง:', err);
        return res.redirect('/');
      }).run();
    }else{
      return res.redirect('/');
    }
  
  }
}