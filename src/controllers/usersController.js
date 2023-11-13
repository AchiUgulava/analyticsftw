// usersController.js
const {User, sequelize, Chat, Message} = require('../db');
const { Op } = require('sequelize');

exports.getSortedUsers = async function(req, res) {
  try {
    // Default sorting if none is provided
    const defaultSort = { name: 'last_login', asc: 'desc' };

    // Extract sorting options from request
    const sortOption = req.body.sortby || defaultSort;
    const sortDirection = sortOption.asc === 'asc' ? 'ASC' : 'DESC';
    const sortField = sortOption.name || defaultSort.name;

    // Pagination settings
    const page = parseInt(req.body.page, 10) || 0;
    const limit = 50;
    const offset = (page) * limit;

    // Fetch filtered users
    const users = await User.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Chats.user_id')), 'chat_count']
        ]
      },
      include: [
        {
          model: Chat,
          as: 'Chats', // Specify the alias here
          attributes: [],
          duplicating: false
        }
      ],
      group: ['User.user_id'],
      order: [[sortField, sortDirection]],
      limit: limit,
      offset: offset
    });

  //   const [results, metadata] = await sequelize.query(`
  //   SELECT
  //     User.*,
  //     (SELECT COUNT(*) FROM chats WHERE chats.user_id = User.user_id) AS chat_count
  //   FROM
  //     (SELECT * FROM users ORDER BY ${sortField} ${sortDirection} LIMIT ${limit} OFFSET ${offset}) AS User
  //   LEFT JOIN chats ON User.user_id = chats.user_id
  //   GROUP BY User.user_id
  // `);
  
  
  // console.log(`sortField: ${sortField}, sortDirection: ${sortDirection}, limit: ${limit}, offset: ${offset}, metadate ${metadata}`);
  

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.userCount = async function(req, res) {
  try {
    // Extract filter options from the request
    const filterField = req.body.filterField;
    const filterValue = req.body.filterValue;

    // Build the filter condition
    let filterCondition = {};
    if (filterField && filterValue) {
      filterCondition[filterField] = {
        [Op.like]: `%${filterValue}%`
      };
    }

    // Count users with the given filter condition
    const count = await User.count({
      where: filterCondition
    });

    console.log(count);
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};




exports.getSortedAndFilteredUsers = async function(req, res) {
  try {
    // Sorting
    const defaultSort = { name: 'last_login', asc: 'desc' };
    const sortOption = req.body.sortby || defaultSort;
    const sortDirection = sortOption.asc === 'asc' ? 'ASC' : 'DESC';
    const sortField = sortOption.name || defaultSort.name;

    // Pagination
    const page = parseInt(req.body.page, 10) || 0;
    const limit = 50;
    const offset = page * limit;

    // Filtering
    const filterField = req.body.filterField; // The field to filter on (e.g., 'name', 'email')
    const filterValue = req.body.filterValue; // The substring to filter with

    let filterCondition = {};
    if (filterField && filterValue) {
      filterCondition[filterField] = { [Op.like]: `%${filterValue}%` };
    }

    // Fetch users with sorting, pagination, and filtering
    const users = await User.findAll({
      where: filterCondition,
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Chats.user_id')), 'chat_count']
        ]
      },
      include: [
        {
          model: Chat,
          as: 'Chats',
          attributes: [],
          duplicating: false
        }
      ],
      group: ['User.user_id'],
      order: [[sortField, sortDirection]],
      limit: limit,
      offset: offset
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.getByEmail = async function(req, res) {
  try {
    const email = req.body.email;

    // Find the user by email
    const user = await User.findOne({
      where: { email: email },
      include: [{
        model: Chat,
        as: 'Chats',
        include: [{
          model: Message,
          as: 'Messages', // Include messages for each chat
          order: [
            ['timestamp', 'ASC'],
            ['seq_num', 'ASC']
          ]
        }]
      }]
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
