let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let mongoose = require('mongoose');
let {StudentList} = require('./model');
let {DATABASE_URL, PORT} = require('./config');;

let app = express();
app.use(express.static('public'));
app.use(morgan('dev'));

let students = [{
        matricula: 1175990,
        nombre: 'Manuel',
        apellido: 'Gonzalez'
    },
    {
        matricula: 1175991,
        nombre: 'Erick',
        apellido: 'Pérez'
    },
    {
        matricula: 1175992,
        nombre: 'Samuel',
        apellido: 'Castillo'
    },
    {
        matricula: 1175992,
        nombre: 'Samuel',
        apellido: 'Castillo'
    }
];




// Req: The information that comes form the GET.
// Res: The var we use to send the response.
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

app.get('/api/studentsByName/:name', (req, res) => {
    // params.name because on the end-point I put it like that.
    let name = req.params.name;

    let result = students.filter((student) => {
        if (student.nombre === name) {
            return student;
        }
    });

    if (result) {
        res.status(200).json(result);
    } else {
        res.statusMessage = 'Los alumnos no se encontraron.';
        res.status(404).send();
    }
});

app.post('/api/newStudent', jsonParser, (req, res) => {
    let newStudent = {
        matricula: req.body.matricula,
        nombre: req.body.nombre,
        apellido: req.body.apellido
    }

    if (newStudent.matricula == undefined || newStudent.nombre == undefined || newStudent.apellido == undefined) {
        return res.status(406).send();
    } else {
        students.forEach(student => {
            if (student.matricula === newStudent.matricula) {
                return res.status(409).send();
            }
        });
        return res.status(201).json(newStudent);
    }
});

app.put('/api/updateStudent/:id', jsonParser, (req, res) => {
    let newUpdate = {
        matricula: req.body.matricula,
        nombre: req.body.nombre,
        apellido: req.body.apellido
    }

    let paramMatricula = req.params.id;

    if ((newUpdate.nombre == undefined || newUpdate.nombre == null) && (newUpdate.apellido == undefined || newUpdate.nombre == null)) {
        return res.status(406).send('Debe haber un nombre o apellido.');
    } else {
        if (paramMatricula == newUpdate.matricula) {
            students.forEach(students => {
                if (students.matricula === newUpdate.matricula) {
                    return res.status(202).json(newUpdate);
                }
            });
            return res.status(404).send('No existe ningun estudiante con esa matricula.');
        } else {
            return res.status(409).send('La matricula del Body no coincide con la de los parametros.');
        }
    }
});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            } else {
                server = app.listen(port, () => {
                        console.log("App is running on port " + port);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL);

module.exports = { app, runServer, closeServer };