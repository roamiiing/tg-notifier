import {VercelRequest, VercelResponse} from '@vercel/node';
import axios from 'axios';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
      allowedMethods: ['POST'],
    });
  }

  const { TG_BOT_TOKEN, TG_CHANNEL, SECRET_KEY } = process.env;

  if (!TG_BOT_TOKEN || !TG_CHANNEL || !SECRET_KEY) {
    return res.status(500).json({
      message: 'Invalid function configuration',
      missingFields: [
        !TG_BOT_TOKEN && 'TG_BOT_TOKEN',
        !TG_CHANNEL && 'TG_CHANNEL',
        !SECRET_KEY && 'SECRET_KEY',
      ].filter(x => !!x),
    });
  }

  if (!req.body) {
    return res.status(400).json({
      message: 'Body is required',
    });
  }

  const {
    body: {
      secret = '',
      success = true,
      sender = 'Notifier',
      message = '',
      meta = {} as Record<string, string>,
    }
  } = req;

  if (secret !== SECRET_KEY) {
    return res.status(402).json({
      message: 'Not allowed. Please pass a valid secret key',
      secretField: 'secret',
    });
  }

  const MESSAGE = `
${success ? '✅ *Success:*' : '❌ *Error:*'} ${sender}
${message}

${Object.keys(meta).length > 0 ? '*Details:*' : ''}
${Object.entries(meta).map(([key, value]) => `${key}: ${value}`).join('\n')}
  `.trim();

  try {
    await axios.post(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TG_CHANNEL,
        text: MESSAGE,
        parse_mode: 'MarkdownV2'
      }
    )
    return res.json({
      success: true,
      message: MESSAGE,
    });
  } catch(e) {
    return res.status(500).json({
      message: 'Request to telegram has failed',
    });
  }

  return res.json(MESSAGE);
}
