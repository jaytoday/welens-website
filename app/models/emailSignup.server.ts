import type { EmailSignup } from "@prisma/client";

import { prisma } from "~/db.server";

export type { EmailSignup } from "@prisma/client";


export function createEmailSignup({
  email,
  additionalInfo
}: Pick<EmailSignup, "email" | "additionalInfo">) {
  return prisma.emailSignup.create({
    data: {
      email,
      additionalInfo
    },
  });
}