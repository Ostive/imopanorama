import { prisma } from "@/lib/prisma";


export const getVerificationTokenByToken = async (token: string) => {
  try {
    const VerificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return VerificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByMail = async (
    email : string
) => {
    try{
        const VerificationToken = await prisma.verificationToken.findFirst({
            where:{email}
        });

        return VerificationToken
    }
    catch{
        return null;
    }
}