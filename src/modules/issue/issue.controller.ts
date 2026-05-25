import type { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { issueService } from "./issue.service";
import type { JwtPayload } from "jsonwebtoken";
import type { TissueQuery } from "../../type";

const createIssue = async (req: Request, res: Response) => {
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

  try {
    const result = await issueService.getSingleIssueFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
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

  try {
    const user = req.user;

    const result = await issueService.updateIssueFromDB(
      req.body,
      id as string,
      user as any,
    );

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
  const user = req.user;

  try {
    const result = await issueService.issueDeleteFromDB(id as string, user);

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
