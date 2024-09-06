const bcrypt = require('bcrypt');

// Function to hash a password
const hashPassword = async (password) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

// Example usage
const main = async () => {
    const password = 'Pass@123';  // Replace with the password you want to hash
    const hashedPassword = await hashPassword(password);
    console.log('Plain Password:', password);
    console.log('Hashed Password:', hashedPassword);
};

main();
