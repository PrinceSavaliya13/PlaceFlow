export const notFound = (req, res) =>
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError")
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((x) => x.message)
        .join(", "),
    });
  if (err.code === 11000)
    return res
      .status(409)
      .json({ success: false, message: "Duplicate record" });
  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "Server error" });
};
