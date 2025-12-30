import Joi from 'joi';
import User from '../models/User.models.js';

async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(),
    ]);

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) { next(err) }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) { next(err) }
}


async function activateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) { next(err) }
}

async function deactivateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) { next(err) }
}

const updateSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  email: Joi.string().email(),
});

async function updateProfile(req, res, next) {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (value.email) {
      const existing = await User.findOne({
        email: value.email,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      value,
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (err) { next(err) }
}

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[!@#$%^&*]/)
    .required(),
});

async function changePassword(req, res, next) {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.user._id).select('+password');
    const ok = await user.comparePassword(value.oldPassword);

    if (!ok) {
      return res.status(401).json({ message: 'Old password incorrect' });
    }

    user.password = value.newPassword;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) { next(err) }
}

export default {
  listUsers,
  activateUser,
  deactivateUser,
  getProfile,
  updateProfile,
  changePassword,
};
