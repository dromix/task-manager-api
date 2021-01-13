// 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
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'teoszz@ukr.net',
    subject: 'Welcome to the app',
    text: `${name}. Can you explain, how long are you?`
  }).then(() => {
    console.log('Message sent');
  })
  .catch(error => {
    console.log(error.response.body);
  });
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'teoszz@ukr.net',
    subject: 'Why say me why?',
    text: `${name}. Why do you remove an account?`
  }).then(() => {
    console.log('Bad news');
  })
  .catch(error => {
    console.log(error.response.body);
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
