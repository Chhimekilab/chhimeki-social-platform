const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3001;

// Mock data
const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
  posts: [
    { id: 1, title: 'Hello World', content: 'This is a test post', userId: 1 },
    { id: 2, title: 'Another Post', content: 'Another test post', userId: 2 },
  ],
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  // Routes
  if (path === '/api/users' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.users));
  } else if (path === '/api/posts' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.posts));
  } else if (path === '/api/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});