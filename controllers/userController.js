const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail, sendPasswordResetEmail } = require('../NodeMailer/nodeMailer.js');

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, phone, role } = req.body;

        // Vérification basique
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationCode = crypto.randomBytes(20).toString("hex");

        // ❌ IMPORTANT : ne pas inclure confirmPassword dans le nouveau User
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role,
            activationCode,
            isActive: false,
        });

        await newUser.save();
        await sendEmail(email, activationCode);

        res.status(201).json({
            message: "Utilisateur créé avec succès ! Veuillez vérifier votre email.",
        });
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


// ACTIVATE ACCOUNT
const activateAccount = async (req, res) => {
    try {
        const { activationCode } = req.params;
        if (!activationCode) {
            return res.status(400).json({ message: "Code d'activation manquant." });
        }

        const user = await User.findOne({ activationCode });

        if (!user) {
            return res.status(400).json({ message: "Code invalide ou expiré." });
        }

        user.isActive = true;
        user.activationCode = null;
        await user.save();

        res.json({ message: "Votre compte a été activé avec succès !" });
    } catch (error) {
        console.error("Erreur d'activation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};

// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "L'ID est requis" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    try {
        let imageUrl = req.body.photo;

        if (req.file) {
            imageUrl = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body, photo: imageUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update user" });
    }
};

// EXPORTS (CommonJS)
module.exports = {
    createUser,
    activateAccount,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser,
};
