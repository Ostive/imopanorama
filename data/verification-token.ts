import { prisma } from "@/lib/prisma";

export const getVerificationTokenByMail = async (
    token : string
) => {
    try{
        const VerificationToken = await prisma.verificationToken.findUnique({
            where:{token}
        });

        return VerificationToken
    }
    catch{
        return null;
    }
}