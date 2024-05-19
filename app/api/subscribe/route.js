// pages/api/subscribe.js
import { NextResponse } from 'next/server';
import mailgun from 'mailgun-js';

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const listAddress = process.env.MAILGUN_LIST_ADDRESS;

const mg = mailgun({ apiKey, domain });

export async function POST(req) {
  const { email } = await req.json();

  if ( !email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  try {
    // Check if the email address already exists in the mailing list
    const member = await mg.lists(listAddress).members(email).info();
    if (member.address) {
      console.log(`Email ${email} already exists in the list. Proceeding to send email.`);
    }
  } catch (error) {
    // If the error indicates that the member already exists, proceed to send the email
    if (error.message.includes('Address already exists')) {
      console.log(`Email ${email} already exists in the list. Proceeding to send email.`);
    } else {
      console.error('Error checking member in mailing list:', error);
      return NextResponse.json({ error: 'Failed to check member in mailing list' }, { status: 500 });
    }
  }

  try {
    // Send welcome email
    const data = {
      from: 'Your Name <your@example.com>',
      to: email,
      subject: 'Welcome to Talentmapp',
      text: `Hello Talentmapper!,\n\nWelcome to Talentmapp!\n\nThank you for subscribing to our newsletter.`,
    };

    await mg.messages().send(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
