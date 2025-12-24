import User from '../models/User.js';
import { Webhook } from 'svix';

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        };

        // 1. Get the Raw Payload (needed for verification)
        const payload = req.body.toString();

        // 2. Verify the Signature
        await whook.verify(payload, headers);

        // 3. Parse the JSON manually
        const { type, data } = JSON.parse(payload);

        switch (type) {
            case "user.created":
            case "user.updated": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    // FIX: Save as 'name' to match your Admin Dashboard
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url
                };

                await User.findByIdAndUpdate(data.id, userData, { upsert: true });
                break;
            }
            case "user.deleted": {
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
};

export default clerkWebhooks;