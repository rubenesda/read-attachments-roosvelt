import { Controller, HttpCode, Post, Query, Res } from '@nestjs/common';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import * as https from 'https';
import { supportedExtension, parseMsgCode } from '../utils';
import { Response } from 'express';

@Controller('mail')
export class MailController {
  // This shifted to library-specific mode instead of Standard mode
  // you can find it at https://docs.nestjs.com/controllers#routing
  @HttpCode(200)
  @Post()
  async parseEmail(@Query('url') url: string, @Res() res: Response) {
    // Read email file and extract its data.
    const fileInputStream = fs.createReadStream(url);
    const mailAttachments = [];
    const parsed = await simpleParser(fileInputStream, {});

    // Checks if there is at least one attachement in the email.
    // Otherwise, it will go through to html object.
    if (parsed.attachments && parsed.attachments.length > 0) {
      // The email could have a lot of attachements, it will inspect
      // each one and will review their extensions.
      parsed.attachments.forEach((attachment) => {
        const filename = attachment.filename;

        if (!supportedExtension(filename)) {
          return;
        }

        // It will end up appending each JSON file to mailAttachements array
        const dataRaw = Buffer.from(attachment.content);
        mailAttachments.push(JSON.parse(dataRaw.toString()));
      });

      if (!mailAttachments.length) {
        return res.status(404).send(parseMsgCode('NO_ATTACHMENTS'));
      }

      return res.send(mailAttachments);
    } else if (parsed.html) {
      // This will review if there were attachment as links inside of the email's body
      let potencialUrls = parsed.html
        .match(/href="([^"]*)"/g)
        .map((url) => url.replace('href="', '').replace('"', ''));

      // This will choose the valid links that there were inside of the email's body
      potencialUrls = potencialUrls.filter((url) => supportedExtension(url));

      if (!potencialUrls.length) {
        return res.status(400).send(parseMsgCode('NO_VALID_ATTACHMENTS'));
      }

      // It will create an array with Promises that will be solved previously to return
      // the JSON response of the endpoint
      const promisesArray = potencialUrls.map((url) => {
        return new Promise((resolve) => {
          https.get(url, (resp) => {
            let body = '';
            // The data is a stream and will be stored by chunks. Once completed,
            // the body will be appended to mailAttachment array
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
      return res.send(mailAttachments);
    } else {
      return res.status(404).send(parseMsgCode('NO_ATTACHMENTS'));
    }
  }
}
