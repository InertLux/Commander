const Meta = require("./meta.model");

module.exports = {

    getAllEncyclopediaEntries:() => {
        return Meta.getAllEncyclopediaEntries();
    },
    getEncyclopediaEntry:(data) => {
        return Meta.getEncyclopediaEntry(data.id);
    },
    addEncyclopediaEntry:(data) => {
        return Meta.addEncyclopediaEntry(data.name, data.description, data.tags, data.text);
    },
    removeEncyclopediaEntry:(data) => {
        return Meta.removeEncyclopediaEntry(data.id);
    },
    getEncyclopediaEntryText:(data) => {
        return Meta.getEncyclopediaEntryText(data.id);
    },
    setEncyclopediaEntryText:(data) => {
        return Meta.setEncyclopediaEntryText(data.id, data.text);
    },
    setEncyclopediaEntryDescription:(data) => {
        return Meta.setEncyclopediaEntryDescription(data.id, data.text);
    },
    setEncyclopediaEntryTags:(data) => {
        return Meta.setEncyclopediaEntryTags(data.id, data.text);
    }
}