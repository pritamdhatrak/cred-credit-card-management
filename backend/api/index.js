module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'CRED Backend API is working!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: 'POST /api/user/signup',
      login: 'POST /api/user/login'
    }
  });
};
