import type { Request, Response } from "express";
import { pool } from "../../db";
import type { Iuser } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupIntoDB = async (payload: Iuser) => {
  const { name, email, password, role } = payload;

  //   console.log(name, email, password);

  const hashPassword = await bcrypt.hash(password, 11);

  const result = await pool.query(
    `
       INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor'))
       RETURNING*
        `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
  //   console.log(result.rows[0]);
};

const loginIntoDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
        SELECT* FROM users WHERE email=$1
        `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  //Generate Token
  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  if (!matchPassword) {
    throw new Error("Invalid Password");
  }
  delete user.password;
  return { accessToken, user };
};

export const authService = {
  signupIntoDB,
  loginIntoDB,
};
