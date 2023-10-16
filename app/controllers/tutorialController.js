const { tutorialCollection } = require("../schema/tutorial");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * Create and Save a new Tutorial
 */
const create = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const tutorial = await tutorialCollection.create({
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    });

    res.send({
      isRequestSuccesful: true,
      message: "Tutorial  Added Successfully",
      tutorial,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Tutorial.",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Retrieve all Tutorials from the database
 */
const findAll = async (req, res) => {
  const title = req.query.title;
  let condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  try {
    const alltutorial = await tutorialCollection.find(condition);
    res.send(alltutorial);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Find a single Tutorial with an id
 */
const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const tutorialId = await tutorialCollection.findById(id);

    if (!tutorialId)
      res.status(404).send({ message: "Not found Tutorial with id " + id });
    else res.send(tutorialId);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving Tutorial with id=" + id });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * Update a Tutorial by the id in the request
 */
const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  try {
    const updateTutorial = await tutorialCollection.findByIdAndUpdate(
      id,
      req.body,
      { useFindAndModify: false }
    );

    if (!updateTutorial) {
      res.status(404).send({
        message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
      });
    } else res.send({ message: "Tutorial was updated successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id,
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Delete a Tutorial with the specified id in the request
 */

const deletes = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteTutorial = await tutorialCollection.findByIdAndRemove(id);

    if (!deleteTutorial) {
      res.status(404).send({
        message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
      });
    } else {
      res.send({
        message: "Tutorial was deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Tutorial with id=" + id,
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Delete all Tutorials from the database
 */
const deleteAll = async (req, res) => {
  try {
    await tutorialCollection.deleteMany({});
    res.send({
      message: `${data.deletedCount} Tutorials were deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all tutorials.",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Find all Tutorials with published = true
 */
const findAllpublished = async (req, res) => {
  try {
    const publishedTutorial = await tutorialCollection.find({
      published: true,
    });
    res.send(publishedTutorial);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deletes,
  deleteAll,
  findAllpublished,
};
