const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getSignup = async (req,res,next) => {
    res.render('signup')
}

exports.postSignup = async(req,res,next) => {
    const {email} = req.body
    const {password} = req.body
    const {confirmPassword} = req.body
    const {username} = req.body
    // const errors = validationResult(req)
    // console.log(errors.array())
    // if (!errors.isEmpty()) {
    //     return res.status(422).render('auth/signup', {
    //         path: '/signup',
    //         pageTitle: 'Signup',
    //         errorMessage:errors.array()[0].msg,
    //         oldInput: {email: email, password:password},
    //         validationErrors: errors.array()
    //     })
    // }
    if(confirmPassword !== password){
        //throw error
    }
    try {
        const existingUser = await User.findOne({email: email}) 
        if(existingUser){
            //throw error
        }
        const existingUsername = await User.findOne({username: username})
        if(existingUsername){
            // Username is already taken, try another
        }

        const hashedPassword = await bcrypt.hash(password,12)
        const user = new User({
            password: hashedPassword,
            email: email,
            username: username
        })
        await user.save()

        // await transporter.sendMail({
        //     to: email,
        //     from: 'oozore@quales.tech',
        //     subject: 'Signup suceeded',
        //     text: 'You succesfully signed up'
        // })
        // console.log('email sent')
        res.redirect('/login')
                   
    } catch (err) {
            console.log(err)
            // const error = new Error(err)
            // error.httpStatusCode = 500
            // return next(error)
    }


}

exports.getLogin = async (req,res,next)=> {
    res.render('login')
}

exports.postLogin = async (req,res,next) => {
        const {email} = req.body
        const {password} = req.body
        // const errors = validationResult(req)
        // // console.log(errors.array())
        // if (!errors.isEmpty()) {
        //     return res.status(422).render('auth/login', {
        //         path: '/login',
        //         pageTitle: 'Login',
        //         errorMessage:errors.array()[0].msg,
        //         passwordMessage: null,
        //         email: email,
        //         validationErrors: errors.array()
        //     })
        // }
        try{
                const user = await User.findOne({email: email})
                const doMatch =await bcrypt.compare(password, user.password)
                if (doMatch) {
                req.session.user = user
                req.session.isLoggedIn = true
                return req.session.save((err) => {
                    console.log(err)
                    res.redirect('/joinroom')
                })
                }else{
                    console.log('invalid password')
                    // return res.status(422).render('auth/login', {
                    //     path: '/login',
                    //     pageTitle: 'Login',
                    //     errorMessage:'Invalid email or password',
                    //     passwordMessage: null,
                    //     email: email,
                    //     validationErrors: []
                    // })
                }
        }catch(err){
            console.log(err)
            res.redirect('/login')
        }
    
}