const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")
const path = require("path")
const bcrypt = require("bcrypt")

const app = express()
const saltRounds = 10

app.use(cors())
app.use(express.json())

const dbPath = path.resolve(__dirname, "database.db")
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE, 
    password TEXT, 
    role TEXT
  )`)

  // PATAISYTA: Pridėtas experience_type laukas
  db.run(`CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    description TEXT, 
    price REAL, 
    location TEXT, 
    category TEXT, 
    experience_type TEXT, 
    image TEXT,
    host_email TEXT
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    listing_id INTEGER, 
    user_email TEXT, 
    date TEXT,
    status TEXT DEFAULT 'Patvirtinta'
  )`)

  const hash = (pw) => bcrypt.hashSync(pw, saltRounds)

  // Naudojame INSERT OR IGNORE, kad kaskart neperrašytų tų pačių vartotojų
  db.run("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)", ["admin@vu.lt", hash("123"), "admin"])
  db.run("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)", ["host@vu.lt", hash("123"), "host"])
  db.run("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)", ["guest@vu.lt", hash("123"), "guest"])

  // Pradiniai duomenys su priskirta patirtimi (experience_type)
  db.get("SELECT COUNT(*) as count FROM listings", (err, row) => {
    if (row && row.count === 0) {
      // server.js fragmentas
      const initialListings = [
        [
          "Prabangus loftas senamiestyje",
          "Aukštos lubos ir modernus interjeras miesto širdyje. Puikiai tinka darbui.",
          120,
          "Vilnius, Lietuva",
          "Miestas",
          "Darbui", // Experience type
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
          "host@vu.lt",
        ],
        [
          "Namelis medyje",
          "Pabėkite nuo triukšmo į ramybės oazę gamtoje.",
          85,
          "Anykščiai, Lietuva",
          "Gamta",
          "Poilsiui",
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.familyhandyman.com%2Fwp-content%2Fuploads%2F2019%2F05%2FFH12MAR_52_651_001-treehouse-building-tips.jpg&f=1&nofb=1&ipt=787ad20f946e19af035a68befe5fa258ed58e09d462a7c5b0dccc284578cd176",
          "host@vu.lt",
        ],
        [
          "Moderni vila prie jūros",
          "Erdvi vila su vaizdu į kopas ir saulėlydžius. Romantiška aplinka.",
          210,
          "Nida, Lietuva",
          "Pajūris",
          "Romantika",
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
          "host@vu.lt",
        ],
        [
          "Ekonominė studija centre",
          "Mažas, bet jaukus būstas studentams ar taupiems keliautojams.",
          45,
          "Kaunas, Lietuva",
          "Miestas",
          "Darbui",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          "host@vu.lt",
        ],
        [
          "Sodyba prie ežero",
          "Aktyvus laisvalaikis: valtys, žvejyba ir krepšinio aikštelė.",
          160,
          "Molėtai, Lietuva",
          "Gamta",
          "Aktyviam laisvalaikiui",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
          "host@vu.lt",
        ],
        [
          "Butas su vaizdu į marias",
          "Ideali vieta ramiam poilsiui stebint laivus.",
          95,
          "Klaipėda, Lietuva",
          "Pajūris",
          "Poilsiui",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
          "host@vu.lt",
        ],
        [
          "Penthouse su SPA zona",
          "Aukščiausios klasės patirtis su asmenine pirtimi ir masažine vonia.",
          350,
          "Vilnius, Lietuva",
          "Miestas",
          "Romantika",
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
          "host@vu.lt",
        ],
      ]
      const stmt = db.prepare(
        "INSERT INTO listings (title, description, price, location, category, experience_type, image, host_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      initialListings.forEach((l) => stmt.run(l))
      stmt.finalize()
    }
  })
})

app.get("/api/admin/stats", (req, res) => {
  const stats = {}

  // Skaičiuojame skelbimus pagal patirties tipą
  db.all("SELECT experience_type, COUNT(*) as count FROM listings GROUP BY experience_type", [], (err, rows) => {
    stats.experiences = rows

    // Skaičiuojame skelbimus pagal kainų segmentus
    db.all(
      `
      SELECT 
        CASE 
          WHEN price <= 80 THEN 'Ekonominis (iki 80€)'
          WHEN price <= 150 THEN 'Vidutinis (80-150€)'
          ELSE 'Premium (150€+)'
        END as price_segment,
        COUNT(*) as count
      FROM listings 
      GROUP BY price_segment
    `,
      [],
      (err, priceRows) => {
        stats.prices = priceRows
        res.json(stats)
      }
    )
  })
})

// PATAISYTA: Atnaujintas GET maršrutas su filtravimo logika serveryje
app.get("/api/listings", (req, res) => {
  const { maxPrice, experience } = req.query
  let sql = "SELECT * FROM listings WHERE 1=1"
  let params = []

  // PATAISYTA: Tiksli kainų segmentavimo logika
  if (maxPrice && maxPrice !== "null") {
    const price = Number(maxPrice)
    if (price === 9999) {
      sql += " AND price > 150" // Premium segmentas
    } else if (price === 150) {
      sql += " AND price > 80 AND price <= 150" // Vidutinis segmentas
    } else {
      sql += " AND price <= 80" // Ekonominis segmentas
    }
  }

  if (experience && experience !== "Visi") {
    sql += " AND experience_type = ?"
    params.push(experience)
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

// Kiti maršrutai (Register, Login, Bookings...) lieka tokie patys kaip tavo atsiųstame faile
app.post("/api/register", (req, res) => {
  const { email, password, role } = req.body
  const hashed = bcrypt.hashSync(password, saltRounds)
  db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashed, role], (err) => {
    if (err) return res.status(500).json({ error: "Vartotojas jau egzistuoja" })
    res.status(201).json({ success: true })
  })
})

app.post("/api/login", (req, res) => {
  const { email, password } = req.body
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...safeUser } = user
      res.json({ user: safeUser })
    } else res.status(401).json({ error: "Neteisingi duomenys" })
  })
})

app.get("/api/listings/:id", (req, res) => {
  db.get("SELECT * FROM listings WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Skelbimas nerastas" })
    res.json(row)
  })
})

app.post("/api/listings", (req, res) => {
  const { title, description, price, location, category, experience_type, image, host_email } = req.body
  db.run(
    "INSERT INTO listings (title, description, price, location, category, experience_type, image, host_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, description, price, location, category, experience_type, image, host_email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.status(201).json({ id: this.lastID, success: true })
    }
  )
})

app.delete("/api/listings/:id", (req, res) => {
  const id = req.params.id
  db.serialize(() => {
    db.run("DELETE FROM bookings WHERE listing_id = ?", [id])
    db.run("DELETE FROM listings WHERE id = ?", [id], () => res.json({ success: true }))
  })
})

app.post("/api/bookings", (req, res) => {
  const { listing_id, user_email, date } = req.body
  db.run("INSERT INTO bookings (listing_id, user_email, date) VALUES (?, ?, ?)", [listing_id, user_email, date], () =>
    res.status(201).json({ success: true })
  )
})

app.get("/api/bookings", (req, res) => {
  const { email, role } = req.query
  let sql = ""
  let params = []
  if (role === "admin")
    sql = `SELECT b.*, l.title, l.price, l.location FROM bookings b JOIN listings l ON b.listing_id = l.id`
  else if (role === "host") {
    sql = `SELECT b.*, l.title, l.price, l.location FROM bookings b JOIN listings l ON b.listing_id = l.id WHERE l.host_email = ?`
    params = [email]
  } else {
    sql = `SELECT b.*, l.title, l.price, l.location FROM bookings b JOIN listings l ON b.listing_id = l.id WHERE b.user_email = ?`
    params = [email]
  }
  db.all(sql, params, (err, rows) => res.json(rows))
})

app.delete("/api/bookings/:id", (req, res) => {
  db.run("DELETE FROM bookings WHERE id = ?", [req.params.id], () => res.json({ success: true }))
})

/** KONFIGŪRACIJA RENDER TALPINIMUI **/

// Jei NODE_ENV yra production, pateikiame sukompiliuotą React projektą
if (process.env.NODE_ENV === "production") {
  // Pateikiame statinius failus
  app.use(express.static(path.join(__dirname, "../client/dist")))

  // PATAISYTA: Naudojame :any* parametrą
  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"))
  })
}

// Paleidimas naudojant Render priskirtą PORT arba 5000 lokaliai
const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveris paleistas: prievadas ${PORT}`)
})
