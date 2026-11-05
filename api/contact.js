import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['liyemavanda000@gmail.com'],
      subject: `[Portfolio] ${subject || 'New Message'}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1A1817;">
          <h2 style="color: #C85A32;">New Inquiry from Portfolio</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border: 1px solid #EEEAE5; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #FAF8F5; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}