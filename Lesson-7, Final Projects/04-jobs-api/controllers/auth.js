const User = require('../models/User.js')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()

    console.log(user)

    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}


const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare passwords
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token, extra: 'welcome mada faka' })
}


module.exports = {
    register,
    login,
}
