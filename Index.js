const http = require('http')
const express = require('express')
const path = require('path')
const app = express()
const { dirname } = require('path')
const hbs = require('hbs')
const session = require('express-session')


app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.urlencoded({ extended: false }))

// use session setting
app.use(
    session(
        {
            cookie: {
                maxAge: 1000 * 60 * 60 * 2,
                secure: false,
                httpOnly: true
            },
            store: new session.MemoryStore,
            saveUninitialized: true,
            resave: false,
            secret: 'secretkey'
        }
    )
)
// setup flash message midleware
app.use(function (request, response, next) {
    response.locals.message = request.session.message
    delete request.session.message
    next()
})

hbs.registerPartials(__dirname + '/views/partials')

// get connection
const dbConnection = require('./connection/db')
const uploadFile = require('./middleware/uploadFile')
const { response } = require('express')
const { type } = require('os')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')

const pathFile = 'http://localhost:3100/uploads/'

app.get('/', function (request, response) {
    const query = `SELECT heroes_tb.id, photos, heroes_tb.name, type_tb.name AS type FROM heroes_tb INNER JOIN type_tb ON type_id = type_tb.id ORDER BY heroes_tb.id DESC`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            // console.log(results)

            const heroes = {
                ...results
            }

            response.render('index', {
                title: "Heroes",
                heroes
            })
        })
    })
});

app.get('/heroes/:id', function (request, response) {
    const { id } = request.params
    const query = `SELECT
                    heroes_tb.id, heroes_tb.name, type_id, type_tb.name AS type_name,
                    photos, agility, power, stamina, unique_skill, weakness, description
                     FROM heroes_tb INNER JOIN type_tb ON type_id = type_tb.id WHERE heroes_tb.id = ${id}`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            heroes = {
                ...results[0]
            }

            response.render('heroes', {
                title: "Heroes Details",
                heroes
            })
        })
    })
});

app.get('/add-heroes', function (request, response) {
    const query = `SELECT * FROM type_tb`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            // console.log(results)

            const type = {
                ...results
            }
            response.render('add-heroes', {
                title: "Add Heroes",
                type
            })
        })
    })
});

app.post('/add-heroes', uploadFile('image'), function (request, response) {
    const { name, type, agility, power, stamina, skill, weakness, description } = request.body
    let image = ''


    if (request.file) {
        image = request.file.filename
    }

    if (name == '' || type == '' || image == '' || agility == '' || power == '' || stamina == '' || skill == '' || weakness == '' || description == '' || agility < 0 || power < 0 || stamina < 0 || agility > 100 || power > 100 || stamina > 100) {
        request.session.message = {
            type: 'danger',
            message: 'Please insert all data correctly'
        }
        response.redirect('/add-heroes')
    }
    else {

        const query = `INSERT INTO heroes_tb (name, type_id, photos, agility, power, stamina, unique_skill, weakness, description)
                    VALUES ("${name}", ${type}, "${image}", ${agility}, ${power}, ${stamina}, "${skill}", "${weakness}", "${description}")`
        dbConnection.getConnection(function (err, conn) {
            if (err) throw err

            conn.query(query, function (err, results) {
                if (err) throw err

                request.session.message = {
                    type: 'success',
                    message: 'Add heroes successfull'
                }
                response.redirect(`/heroes/${results.insertId}`)
            })
        })
    }
});

app.get('/edit-heroes/:id', function (request, response) {
    const { id } = request.params
    const query = `SELECT 
                    heroes_tb.id, heroes_tb.name, type_id, type_tb.name AS type_name,
                    photos, agility, power, stamina, unique_skill, weakness, description
                    FROM heroes_tb INNER JOIN type_tb ON type_id = type_tb.id WHERE heroes_tb.id = ${id}`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            // console.log(results[0])

            const heroes = {
                ...results[0],
                photos: pathFile + results[0].photos
            }
            response.render('edit-heroes', {
                title: "Edit Heroes",
                heroes
            })
        })
    })
});

