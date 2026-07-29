export const EmailTemplate = (otp) => {
 return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#6C63FF;padding:35px;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;">
                💌 Saraha App
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="margin-top:0;color:#333333;">
                Email Verification
              </h2>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Hello,
              </p>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Thank you for joining <strong>Saraha App</strong>.
                Please use the verification code below to complete your email verification.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <span style="
                  display:inline-block;
                  padding:18px 40px;
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#6C63FF;
                  background:#F3F2FF;
                  border:2px dashed #6C63FF;
                  border-radius:10px;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:16px;color:#555555;">
                This code will expire in
                <strong>2 minutes</strong>.
              </p>

              <p style="font-size:16px;color:#555555;">
                If you didn't request this code, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:25px;background:#fafafa;border-top:1px solid #eeeeee;">

              <p style="margin:0;font-size:14px;color:#888888;">
                © 2026 Saraha App. All rights reserved.
              </p>

              <p style="margin-top:8px;font-size:13px;color:#aaaaaa;">
                Built with ❤️ by Mohamed Elsayed
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

export const forgetPasswordTemplate = (otp) => {
   return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#6C63FF;padding:35px;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;">
                💌 Saraha App
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="margin-top:0;color:#333333;">
                Reset Password OTP
              </h2>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Hello,
              </p>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Thank you for joining <strong>Saraha App</strong>.
                Please use the OTP code below to complete your reset password operation.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <span style="
                  display:inline-block;
                  padding:18px 40px;
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#6C63FF;
                  background:#F3F2FF;
                  border:2px dashed #6C63FF;
                  border-radius:10px;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:16px;color:#555555;">
                This code will expire in
                <strong>2 minutes</strong>.
              </p>

              <p style="font-size:16px;color:#555555;">
                If you didn't request this code, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:25px;background:#fafafa;border-top:1px solid #eeeeee;">

              <p style="margin:0;font-size:14px;color:#888888;">
                © 2026 Saraha App. All rights reserved.
              </p>

              <p style="margin-top:8px;font-size:13px;color:#aaaaaa;">
                Built with ❤️ by Mohamed Elsayed
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

export const updateEmailTemplate = (otp) => {
   return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Update Your Email</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#6C63FF;padding:35px;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;">
                💌 Saraha App
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="margin-top:0;color:#333333;">
                Update Email OTP
              </h2>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Hello,
              </p>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Thank you for joining <strong>Saraha App</strong>.
                Please use the OTP code below to complete your update email operation.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <span style="
                  display:inline-block;
                  padding:18px 40px;
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#6C63FF;
                  background:#F3F2FF;
                  border:2px dashed #6C63FF;
                  border-radius:10px;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:16px;color:#555555;">
                This code will expire in
                <strong>2 minutes</strong>.
              </p>

              <p style="font-size:16px;color:#555555;">
                If you didn't request this code, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:25px;background:#fafafa;border-top:1px solid #eeeeee;">

              <p style="margin:0;font-size:14px;color:#888888;">
                © 2026 Saraha App. All rights reserved.
              </p>

              <p style="margin-top:8px;font-size:13px;color:#aaaaaa;">
                Built with ❤️ by Mohamed Elsayed
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}