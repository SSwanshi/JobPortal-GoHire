const {getPremiumUsers} = require('../controllers/admin.controller');

const premiumService = {
  PremiumUserService: {
    PremiumUserPort: {
      GetPremiumUsers: getPremiumUsers
    }
  }
};

module.exports = premiumService;
