export default function handler(req, res) {
  res.status(200).json({
    message: "CRED Backend API is working!",
    success: true,
    timestamp: new Date().toISOString()
  });
}
