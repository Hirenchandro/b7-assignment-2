import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utility/sendResponse";

const signupUser = async (req: Request, res: Response) => {
  //   console.log("signup User", req.body);
  try {
    const result = await authService.signupIntoDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Registered Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    // console.log("Signup user error", error);
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Bad Request",
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  const result = await authService.loginIntoDB(req.body);

  try {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User login Successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User Loging Failled",
      error: error,
    });
  }
};
export const authController = {
  signupUser,
  loginUser,
};
