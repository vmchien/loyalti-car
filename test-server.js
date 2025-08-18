const http = require('http');
const url = require('url');

// Mock data
const mockCustomers = [
  {
    id: "1",
    fullName: "Nguyễn Văn An",
    phone: "0123456789",
    email: "nguyen.van.an@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    dateOfBirth: "1990-01-15",
    gender: "male",
    note: "Khách hàng VIP"
  },
  {
    id: "2",
    fullName: "Trần Tâm",
    phone: "0857869999",
    email: "tran.thi.binh@email.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    dateOfBirth: "1985-05-20",
    gender: "female",
    note: "Khách hàng thường xuyên"
  },
  {
    id: "3",
    fullName: "Lê Hoàng Cường",
    phone: "0912345678",
    email: "le.hoang.cuong@email.com",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    dateOfBirth: "1992-12-10",
    gender: "male",
    note: ""
  }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`, query);

  if (pathname === '/getCustomerById' && req.method === 'GET') {
    const customerId = query.id;
    
    if (!customerId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id parameter' }));
      return;
    }

    const customer = mockCustomers.find(c => c.id === customerId);
    
    if (customer) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(customer));
      console.log(`Found customer: ${customer.fullName}`);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Customer not found' }));
      console.log(`Customer with id ${customerId} not found`);
    }
  } 
  else if (pathname === '/getCustomers' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockCustomers));
    console.log(`Returned ${mockCustomers.length} customers`);
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`🚀 Test API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /getCustomerById?id=<customer_id>`);
  console.log(`   GET /getCustomers`);
  console.log(`\n📊 Sample data:`);
  mockCustomers.forEach(customer => {
    console.log(`   - ID: ${customer.id}, Name: ${customer.fullName}`);
  });
});
