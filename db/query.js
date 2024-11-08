const mysql = require("mysql2/promise");
const connectToDatabase = require("./config");

const getTableData = async (table_name, data) => {
  const connection = await connectToDatabase();
  const {
    column_name = null,
    value = null,
    limit = 10,
    page = 0,
    sort_column = "id",
    sort_order = "asc",
    where = {},
    logic = "AND",
  } = data;

  try {
    let sql = `SELECT * FROM ${mysql.escapeId(table_name)}`;

    if (Object.keys(where).length) {
      let whereClauses = [];
      Object.keys(where).forEach((key, index) => {
        const condition = `${mysql.escapeId(key)} = ${mysql.escape(
          where[key]
        )}`;
        whereClauses.push(condition);
      });

      sql += ` WHERE ${whereClauses.join(` ${logic} `)}`;
    }

    // Add ORDER BY clause
    sql += ` ORDER BY ${mysql.escapeId(sort_column)} ${
      sort_order === "asc" ? "ASC" : "DESC"
    }`;

    // Add LIMIT and OFFSET
    sql += ` LIMIT ${limit} OFFSET ${page}`;

    const params =
      column_name && value !== null ? [value, limit, page] : [limit, page];

    const [rows] = await connection.execute(sql, params);

    return { data: rows, limit, page: page };
  } catch (error) {
    console.error(
      `Error fetching data from table ${table_name}:`,
      error.message
    );
    throw error;
  } finally {
    await connection.end();
  }
};

const insertDataToInTable = async (table_name, data) => {
  const connection = await connectToDatabase();
  const { body = {} } = data;

  try {
    const columns = Object.keys(body).map((key) => mysql.escapeId(key));
    const values = Object.values(body).map((value) => mysql.escape(value));

    let sql = `INSERT INTO ${mysql.escapeId(table_name)} (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")})`;

    // Execute the query
    const [result] = await connection.execute(sql);

    return { data: { id: result.insertId, ...body } };
  } catch (error) {
    console.error(
      `Error inserting data into table ${table_name}:`,
      error.message
    );
    throw error;
  } finally {
    await connection.end();
  }
};

const findAndDeleteTableData = async (table_name, data) => {
  const connection = await connectToDatabase();
  const { where = {} } = data;
  try {
    let whereClauses = [];
    const params = [];
    
    for (const [key, value] of Object.entries(where)) {
      whereClauses.push(`${mysql.escapeId(key)} = ?`);
      params.push(value);
    }

    if (whereClauses.length === 0) {
      throw new Error("No conditions provided for deletion.");
    }

    let selectSql = `SELECT * FROM ${mysql.escapeId(table_name)} WHERE ${whereClauses.join(" AND ")}`;
    const [rows] = await connection.execute(selectSql, params);
    
    if (rows.length === 0) {
      return { message: "No records found to delete." };
    }

    let deleteSql = `DELETE FROM ${mysql.escapeId(table_name)} WHERE ${whereClauses.join(" AND ")}`;
    await connection.execute(deleteSql, params);

    return {
      message: "Data deleted successfully.",
      deletedData: rows, 
    };
  } catch (error) {
    console.error(`Error deleting data from table ${table_name}:`, error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

const findAndUpdateTableData = async (table_name, data) => {
  const connection = await connectToDatabase();
  const { where = {}, body = {} } = data;

  try {
    let whereClauses = [];
    const whereParams = [];
    
    for (const [key, value] of Object.entries(where)) {
      whereClauses.push(`${mysql.escapeId(key)} = ?`);
      whereParams.push(value);
    }
    
    if (whereClauses.length === 0) {
      throw new Error("No conditions provided for update.");
    }
    
    let setClauses = [];
    const setParams = [];
    
    for (const [key, value] of Object.entries(body)) {
      setClauses.push(`${mysql.escapeId(key)} = ?`);
      setParams.push(value);
    }
    
    if (setClauses.length === 0) {
      throw new Error("No data provided to update.");
    }
    
    let selectSql = `SELECT * FROM ${mysql.escapeId(table_name)} WHERE ${whereClauses.join(" AND ")}`;
    const [rows] = await connection.execute(selectSql, whereParams);
    
    if (rows.length === 0) {
      return { message: "No records found to update." };
    }

    let updateSql = `UPDATE ${mysql.escapeId(table_name)} SET ${setClauses.join(", ")} WHERE ${whereClauses.join(" AND ")}`;
    await connection.execute(updateSql, [...setParams, ...whereParams]);

    return {
      message: "Data updated successfully.",
      updatedData: { id: rows[0].id, ...body }, 
    };
  } catch (error) {
    console.error(`Error updating data in table ${table_name}:`, error.message);
    throw error;
  } finally {
    await connection.end();
  }
};


module.exports = {
  getTableData,
  insertDataToInTable,
  findAndDeleteTableData,
  findAndUpdateTableData
};
