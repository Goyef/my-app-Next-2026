import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface OTPEmailProps {
  otp: string;
  expiresIn?: number; // en minutes
}

export default function OTPEmail({ otp, expiresIn = 10 }: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ton code de vérification : {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Code de vérification</Heading>
          <Text style={text}>
            Utilise ce code pour te connecter :
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={warning}>
            ⏱️ Ce code expire dans {expiresIn} minutes.
          </Text>
          <Text style={footer}>
            Si tu n'as pas demandé ce code, ignore cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const codeContainer = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '20px 0',
  padding: '20px',
};

const code = {
  color: '#000',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  textAlign: 'center' as const,
  margin: '0',
};

const warning = {
  color: '#f59e0b',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px',
};