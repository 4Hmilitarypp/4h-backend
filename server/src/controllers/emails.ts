import { pick } from 'lodash'
import informationTemplate from '../emailTemplates/information'
import { Controller } from '../types'
import { emailError } from '../utils/errors'
import transporter from '../utils/nodemailer'

const cleanContactUs = (obj: any) => pick(obj, ['name', 'email', 'message'])

export const contactUs: Controller = async (req, res) => {
  const form = cleanContactUs(req.body)

  try {
    await transporter.sendMail({
      from: `"4-H Military Partnerships" <${process.env.EMAIL_USER}>`,
      html: informationTemplate(form.name, form.email, form.message),
      subject: `4-H Information Request`,
      text: '',
      to: 'alex@wendte.tech',
    })
  } catch (err) {
    throw emailError(err)
  }

  return res.status(200).send('Your message was sent successfully. You should hear back shortly!')
}
