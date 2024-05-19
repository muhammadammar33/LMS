const Head = require("../models/head");

const getHeadById = async (req, res, next) => {
  try {
    const { hid } = req.params;

    const head = await Head.findById(hid);

    if (!head) {
      return res.status(404).send({ error: "Head not found" });
    }

    res.status(200).send(head);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { getHeadById };