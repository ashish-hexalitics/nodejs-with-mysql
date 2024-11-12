const {
  getTableData,
  insertDataToInTable,
  findAndDeleteTableData,
  findAndUpdateTableData,
} = require("../db/query");
const { items } = require("../db/dbConstant");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

exports.createItem = async (req, res) => {
  try {
    const dataToInsert = {
      body: {
        itemName: req.body.itemName,
        itemDesc: req.body.itemDesc,
        qty: req.body.qty,
        price: req.body.price,
      },
    };
    const result = await insertDataToInTable("items", dataToInsert);

    const itemId = result.data.id;
    const itemDetailsUrl = `https://ashish-vishwakarma-portfolio.netlify.app/items/${itemId}`;

    // Define the path for the QR code image
    const qrCodeDir = path.join(__dirname, "qrcodes");
    const qrCodePath = path.join(qrCodeDir, `item_${itemId}.png`);

    // Ensure the directory exists
    if (!fs.existsSync(qrCodeDir)) {
      fs.mkdirSync(qrCodeDir, { recursive: true });
    }

    // Generate and save the QR code to a file
    await QRCode.toFile(qrCodePath, itemDetailsUrl);

    // const qrCodeImage = await QRCode.toDataURL(itemDetailsUrl);
    // console.log(qrCodeImage);  

    // Return the publicly accessible QR code URL
    res.status(201).json({
      message: "Item created successfully",
      data: result.data,
      qrCodeUrl: `https://yourdomain.com/qrcodes/item_${itemId}.png`,
    });
  } catch (error) {
    console.error("Error in main application:", error.message);
    res.status(500).json({ error: "Failed to create item and generate QR code" });
  }
};

exports.getItembyId = async (req, res) => {
  try {
    const id = req?.params?.itemId;
    const data = await getTableData(items, {
      where: { id },
    });
    res.status(200).json({ data: data.data[0] });
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = req?.params?.itemId;
    const dataToDelete = {
      where: {
        id,
      },
    };
    const result = await findAndDeleteTableData(items, dataToDelete);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const id = req.params.itemId;
    const dataToUpdate = {
      where: { id },
      body: req.body,
    };
    const result = await findAndUpdateTableData(items, dataToUpdate);
    res.status(200).json(result); // Send the result back to the client
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.getAllUserItem = async (req, res) => {
  try {
    const page = req?.query?.page || 0;
    const limit = req?.query?.limit || 5;
    const userId = req?.params?.userId;

    const data = await getTableData(items, {
      where: { userId },
      limit,
      page,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};
