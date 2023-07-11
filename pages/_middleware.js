import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getCookie } from "cookies-next";

export async function middleware(req, res) {
  const { pathname } = req.nextUrl;

  const session = await getToken({ req:req, secret: process.env.JWT_SECRET });

  var cookie = getCookie("server-auth", { req, res });

  if (session?.twofaEnabled) {
    if (cookie == `keep-in${session?.id}`) {
      return NextResponse.next();
    }

    if (session) {
      if (pathname !== "/authentication") {
        if (pathname == "/api/authentication") {
          return NextResponse.next();
        } else {
          const url = req.nextUrl.clone();
          url.pathname = "/authentication";
          return NextResponse.rewrite(url);
        }
      }
    }
  }

  // if the request is coming from New York, redirect to the home page
  return NextResponse.next();

  // return NextResponse.json({ message: "Hello World!" });
}
