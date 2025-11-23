const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true pour port 465, false pour 587
    auth: {
        user: "",
        pass: ""
    },
    // ajouter l’option tls: { rejectUnauthorized: false } dans ton transporteur. Ça va dire à Node.js de ne pas bloquer les certificats auto-signés.
    tls: {
        rejectUnauthorized: false // ← important pour éviter l'erreur self-signed
    }
});


const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


        // Envoi de l'email
        await transporter.sendMail({
            from: "yassinedebich214@gmail.com",  // Ton adresse email
            to: email,
            subject: "Réinitialisation du mot de passe",
            html: `
          <!DOCTYPE html>
          <html>
          <head>
              <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body>
              <div class="container">
                  <div class="row justify-content-center">
                      <div class="col-md-8">
                          <div class="card">
                              <div class="card-header bg-primary text-white">
                                  <h4>Réinitialisation du mot de passe</h4>
                              </div>
                              <div class="card-body">
                                  <p>Bonjour,</p>
                                  <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                                  <p><a href="${resetLink}">Réinitialiser le mot de passe</a></p>
                                  <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
                                  <p>Cordialement,<br>Votre équipe de support</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </body>
          </html>
        `,
        });

        console.log("Email de réinitialisation envoyé à :", email);
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'email de réinitialisation :", err);
    }
};

const sendEmail = async (email, activationCode) => {
    try {
        const activationLink = `http://localhost:4200/account-activation/${activationCode}`;

        await transporter.sendMail({
            from: "chebbieya1982003@gmail.com",
            to: email,
            subject: "Account activation",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header bg-primary text-white">
                                        <h4>Account Activation</h4>
                                    </div>
                                    <div class="card-body">
                                        <p>Dear User,</p>
                                        <p>Thank you for registering. Please click the link below to activate your account:</p>
                                        <p><a href="${activationLink}">Activate Account</a></p>                                        <p>If you did not request this, please ignore this email.</p>
                                        <p>Best regards,<br>Travel Agency Team</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = { sendEmail, sendPasswordResetEmail }