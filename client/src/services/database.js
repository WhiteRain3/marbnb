import initSqlJs from "sql.js"

let db

export const DatabaseService = {
  async init() {
    const SQL = await initSqlJs({
      // Naudojame oficialų WASM failą iš CDN
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    })
    db = new SQL.Database()

    // Lentelių struktūra (Atitinka reikalavimą 360 dėl kintamųjų kiekio ir tipų)
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE, 
        password TEXT, 
        role TEXT
      );
      CREATE TABLE listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        price REAL, 
        location TEXT, 
        category TEXT, 
        image TEXT,
        host_id INTEGER,
        FOREIGN KEY(host_id) REFERENCES users(id)
      );
      CREATE TABLE bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        listing_id INTEGER, 
        user_email TEXT, 
        date TEXT, 
        status TEXT,
        FOREIGN KEY(listing_id) REFERENCES listings(id)
      );
    `)

    // Testavimo duomenų rinkinys (Reikalavimas 365, 651)
    db.run(`
      INSERT INTO users (email, password, role) VALUES 
      ('admin@vu.lt', '123', 'admin'), 
      ('host@vu.lt', '123', 'host'), 
      ('guest@vu.lt', '123', 'guest');
    `)

    db.run(`
      INSERT INTO listings (title, price, location, category, image, host_id) VALUES 
      ('Modernus Loftas', 120.0, 'Vilnius', 'Miestas', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 2),
      ('Namelis miške', 85.0, 'Varėna', 'Gamta', 'https://images.unsplash.com/photo-1449156001437-3a166aefbb05?w=800', 2);
    `)

    console.log("SQLite DB paruošta naudojimui.")
  },

  // SQL užklausų vykdymas (Demonstruoja programavimo ir DB valdymo įgūdžius)
  query(sql, params = []) {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    const rows = []
    while (stmt.step()) rows.push(stmt.getAsObject())
    stmt.free()
    return rows
  },

  run(sql, params = []) {
    db.run(sql, params)
  },
}
