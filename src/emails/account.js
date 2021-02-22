const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'teoszz@ukr.net',
    subject: 'Welcome to the app',
    text: `${name}. Can you explain, how long are you?`
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'teoszz@ukr.net',
    subject: 'Why say me why?',
    text: `${name}. Why do you remove an account?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
