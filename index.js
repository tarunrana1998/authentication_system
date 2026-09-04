import express from "express";

const app = express();

app.get('/', (req, res) => {
    const params = req.params
    const query = req.query
    const body = req.body
    res.json({
        message: 'Hello World!',
        success: true,
        statusCode: 200,
        data: {
            params,
            query,
            body
            
        }
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})