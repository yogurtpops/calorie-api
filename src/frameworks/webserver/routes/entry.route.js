var entryController = require('../../../controllers/entry.controller');
var entryRepository = require('../../../application/repositories/entry.repository');
var entryRepositoryMongoDB = require('../../database/mongoDB/repositories/entry.repository');
var { authMiddleware, isAdmin, verifyUser } = require('../middlewares/auth.middleware');
var userRepository = require('../../../application/repositories/user.repository');
var userRepositoryMongoDB = require ('../../database/mongoDB/repositories/user.repository');

function entryRouter (express) {
  const router = express.Router();
  const controller = entryController(
    entryRepository,
    entryRepositoryMongoDB,
    userRepository,
    userRepositoryMongoDB
  );

  // get all entries, delete entry & edit entry require admin role 
  router
    .route('/')
    .get(
      [authMiddleware, isAdmin],
      controller.fetchAllEntries
    );
  router.route('/metadata').get([authMiddleware, isAdmin], controller.getEntryMetadata);
  router.route('/:id').put([authMiddleware, isAdmin], controller.updateEntryById);
  router.route('/:id').delete([authMiddleware, isAdmin], controller.deleteEntryById);

  // get user entries & create entry for any role
  router.route('/:user/all').get([authMiddleware, verifyUser], controller.fetchEntriesByProperty);
  router.route('/').post(authMiddleware, controller.addNewEntry);

  return router;
}

module.exports = entryRouter;