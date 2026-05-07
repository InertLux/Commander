const express = require("express");
const router = express.Router();
const metaController = require("./meta.controller");



// GET /encyclopedia
router.get("/", metaController.getAllEncyclopediaEntries);

// GET /encyclopedia/:id
router.get("/:id", metaController.getEncyclopediaEntry);

// POST /encyclopedia
router.post("/", metaController.addEncyclopediaEntry);

// DELETE /encyclopedia/:id
router.delete("/:id", metaController.removeEncyclopediaEntry);

// PATCH /encyclopedia/:id/text
router.get("/:id/text", metaController.getEncyclopediaEntryText);

// PATCH /encyclopedia/:id/text
router.patch("/:id/text", metaController.setEncyclopediaEntryText);

// PATCH /encyclopedia/:id/description
router.patch("/:id/description", metaController.setEncyclopediaEntryDescription);

// PATCH /encyclopedia/:id/tags
router.patch("/:id/tags", metaController.setEncyclopediaEntryTags);

module.exports = router;