import { pick } from 'lodash'
import informationTemplate from '../emailTemplates/information'
import { Controller } from '../types'
import { emailError } from '../utils/errors'
import transporter from '../utils/nodemailer'

const cleanContactUs = (obj: any) => pick(obj, ['name', 'email', 'message', 'category'])

export const contactUs: Controller = async (req, res) => {
  const form = cleanContactUs(req.body)

  try {
    await transporter.sendMail({
      from: `"4-H Military Partnerships" <${process.env.EMAIL_USER}>`,
      html: informationTemplate(form.name, form.email, form.message),
      subject: `4-H Information Request${form.category ? ' :' + form.category : ''}`,
      text: '',
      to: ['alex@wendte.tech', 'meredithb@ksu.edu', 'suziem@ksu.edu', 'jpartida@ksu.edu'],
    })
  } catch (err) {
    throw emailError(err)
  }

  return res.status(200).json(form)
}
