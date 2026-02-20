import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());


// Create a single Limitr policy
import { Limitr } from '@formata/limitr';
const policy = await Limitr.cloud({ token: 'lmlive_W80FjPoWoiUWY3EGhojcJjAQQSaJ' });


app.post('/api/ai-chat', async (req, res) => {
    const { customerId, value } = req.body;
    
    // Count tokens for input (free apis)
    const spend = value ?? 1000;
    let message = `unlimited: spent ${spend} tokens`;
    await policy.ensureCustomer(customerId, 'free', 'user', 'Demo User');

    if (await policy.allow(customerId, 'unlimited')) {
        res.json({ message });
        return;
    }
    
    if (await policy.allow(customerId, 'tokens', spend)) {
        // Call to LLM
        message = `allowed: spent ${spend} tokens`;
    } else {
        const limit = await policy.limit(customerId, 'tokens');
        const current = await policy.value(customerId, 'tokens');
        message = `denied: ${current + spend} is over the limit of ${limit}`;
    }
    res.json({ message });
});


app.listen(port, () => { console.log(`Server running at http://localhost:${port}`); });
