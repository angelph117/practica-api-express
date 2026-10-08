const express = require('express');
const db = require('./config/db');

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE PARA RECIBIR JSON
// ==========================================
app.use(express.json());

// ==========================================
// RUTA BASE
// ==========================================
app.get('/', (req, res) => {
    res.send('Servidor de la API REST funcionando correctamente');
});

// ==========================================
// GET - OBTENER TODOS LOS ALUMNOS
// ==========================================
app.get('/api/alumnos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM alumnos');

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los alumnos:', error.message);

        res.status(500).json({
            mensaje: 'Error al obtener los alumnos',
            error: error.message
        });
    }
});

// ==========================================
// GET - OBTENER UN ALUMNO POR ID
// ==========================================
app.get('/api/alumnos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número válido'
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM alumnos WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Alumno no encontrado'
            });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error('Error al obtener el alumno:', error.message);

        res.status(500).json({
            mensaje: 'Error al obtener el alumno',
            error: error.message
        });
    }
});

// ==========================================
// POST - CREAR UN NUEVO ALUMNO
// ==========================================
app.post('/api/alumnos', async (req, res) => {
    try {
        const { nombre, carrera } = req.body;

        if (!nombre || !carrera) {
            return res.status(400).json({
                mensaje: 'Los campos nombre y carrera son obligatorios'
            });
        }

        const [result] = await db.query(
            'INSERT INTO alumnos (nombre, carrera) VALUES (?, ?)',
            [nombre, carrera]
        );

        const nuevoAlumno = {
            id: result.insertId,
            nombre: nombre,
            carrera: carrera
        };

        res.status(201).json(nuevoAlumno);

    } catch (error) {
        console.error('Error al crear el alumno:', error.message);

        res.status(500).json({
            mensaje: 'Error al crear el alumno',
            error: error.message
        });
    }
});

// ==========================================
// PUT - ACTUALIZAR UN ALUMNO
// ==========================================
app.put('/api/alumnos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, carrera } = req.body;

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número válido'
            });
        }

        if (!nombre || !carrera) {
            return res.status(400).json({
                mensaje: 'Los campos nombre y carrera son obligatorios'
            });
        }

        const [result] = await db.query(
            'UPDATE alumnos SET nombre = ?, carrera = ? WHERE id = ?',
            [nombre, carrera, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Alumno no encontrado'
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM alumnos WHERE id = ?',
            [id]
        );

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error('Error al actualizar el alumno:', error.message);

        res.status(500).json({
            mensaje: 'Error al actualizar el alumno',
            error: error.message
        });
    }
});

// ==========================================
// DELETE - ELIMINAR UN ALUMNO
// ==========================================
app.delete('/api/alumnos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número válido'
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM alumnos WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Alumno no encontrado'
            });
        }

        const alumnoEliminado = rows[0];

        await db.query(
            'DELETE FROM alumnos WHERE id = ?',
            [id]
        );

        res.status(200).json({
            mensaje: 'Alumno eliminado correctamente',
            alumno: alumnoEliminado
        });

    } catch (error) {
        console.error('Error al eliminar el alumno:', error.message);

        res.status(500).json({
            mensaje: 'Error al eliminar el alumno',
            error: error.message
        });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});