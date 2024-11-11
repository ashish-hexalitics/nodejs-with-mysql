const {
  getTableData,
  insertDataToInTable,
  findAndDeleteTableData,
  findAndUpdateTableData,
} = require("../db/query");
const { users, posts } = require("../db/dbConstant");

exports.createPost = async (req, res) => {
  try {
    const dataToInsert = {
      body: {
        title: "hi",
        description: "hello",
        userId: 4,
      },
    };
    const result = await insertDataToInTable(posts, dataToInsert);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.getePostbyId = async (req, res) => {
  try {
    const id = req?.params?.postId;
    const data = await getTableData(posts, {
      where: { id },
    });
    res.status(200).json({ data: data.data[0] });
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req?.params?.postId;
    const dataToDelete = {
      where: {
        id,
      },
    };
    const result = await findAndDeleteTableData(posts, dataToDelete);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const id = req.params.postId;
    const dataToUpdate = {
      where: { id },
      body: req.body,
    };
    const result = await findAndUpdateTableData(posts, dataToUpdate);
    res.status(200).json(result); // Send the result back to the client
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.getAllUserPosts = async (req, res) => {
  try {
    const page = req?.query?.page || 0;
    const limit = req?.query?.limit || 5;
    const userId = req?.params?.userId;

    const data = await getTableData(posts, {
      where: { userId },
      limit,
      page,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};
