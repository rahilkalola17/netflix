import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prismadb from "@/lib/prismadb";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  //   const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return { currentUser };
};

export default serverAuth;
