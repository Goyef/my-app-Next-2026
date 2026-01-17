import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    await sendEmail({
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}