import express from 'express';
import cors from 'cors';
import { Limitr } from '@formata/limitr';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());


// Create a Limitr policy instance we can use with our endpoints
const limitrPolicy = await Limitr.cloud({ token: 'lmlive_W80FjPoWoiUWY3EGhojcJjAQQSaJ' });


async function limitrAllow(customerId, resource, value) {
    // Make sure the customer exists
    if (customerId && await limitrPolicy.addCloudCustomer(customerId)) {
        // Return a boolean value for whether the user is allowed
        // Usage tracked and synced in the background
        return await limitrPolicy.allow(customerId, resource, value);
    }
    return null;
}


app.post('/api/ai-chat', async (req, res) => {
    const { customerId, value } = req.body;
    
    // How many tokens are we spending right now?
    // Hint: use the official (free) token counting libs that AI providers provide for accuracy
    const spend = value ?? 1000;

    if (await limitrAllow(customerId, 'chat_tokens', spend)) {
        
        // Call out to LLM here - user is allowed to consume this many tokens

        res.json({ success: true, message: `successfully used ${spend} AI chat tokens` });
    } else {
        res.json({ success: false, message: 'denied: AI chat token limit exceeded' });
    }
});


app.post('/api/change-storage', async (req, res) => {
    const { customerId, value } = req.body;
    
    // How much additional storage are we asking for right now?
    const spend = value ?? '100MB';

    if (await limitrAllow(customerId, 'storage', spend)) {
        
        // Upload document here - user is allowed to use this additional storage

        res.json({ success: true, message: `successfully added ${spend} of storage` });
    } else {
        res.json({ success: false, message: 'denied: storage limit exceeded' });
    }
});


app.post('/api/change-seats', async (req, res) => {
    const { customerId, value } = req.body;
    
    // How many seats are we adding/removing right now?
    const seats = value ?? 1;

    if (await limitrAllow(customerId, 'seats', seats)) {
        
        // Send invite to another user here to join our customer

        res.json({ success: true, message: `successfully added ${seats} seat(s)` });
    } else {
        res.json({ success: false, message: 'denied: seat limit exceeded' });
    }
});


app.listen(port, () => { console.log(`Server running at http://localhost:${port}`); });
