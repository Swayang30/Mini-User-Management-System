import Joi from 'joi';
import User from '../models/User.models.js';
import { signToken } from '../utils/jwt.js';

const signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[!@#$%^&*]/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export async function signup(req, res, next) {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const exists = await User.findOne({ email: value.email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User(value);
    await user.save();

    const token = signToken({ id: user._id });
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) { next(err) }
}

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(value.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id });
    res.json({ token, user: user.toJSON() });
  } catch (err) { next(err) }
}

export async function logout(req, res, next) {
  try {
    res.json({ message: 'Logged out' });
  } catch (err) { next(err) }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: user.toJSON() });
  } catch (err) { next(err) }
}
