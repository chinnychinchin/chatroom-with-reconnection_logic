import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMsg, ChatSvc } from './chat.service';
import { faPaperPlane, faSmile, faPaperclip } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  joinForm: FormGroup
  buttonWording
  participant = null
  $event: Subscription
  messages: ChatMsg [] = []
  faPaperPlane = faPaperPlane; faSmile = faSmile; faPaperClip = faPaperclip;

  constructor(private fb: FormBuilder, private chatSvc: ChatSvc) {}

  ngOnInit() :void {

    this.buttonWording = this.chatSvc.buttonWording
    this.joinForm = this.fb.group({name: this.fb.control('', [Validators.required]), message: this.fb.control("")})
    this.$event
  }

  ngOnDestroy() :void {

    this.chatSvc.event.unsubscribe();

  }


  onButtonClick() {

    const name = this.joinForm.value.name;
    this.participant = name;
    if(this.buttonWording.toLowerCase() == "join") {

      this.chatSvc.join(name)
      this.buttonWording = this.chatSvc.buttonWording
      this.chatSvc.event.subscribe((message => { 
  
        this.messages.push(message)

      }))

    }

    else {

      this.chatSvc.leave()
      this.buttonWording = this.chatSvc.buttonWording
    }
   

  }


  sendMsg() {

    const message = this.joinForm.get("message").value
    this.joinForm.get("message").reset()
    this.chatSvc.sendMsg(message)
  }


}
