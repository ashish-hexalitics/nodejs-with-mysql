const mysql = require("mysql2/promise");

// Establish a database connection function
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Hexa@123!#$",
      database: "customer",
    });
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

module.exports = connectToDatabase;
