const nodemailer = require('nodemailer');

exports.enviarEmail = async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'suporte.smart.kilowatch@gmail.com',
            pass: 'krrj qzxu iaek aaaf',
        },
    });

    const mailOptions = {
        from: 'suporte.smart.kilowatch@gmail.com',
        to: 'suporte.smart.kilowatch@gmail.com',
        subject: `Suporte - ${assunto} (de ${nome})`,
        text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Email enviado com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar email' 
        });
    }
}