import type { APIRoute } from 'astro';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString().trim();

    if (!email || !email.includes('@')) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/?subscribe=invalid' },
      });
    }

    // Save to local CSV
    const timestamp = new Date().toISOString();
    const dataDir = join(process.cwd(), 'data');
    try { mkdirSync(dataDir, { recursive: true }); } catch {}
    appendFileSync(join(dataDir, 'subscribers.csv'), `${timestamp},${email}\n`);

    // Notify Brian via email using Resend (if API key set) or log
    const resendKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BDE Website <onboarding@resend.dev>',
            to: 'brian@bestlessonever.com',
            subject: `New BDE Subscriber: ${email}`,
            text: `New newsletter subscriber!\n\nEmail: ${email}\nTime: ${timestamp}\n\nThis came from briandoeseverything.com`,
          }),
        });
      } catch (e) {
        console.error('Failed to send notification:', e);
      }
    } else {
      console.log(`[NEWSLETTER] New subscriber: ${email} at ${timestamp} — Set RESEND_API_KEY to enable email notifications`);
    }

    return new Response(null, {
      status: 302,
      headers: { Location: '/?subscribed=true' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(null, {
      status: 302,
      headers: { Location: '/?subscribe=error' },
    });
  }
};
