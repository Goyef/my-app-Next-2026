import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
  Link,
} from '@react-email/components';

interface ForgetPasswordEmailProps {
  resetLink: string;
  expiresIn?: number; // en minutes
}

export default function forgetPasswordEmail({ resetLink, expiresIn = 60 }: ForgetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialise ton mot de passe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Réinitialisation du mot de passe</Heading>
          <Text style={text}>
            Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous pour continuer :
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>
          <Text style={text}>
            Ou copie ce lien dans ton navigateur :
          </Text>
          <Text style={link}>
            <Link href={resetLink} style={linkStyle}>{resetLink}</Link>
          </Text>
          <Text style={warning}>
            ⏱️ Ce lien expire dans {expiresIn} minutes.
          </Text>
          <Text style={footer}>
            Si tu n'as pas demandé cette réinitialisation, ignore cet email.
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 24px',
};

const link = {
  color: '#4a4a4a',
  fontSize: '12px',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'underline',
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