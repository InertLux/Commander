
const MetaService = require("./meta.service");

console.log("Meta routes loaded");

module.exports = {
    // GET /encyclopedia
    getAllEncyclopediaEntries: (req, res) => {
        try {
            const entries = MetaService.getAllEncyclopediaEntries();
            res.json(entries);
        } catch (err) {
            console.error("Error fetching encyclopedia entries:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // GET /encyclopedia/:id
    getEncyclopediaEntry: (req, res) => {
        try {
            const id = req.params.id;
            const entry = MetaService.getEncyclopediaEntry({ id });

            if (!entry) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json(entry);
        } catch (err) {
            console.error("Error fetching encyclopedia entry:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // POST /encyclopedia
    addEncyclopediaEntry: (req, res) => {
        try {
            const { name, description, tags, text } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }

            const id = MetaService.addEncyclopediaEntry({
                name,
                description,
                tags,
                text
            });

            res.json({ id });
        } catch (err) {
            console.error("Error adding encyclopedia entry:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // DELETE /encyclopedia/:id
    removeEncyclopediaEntry: (req, res) => {
        try {
            const id = req.params.id;

            const result = MetaService.removeEncyclopediaEntry({ id });

            if (result.changes === 0) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json({ success: true });
        } catch (err) {
            console.error("Error removing encyclopedia entry:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },


    // GET /encyclopedia/:id/text
    getEncyclopediaEntryText: (req, res) => {
        try {
            const id = req.params.id;
            const entry = MetaService.getEncyclopediaEntryText({ id });

            if (!entry) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json(entry);
        } catch (err) {
            console.error("Error fetching encyclopedia entry:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    // PATCH /encyclopedia/:id/text
    setEncyclopediaEntryText: (req, res) => {
        try {
            const id = req.params.id;
            const { text } = req.body;

            const result = MetaService.setEncyclopediaEntryText({ id, text });

            if (result.changes === 0) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json({ success: true });
        } catch (err) {
            console.error("Error updating encyclopedia text:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // PATCH /encyclopedia/:id/description
    setEncyclopediaEntryDescription: (req, res) => {
        try {
            const id = req.params.id;
            const { text } = req.body;

            const result = MetaService.setEncyclopediaEntryDescription({ id, text });

            if (result.changes === 0) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json({ success: true });
        } catch (err) {
            console.error("Error updating encyclopedia description:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // PATCH /encyclopedia/:id/tags
    setEncyclopediaEntryTags: (req, res) => {
        try {
            const id = req.params.id;
            const { text } = req.body;

            const result = MetaService.setEncyclopediaEntryTags({ id, text });

            if (result.changes === 0) {
                return res.status(404).json({ error: "Entry not found" });
            }

            res.json({ success: true });
        } catch (err) {
            console.error("Error updating encyclopedia tags:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

console.log("Controller exports:", module.exports);