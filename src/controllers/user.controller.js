var { addUser, findById, findByProperty, countAll, updateById, deleteById} = require("../application/use_cases/user.usecases");

function userController(
    userRepository,
    userRepositoryImpl,
    authServiceInterface,
    authServiceImpl
  ) {
    const dbRepository = userRepository(userRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
  
    const fetchUsersByProperty = (req, res, next) => {
      const params = {};
      const response = {};
  
      for (const key in req.query) {
        if (Object.prototype.hasOwnProperty.call(req.query, key)) {
          params[key] = req.query[key];
        }
      }

      params.page = params.page ? parseInt(params.page, 10) : 1;
      params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
  
      findByProperty(params, dbRepository)
        .then((users) => {
          response.users = users;
          return countAll(params, dbRepository);
        })
        .then((totalItems) => {
          response.totalItems = totalItems;
          response.totalPages = Math.ceil(totalItems / params.perPage);
          response.itemsPerPage = params.perPage;
          return res.json(response);
        })
        .catch((error) => next(error));
    };
  
    const fetchUserById = (req, res, next) => {
      findById(req.params.id, dbRepository)
        .then((user) => res.json(user))
        .catch((error) => next(error));
    };
  
    const addNewUser = (req, res, next) => {
      const { username, password, role } = req.body;

      addUser(
        username,
        password,
        role,
        dbRepository,
        authService
      )
        .then((user) => res.json(user))
        .catch((error) => next(error));
    };

    const updateUserById = (req, res, next) => {
      const { username, password, role, createdAt, monthlyBudget, dailyCaloryLimit } = req.body;

      updateById({
        id: req.params.id,
        username: username,
        password: password,
        role: role,
        monthlyBudget: monthlyBudget,
        createdAt: createdAt,
        dailyCaloryLimit: dailyCaloryLimit,
        userRepository: dbRepository
      })
        .then((message) => res.json(message))
        .catch((error) => next(error));
    };

    const deleteUserById = (req, res, next) => {
      deleteById(req.params.id, dbRepository)
        .then(() => res.json({'message':'user sucessfully deleted!'}))
        .catch((error) => next(error));
    };

    const getUserMetadata = (req, res, next) => {
      const params = {};
      const response = {};
  
      // setDateRage prev week 
      params.createdAt = { 
        $gt: moment().subtract(14, "days"), 
        $lt: moment().subtract(7, "days")
      };
      
      countAll(params, dbRepository)
        .then((countPrevWeek) => {
          response.newUserPrevWeek = countPrevWeek;
          // setDateRage this week
          params.createdAt = { 
            $gt: moment().subtract(7, "days"), 
            $lt: moment()
          }; 
          return countAll(params, dbRepository);
        })
        .then((countThisWeek) => {
          response.newUserThisWeek = countThisWeek;
          params.createdAt = {}; 
          return countAll(params, dbRepository);
        })
        .then((totalCount) => {
          response.totalUserCount = totalCount; 
          return res.json(response);
        })
        .catch((error) => next(error));
    };
  
    return {
      fetchUsersByProperty,
      fetchUserById,
      addNewUser,
      updateUserById,
      deleteUserById
    };
  }

  module.exports = userController;