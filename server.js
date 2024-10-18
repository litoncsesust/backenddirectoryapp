const { error } = require('console');
const { stat } = require('fs');
const http = require('http');

const todos = [
    {id:1, text:"TODO One"},
    {id:2, text:"TODO Two"},
    {id:3, text:"TODO Three"},
]

const server = http.createServer((req, res) => {
    const { method, url } = req;
    let body = [];
  
    req.on('data', chunk => {
        body.push(chunk)
    }).on('end', ()=>{
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success: false,
            data: null,
            error: null
        }

        if(method === 'GET' && url === '/todos') {
            status = 200;
            response.success = true;
            response.data = todos;
        } else if ( method === 'POST' && url === '/todos') {
            const {id, text} = JSON.parse(body)
            
            if(!id || !text) {
                status = 400;
                response.error = 'Please add id and text';
            }else {
                todos.push({id, text})
                status = 201;
                response.success = true;
                response.data = todos;
            }
        }
        
        res.writeHead(status, {
            'Contert-Type': 'application/json',
            'X-Powered-By': 'NodeJs'
        })
        res.end(JSON.stringify(response));
    } )

   
})

const PORT = 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))