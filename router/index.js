import express  from 'express'
import { RegisterController, UserController ,RefreshController, productController} from '../controllers'
import { LoginController } from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router()

router.post('/register', RegisterController.register)
router.post('/login', LoginController.login)
router.get('/me', auth, UserController.me)
router.post('/refresh', RefreshController.refresh)
router.post('/logout',auth,LoginController.logout)

// products

router.post('/products',[auth, admin], productController.store)
router.put('/products/:id',[auth,admin], productController.update)
router.delete('/products/:id',[auth, admin], productController.delete)
router.get('/products', productController.index)
router.get('/products/:id', productController.show)

export default router