// ================================================================================
// INITIALIZATION DE DEPENDENCIAS Y VARIABLES
const express = require("express"); 
const { Pool } = require("pg"); 
const cors = require("cors");
const app = express();
const port = 3000;
let lastCacheTime = 0;
const CACHE_DURATION = 600000; // 10 min

app.use(cors());
app.use(express.json());



// CONEXION A LA BASE DE DATOS
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



// COMPROBACION DEL PUERTO DEL SERVIDOR
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});



// CACHE DE DATOS
let peliculasCache = null;
let demografiasCache = null;
const userProfilesCache = {};
let generoCache = null;







// ================================================================================
// ENDPOINTS



// AUTENTIFICACION ================================================================



// LOGUEO DE UNA CUENTA
app.post("/login", async (req, res) => {
    const { usuario, contrasenia } = req.body;
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
        res.json({
            success: true,
            userId: user.id_cuenta,
            rol_cuenta: user.rol_cuenta,
            profile: profile || {}
        });
    } else {
        res.json({ success: false, message: "Usuario o Contraseña incorrecta" });
    }
});



// OBTENER TODAS LAS CUENTAS
app.get("/cuentas", async (req, res)=>{
    const {rows} = await pool.query(
        "SELECT * FROM CUENTA;"
    );
    res.json(rows);
});



// OBTENER DATOS DEL PERFIL DE UNA CUENTA
app.get("/cuenta/:userId", async (req, res) => {
    const { userId } = req.params;
    const { rows } = await pool.query(
        `SELECT id_cuenta, usuario, email, nombre_usuario, apellido_usuario, rol_cuenta, fecha_creacion FROM CUENTA WHERE id_cuenta = $1`, 
        [userId]
    );

    if (rows.length > 0) {
        const user = rows[0];
        const { rows: profileRows } = await pool.query(
            `SELECT * FROM PERFIL WHERE id_cuenta = $1`, 
            [userId]
        );
        const profile = profileRows.length > 0 ? profileRows[0] : null;
        res.json({
            id_cuenta: user.id_cuenta,
            usuario: user.usuario,
            email: user.email,
            nombre_usuario: user.nombre_usuario,
            apellido_usuario: user.apellido_usuario,
            rol_cuenta: user.rol_cuenta,
            fecha_creacion: user.fecha_creacion,
            perfil: profile || {}
        });
    } else {
        res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
});




// OBTENER DATOS DEL PERFIL DE UNA CUENTA
app.get("/perfiles/:userId", async (req, res) => {
    const { userId } = req.params;
    if (userProfilesCache[userId]) {
        console.log("Perfiles obtenidos de caché para el usuario:", userId);
        return res.json(userProfilesCache[userId]);
    }
    const { rows } = await pool.query(
        `SELECT PERFIL.* 
         FROM PERFIL 
         JOIN CUENTA ON PERFIL.id_cuenta = CUENTA.id_cuenta 
         WHERE CUENTA.id_cuenta = $1`,
        [userId]
    );
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    userProfilesCache[userId] = rows;
    res.json(rows);
});




app.put('/cuenta/:id', async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { usuario, email, nombre_usuario, apellido_usuario, rol_cuenta } = req.body;

    // Creamos un objeto para las actualizaciones
    const updates = {};

    // Añadir solo los campos que se reciban en el cuerpo de la solicitud
    if (usuario) updates.usuario = usuario;
    if (email) updates.email = email;
    if (nombre_usuario) updates.nombre_usuario = nombre_usuario;
    if (apellido_usuario) updates.apellido_usuario = apellido_usuario;
    if (rol_cuenta) updates.rol_cuenta = rol_cuenta;

    // Si no hay actualizaciones, respondemos con un mensaje de error
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    try {
        // Verificar si el usuario existe en la base de datos
        const userCheckQuery = 'SELECT 1 FROM cuenta WHERE id_cuenta = $1';
        const userCheckResult = await pool.query(userCheckQuery, [id]);

        if (userCheckResult.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Creamos una lista de parámetros dinámicos para la actualización
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        // Construimos la consulta de actualización dinámica
        let query = 'UPDATE cuenta SET ';
        fields.forEach((field, index) => {
            query += `${field} = $${index + 1}`;
            if (index < fields.length - 1) {
                query += ', ';
            }
        });
        query += ` WHERE id_cuenta = $${fields.length + 1}`;

        // Añadimos el ID al final de los valores
        values.push(id);

        // Ejecutamos la consulta de actualización
        const result = await pool.query(query, values);

        // Verificamos si se actualizó algún registro
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se pudo actualizar el perfil' });
        }

        res.status(200).json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar los datos del perfil' });
    }
});




