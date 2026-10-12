import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Complaint, User, ContactMessage, SystemStats, ComplaintStatus } from './types';

// Store DB in project root data directory
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'wms.sqlite');

let _db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    initTables(_db);
  }
  return _db;
}

function initTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'citizen',
      status TEXT NOT NULL DEFAULT 'verified',
      code INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      wastetype TEXT NOT NULL,
      location TEXT NOT NULL,
      locationdescription TEXT NOT NULL,
      file TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      adminRemarks TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fname TEXT NOT NULL,
      lname TEXT NOT NULL,
      contactEmail TEXT NOT NULL,
      contactPhone TEXT NOT NULL,
      comment TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed initial data if complaints table is empty
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM complaints').get() as { cnt: number };
  if (countRow.cnt === 0) {
    seedDatabase(db);
  }
}

function seedDatabase(db: DatabaseSync) {
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password, role, status, code, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  // Passwords: admin / admintest, citizen / password123
  insertUser.run('Municipal Admin', 'admin@wms.gov', 'admin', 'admin', 'verified', 0, now);
  insertUser.run('Admin Operator', 'admin', 'admintest', 'admin', 'verified', 0, now);
  insertUser.run('Janak Bist', 'bistajanak303@gmail.com', 'password123', 'citizen', 'verified', 0, now);
  insertUser.run('Image Kunwar', 'imagekunwar@gmail.com', 'password123', 'citizen', 'verified', 0, now);
  insertUser.run('Janak Sagarmatha', 'janak.bista@sagarmatha.edu.np', 'password123', 'citizen', 'verified', 0, now);

  const insertComplaint = db.prepare(`
    INSERT INTO complaints (id, name, mobile, email, wastetype, location, locationdescription, file, date, status, adminRemarks, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialComplaints = [
    {
      id: 77,
      name: 'Janak Bista',
      mobile: '9828912874',
      email: 'janak.bista@sagarmatha.edu.np',
      wastetype: 'Mixed',
      location: 'Kathmandu, Ring Road',
      locationdescription: 'Heavily piled garbage overflowing near Ring Road sector crossing',
      file: '/uploads/Capture.PNG',
      date: '12:11 PM, Sunday 25th Apr 2021',
      status: 'Completed',
      adminRemarks: 'Waste collection truck dispatched. Site cleaned and disinfected.',
    },
    {
      id: 102,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'bistajanak303@gmail.com',
      wastetype: 'Mixed, Household',
      location: 'Kathmandu, Pulchowk',
      locationdescription: 'Pulchowk campus main exit, near traffic island',
      file: '/uploads/images.jpg',
      date: '04:21 PM, Thursday 22nd Jul 2021',
      status: 'Completed',
      adminRemarks: 'Area cleared by municipal sanitation team.',
    },
    {
      id: 103,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'bistajanak303@gmail.com',
      wastetype: 'Mixed',
      location: 'Sanepa, Lalitpur',
      locationdescription: 'Near Sagarmatha college bridge and riverside walkway',
      file: '/uploads/env.jpg',
      date: '07:47 PM, Friday 23rd Jul 2021',
      status: 'Pending',
      adminRemarks: 'Scheduled for morning pickup.',
    },
    {
      id: 105,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'bistajanak303@gmail.com',
      wastetype: 'Inorganic, Plastic',
      location: 'Bhaktapur',
      locationdescription: 'Bhaktapur Durbar Square heritage corner perimeter',
      file: '/assets/img/recycling.jpeg',
      date: '07:50 PM, Friday 23rd Jul 2021',
      status: 'Pending',
      adminRemarks: 'Assigned to Bhaktapur Heritage Cleanliness squad.',
    },
    {
      id: 106,
      name: 'Janak Bist',
      mobile: '9828912874',
      email: 'janak.bista@sagarmatha.edu.np',
      wastetype: 'Inorganic',
      location: 'Kalanki',
      locationdescription: 'Thankot road junction bus depot corner',
      file: '/assets/img/Medical-Waste.jpg',
      date: '08:50 PM, Friday 23rd Jul 2021',
      status: 'In Progress',
      adminRemarks: 'Sanitation team deployed. Awaiting compactor.',
    },
    {
      id: 110,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'bistajanak303@gmail.com',
      wastetype: 'Mixed',
      location: 'Lalitpur',
      locationdescription: 'Pulchowk campus department road',
      file: '/assets/img/recycling5.png',
      date: '09:11 PM, Friday 23rd Jul 2021',
      status: 'Pending',
      adminRemarks: 'Under review.',
    },
    {
      id: 111,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'janak.bista@sagarmatha.edu.np',
      wastetype: 'Mixed',
      location: 'Kathmandu, Dillibazar',
      locationdescription: 'Opposite to public library corner',
      file: '/uploads/Capture.PNG',
      date: '09:19 PM, Friday 23rd Jul 2021',
      status: 'Pending',
      adminRemarks: 'Awaiting local route dispatch.',
    },
    {
      id: 114,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'janak.bista@sagarmatha.edu.np',
      wastetype: 'Inorganic, E-Waste',
      location: 'Lalitpur, Jawalakhel',
      locationdescription: 'Zoo road roundabout, dumped electrical components and cables',
      file: '/uploads/env.jpg',
      date: '07:20 AM, Saturday 24th Jul 2021',
      status: 'Pending',
      adminRemarks: 'E-waste contractor notified.',
    },
    {
      id: 115,
      name: 'Image Kunwar',
      mobile: '9808713012',
      email: 'imagekunwar@gmail.com',
      wastetype: 'Organic, Mixed',
      location: 'Kathmandu, Tahachal',
      locationdescription: 'Near Mahendra Ratna Campus main gate, approximately 40kg piled organic waste',
      file: '/uploads/images.jpg',
      date: '08:40 AM, Saturday 24th Jul 2021',
      status: 'In Progress',
      adminRemarks: 'Special organic composting collection truck assigned.',
    },
    {
      id: 116,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'janak.bista@sagarmatha.edu.np',
      wastetype: 'Household',
      location: 'Bhaktapur',
      locationdescription: 'Near Durbar square gate, residential domestic bags',
      file: '/assets/img/recycling.jpeg',
      date: '09:44 AM, Saturday 24th Jul 2021',
      status: 'Completed',
      adminRemarks: 'Completed by morning round team.',
    },
    {
      id: 117,
      name: 'Janak Bist',
      mobile: '9848726051',
      email: 'bistajanak303@gmail.com',
      wastetype: 'Mixed',
      location: 'Bhaktapur, Suryabinayak',
      locationdescription: 'Lane 4 junction near community garden',
      file: '/uploads/Capture.PNG',
      date: '05:17 PM, Thursday 26th Aug 2021',
      status: 'Pending',
      adminRemarks: 'Assigned to afternoon collector.',
    },
  ];

  for (const c of initialComplaints) {
    insertComplaint.run(
      c.id,
      c.name,
      c.mobile,
      c.email,
      c.wastetype,
      c.location,
      c.locationdescription,
      c.file,
      c.date,
      c.status,
      c.adminRemarks,
      now
    );
  }

  const insertContact = db.prepare(`
    INSERT INTO contact_messages (fname, lname, contactEmail, contactPhone, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertContact.run('Mark', 'Zuckerberg', 'janak@gmail.com', '9812345678', 'Great initiative for municipal waste tracking and reporting!', now);
  insertContact.run('John', 'Doe', 'bistajanak303@gmail.com', '9828912874', 'Very easy to use app, clean and responsive.', now);
}

// Complaint Queries
export function getAllComplaints(filters?: { email?: string; status?: string; search?: string }): Complaint[] {
  const db = getDb();
  let query = 'SELECT * FROM complaints WHERE 1=1';
  const params: any[] = [];

  if (filters?.email) {
    query += ' AND LOWER(email) = LOWER(?)';
    params.push(filters.email.trim());
  }

  if (filters?.status && filters.status !== 'All') {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters?.search) {
    query += ' AND (name LIKE ? OR location LIKE ? OR locationdescription LIKE ? OR wastetype LIKE ? OR CAST(id AS TEXT) = ?)';
    const s = `%${filters.search.trim()}%`;
    params.push(s, s, s, s, filters.search.trim());
  }

  query += ' ORDER BY id DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params) as unknown as Complaint[];
}

export function getComplaintById(id: number): Complaint | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
  const result = stmt.get(id);
  return (result as unknown as Complaint) || null;
}

export function createComplaint(data: Omit<Complaint, 'id'>): Complaint {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO complaints (name, mobile, email, wastetype, location, locationdescription, file, date, status, adminRemarks, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.name,
    data.mobile,
    data.email,
    data.wastetype,
    data.location,
    data.locationdescription,
    data.file || '/assets/img/recycling.jpeg',
    data.date || new Date().toLocaleString(),
    data.status || 'Pending',
    data.adminRemarks || 'Complaint submitted and queued for review.',
    now
  );

  const newId = Number(info.lastInsertRowid);
  return getComplaintById(newId)!;
}

export function updateComplaint(id: number, data: Partial<Complaint>): Complaint | null {
  const db = getDb();
  const existing = getComplaintById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = { ...existing, ...data, updatedAt: now };

  const stmt = db.prepare(`
    UPDATE complaints
    SET name = ?, mobile = ?, email = ?, wastetype = ?, location = ?, locationdescription = ?, file = ?, status = ?, adminRemarks = ?, updatedAt = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.name,
    updated.mobile,
    updated.email,
    updated.wastetype,
    updated.location,
    updated.locationdescription,
    updated.file,
    updated.status,
    updated.adminRemarks || null,
    now,
    id
  );

  return getComplaintById(id);
}

export function deleteComplaint(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM complaints WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// User & Auth Queries
export function getUserByEmail(email: string): User | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
  const user = stmt.get(email.trim());
  return (user as unknown as User) || null;
}

export function getUserById(id: number): User | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id);
  return (user as unknown as User) || null;
}

export function createUser(data: Omit<User, 'id'>): User {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, role, status, code, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.name,
    data.email,
    data.password || 'password123',
    data.role || 'citizen',
    data.status || 'verified',
    data.code || 0,
    now
  );

  return getUserById(Number(info.lastInsertRowid))!;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const db = getDb();
  const stmt = db.prepare('UPDATE users SET password = ? WHERE LOWER(email) = LOWER(?)');
  const result = stmt.run(newPassword, email.trim());
  return result.changes > 0;
}

// Stats & Metrics
export function getSystemStats(): SystemStats {
  const db = getDb();
  const totalComplaintsRow = db.prepare('SELECT COUNT(*) as cnt FROM complaints').get() as { cnt: number };
  const pendingRow = db.prepare("SELECT COUNT(*) as cnt FROM complaints WHERE status = 'Pending'").get() as { cnt: number };
  const inProgressRow = db.prepare("SELECT COUNT(*) as cnt FROM complaints WHERE status = 'In Progress'").get() as { cnt: number };
  const completedRow = db.prepare("SELECT COUNT(*) as cnt FROM complaints WHERE status = 'Completed'").get() as { cnt: number };
  const rejectedRow = db.prepare("SELECT COUNT(*) as cnt FROM complaints WHERE status = 'Rejected'").get() as { cnt: number };
  const totalUsersRow = db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number };

  const recentComplaints = db.prepare('SELECT * FROM complaints ORDER BY id DESC LIMIT 5').all() as unknown as Complaint[];

  // Waste type frequency
  const allComplaints = db.prepare('SELECT wastetype FROM complaints').all() as { wastetype: string }[];
  const wasteTypeCounts: Record<string, number> = {};
  for (const c of allComplaints) {
    const types = c.wastetype.split(',').map(t => t.trim()).filter(Boolean);
    for (const t of types) {
      wasteTypeCounts[t] = (wasteTypeCounts[t] || 0) + 1;
    }
  }

  return {
    totalComplaints: totalComplaintsRow.cnt,
    pendingCount: pendingRow.cnt,
    inProgressCount: inProgressRow.cnt,
    completedCount: completedRow.cnt,
    rejectedCount: rejectedRow.cnt,
    totalUsers: totalUsersRow.cnt,
    recentComplaints,
    wasteTypeCounts,
  };
}

// Contact messages
export function addContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO contact_messages (fname, lname, contactEmail, contactPhone, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(data.fname, data.lname, data.contactEmail, data.contactPhone, data.comment, now);
  const id = Number(info.lastInsertRowid);
  return { id, ...data, createdAt: now };
}

export function getAllContactMessages(): ContactMessage[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC');
  return stmt.all() as unknown as ContactMessage[];
}
