import { Resend } from 'resend';

const resend = new Resend('re_NieSSv6q_FSVBHSUpoAt1LcvsvcBcoPh5');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'saruelucas2@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});