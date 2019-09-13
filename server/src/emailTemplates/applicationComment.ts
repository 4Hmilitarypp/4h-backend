const applicationCommentTemplate = (name: string, comment: string) => `
<h2 style="color: #512888; margin: 0; font-size: 26px; padding: 10px 0;">4-H Military Partnerships</h2>
<p style="font-size: 16px; margin: 0;">
	<span style="color: #512888; font-weight: bold;">${name}</span> made a comment on your application</p>
<h3 style="margin: 0">Here is the start of the comment</h3>
<p style="font-size: 16px; margin: 0; padding: 10px 20px;">${comment}</p>
	`

export default applicationCommentTemplate
