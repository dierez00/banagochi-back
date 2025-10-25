import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, getAdmins, getUserDevices, logoutDevice, logoutAllDevices } from '../controllers/user.controller';
import { uploadBiometricFiles } from '../config/multer';
import { verifyBiometric } from '../middleware/biometricVerification';

// Import the login function from the controller
const router = Router();

router.post('/register', uploadBiometricFiles, verifyBiometric, createUser);
router.get('/getall', getAllUsers)
router.get('/get/:id', getUserById)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.get('/getadmins', getAdmins); 
router.get('/:id/devices', getUserDevices);
router.post('/:id/logout-device', logoutDevice);
router.post('/:id/logout-all', logoutAllDevices);


// 6835f40622f94c7f62673f9c


export default router;
