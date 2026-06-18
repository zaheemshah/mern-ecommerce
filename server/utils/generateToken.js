import jwt from 'jsonwebtoken';

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const sendTokenResponse = (user, statusCode, res, rememberMe = false) => {
  const token = generateToken(user._id);
  const expireDays = rememberMe ? 30 : Number(process.env.JWT_COOKIE_EXPIRE) || 7;

  const options = {
    expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
      },
    });
};
