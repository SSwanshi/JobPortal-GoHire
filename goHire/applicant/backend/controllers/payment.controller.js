const User = require('../models/user');
const PremiumUser = require('../models/premium_user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Please login to buy Premium.' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100, // Convert to cents
      currency: 'inr',
      metadata: {
        userId: user.userId,
        email: user.email,
        plan: plan
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

const getPaymentPage = async (req, res) => {
  try {
    res.json({ message: 'Payment page data' });
  } catch (error) {
    console.error('Payment page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const processPayment = async (req, res) => {
  try {
    const { paymentIntentId, plan, amount } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Please login to Buy the Premium.' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Check if already premium
    const existingPremiumUser = await PremiumUser.findOne({ email: user.email });
    if (existingPremiumUser) {
      const isExpired = existingPremiumUser.planExpiry && new Date() > new Date(existingPremiumUser.planExpiry);
      if (!isExpired) {
        return res.status(400).json({ error: 'User is already an active premium member' });
      }
      // If expired, remove the old record to allow creation of a new one
      await PremiumUser.deleteOne({ email: user.email });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    let planType = 'monthly';
    if (plan === 'annual' || amount === '2999') {
      planType = 'annual';
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Create premium user
    const premiumUser = new PremiumUser({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      password: user.password,
      resumeId: user.resumeId,
      plan: planType,
      planExpiry: expiryDate
    });

    await premiumUser.save();

    // Determine subscription plan based on amount for response
    let subscriptionPlan = planType === 'annual' ? 'Annual Premium Plan' : 'Monthly Premium Plan';

    res.json({
      success: true,
      transactionId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toString(),
      subscriptionPlan,
      paymentDetails: {
        method: 'stripe',
        amount: (paymentIntent.amount / 100).toString(),
        transactionId: paymentIntent.id,
        status: paymentIntent.status
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment failed. Please try again.' });
  }
};

const getReceipt = async (req, res) => {
  try {
    res.json({ message: 'Receipt data' });
  } catch (error) {
    console.error('Receipt error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubscription = async (req, res) => {
  try {
    res.json({ message: 'Subscription page data' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTerms = async (req, res) => {
  try {
    res.json({ message: 'Terms of Service' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPrivacy = async (req, res) => {
  try {
    res.json({ message: 'Privacy Policy' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPaymentIntent,
  getPaymentPage,
  processPayment,
  getReceipt,
  getSubscription,
  getTerms,
  getPrivacy
};

