const {
  getTableData,
  insertDataToInTable,
  findAndDeleteTableData,
  findAndUpdateTableData,
} = require("../db/query");
const { users } = require("../db/dbConstant");

exports.getUsers = async (req, res) => {
  try {
    const page = req?.query?.page || 0;
    const limit = req?.query?.limit || 5;
    const data = await getTableData(users, {
      where: {},
      limit,
      page,
      logic: "AND",
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req?.params?.id
    const data = await getTableData(users, {
      where: {id}
    });
    res.status(200).json({data:data.data[0]});
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const dataToInsert = {
      body: {
        name: "example",
        email: "example@example.com",
      },
    };
    const result = await insertDataToInTable(users, dataToInsert);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const dataToDelete = {
      where: {
        id,
      },
    };
    const result = await findAndDeleteTableData(users, dataToDelete);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const dataToUpdate = {
      where: { id },
      body: req.body,
    };
    const result = await findAndUpdateTableData(users, dataToUpdate);
    res.status(200).json(result); // Send the result back to the client
  } catch (error) {
    console.error("Error in main application:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
