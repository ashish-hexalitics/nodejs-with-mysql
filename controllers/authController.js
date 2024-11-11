const {
  getTableData,
  insertDataToInTable,
  findAndDeleteTableData,
  findAndUpdateTableData,
} = require("../db/query");
const { users } = require("../db/dbConstant");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (!data.data.length) {
      return res.status(401).json({ message: "invailed  credentials" });
    }

    const isPasswordMatched = await bcrypt.compareSync(
      password,
      data.data[0].password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "invailed  credentials" });
    }

    const token = await jwt.sign(data.data[0], process.env.JWT_PASS_KEY);

    res.status(200).json({ data: { ...data.data[0], token } });
  } catch (error) {
    console.error("Error in main application:", error.message);
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (data.data.length) {
      return res
        .status(409)
        .json({ message: "user already exist with that email" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    req.body.password = hash;

    const token = await jwt.sign(req.body, process.env.JWT_PASS_KEY, {
      expiresIn: "1h",
    });

    const dataToInsert = {
      body: req.body,
    };

    const result = await insertDataToInTable(users, dataToInsert);

    res.status(200).json({ data: { ...result.data, token } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendforgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (!data.data.length) {
      return res
        .status(404)
        .json({ message: "user not found with that email" });
    }
    const otp = Math.round(Math.random() * 10000);
    const dataToUpdate = {
      where: { email },
      body: { otp: otp },
    };
    const result = await findAndUpdateTableData(users, dataToUpdate);
    res.status(200).json({ message: "OTP Sent", otp: otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.matchforgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (!data.data.length) {
      return res.status(404).json({
        message: "user not found with that email",
        isMatchedOtp: false,
      });
    }

    const isMatchedOtp = data.data[0].otp === otp;

    if (!isMatchedOtp) {
      return res.status(401).json({ message: "invailed otp", isMatchedOtp });
    }

    res.status(200).json({ message: "matched otp", isMatchedOtp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (!data.data.length) {
      return res.status(404).json({
        message: "user not found with that email",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const dataToUpdate = {
      where: { email },
      body: { password: hash, otp: null },
    };

    const result = await findAndUpdateTableData(users, dataToUpdate);

    res.status(200).json({
      data: {
        ...result.data,
        message: "changed password success",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPasword = async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;

    const data = await getTableData(users, {
      where: { email },
    });

    if (!data.data.length) {
      return res.status(404).json({
        message: "user not found with that email",
        isPasswordMatched: false,
      });
    }

    const isPasswordMatched = await bcrypt.compareSync(
      oldPassword,
      data.data[0].password
    );

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ message: "invailed old password", isPasswordMatched });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const dataToUpdate = {
      where: { email },
      body: { password: hash },
    };
    const result = await findAndUpdateTableData(users, dataToUpdate);

    res.status(200).json({
      data: {
        ...result.data,
        message: "changed password success",
        isPasswordMatched,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
