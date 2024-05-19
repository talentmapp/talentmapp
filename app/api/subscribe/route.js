// pages/api/subscribe.js
import { NextResponse } from 'next/server';
import mailgun from 'mailgun-js';

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const listAddress = process.env.MAILGUN_LIST_ADDRESS;

const mg = mailgun({ apiKey, domain });

export async function POST(req) {
  console.log("API Key:", process.env.MAILGUN_API_KEY);
  console.log("Domain:", process.env.MAILGUN_DOMAIN);
  console.log("List Address:", process.env.MAILGUN_LIST_ADDRESS);

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if the email address exists in the mailing list
    try {
      const member = await mg.lists(listAddress).members(email).info();
      if (member) {
        // Member already exists
        return NextResponse.json({ message: "Looks like you're already on our list!" }, { status: 200 });
      }
    } catch (error) {
      if (error.statusCode !== 404) {
        console.error('Error checking member in mailing list:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }
    }

    // Add the email address to the mailing list
    try {
      await mg.lists(listAddress).members().create({ subscribed: true, address: email });
    } catch (error) {
      console.error('Error adding member to mailing list:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    // Send welcome email
    const data = {
      from: 'Talentmapp <postmaster@mg.talentmapp.co>',
      to: email,
      subject: 'Welcome to Talentmapp',
      text: `Hello,\n\nWelcome to Talentmapp!\n\nThank you for subscribing to our newsletter.`,
    };

    try {
      await mg.messages().send(data);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe and send email' }, { status: 500 });
  }
}
