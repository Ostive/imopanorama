import {v4 as uuidv4} from 'uuid';
import { prisma } from "@/lib/prisma";
import { getVerificationTokenByMail } from "@/data/verification-token";

export const generateVerificationToken = async (email:string)=>
{
    const token = uuidv4();
    //date per milisecond
    const expires = new Date(new Date().getTime() + 1000*60*10);//10 minute

    const existingToken = await getVerificationTokenByMail(email);

    if(existingToken)
    {
        await prisma.verificationToken.delete({
            where:{
                id:existingToken.id
            }
        });
    }
    const verificationToken = await prisma.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    });

    return verificationToken
    
}