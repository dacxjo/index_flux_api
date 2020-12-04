const Mail = use('Mail')
const { validate } = use('Validator')
const Env = use('Env')
class MailController {

  async sendContact ({ request,response }) {
    const rules = {
      email: 'required|email',
      phone: 'required',
      name:'required',
      message:'required'
    }
    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
      return response.status(422).json(validation.messages())
  }

    const data = request.all()
    const to = 'djesus1906.96@gmail.com'

   let status =  await Mail.send('mails.contact',data, (message) => {
      message.from('info@arpentechnologies.com')
      message.to(Env.get('MAIL_TO','djesus1906.96@gmail.com'))
      message.replyTo(data.email)
      message.subject('Contacto Arpen Technologies')
    })

    if(status.response === '250 Message received'){
      this.sendConfirmation(data);
    }
  } 

  async sendConfirmation (data) {
   
    const to = data.email

    await Mail.send('mails.confirmation',data, (message) => {
      message.from('info@arpentechnologies.com')
      message.to(to)
      message.replyTo('desarrollo@arpentechnologies.com')
      message.subject('Arpen Technologies - Respuesta automática')
    })
  } 

}

module.exports = MailController