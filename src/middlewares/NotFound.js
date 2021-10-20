module.exports = (_req, res) => {
  res
    .status(404)
    .send({ message: 'Esta pagina não existe' })
}