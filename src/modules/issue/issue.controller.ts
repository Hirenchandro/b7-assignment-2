import type { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { issueService } from "./issue.service";
import type { JwtPayload } from "jsonwebtoken";
import type { TissueQuery } from "../../type";

const createIssue = async (req: Request, res: Response) => {
  // console.log("signup User", req.user);
  try {
    const result = await issueService.issueInsertIntoDB(
      req.body,
      req.user as JwtPayload,
    );

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
      message: "issue insert fail",
      error: error,
    });
  }
};
//get all issues
const getAllIssues = async (req: Request, res: Response) => {
  const query = req.query;
  // console.log("gelall", );
  try {
    const result = await issueService.getAllIssuesFromDB(query as TissueQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue Retrived Successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Issue get failled",
      error: error.message,
    });
  }
};

//Get Single issue

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log("get single issue:", id);
  try {
    const result = await issueService.getSingleIssueFromDB(id as string);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Single Issue Retrived Successfully",
      data: result.data,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
      error: error.message,
    });
  }
};

//updated

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  // console.log("issue id Here: ", id);.
  try {
    const user = req.user;

    // console.log("update user here: ", user);
    const result = await issueService.updateIssueFromDB(
      req.body,
      id as string,
      user as any,
    );

    console.log("update con REsult here:", result);
    // console.log("issue controller: resutl:", result.rows[0]);
    if (result?.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Id not found",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue Updated Successfully",
      data: result?.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
      error: error.message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.issueDeleteFromDB(id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue Deleted Successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found",
      error: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
