// Functions for application endpoints
exports.version = (req, res) => {
  const { VERSION } = process.env;
  res.send(`Service v${VERSION}`);
};
