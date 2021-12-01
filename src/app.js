const connect = require('./connect')

const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();

const redisPort = 6379
const client = redis.createClient(
{
    socket : {
        host: 'redis',
        port: redisPort
    }
});

console.log(client)

//log error to the console if any occurs
client.on("error", (err) => {
    console.log(err);
});

connect()



app.get("/jobs/:id", async (req, res) => {
    console.log(req.url)
    const searchTerm = req.params['id'];
    console.log(searchTerm)
    try {
        console.log(client.isOpen)
        await client.connect()
        console.log(client.isOpen)
        let jobs = await client.get(searchTerm)
        if (jobs) {
            res.status(200).send({
                jobs: JSON.parse(jobs),
                message: "data retrieved from the cache"
            })
        }
        else {
            const jobs = await axios.get(`https://jsonplaceholder.typicode.com/todos/${searchTerm}`);
                console.log(jobs.data)
                client.set(searchTerm, JSON.stringify(jobs.data));
                console.log('saved in cache')
                console.log(jobs.data)
                    res.status(200).send({
                    jobs: jobs.data,
                })
        }

        await client.quit()
        //res.status(404).send('NOT FOUND XD')
    }catch(error){
        console.log('Error ocurred')
        console.log(error)
    }
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Node server started");
});
