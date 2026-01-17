// Template HTML pour l'email OTP
export function getOTPEmailHTML(otp: string, expiresIn: number = 10): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de vérification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; max-width: 600px;">
          <tr>
            <td>
              <h1 style="color: #1a1a1a; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                Code de vérification
              </h1>
              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                Utilise ce code pour te connecter :
              </p>
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">
                  ${otp}
                </span>
              </div>
              <p style="color: #f59e0b; font-size: 14px; text-align: center; margin: 20px 0;">
                ⏱️ Ce code expire dans ${expiresIn} minutes.
              </p>
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                Si tu n'as pas demandé ce code, ignore cet email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Template HTML pour l'email de réinitialisation de mot de passe
export function getPasswordResetEmailHTML(resetLink: string, expiresIn: number = 60): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; max-width: 600px;">
          <tr>
            <td>
              <h1 style="color: #1a1a1a; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                Réinitialisation de mot de passe
              </h1>
              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous :
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="color: #f59e0b; font-size: 14px; text-align: center; margin: 20px 0;">
                ⏱️ Ce lien expire dans ${expiresIn} minutes.
              </p>
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0;">
                Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :
              </p>
              <p style="color: #3b82f6; font-size: 12px; text-align: center; word-break: break-all;">
                ${resetLink}
              </p>
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                Si tu n'as pas demandé cette réinitialisation, ignore cet email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
