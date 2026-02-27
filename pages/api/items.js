let items = [];
let nextId = 1;

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ items });

    case 'POST': {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: '名称不能为空' });
      const item = { id: nextId++, name, createdAt: new Date().toISOString() };
      items.push(item);
      return res.status(201).json(item);
    }

    case 'DELETE': {
      const id = parseInt(req.query.id);
      items = items.filter(item => item.id !== id);
      return res.status(200).json({ success: true });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `不支持 ${req.method} 方法` });
  }
}
