//Load libraries
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const morgan = require('morgan');

//Instantiate app
const app = express();
const appWS= expressWs(app);

//configure environment and app
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
app.use(cors());
app.use(morgan('combined'));


//
const ROOM = [];

const mkMsg = (msg, name) => {

    return JSON.stringify({
        from: name,
        msg, 
        time: new Date()
    })

}

//configure routes

//websocket endpoint
app.ws('/chat/:name', (ws, req) => {

    const name = req.params.name;
    
    ROOM.push({name, ws});
    //send a message to all participants about new participant joining
    for (const p of ROOM) {
        
        const msg = mkMsg(`${name} has joined the chat`, "Server")
        p.ws.send(msg)

    }

    ws.on('message', (payload) => {

        const msg = mkMsg(payload, name)
        for (let p of ROOM) {
         
            p.ws.send(msg)
    
        }
    
    })

    //IMPT to do this!!!
    ws.on('close', () => {
        
        const pIndex = ROOM.findIndex(p => { return p.name == name});
        ROOM[pIndex]['ws'].close();
        ROOM.splice(pIndex,1)
        //Remember to do the loop after splicing, otherwise sending a message to a socket that has already closed will throw an error 
        //causing the rest of the participants to not be able to receive the message.
        for (const p of ROOM) {
   
            p.ws.send(`${name} has left the chat`)
    
        }

    })

})


app.listen(PORT, () => {console.log(`Your chatroom server has started on port ${PORT} at ${new Date()}`)})