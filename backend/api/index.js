module.exports = (req, res) => {
  res.status(200).json({
    message: "Backend API is working!",
    success: true,
    timestamp: new Date().toISOString()
  });
};
