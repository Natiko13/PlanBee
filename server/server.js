require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const connectDB = require("./db")

const loginRoutes = require("./router/loginRoutes")
const registrationRoutes = require("./router/registrationRoutes")
const calendarRoutes = require("./router/calendarRoutes")
const noteRoutes = require("./router/noteRoutes")
const categoryRoutes = require("./router/categoryRoutes")
const collaborationRoutes = require("./router/collaborationRoutes")
const getUserRoutes = require("./router/getUserRoutes")
const userSettings = require("./router/userSettingsRoutes")

const app = express()

app.use((req, res, next) => {
	console.log(`Received request: ${req.method} ${req.url}`)
	next()
})

app.use(express.json())
app.use(cookieParser())

app.use("/api", loginRoutes)
app.use("/api", registrationRoutes)
app.use("/api", calendarRoutes)
app.use("/api", noteRoutes)
app.use("/api", categoryRoutes)
app.use("/api", collaborationRoutes)
app.use("/api", getUserRoutes)
app.use("/api", userSettings)

connectDB()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
