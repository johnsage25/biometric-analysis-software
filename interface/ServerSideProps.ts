import type { NextApiRequest, NextApiResponse } from "next";
export interface ServerSideProps {
    req?:NextApiRequest,
    res?:NextApiResponse
}