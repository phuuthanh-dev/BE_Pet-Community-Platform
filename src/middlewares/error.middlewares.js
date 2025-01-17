import { StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from '../utils/errorWithStatus.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return;
  }

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack']),
  });
  next();
};
