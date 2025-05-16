const nodemailer = require('nodemailer');

exports.criarNotificacao = async (req, res) => {
    const { nome, email, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'suporte.smart.kilowatch@gmail.com',
            pass: 'sua-senha-ou-senha-de-app', // Colocar senha de app aqui
        },
    });

    const mailOptions = {
        from: 'suporte.smart.kilowatch@gmail.com',
        to: 'suporte.smart.kilowatch@gmail.com',
        replyTo: email,
        subject: `Mensagem de Suporte de ${nome}`,
        text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ error: 'Erro ao enviar email' });
    }
}