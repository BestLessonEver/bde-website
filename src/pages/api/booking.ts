import type { APIRoute } from 'astro';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const date = formData.get('date')?.toString().trim() || '';
    const eventType = formData.get('event_type')?.toString().trim() || '';
    const venue = formData.get('venue')?.toString().trim() || '';
    const details = formData.get('details')?.toString().trim() || '';

    if (!name || !email) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/music?booking=invalid' },
      });
    }

    const timestamp = new Date().toISOString();
    const dataDir = join(process.cwd(), 'data');
    try { mkdirSync(dataDir, { recursive: true }); } catch {}

    // Save booking inquiry
    const entry = JSON.stringify({ timestamp, name, email, date, eventType, venue, details });
    appendFileSync(join(dataDir, 'bookings.jsonl'), entry + '\n');

    // Notify Brian
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
            subject: `New Booking Inquiry from ${name}`,
            text: `New booking inquiry!\n\nName: ${name}\nEmail: ${email}\nDate: ${date || 'Not specified'}\nEvent Type: ${eventType || 'Not specified'}\nVenue: ${venue || 'Not specified'}\n\nDetails:\n${details || 'None provided'}\n\nTime: ${timestamp}\nFrom: briandoeseverything.com/music`,
          }),
        });
      } catch (e) {
        console.error('Failed to send booking notification:', e);
      }
    } else {
      console.log(`[BOOKING] New inquiry from ${name} (${email}) for ${date || 'TBD'} - Set RESEND_API_KEY to enable email notifications`);
    }

    return new Response(null, {
      status: 302,
      headers: { Location: '/music?booked=true#book' },
    });
  } catch (err) {
    console.error('Booking error:', err);
    return new Response(null, {
      status: 302,
      headers: { Location: '/music?booking=error' },
    });
  }
};
