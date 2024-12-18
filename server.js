import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";


const app = express();
const port = 5000;
env.config();


const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));

// db.connect((err, client, release) => {
//     if (err) {
//       console.error('Error acquiring client', err.stack);
//       return;
//     }
//     console.log('Connected to database');
//   });

app.get('/menus',async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM menus');
        res.json(result.rows);
    } catch (error) {
        console.log("error");
        res.status(400).json({error:'server error'});
    }
});

app.get('/menu/:id/items', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM items WHERE menu_id = $1', [id]);
        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.log("error fetch data");
    }
});

  
  app.get('/menus', (req, res) => {
    res.json({ message: 'Menus route works!' });
  });
  

app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
})
