const User = require('../../utils/db-helper').User;
const bcrypt = require('bcryptjs');
const baseHelper = require('../../helpers/baseHelper');

// there must be only one admin
const insertAdminUser = async() => {
    const dbUser = await User.findOne({ role: 'A' });
    if (!dbUser) {
        console.log('Creating admin user');
        let user = new User();
        user.name = 'Ricardo Louro';
        user.username = 'ricardo_louro';
        user.email = 'ricardo.louro@gmail.com';
        user.role = 'A';
        user.hash = bcrypt.hashSync('12345', 10);

        // save user
        user = await user.save();

        user = baseHelper.setCreatedMeta(user, user.id);

        return await user.save();
    }

    console.log('Admin user already created');
};

module.exports = {
    insertAdminUser
};