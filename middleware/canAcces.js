export const canAcces = (roles) => (req, res, next) => {
  const role = req.user.role;

  if (role === null || role === undefined) return res.sendStatus(401);
};
