const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

// Try the root dev.db
const dbPath = path.join(__dirname, 'dev.db');
console.log('Trying:', dbPath);
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const p = new PrismaClient({ adapter });
p.user.count().then(n => { console.log('Root dev.db works! User count:', n); return p.$disconnect(); }).catch(async (e) => {
  console.log('Root dev.db failed:', e.message.substring(0, 80));
  await p.$disconnect();
  // Try prisma/dev.db
  const dbPath2 = path.join(__dirname, 'prisma', 'dev.db');
  console.log('Trying:', dbPath2);
  const adapter2 = new PrismaBetterSqlite3({ url: 'file:' + dbPath2 });
  const p2 = new PrismaClient({ adapter: adapter2 });
  p2.user.count().then(n2 => { console.log('prisma/dev.db works! User count:', n2); return p2.$disconnect(); }).catch(e2 => console.error('prisma/dev.db failed:', e2.message.substring(0, 80)));
});