// MANIPULACION DE PELICULAS ==============================================================



// OBTENER TODAS LAS PELICULAS
app.get("/peliculas", async (req, res) => {
    const now = Date.now();
    if (peliculasCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("🔵 Datos obtenidos de memoria");
        return res.json(peliculasCache);
    }
    const { rows } = await pool.query(
        `SELECT id_pelicula, titulo, sinopsis, anyo, url_portada, url_cartel, url_trailer, url_carrusel, 
                demografia.nombre_demografia, genero.nombre_genero, pegi.edad
         FROM pelicula
         JOIN demografia ON pelicula.id_demografia = demografia.id_demografia
         JOIN genero ON pelicula.id_genero = genero.id_genero
         JOIN pegi ON pelicula.id_pegi = pegi.id_pegi`
    );
    peliculasCache = rows;
    lastCacheTime = now;
    console.log("🟢 Datos guardados en memoria");
    res.json(rows);
});



// INSERTAR UNA NUEVA PELICULA EN LA BASE DE DATOS
app.post("/peliculas", async (req, res) => {
    const { titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi } = req.body;
    const { rows } = await pool.query(
        `INSERT INTO pelicula (titulo, sinopsis, anyo, id_genero, url_portada, url_trailer, url_carrusel, id_demografia, id_pegi)
         VALUES ($1, $2, $3, (SELECT id_genero FROM genero WHERE nombre_genero = $4), $5, $6, $7, (SELECT id_demografia FROM demografia WHERE nombre_demografia = $8), (SELECT id_pegi FROM pegi WHERE edad = $9)) 
         RETURNING *`,
        [titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi]
    );
    res.status(201).json(rows[0]);
});



// ELIMINAR UNA PELICULA DE LA BASE DE DATOS
app.delete("/peliculas/:id", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        `DELETE FROM pelicula WHERE id_pelicula = $1 RETURNING *`,
        [id]
    );
    if (result.rowCount > 0) {
        res.json({ message: "Película eliminada correctamente", pelicula: result.rows[0] });
    } else {
        res.status(404).json({ message: "Película no encontrada" });
    }
});



// ACTUALIZAR UNA PELICULA DE LA BASE DE DATOS
app.put("/peliculas/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, sinopsis, anio, genero, url_cartel, url_trailer, url_carrusel, demografia, pegi } = req.body;
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


// MANIPULACION DE LOS GENEROS ==============================================================


// DEVUELVE TODOS LOS GENEROS
app.get("/genero", async (req, res) => {
    const now = Date.now();
    if (generoCache && now - lastCacheTime < CACHE_DURATION) {
        console.log("Generos obtenidos de memoria");
        return res.json(generoCache);
    }
    const {rows} = await pool.query(
        "SELECT * FROM GENERO;"
    );
    generoCache = rows;
    lastCacheTime = now;
    console.log("Generos guardados en memoria");
    res.json(rows);
});


// MANIPULACION DE LAS DEMOGRAFIAS ==============================================================


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


// MANIPULACION DE LOS PEGIS ==============================================================


// DEVUELVE TODOS LOS PEGIS
app.get("/pegi", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT * FROM PEGI;"
    );
    console.log(rows);
    res.json(rows);
});



// MANIPULACION DE LOS VISTOS Y FAVORITOS ==============================================================



//OBTENER TODOS LOS VISTOS
app.get("/visto", async (req, res) => {
    const { rows } = await pool.query(
        `SELECT *
         FROM pelicula
         JOIN visto ON pelicula.id_pelicula = visto.id_pelicula;`
        );
        console.log(rows);
        res.json(rows);
});



// INSERTAR UNA NUEVO ESTADO PARA UNA PELICULA
app.post("/visto/actualizar", async (req, res) => {
    const { id_perfil, id_pelicula, favorito, estado } = req.body;
    if (id_perfil === undefined || id_pelicula === undefined || favorito === undefined || estado === undefined) {
        return res.status(400).json({ error: 'Faltan parámetros en la solicitud.' });
    }

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
});


// OBTENEMOS TODOS LOS FAVORITOS DE UN PERFIL
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