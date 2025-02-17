let peliculasCache = null;
let demografiasCache = null;
let userCache = null;
let generoCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 600000; // 10 min

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
            res.json({ success: false, message: "Usuario o Contraseña incorrecta" });
        }
    } catch (error) {
        console.error("Error durante el login:", error);
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
    const now = Date.now();

    if (userCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("🔵 Datos obtenidos de memoria");
        return res.json(userCache);
    }

    const { userId } = req.params;
    const { rows } = await pool.query(
        `SELECT PERFIL.* 
         FROM PERFIL 
         JOIN CUENTA ON PERFIL.id_cuenta = CUENTA.id_cuenta 
         WHERE CUENTA.id_cuenta = $1`,
        [userId]
    );

    userCache = rows;
    lastCacheTime = now;
    console.log("🟢 Users guardados en memoria");

    res.json(rows);
});




// PELICULAS ==============================================================

app.get("/peliculas", async (req, res) => {
    const now = Date.now();
    
    // 1️⃣ Verifica si el caché es válido
    if (peliculasCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("🔵 Datos obtenidos de memoria");
        return res.json(peliculasCache);
    }

    // 2️⃣ Si el caché expiró, consulta la base de datos
    const { rows } = await pool.query(
        `SELECT id_pelicula, titulo, sinopsis, anyo, url_portada, url_cartel, url_trailer, url_carrusel, 
                demografia.nombre_demografia, genero.nombre_genero, pegi.edad
         FROM pelicula
         JOIN demografia ON pelicula.id_demografia = demografia.id_demografia
         JOIN genero ON pelicula.id_genero = genero.id_genero
         JOIN pegi ON pelicula.id_pegi = pegi.id_pegi`
    );

    // 3️⃣ Guarda en caché los resultados
    peliculasCache = rows;
    lastCacheTime = now;
    console.log("🟢 Datos guardados en memoria");

    res.json(rows);
});

app.post("/peliculas", async (req, res) => {
    const { titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi } = req.body;
    
    try {
        // Inserta la película en la base de datos
        const { rows } = await pool.query(
            `INSERT INTO pelicula (titulo, sinopsis, anyo, id_genero, url_portada, url_trailer, url_carrusel, id_demografia, id_pegi)
             VALUES ($1, $2, $3, (SELECT id_genero FROM genero WHERE nombre_genero = $4), $5, $6, $7, (SELECT id_demografia FROM demografia WHERE nombre_demografia = $8), (SELECT id_pegi FROM pegi WHERE edad = $9)) 
             RETURNING *`,
            [titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi]
        );

        res.status(201).json(rows[0]);  // Responder con la película añadida
    } catch (error) {
        console.error("Error al agregar la película:", error);
        res.status(500).json({ message: "Error al agregar la película" });
    }
});

app.delete("/peliculas/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        // Elimina la película de la base de datos
        const result = await pool.query(
            `DELETE FROM pelicula WHERE id_pelicula = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount > 0) {
            res.json({ message: "Película eliminada correctamente", pelicula: result.rows[0] });
        } else {
            res.status(404).json({ message: "Película no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar la película:", error);
        res.status(500).json({ message: "Error al eliminar la película" });
    }
});

app.put("/peliculas/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi } = req.body;

    try {
        // Actualiza los detalles de la película
        const { rows } = await pool.query(
            `UPDATE pelicula
             SET titulo = $1, sinopsis = $2, anyo = $3, id_genero = (SELECT id_genero FROM genero WHERE nombre_genero = $4),
                 url_portada = $5, url_trailer = $6, url_carrusel = $7, id_demografia = (SELECT id_demografia FROM demografia WHERE nombre_demografia = $8),
                 id_pegi = (SELECT id_pegi FROM pegi WHERE edad = $9)
             WHERE id_pelicula = $10
             RETURNING *`,
            [titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi, id]
        );

        if (rows.length > 0) {
            res.json({ message: "Película actualizada correctamente", pelicula: rows[0] });
        } else {
            res.status(404).json({ message: "Película no encontrada" });
        }
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        res.status(500).json({ message: "Error al actualizar la película" });
    }
});





// DEVUELVE TODOS LOS GENEROS
app.get("/genero", async (req, res) => {
    const now = Date.now();

    if (generoCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("🔵 Datos obtenidos de memoria");
        return res.json(generoCache);
    }

    const {rows} = await pool.query(
        "SELECT * FROM GENERO;"
    );
    generoCache = rows;
    lastCacheTime = now;
    console.log("🟢 Datos guardados en memoria");

    res.json(rows);
});

// DEVUELVE TODAS LAS DEMOGRAFIAS
app.get("/demografia", async (req, res) => {
    const now = Date.now();

    if (peliculasCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("🔵 Datos obtenidos de memoria");
        return res.json(demografiasCache);
    }

    const {rows} = await pool.query(
        "SELECT * FROM DEMOGRAFIA;"
    );

    demografiasCache = rows;
    lastCacheTime = now;
    console.log("🟢 Datos guardados en memoria");
    res.json(rows);
});

// DEVUELVE TODOS LOS PEGIS
app.get("/pegi", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT * FROM PEGI;"
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
app.get("/peliculas/demografia/:demografia", async (req, res) => {
    const { demografia } = req.params;
    const { rows } = await pool.query(
        `SELECT *
         FROM pelicula
         JOIN demografia ON pelicula.id_demografia = demografia.id_demografia
         JOIN genero ON pelicula.id_genero = genero.id_genero
         JOIN pegi ON pelicula.id_pegi = pegi.id_pegi
         WHERE demografia.nombre_demografia = $1`, 
        [demografia]
    );
    console.log(rows);
    res.json(rows);
});



// DEVUELVE TODAS LAS PELICULAS DE UN PEGI CONCRETO
app.get("/peliculas/pegi/:pegi", async (req, res)=>{
    const {pegi} = req.params;
    const {rows} = await pool.query(
        `SELECT * 
         FROM PELICULA, PEGI 
         WHERE PELICULA.id_pegi = PEGI.id_pegi 
         AND edad = $1;`, 
        [pegi]
    );
    console.log(rows);
    res.json(rows);
});




// Endpoint para obtener todas las películas con su estado de visto/favorito
app.get("/visto", async (req, res) => {
    const { rows } = await pool.query(
        `SELECT *
         FROM pelicula
         JOIN visto ON pelicula.id_pelicula = visto.id_pelicula;`
        );
        console.log(rows);
        res.json(rows);
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
    const { idPerfil } = req.params;
    const { rows } = await pool.query(
        `SELECT pelicula.id_pelicula, titulo, sinopsis, anyo, url_portada, url_cartel, url_trailer, url_carrusel, 
                demografia.nombre_demografia, genero.nombre_genero, pegi.edad
        FROM pelicula
        JOIN visto ON pelicula.id_pelicula = visto.id_pelicula
        JOIN demografia ON pelicula.id_demografia = demografia.id_demografia
        JOIN genero ON pelicula.id_genero = genero.id_genero
        JOIN pegi ON pelicula.id_pegi = pegi.id_pegi
        WHERE visto.id_perfil = $1
        AND visto.favorito = TRUE;`,
        [idPerfil]
    );
    console.log(rows);
    res.json(rows);
});