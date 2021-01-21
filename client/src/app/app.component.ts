import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSvc } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  joinForm: FormGroup
  buttonWording

  constructor(private fb: FormBuilder, private chatSvc: ChatSvc) {}

  ngOnInit() :void {

    this.joinForm = this.fb.group({name: this.fb.control('', [Validators.required])})
    this.buttonWording = this.chatSvc.buttonWording
  }


  onButtonClick() {

    const name = this.joinForm.value.name;
    if(this.buttonWording.toLowerCase() == "join") {

      this.chatSvc.join(name)
      this.buttonWording = this.chatSvc.buttonWording

    }

    else {

      this.chatSvc.leave()
      this.buttonWording = this.chatSvc.buttonWording
    }
   

  }


}
