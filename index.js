const express = require('express');

const app = express();

const PORT = 3000;

// Middleware para recibir datos en formato JSON
app.use(express.json());


// ==========================================
// DATOS EN MEMORIA
// ==========================================

let alumnos = [
    {
        id: 1,
        nombre: "Angel",
        carrera: "Ingeniería en Sistemas Computacionales"
    },
    {
        id: 2,
        nombre: "Maria",
        carrera: "Ingeniería en Sistemas Computacionales"
    },
    {
        id: 3,
        nombre: "Carlos",
        carrera: "Ingeniería en Sistemas Computacionales"
    }
];


// ==========================================
// RUTA BASE
// ==========================================

app.get('/', (req, res) => {
    res.send('Servidor de la API REST funcionando correctamente');
});


// ==========================================
// GET - OBTENER TODOS LOS ALUMNOS
// ==========================================

app.get('/api/alumnos', (req, res) => {
    res.status(200).json(alumnos);
});


// ==========================================
// GET - OBTENER UN ALUMNO POR ID
// ==========================================

app.get('/api/alumnos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const alumno = alumnos.find(alumno => alumno.id === id);

    if (!alumno) {
        return res.status(404).json({
            mensaje: 'Alumno no encontrado'
        });
    }

    res.status(200).json(alumno);
});


// ==========================================
// POST - CREAR UN NUEVO ALUMNO
// ==========================================

app.post('/api/alumnos', (req, res) => {

    const { nombre, carrera } = req.body;

    if (!nombre || !carrera) {
        return res.status(400).json({
            mensaje: 'Los campos nombre y carrera son obligatorios'
        });
    }

    const nuevoId = alumnos.length > 0
        ? Math.max(...alumnos.map(alumno => alumno.id)) + 1
        : 1;

    const nuevoAlumno = {
        id: nuevoId,
        nombre: nombre,
        carrera: carrera
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});


// ==========================================
// PUT - ACTUALIZAR UN ALUMNO
// ==========================================

app.put('/api/alumnos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const indice = alumnos.findIndex(alumno => alumno.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Alumno no encontrado'
        });
    }

    const { nombre, carrera } = req.body;

    if (!nombre || !carrera) {
        return res.status(400).json({
            mensaje: 'Los campos nombre y carrera son obligatorios'
        });
    }

    alumnos[indice] = {
        id: id,
        nombre: nombre,
        carrera: carrera
    };

    res.status(200).json(alumnos[indice]);
});


// ==========================================
// DELETE - ELIMINAR UN ALUMNO
// ==========================================

app.delete('/api/alumnos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const indice = alumnos.findIndex(alumno => alumno.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Alumno no encontrado'
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1);

    res.status(200).json({
        mensaje: 'Alumno eliminado correctamente',
        alumno: alumnoEliminado[0]
    });
});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});