const mailSender = require('./mailsender.cjs')


exports.sendVerificationEmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
        );
        if (mailResponse.success) {
            console.log("Email sent successfully: ", mailResponse.messageId);
        } else {
            console.log("Error occurred while sending email: ", mailResponse.error);
            throw new Error(mailResponse.error);
        }
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}


