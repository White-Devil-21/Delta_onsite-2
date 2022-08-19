const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Delta_21',
    database: 'notes'
})
const app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'))
app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    let sql = "SELECT * FROM notes_data ORDER BY pinOrder"
    db.query(sql, (error, rows)=>{
        if(error){
            res.sendStatus(500)                        
        }
        res.render('index.ejs', {data: rows})        
    })
    
})

app.post('/', (req, res)=>{
    let sql = "INSERT INTO notes_data(note) VALUES (?)"
    db.query(sql, [[req.body.note]], (error, result)=>{
        if(error){
            res.sendStatus(400)
        }
        console.log(result)
    })
    res.redirect('/')
})

app.post('/pin', (req, res)=>{
    let sql1 = "UPDATE notes_data SET pinOrder = 1 WHERE note = ?"
    db.query(sql1, [[req.body.pinned]], (error, result)=>{
        if(error){
            res.sendStatus(500)
        }
        console.log(result)
    })
    let sql2 = "UPDATE notes_data SET pinOrder = (sNo + 1) WHERE note != ?"
    db.query(sql2, [[req.body.pinned]], (error, result)=>{
        if(error){
            res.sendStatus(500)
        }
        console.log(result)
    })
    let sql3 = "SELECT * FROM notes_data ORDER BY pinOrder"
    db.query(sql3, (error, rows)=>{
        if(error){
            res.sendStatus(500)
        }
        res.render('index.ejs', {data: rows})        
    })
})

app.post('/delete', (req, res)=>{
    let sql1 = "DELETE FROM notes_data WHERE note = ?"
    db.query(sql1, [[req.body.deleted]], (error, result)=>{
        if(error){
            res.sendStatus(500)
        }
        console.log(result)
    })
    let sql2 = "SELECT * FROM notes_data ORDER BY pinOrder"
    db.query(sql2, (error, rows)=>{
        if(error){
            res.sendStatus(500)
        }
        res.render('index.ejs', {data: rows})        
    })

})

app.listen(1000)

