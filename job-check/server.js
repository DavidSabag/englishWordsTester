const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const { mongoConnection } = require('./database');
const { API_URL_EN, COLLECTION_NAME } = require('./server.config');

app.use(cors());
app.options('*', cors());
app.use(express.json());



app.post('/job-check',  async (req, res) => {   
    try{ 
        const { word } = req.body;
        console.info(`word to test: ${word}`);

        const db = await mongoConnection;
        const wordsCollection = db.collection(COLLECTION_NAME)
        const result = await wordsCollection.find({type: 'words'}).toArray()

        if(result.length === 0){
            await wordsCollection.insertOne({type: 'words', data: []})
        }

        const isWordExist = result?.[0]?.data.some(w => w === word )

        if(isWordExist){
            return res.status(200).json({ exist: true });    
        }

        const response = await axios.get(`${API_URL_EN}/${word}`)
                
        
        if(response?.data?.length > 0){  // exist

            await wordsCollection.updateOne(
                { type: 'words' },            
                { $addToSet: {data: word} },
                { $upsert: true }
            )
            return res.status(200).json({ exist: true });
    
        }
           
        return res.status(200).json({ exist: false });

    } catch(err) {
        console.error(err.message)
        res.status(500).json({ err: err.message, exist: false })
        
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

