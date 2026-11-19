import { validationResult } from "express-validator";
export const validate = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty())
    return res
      .status(422)
      .json({
        success: false,
        message: "Validation failed",
        errors: e.array(),
      });
  next();
};
