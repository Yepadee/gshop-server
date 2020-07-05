import * as nodemailer from "nodemailer";

const MY_EMAIL = "bloodcrush.store@gmail.com";
const EMAIL_SERVICE = "gmail"

export class EmailService {
    client

    constructor() {
        this.client = nodemailer.createTransport({
            service: EMAIL_SERVICE,
            auth: {
                user: MY_EMAIL,
                pass: "ZamU$dNJq*WG"
            }
        });
    }

    public sendOrderSummary(customerEmail: string, orderItems) {
        const mailOptions = {
            from: MY_EMAIL,
            to: customerEmail,
            subject: "Your order from Bloodcrush!",
            text: JSON.stringify(orderItems)
        }

        this.client.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }
}