app.post('/edit-heroes', uploadFile('image'), function (request, response) {
    const { name, type, agility, power, stamina, skill, weakness, description, id, oldImage } = request.body

    let image = oldImage.replace(pathFile, '');

    if (request.file) {
        image = request.file.filename;
    }
    if (name == '' || type == '' || image == '' || agility == '' || power == '' || stamina == '' || skill == '' || weakness == '' || description == '' || agility < 0 || power < 0 || stamina < 0 || agility > 100 || power > 100 || stamina > 100) {
        request.session.message = {
            type: 'danger',
            message: 'Please insert all data correctly'
        }
        response.redirect('/add-heroes')
    }
    else {
        const query = `UPDATE heroes_tb SET
                     name = "${name}", type_id = "${type}", photos = "${image}", agility = "${agility}",
                     power = "${power}", stamina = "${stamina}", unique_skill= "${skill}",
                     weakness= "${weakness}", description = "${description}"
                    WHERE id = ${id}`

        dbConnection.getConnection((err, conn) => {
            // if (err) throw err;
            if (err) {
                console.log(err);
            }

            conn.query(query, (err, results) => {
                // if (err) throw err;

                if (err) {
                    console.log(err);
                }
                response.redirect(`/heroes/${id}`);
            })
        })
    }
});

app.get('/delete-heroes/:id', function (request, response) {
    const id = request.params.id
    const query = `DELETE FROM heroes_tb WHERE id = ${id}`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err

        conn.query(query, function (err, results) {
            if (err) throw err

            request.session.message = {
                type: 'success',
                message: 'Delete heroes successfull'
            }
            response.redirect('/')
        })
    })

})

app.get('/type-list', function (request, response) {
    const query = `SELECT * FROM type_tb ORDER BY id ASC`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            console.log(results)

            const type = {
                ...results
            }

            response.render('type-list', {
                title: "Type List",
                type
            })
        })
    })
});

app.get('/add-type', function (request, response) {
    response.render('add-type', {
        title: "Add Type"
    })
});

app.post('/add-type', function (request, response) {
    const { name } = request.body

    if (name === "") {
        request.session.message = {
            type: 'danger',
            message: 'Please insert all data'
        }
        response.redirect('/add-type')
    }
    else {
        const query = `INSERT INTO type_tb (name) VALUES ("${name}")`

        dbConnection.getConnection(function (err, conn) {
            if (err) throw err

            conn.query(query, function (err, results) {
                if (err) throw err

                request.session.message = {
                    type: 'success',
                    message: 'Add type successfully'
                }

                response.redirect(`/type-list`)
            })
        })
    }
});

app.get('/delete-type/:id', function (request, response) {
    const id = request.params.id
    const query = `DELETE FROM type_tb WHERE id = ${id}`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err

        conn.query(query, function (err, results) {
            if (err) throw err

            request.session.message = {
                type: 'success',
                message: 'Delete type successfull'
            }
            response.redirect('/type-list')
        })
    })

})

app.get('/edit-type/:id', function (request, response) {
    const { id } = request.params
    const query = `SELECT * FROM type_tb WHERE id = ${id}`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
            if (err) throw err

            const type = {
                ...results[0]
            }
            response.render('edit-type', {
                title: "Edit Type",
                type
            })
        })
    })
});

app.post('/edit-type', function (request, response) {
    const { id, name } = request.body

    if (name === "") {
        request.session.message = {
            type: 'danger',
            message: 'Please insert data'
        }
        response.redirect(`/edit-type/${id}`)
    }
    else {
        const query = `UPDATE type_tb SET name = "${name}" WHERE id = ${id}`

        dbConnection.getConnection(function (err, conn) {
            if (err) throw err;

            conn.query(query, function (err, results) {
                if (err) throw err

                response.redirect(`/type-list`);
            })
        })
    }
});

const port = 3100
const server = http.createServer(app)
server.listen(port)