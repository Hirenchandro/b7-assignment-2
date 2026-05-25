import { Pool } from "pg";
import { pool } from "../../db";
import type { Iissue } from "./issue.interface";
import type { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utility/sendResponse";
import type { TissueQuery } from "../../type";
import { error } from "console";

const issueInsertIntoDB = async (payload: Iissue, user: JwtPayload) => {
  const { title, description, type, status } = payload;
  const { id } = user;

  const result = await pool.query(
    `
       INSERT INTO issues(title,description,type,status,reporter_id) VALUES($1,$2,$3,COALESCE($4,'open'),$5)
       RETURNING*
        `,
    [title, description, type, status, id],
  );
  delete result.rows[0].password;
  return result;
};

//get all issues

const getAllIssuesFromDB = async (params: TissueQuery) => {
  const { sort, type, status } = params;

  let sqlQuary = `SELECT* FROM issues `;
  const values = [];

  // type filter
  if (type) {
    values.push(type);
    sqlQuary += `WHERE type = $${values.length}`;
  }

  //status
  if (status) {
    values.push(status);
    if (values.length === 1) {
      sqlQuary += `WHERE status=$${values.length}`;
    } else {
      sqlQuary += `AND status=$${values.length}`;
    }
  }

  // sorting
  if (sort === "oldest") {
    sqlQuary += `ORDER BY  created_at ASC`;
  } else {
    sqlQuary += `ORDER BY created_at DESC`;
  }

  const result = await pool.query(sqlQuary, values);

  const issue = [];
  for (const data of result.rows) {
    const userResult = await pool.query(
      `
      SELECT id, name, role FROM users WHERE id=$1
      `,
      [data.reporter_id],
    );
    const reporter = userResult.rows[0];

    const allData = { ...data, reporter: reporter };
    delete allData.reporter_id;

    issue.push(allData);
  }

  return issue;
};
// get Single User

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    
    SELECT* FROM issues WHERE id=$1
    `,
    [id],
  );

  const userResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [result.rows[0].reporter_id],
  );
  const reporter = userResult.rows[0];
  const data = { ...result.rows, reporter: reporter };

  return { data };
};

//update issues

const updateIssueFromDB = async (payload: Iissue, id: string, user: any) => {
  const { title, description, type } = payload;

  console.log("user role", user.role);

  if (user.role === "maintainer") {
    const result = await pool.query(
      `
   UPDATE issues SET  title=COALESCE($1,title),
   description=COALESCE($2,description),
   type=COALESCE($3,type),
   updated_at= NOW()
    WHERE id =$4 RETURNING*
    `,
      [title, description, type, id],
    );

    return result;
  }

  const contributorStatus = await pool.query(
    `
      SELECT reporter_id, status FROM issues WHERE id=$1
      `,
    [id],
  );

  const constributorAllow = contributorStatus.rows[0];

  if (
    user.role === "contributor" &&
    user.id === constributorAllow.reporter_id &&
    constributorAllow.status === "open"
  ) {
    let sqlupdateQuery = `
   UPDATE issues SET  title=COALESCE($1,title),
   description=COALESCE($2,description),
   type=COALESCE($3,type),
   updated_at= NOW()
    WHERE id =$4 RETURNING*
    `;
    const result = await pool.query(sqlupdateQuery, [
      title,
      description,
      type,
      id,
    ]);

    return result;
  }
};

const issueDeleteFromDB = async (id: string, user: any) => {
  console.log("deleteDB user role here", user.role);
  if (user.role === "maintainer") {
    const result = await pool.query(
      `
    DELETE FROM issues WHERE id=$1
    
    `,
      [id],
    );
    return result;
  } else {
    throw new Error("Sorry!! You have no delete access!!");
  }
};

export const issueService = {
  issueInsertIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  issueDeleteFromDB,
};
