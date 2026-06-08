import { Router, type Response } from 'express';
import bcrypt from 'bcrypt';
import type { AuthRequest } from '../middleware/auth.js';
import { generateToken } from '../middleware/auth.js';
import { findUserByEmail, createUser } from '../store/memoryStore.js';
import type { LoginInput, RegisterInput, AuthResponse, User } from '../../shared/types';

const router = Router();

function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...safeUser } = user;
  return safeUser;
}

router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as RegisterInput;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: '请填写完整信息' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: '密码至少需要6位以上' });
      return;
    }

    if (findUserByEmail(email)) {
      res.status(400).json({ error: '该邮箱已被注册' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const response: AuthResponse = {
      user: sanitizeUser(user),
      token,
    };

    res.json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    if (!email || !password) {
      res.status(400).json({ error: '请填写邮箱和密码' });
      return;
    }

    const user = findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: '邮箱或密码错误' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: '邮箱或密码错误' });
      return;
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const response: AuthResponse = {
      user: sanitizeUser(user),
      token,
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: '退出成功' });
});

router.get('/me', (req: AuthRequest, res: Response): void => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: '未登录' });
  }
});

export default router;
