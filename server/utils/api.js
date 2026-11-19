export const pagination = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1),
    limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  return { page, limit, skip: (page - 1) * limit };
};
export const response = (res, status, data, message = "Success") =>
  res.status(status).json({ success: status < 400, message, ...data });
