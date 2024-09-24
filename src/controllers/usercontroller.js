const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // ตรวจสอบค่า password
        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        user.password = undefined; // hide password from response

        res.status(201).json(user);
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        console.log('User found:', user);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

    
        if (!user.role) {
            console.log('User role is undefined');
            return res.status(400).json({ message: 'User role not defined' });
        }
        
        const jsonWebToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated JWT:', jsonWebToken);
        res.status(200).json({ user, token: jsonWebToken });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// exports.updateProfileImage = async (req, res) => {
//     const userId = req.user.id; 
//     const profileImage = req.file ? req.file.path : null;

//     try {
//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.profileImage = profileImage; 
//         await user.save();

//         res.status(200).json(user); 
//     } catch (err) {
//         console.error('Error during updating profile image:', err);
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };





exports.updateRole = async (req, res) => {
    const {id} = req.params
    const { role } = req.body;

    try{
        if(!['buyer','seller','admin'].includes(role)){
            return res.statu(400).json({ message: 'Invalid role' });
        }
        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = role
        await user.save()

        res.status(200).json(user)
    }catch(err){
        console.error('Error during updating role:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
