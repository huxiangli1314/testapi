export default function handler(req, res) {
  res.status(200).json({
    message: '你好！API 接口运行正常 ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    docker: process.env.DOCKER === 'true',
  });
}
