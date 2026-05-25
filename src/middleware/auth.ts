import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access!!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;

      const userData = await pool.query(
        `
      SELECT* FROM users WHERE email=$1
      `,
        [decoded.email],
      );

      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User Not Found",
        });
      }

      req.user = decoded;
      // console.log(req.user);

      next();
    } catch (error: any) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "invalid Token",
        error: error.message,
      });
    }
  };
};

export default auth;
