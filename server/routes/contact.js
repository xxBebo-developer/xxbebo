// Contact route placeholder
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

// Contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Save to database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        
        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };
        
        await transporter.sendMail(mailOptions);
        
        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting me',
            text: `Hi ${name},\n\nThank you for reaching out. I've received your message and will get back to you soon.\n\nBest regards,\nAlex Developer`
        };
        
        await transporter.sendMail(userMailOptions);
        
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

module.exports = router;