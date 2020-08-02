//for refactor all try_catch blocks
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
