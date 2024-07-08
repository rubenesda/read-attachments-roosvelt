import { Controller, HttpCode, Post, Query } from '@nestjs/common';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import * as path from 'path';
import * as https from 'https';

@Controller('mail')
export class MailController {
  @HttpCode(200)
  @Post()
  async parseEmail(@Query('url') url: string) {
    const fileInputStream = fs.createReadStream(url);
    const mailAttachments = [];
    const parsed = await simpleParser(fileInputStream, {});

    if (parsed.attachments && parsed.attachments.length > 0) {
      console.log(`\nSaving attachments from Email`);
      parsed.attachments.forEach((attachment) => {
        const filename = attachment.filename;
        const filePath = path.join(__dirname, `/${filename}`);
        fs.writeFileSync(filePath, attachment.content);

        const dataRaw = Buffer.from(attachment.content);

        mailAttachments.push(JSON.parse(dataRaw.toString()));
        console.log(`Saved supported attachment: ${filename}`);
      });
      return mailAttachments;
    } else if (parsed.html) {
      const potencialUrls = parsed.html
        .match(/href="([^"]*)"/g)
        .map((url) => url.replace('href="', '').replace('"', ''));

      if (!potencialUrls.length) {
        return 'No attachments found in Email';
      }

      const promisesArray = potencialUrls.map((url) => {
        return new Promise((resolve) => {
          https.get(url, (resp) => {
            let body = '';
            resp.on('data', (chunk) => {
              body += chunk;
            });
            resp.on('end', () => {
              mailAttachments.push(JSON.parse(body));
              resolve(true);
            });
          });
        });
      });

      await Promise.all(promisesArray);
      return mailAttachments;
    } else {
      return 'No attachments found in Email';
    }
  }
}
