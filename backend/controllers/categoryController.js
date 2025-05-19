import { sql } from "../config/db.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await sql`
        SELECT id, name FROM categories
        ORDER BY name 
    `;

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.log("Error getting categories: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
