const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors( storeController.getStores ));
router.get('/stores', catchErrors( storeController.getStores ));
router.get('/stores/page/:page', catchErrors( storeController.getStores ));

// Store add
router.get('/add', 
  authController.isLoggedIn,
  storeController.addStore
);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
// Store edit
router.get('/store/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// Tags
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// login and register
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', 
  authController.isLoggedIn,
  userController.account
);

router.post('/account',
  authController.isLoggedIn,
  catchErrors( userController.updateAccount )
);

router.post('/account/forgot',
  catchErrors(authController.forgot)
);

router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.resetPassword)
);

router.get('/map', storeController.mapPage);
router.get('/hearts',
  authController.isLoggedIn,
  catchErrors(storeController.hearts)
);

router.post('/reviews/:store_id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);
router.get('/top', catchErrors(storeController.getTopStores));

//API endpoint
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
