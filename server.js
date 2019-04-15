const express = require('express')
const api = require('./api')

const app = express()


app.get('/:short', (req,res) => {
    api.find(req.params.short, function(err, url) {
        if(err) {
            res.status('404').send('URL not found')
        } else {
            res.redirect(url)
        }
    })
})

app.get('/api/shorter', (req, res) => {
    api.shorten(req.query.url, (err, link) => {
        if(err) {
            res.json({
                err: true,
                message: err.message
            })
        } else {
            res.json({
                err: false, 
                link: link
            })
        }
    })
})



app.listen(8080, () => {
    console.log('Server is running on port 8080')
})