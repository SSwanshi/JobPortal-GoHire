const fs = require('fs');
const path = require('path');

// Helper to parse simple key=value .env file
const parseEnvFile = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const env = {};
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    });
    return env;
  } catch (err) {
    return null;
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    // Attempt to read applicant backend .env for Stripe credentials
    const envPath = path.resolve(__dirname, '..', '..', 'applicant', 'backend', '.env');
    let env = parseEnvFile(envPath);

    // Fallback: try relative from recruiter root
    if (!env) {
      const altPath = path.resolve(__dirname, '..', '..', '..', 'applicant', 'backend', '.env');
      env = parseEnvFile(altPath);
    }

    if (!env || (!env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY)) {
      return res.status(500).json({ success: false, message: 'Stripe configuration missing' });
    }

    const stripeSecret = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    const stripe = require('stripe')(stripeSecret);

    // Only supporting Pro monthly plan for now
    const PRICE_INR = 999; // as per spec
    const unitAmount = PRICE_INR * 100; // in paise

    const origin = process.env.FRONTEND_URL || req.headers.origin || `http://localhost:5175`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Recruiter Pro - Monthly',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/profile?checkout=success`,
      cancel_url: `${origin}/profile?checkout=cancel`,
      metadata: {
        recruiterId: req.userId ? String(req.userId) : 'unknown'
      }
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCheckoutSession
};
