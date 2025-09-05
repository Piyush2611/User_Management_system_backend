const database = require("..");

exports.getAllSection = async (req, res) => {
  try {
    const sections = await database.section.findAll();

    res.status(200).json({
      code: 200,
      message: 'Sections retrieved successfully.',
      data: sections,
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error.',
    });
  }
};