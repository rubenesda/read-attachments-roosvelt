import { Controller, Post, Query } from '@nestjs/common';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import * as path from 'path';

@Controller('mail')
export class MailController {
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
    } else {
      return 'No attachments found in Email';
    }
  }
}
