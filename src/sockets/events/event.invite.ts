
import { DECISION, INVITE_ERROR, RECEIVE_INVITE } from "../emitters/emitter.invite";


export const SEND_AND_RECEIVE_INVITE_FN = async (io, socket, data: any) => {

    const { email, receiverId } = data || {};

    // const isEmailExits = await User.findOne({email:email});
    // if(!isEmailExits)
    // {
    //     socket.emit(INVITE_ERROR,{message:"User not founded"})
    //     return;
    // }
    // console.log("error work")

    const payload = {
        senderId: socket.id,
        message: `Sent invite to ${email}`,
        email: email

    }
    io.to(receiverId).emit(RECEIVE_INVITE, payload);

}


export const REJECT_INVITE_FN = async (io, socket, data: any) => {
    try {
        const { email, senderEmail } = data || {};

        if (!email || !senderEmail) {
            throw new Error("Please Enter your email")
        }
        const payload = {
            sender: socket.id,
            email: `${senderEmail} reject your invite`,
            message: `${senderEmail} reject your request`,
            success: false
        }
        io.to(email).emit(DECISION, payload)

    } catch (error) {
        console.log(error);

    }
}

export const ACCEPT_INVITE_FN = async (io, socket, data: any) => {
    try {

        const { email, senderEmail } = data || {};
        if (!email || !senderEmail) {
            throw new Error("Please enter your email")
        }
        const payload = {
            senderId: socket.id,
            email: senderEmail,
            message: `${senderEmail} accept your request`,
            success: true,
            status: 200,
        }

        io.to(email).emit(DECISION, payload);

    } catch (error) {
        console.log(error);

    }
}