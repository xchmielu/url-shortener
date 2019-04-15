const secret = require('./secret.json')

const mongoose = require('mongoose')
const validURL = require('valid-url')
const randomString = require('randomstring')


console.log(secret.cos)
const DB_user = secret.db_user
const DB_pass = secret.db_pass
const host = 'http://localhost:8080/'

mongoose.connect(`mongodb://${DB_user}:${DB_pass}@ds217976.mlab.com:17976/link-shortener`)

var schema = new mongoose.Schema({
    short: String,
    url: String
});

var URL = mongoose.model("URL", schema);

function validateURL(url) {

    return validURL.isUri(url);

}

function findURL(short, cb) {

    URL.findOne({ short: short }).exec(function(err, url) {

        if(!url || err) {
            return cb( new Error("URL not found") );
        }

        cb(null, url.url);

    });

}

function shortenURL(value, cb) {

    if( !validateURL(value) ) {
        return cb( new Error("URL is not valid") );
    }

    URL.findOne({ url: value }).exec(function(err, url) {

        if(err) {
            return cb(err);
        }

        if(!url) {

            var short = randomString.generate(5);
            var newURL = new URL({
                short: short,
                url: value
            });

            newURL.save(function(err, url) {

                if(err) {
                    return cb(err);
                }

                cb(null, host + url.short);

            });

        } else {
            cb(null, host + url.short);
        }

    });

}

module.exports = {
    shorten: shortenURL,
    find: findURL
};