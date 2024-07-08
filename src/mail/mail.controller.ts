import { Controller, HttpCode, Post, Query } from '@nestjs/common';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import * as https from 'https';
import { supportedExtension } from '../utils';

@Controller('mail')
export class MailController {
  @HttpCode(200)
  @Post()
  async parseEmail(@Query('url') url: string) {
    const fileInputStream = fs.createReadStream(url);
    const mailAttachments = [];
    const parsed = await simpleParser(fileInputStream, {});

    if (parsed.attachments && parsed.attachments.length > 0) {
      parsed.attachments.forEach((attachment) => {
        const filename = attachment.filename;

        if (!supportedExtension(filename)) {
          return;
        }

        const dataRaw = Buffer.from(attachment.content);

        mailAttachments.push(JSON.parse(dataRaw.toString()));
        console.log(`Saved supported attachment: ${filename}`);
      });

      if (!mailAttachments.length) {
        return 'No attachments found in Email';
      }

      return mailAttachments;
    } else if (parsed.html) {
      let potencialUrls = parsed.html
        .match(/href="([^"]*)"/g)
        .map((url) => url.replace('href="', '').replace('"', ''));

      potencialUrls = potencialUrls.filter((url) => supportedExtension(url));

      if (!potencialUrls.length) {
        return 'No attachments with supported file extension found in Email';
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
