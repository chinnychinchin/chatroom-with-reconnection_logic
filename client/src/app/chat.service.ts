import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ChatSvc {

    event = new Subject()
    sock: WebSocket
    SOCKETENDPOINT = 'ws://localhost:3000/chat' 
    buttonWording = "Join"
    reconnectFunc

    join(name: string) {
        
        const chatSvc = this
        this.sock = new WebSocket(`${this.SOCKETENDPOINT}/${name}`);
        this.buttonWording = "Leave"

        //Handles message events
        this.sock.onmessage = (payload) => { 
            console.log(payload.data)
            this.event.next(payload.data)

        }

        //Handles the event when server drops connection. This is also triggered when a participant leaves voluntarily
        this.sock.onclose = () => {

            if(this.sock != null) {

                console.log(`Lost connection with server`); 

                //Code to reestablish connection
                this.reconnectFunc = setTimeout(function() {
                    console.log("reconnecting...")
                    chatSvc.join(name)
                  }, 2000);
            }

        }
        
    }


    leave() {

        //closing a socket that is already closed won't cause an error 
        this.sock.close()
        this.sock = null
        //If connection with server is lost, clicking the leave button stops the reestablishment of connection
        clearTimeout(this.reconnectFunc)
        this.buttonWording = "Join"

    }



}