import express from 'express'
import { checkAuth, logIn, logOut, signUp, updateProfile } from '../controllers/authController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router  = express.Router()


router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/logout', logOut)
router.put("/update-profile", protectRoute, updateProfile)
router.get('/check', protectRoute, checkAuth)
export default router