import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const getVerificationEmailTemplate = (username: string, otp: string) => {
	return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d1117; border-radius: 16px; border: 1px solid #30363d; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0; border-bottom: 1px solid #30363d;">
                            <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                                STINGRAY<span style="color: #ff79c6;">LAB</span>
                            </h2>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Xin chào ${username},</h3>
                            <p style="margin: 0 0 30px 0; color: #8b949e; font-size: 16px; line-height: 1.6;">
                                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Stingray Lab</strong>.
                                <br>
                                Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực (OTP) dưới đây:
                            </p>

                            <!-- OTP Box -->
                            <div style="background-color: rgba(255, 121, 198, 0.1); border: 1px solid rgba(255, 121, 198, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
                                <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #ff79c6; letter-spacing: 8px; display: block;">
                                    ${otp}
                                </span>
                            </div>

                            <p style="margin: 0 0 10px 0; color: #8b949e; font-size: 14px; text-align: center;">
                                Mã này sẽ hết hạn sau <strong style="color: #ffffff;">10 phút</strong>.
                            </p>
                            <p style="margin: 0; color: #8b949e; font-size: 14px; text-align: center;">
                                Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên của chúng tôi.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #010409; padding: 30px; text-align: center; border-top: 1px solid #30363d;">
                            <p style="margin: 0 0 10px 0; color: #484f58; font-size: 12px;">
                                © 2024 Stingray Lab. All rights reserved.
                            </p>
                            <div style="margin-top: 10px;">
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Trang chủ</a>
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Điều khoản</a>
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Hỗ trợ</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

export const getResetPasswordEmailTemplate = (
	username: string,
	otp: string
) => {
	return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d1117; border-radius: 16px; border: 1px solid #30363d; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0; border-bottom: 1px solid #30363d;">
                            <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                                STINGRAY<span style="color: #ff79c6;">LAB</span>
                            </h2>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Xin chào ${username},</h3>
                            <p style="margin: 0 0 30px 0; color: #8b949e; font-size: 16px; line-height: 1.6;">
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Stingray Lab</strong>.
                                <br>
                                Để đặt lại mật khẩu, vui lòng sử dụng mã xác thực (OTP) dưới đây:
                            </p>

                            <!-- OTP Box -->
                            <div style="background-color: rgba(255, 121, 198, 0.1); border: 1px solid rgba(255, 121, 198, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
                                <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #ff79c6; letter-spacing: 8px; display: block;">
                                    ${otp}
                                </span>
                            </div>

                            <p style="margin: 0 0 10px 0; color: #8b949e; font-size: 14px; text-align: center;">
                                Mã này sẽ hết hạn sau <strong style="color: #ffffff;">10 phút</strong>.
                            </p>
                            <p style="margin: 0; color: #8b949e; font-size: 14px; text-align: center;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #010409; padding: 30px; text-align: center; border-top: 1px solid #30363d;">
                            <p style="margin: 0 0 10px 0; color: #484f58; font-size: 12px;">
                                © 2024 Stingray Lab. All rights reserved.
                            </p>
                            <div style="margin-top: 10px;">
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Trang chủ</a>
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Điều khoản</a>
                                <a href="#" style="color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Hỗ trợ</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

export const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
			console.warn("SMTP credentials missing, skipping email send");
			return;
		}

		await transporter.sendMail({
			from: `"Stingray Lab" <${process.env.SMTP_USER}>`,
			to,
			subject,
			html,
		});
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
};
