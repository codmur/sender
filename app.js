const express = require('express');
const nodemailer = require('nodemailer');
const { z } = require('zod');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());

// Configura el transporte de Nodemailer (esto puede variar dependiendo del servicio que uses)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usa el servicio que prefieras
  auth: {
    user: 'juanpenalversa@gmail.com', // Tu correo de Gmail
    pass: 'waxy bhel pltx jutb' // Tu contraseña o contraseña de aplicación de Google
  }
});

// Define el esquema de validación con Zod
const emailSchema = z.object({
  to: z.string().email(), 
  cc: z.array(z.string().email()).optional(), 
  subject: z.string().min(1, 'El asunto es obligatorio'),
  message: z.string().min(1, 'El mensaje no puede estar vacío') 
});

// Endpoint /sender para enviar correos
app.post('/sender', async (req, res) => {
  try {
    // Valida los datos con Zod
    const { to, cc, subject, message } = emailSchema.parse(req.body);

    // Configura los detalles del correo
    const mailOptions = {
      from: 'juanpenalversa@gmail.com', 
      to: to, 
      cc: cc, 
      subject: subject, 
      text: message, 
      html: `<p>${message}</p>` 
    };

    // Envía el correo
    const info = await transporter.sendMail(mailOptions);
    
    // Responde con un mensaje de éxito
    res.status(200).json({ message: 'Correo enviado exitosamente', info: info.response });
  } catch (error) {
    // Si hay un error, responde con el mensaje de error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos de entrada no válidos', details: error.errors });
    }
    res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
