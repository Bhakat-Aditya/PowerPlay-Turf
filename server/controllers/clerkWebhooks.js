import User from '../models/User.js';
import { Webhook } from 'svix';

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        }

        // Note: For this to work reliably, req.body must match the raw payload. 
        // See server.js fix below.
        await whook.verify(JSON.stringify(req.body), headers);

        const { type, data } = req.body;

        switch (type) {
            case "user.created":
            case "user.updated": {
                // Only extract these fields for create/update
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url
                };
                
                // upsert: true ensures we create if it doesn't exist, update if it does
                await User.findByIdAndUpdate(data.id, userData, { upsert: true });
                break;
            }
            case "user.deleted": {
                // For delete, we only have data.id
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.json({ success: true, message: 'Webhook received' });

    } catch (error) {
        console.log("Webhook Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

export default clerkWebhooks;