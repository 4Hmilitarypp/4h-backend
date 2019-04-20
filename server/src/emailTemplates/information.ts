const informationTemplate = (name: string, email: string, message: string) => `
<h2 style="color: #512888; margin: 0; font-size: 26px; padding: 10px 0;">4-H Military Partnerships</h2>
<p style="font-size: 16px; margin: 0;">
	<span style="color: #512888; font-weight: bold;">${name}</span> is requesting information</p>
<p style="font-size: 16px; margin: 0;">Their Email is:
	<a style="color: #512888;" href="mailto:${email}">${email}</a>
</p>
<h3 style="margin: 0">Here is their message</h3>
<p style="font-size: 16px; margin: 0; padding: 10px 20px;">${message}</p>
	`

export default informationTemplate
