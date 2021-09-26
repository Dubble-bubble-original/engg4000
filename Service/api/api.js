// Functions for application endpoints
exports.version = (req, res) => {
    const VERSION = process.env.VERSION;
    res.send(`Service v${VERSION}`);
};
