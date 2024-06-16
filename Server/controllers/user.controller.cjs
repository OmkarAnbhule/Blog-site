const User = require('../models/user.model.cjs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const OTP = require('../models/otp.model.cjs');
const otpGenerator = require('otp-generator');
const { sendVerificationEmail } = require('../utils/otputils.cjs')
const { uploadFileOnCloudinary } = require('../utils/cloudinary.utils.cjs')

exports.createUser = async (req, resp) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.find({ email: email })
        if (user.length == 0) {
            if (name == '' || email == '' || password == '') {
                return resp.status(404).json({ success: false, message: 'credentials not found' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const res = await uploadFileOnCloudinary(req.files.file, 'userAvatar')
            if (res) {
                const result = new User({ name, email, password: hashedPassword, avatar: res.secure_url })
                await result.save();
                const token = jwt.sign({
                    email: email, id: result._id
                }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
                result.tokens = result.tokens.concat({ token });
                await result.save();
                if (result) {
                    resp.cookie('USR_TKN', token, {
                        maxAge: 48 * 60 * 1000,
                        httpOnly: true,
                        secure: true
                    });
                    return resp.status(201).send({ success: true, uid: token });
                }
            }
        }
    }
    catch (e) {
        console.log(e)
        return resp.status(500).send({ success: false, message: 'server not responding' })
    }
}

exports.loginUser = async (req, resp) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        const token = jwt.sign({
            email: email, id: user._id
        }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
        const result = await User.findOneAndUpdate({ email: email }, { isLoggedin: true, loginTime: Date.now(), $push: { tokens: { token } } })
        if (result) {
            resp.cookie('USR_TKN', token, {
                maxAge: 48 * 60 * 1000,
                httpOnly: true,
                secure: true
            });
            return resp.status(201).send({ success: true, uid: token });
        }
    }
    catch (e) {
        console.log(e)
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.verfiyUser = async (req, resp) => {
    try {
        const { email } = req.params

        const result = await User.find({ email: email })
        if (result.length > 0) {
            resp.status(400).send({ success: false, message: "User found" })
        }
        else {
            resp.status(201).send({ success: true, message: "User not found" })
        }
    }
    catch (e) {
        resp.status(500).send({ success: false, message: 'server not responding' })
    }
}

exports.sendOtp = async (req, resp) => {
    try {
        const { email } = req.body
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: false,
        });
        let result = await OTP.findOne({ otp: otp });
        const old = await OTP.findOne({ email: email })
        console.log(old);
        if (old && old.count >= 3) {
            resp.status(400).send({ success: false, message: 'server busy' })
        }
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: true,
                lowerCaseAlphabets: true,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpBody = await OTP.create({ email, otp });
        if (otpBody) {
            await sendVerificationEmail(email, otp);
            resp.status(201).send({ success: true, message: 'otp sent successfully' });
        }
    }
    catch (e) {
        resp.status(500).send({ success: false, message: 'internal server error' });
    }
}

exports.getUser = async (req, resp) => {
    try {
        const { id } = req.params
        const result = await User.findById(id)
        if (result) {
            resp.status(201).send({ success: true, data: result })
        }
    }
    catch (e) {
        resp.status(500).send({ success: false, message: 'internal server error' });
    }
}

exports.logout = async (req, resp) => {
    try {
        const result = await User.findByIdAndUpdate(req.user.id, { isLoggedin: false })
        if (result) {
            resp.clearCookie('USR_TKN')
            return resp.status(201).send({ success: true, message: 'logged out' })
        }
    } catch (error) {
        console.log(error)
        return resp.status(500).send({ success: false, message: 'internal server error' });
    }
}