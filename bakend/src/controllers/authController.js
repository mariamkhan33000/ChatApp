import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js"
import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'



export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message : "All field is reaquired"})
        }
        if(password.length < 6) {
            return res.status(400).json({ message : "Password must be at least 6 digits"})
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({message: "Email already exit"})

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            const newUser = new User({
                fullName,
                email,
                password: hashPassword
            })
            if(newUser) {
                generateToken(newUser._id, res)
                await newUser.save()

                res.status(201).json({
                    _id: newUser._id,
                    fullName : newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                })
            } else {
                res.status(400).json({message: "Invalid User Data"})
            }
    } catch (error) {
        console.log("Error in singnUp Controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const logIn = async (req, res) => {
    try {
        const {email, password} = req.body 
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Invalid Condition"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Password not matched"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email: user.email, 
            profilePic : user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({message:"Interval Login error"})
    }
}

export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logout Successfull"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({message:"Interval Logout error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, 
            {profilePic : uploadResponse.secure_url},
            {new: true}
        )
        res.status(200).json({updatedUser})
    } catch (error) {
        console.log("Error in Update Profile", error.message)
        res.status(500).json({message:"Interval Logout error"})
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in CheckAuth", error.message)
        res.status(500).json({message:"Interval Server error"})
    }
}