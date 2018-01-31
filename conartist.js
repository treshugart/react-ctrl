const { config, preset } = require("conartist");

module.exports = config(preset.base(), preset.jest(), preset.enzyme());
