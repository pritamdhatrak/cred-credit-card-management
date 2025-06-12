export default function handler(req, res) {
  res.status(200).json({
    message: 'Backend is working!',
    success: true,
    timestamp: new Date().toISOString()
  });
}
