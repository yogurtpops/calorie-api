var user = require("../../entities/user");

function addUser(
    username,
    password,
    role,
    userRepository,
    authService
  ) {
    if (!username || !password) {
      throw new Error('username and password fields cannot be empty');
    }
  
    const newUser = user(
      username,
      authService.encryptPassword(password),
      role
    );
  
    return userRepository
      .findByProperty({ username })
      .then((userWithUsername) => {
        if (userWithUsername.length) {
          throw new Error(`User with username: ${username} already exists`);
        }
        return userRepository.add(newUser);
      });

  }

  function countAll(params, userRepository) {
    return userRepository.countAll(params);
  }

  function findById(id, userRepository) {
    return userRepository.findById(id);
  }

  function findByProperty(params, userRepository) {
    return userRepository.findByProperty(params);
  }

  function updateById({
    id,
    username,
    role,
    monthlyBudget,
    createdAt,
    dailyCaloryLimit,
    weeklyAverage,
    userRepository
  }) {
    const updatedUser = user({ 
      username: username,
      password: '',
      role: role,
      createdAt: createdAt,
      monthlyBudget: monthlyBudget,
      weeklyAverage: weeklyAverage,
      dailyCaloryLimit: dailyCaloryLimit 
    });

    return userRepository.findById(id).then((user) => {
      if (!user) {
        throw new Error(`No user found with id: ${id}`);
      }

      return userRepository.updateById(id, updatedUser);
    });
  }


  function deleteById(id, userRepository) {
    return userRepository.findByProperty(id).then((user) => {
      if (!user) {
        throw new Error(`No user found with id: ${id}`);
      }
      return userRepository.deleteById(id);
    });
  }

  module.exports = {addUser, countAll, findById, findByProperty, updateById, deleteById}
