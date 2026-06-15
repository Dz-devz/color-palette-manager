import { NextFunction, Request, Response } from "express";
import { makeError } from "../utils/errors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { error, statusCode } = makeError(err);
  if (statusCode >= 500) {
    console.error(err);
  }
  res.status(statusCode).json({ error });
}
