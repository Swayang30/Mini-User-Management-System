// const { verifyToken } = require('../utils/jwt');
// const User = require('../models/User');

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.models.js';

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select('+password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (user.status !== 'active') return res.status(403).json({ message: 'Account inactive' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

