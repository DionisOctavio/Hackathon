const express = require("express"); 
const { Pool } = require("pg"); 
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "disney.cno6yck6ypip.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "Ken131014",
    port: 5432,
    ssl: {
    rejectUnauthorized: false, 
    },
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});



// LOGIN    
app.post("/login", async (req, res) => {
    const { usuario, contrasenia } = req.body;
    try {
        const { rows } = await pool.query(
            "SELECT * FROM CUENTA WHERE usuario = $1 AND contrasenia = $2",
            [usuario, contrasenia]
        );
        
        if (rows.length > 0) {
            const user = rows[0];
            
            const { rows: profileRows } = await pool.query(
                `SELECT PERFIL.* 
                 FROM PERFIL 
                 WHERE PERFIL.id_cuenta = $1`,
                [user.id_cuenta]
            );

            const profile = profileRows.length > 0 ? profileRows[0] : null;

            console.log('User data being sent:', {
                success: true,
                userId: user.id_cuenta,
                role: user.rol_cuenta,   
                profile: profile || {}   
            });

            res.json({
                success: true,
                userId: user.id_cuenta,
                rol_cuenta: user.rol_cuenta,  
                profile: profile || {} 
            });
        } else {
            res.json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/cuenta/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        // Consultar los datos del usuario usando el ID de cuenta
        const { rows } = await pool.query(
            `SELECT * FROM CUENTA WHERE id_cuenta = $1`, 
            [userId]
        );

        if (rows.length > 0) {
            const user = rows[0];
            
            // Obtener el perfil asociado a este usuario
            const { rows: profileRows } = await pool.query(
                `SELECT * FROM PERFIL WHERE id_cuenta = $1`, 
                [userId]
            );

            // Si hay perfil asociado, lo añadimos a la respuesta
            const profile = profileRows.length > 0 ? profileRows[0] : null;

            // Enviar la respuesta con los datos del usuario y perfil
            res.json({
                id_cuenta: user.id_cuenta,
                usuario: user.usuario,
                email: user.email,
                nombre_usuario: user.nombre_usuario,
                apellido_usuario: user.apellido_usuario,
                rol_cuenta: user.rol_cuenta,
                perfil: profile || {}  // Incluir el perfil, si existe
            });
        } else {
            res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

app.get("/cuentas", async (req, res)=>{
    const {rows} = await pool.query(
        "SELECT * FROM CUENTA;"
    );
    res.json(rows);
});

app.get("/perfiles/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT PERFIL.* 
             FROM PERFIL 
             JOIN CUENTA ON PERFIL.id_cuenta = CUENTA.id_cuenta 
             WHERE CUENTA.id_cuenta = $1`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/peliculas", async (req, res) => {
    const { rows } = await pool.query(
        `SELECT id_pelicula, titulo, sinopsis, anyo, url_portada, url_cartel, url_trailer, url_carrusel, 
                demografia.nombre_demografia, genero.nombre_genero, pegi.edad
         FROM pelicula
         JOIN demografia ON pelicula.id_demografia = demografia.id_demografia
         JOIN genero ON pelicula.id_genero = genero.id_genero
         JOIN pegi ON pelicula.id_pegi = pegi.id_pegi`
    );
    console.log(rows);
    res.json(rows);
});


// DEVUELVE TODAS LAS PELICULAS DE UN GENERO CONCRETO
app.get("/peliculas/genero/:genero", async (req, res) => {
    const { genero } = req.params;
    const { rows } = await pool.query(
        `SELECT PELICULA.*, GENERO.nombre_genero AS genero 
         FROM PELICULA 
         JOIN GENERO ON PELICULA.id_genero = GENERO.id_genero
         WHERE GENERO.nombre_genero = $1;`, 
        [genero]
    );
    res.json(rows);
});


// DEVUELVE TODAS LAS PELICULAS DE UNA DEMOGRAFIA CONCRETA
app.get("/peliculas/demografia/:demografia", async (req, res)=>{
    const {demografia} = req.params;
    const {rows} = await pool.query(
        "SELECT * FROM PELICULA, DEMOGRAFIA WHERE PELICULA.id_demografia = DEMOGRAFIA.id_demografia AND nombre_demografia = $1;", [demografia]
    );
    res.json(rows);
});

// DEVUELVE TODAS LAS PELICULAS DE UN PEGI CONCRETO
app.get("/peliculas/pegi/:pegi", async (req, res)=>{
    const {pegi} = req.params;
    const {rows} = await pool.query(
        "SELECT * FROM PELICULA, PEGI WHERE PELICULA.id_pegi = PEGI.id_pegi AND edad = $1;", [pegi]
    );
    res.json(rows);
});

// DEVUELVE TODOS LOS GENEROS
app.get("/genero", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT * FROM GENERO;"
    );
    res.json(rows);
});

// DEVUELVE TODAS LAS DEMOGRAFIAS
app.get("/demografia", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT * FROM DEMOGRAFIA;"
    );
    res.json(rows);
});

// DEVUELVE TODOS LOS PEGIS
app.get("/pegi", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT * FROM PEGI;"
    );
    res.json(rows);
});

// Endpoint para obtener todas las películas con su estado de visto/favorito
app.get("/visto", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT P.id_pelicula, P.titulo, P.sinopsis, P.año, V.favorito, V.estado
            FROM PELICULA P
            LEFT JOIN VISTO V ON P.id_pelicula = V.id_pelicula
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las películas:", error);
        res.status(500).json({ error: 'Hubo un error al obtener las películas.' });
    }
});

// Endpoint para actualizar el estado de "Favorito" y "Visto" en la tabla VISTO
app.post("/visto/actualizar", async (req, res) => {
    const { id_perfil, id_pelicula, favorito, estado } = req.body;

    if (id_perfil === undefined || id_pelicula === undefined || favorito === undefined || estado === undefined) {
        return res.status(400).json({ error: 'Faltan parámetros en la solicitud.' });
    }

    try {
        const { rows } = await pool.query(`
            SELECT * FROM VISTO WHERE id_perfil = $1 AND id_pelicula = $2
        `, [id_perfil, id_pelicula]);

        if (rows.length > 0) {
            await pool.query(`
                UPDATE VISTO
                SET favorito = $1, estado = $2
                WHERE id_perfil = $3 AND id_pelicula = $4
            `, [favorito, estado, id_perfil, id_pelicula]);

            res.json({ message: 'Estado de la película actualizado correctamente.' });
        } else {
            await pool.query(`
                INSERT INTO VISTO (id_perfil, id_pelicula, favorito, estado)
                VALUES ($1, $2, $3, $4)
            `, [id_perfil, id_pelicula, favorito, estado]);

            res.json({ message: 'Estado de la película insertado correctamente.' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado de la película:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar el estado de la película.' });
    }
});


app.get('/favoritos/:idPerfil', async (req, res) => {
    const idPerfil = req.params.idPerfil;
    try {
        const query = `
            SELECT P.id_pelicula, P.titulo, P.url_cartel, P.anyo
            FROM PELICULA P
            JOIN VISTO V ON P.id_pelicula = V.id_pelicula
            WHERE V.id_perfil = $1 AND V.favorito = TRUE;
        `;
        
        const result = await pool.query(query, [idPerfil]);
        
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({ message: "No tienes películas favoritas." });
        }
    } catch (err) {
        console.error("Error al obtener películas favoritas:", err);
        res.status(500).json({ error: "Hubo un error al obtener las películas favoritas." });
    }
});