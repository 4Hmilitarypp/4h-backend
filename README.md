# 4-H Military Partnerships Website

This website was developed by Alex Wendte [alex@wendte.tech](#mailto:alex@wendte.tech) for 4-H Military Partnerships. You can view the live version of the site [here](https://http://4-hmpp-test.now.sh).

- [4-H Military Partnerships Website](#4-h-military-partnerships-website)
	- [Technologies Used](#technologies-used)
		- [Front End](#front-end)
		- [Server](#server)
		- [Database](#database)
	- [Documentation](#documentation)
		- [Front End](#front-end-1)
		- [Server](#server-1)
		- [Database](#database-1)
	- [Deployment](#deployment)
		- [Front End](#front-end-2)
		- [Server](#server-2)
		- [Database](#database-2)

## Technologies Used

### Front End

- React.js
- Styled Components
- Google Maps API
- Create-React-App
- Typescript

### Server

- Node.js
- Express.js
- Mongoose
- Typescript

### Database

- MongoDB
- Redis

## Documentation

### Front End

### Server

- Find the Swagger API documentation [here](https://app.swaggerhub.com/apis-docs/4Hmilitarypp/4-HMPP/)

### Database

## Deployment

### Front End

- Client Frontend
  - [Zeit Now](https://zeit.co/now) version 1
- Admin Frontend
  - Deployed with the server

### Server

- Digital Ocean droplet with Dokku installed
- If you are having troubles with npm installing bcrypt, follow the instruction here: https://www.gatsbyjs.org/docs/gatsby-on-windows/
  - This will allow you to install node-gyp which you need. Ultimately I had to run `npm config set python "C:\Users\<user>\AppData\Local\Programs\Python\Python27\python2.7.exe"` in order to get this to work
- You also need to run npm i -g typescript nodemon in order to run and compile the server
### Database

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
