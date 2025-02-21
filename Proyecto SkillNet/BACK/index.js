// INITIALIZATION DE DEPENDENCIAS Y VARIABLES
const express = require("express"); 
const { Pool } = require("pg"); 
const cors = require("cors");
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());



// CONEXION A LA BASE DE DATOS
const pool = new Pool({
    user: "postgres",
    host: "skillnet.cno6yck6ypip.us-east-1.rds.amazonaws.com",
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

// RUTAS
app.post("/login", async (req, res) => {
    const { correo, contrasenia } = req.body;

    try {
        // Buscar el usuario en la base de datos por correo
        const { rows } = await pool.query("SELECT * FROM usuario WHERE correo = $1", [correo]);

        if (rows.length === 0) {
            // Si no se encuentra el correo
            return res.json({ success: false, message: "Correo no registrado" });
        }

        const usuario = rows[0];

        // Verificar si la contraseña es correcta (comparación en texto claro)
        if (usuario.contrasena !== contrasenia) {
            return res.json({ success: false, message: "Contraseña incorrecta" });
        }

        // Si el login es exitoso
        res.json({
            success: true,
            message: "Login exitoso",
            data: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                rol: usuario.rol,
                correo: usuario.correo,
                url: usuario.url
            }
        });

    } catch (error) {
        // En caso de error en la consulta o conexión
        console.error("Error al hacer login:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});


app.get("/cursos", async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT c.id_curso, e.empresa, d.dificultad, g.genero, titulo,url
            FROM CURSO c 
            JOIN DIFICULTAD d ON d.id_dificultad = c.id_dificultad
            LEFT JOIN EMPRESA e ON e.id_empresa = c.id_empresa
            JOIN GENERO g ON g.id_genero = c.id_genero;`
            );
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get("/cursos/:idCurso", async (req, res) => {
    try {
        const { idCurso } = req.params;  // Obtener el idCurso de los parámetros de la URL

        // Realizar la consulta para obtener los detalles del curso con el idCurso
        const { rows } = await pool.query(
            `SELECT c.id_curso, e.empresa, d.dificultad, g.genero, c.titulo, c.url, c.descripcion
            FROM CURSO c 
            JOIN DIFICULTAD d ON d.id_dificultad = c.id_dificultad
            LEFT JOIN EMPRESA e ON e.id_empresa = c.id_empresa
            JOIN GENERO g ON g.id_genero = c.id_genero
            WHERE c.id_curso = $1;`, 
            [idCurso]  // Pasar el idCurso como parámetro en la consulta
        );

        // Si no se encuentran resultados, devolver un mensaje adecuado
        if (rows.length === 0) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        // Devolver los resultados en formato JSON
        res.json(rows[0]);

    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



app.get("/curso/video/:idCurso", async (req, res) => {
    try {
        // Obtener el parámetro idCurso de la URL
        const idCurso = req.params.idCurso;

        console.log("ID Curso recibido:", idCurso); // Agregado para depuración

        // Realizar la consulta para obtener los videos relacionados con el curso
        const { rows } = await pool.query(
            `SELECT v.id_video, v.titulo, v.url
            FROM VIDEO v
            JOIN CURSO c ON v.id_curso = c.id_curso
            WHERE c.id_curso = $1;`, 
            [idCurso]  // Pasamos el idCurso como parámetro de la consulta
        );

        console.log("Resultados de la consulta:", rows); // Agregado para depuración

        // Si no se encuentran resultados, enviar un mensaje adecuado
        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron videos para este curso" });
        }

        // Devolver los resultados en formato JSON
        res.json(rows);

    } catch (error) {
        // Log de error
        console.error("Error en la consulta:", error);

        // Respuesta con error 500 si ocurre algún fallo en la consulta
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get("/usuario", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM usuario");
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
