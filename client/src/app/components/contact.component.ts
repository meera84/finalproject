import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../Models';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  form: FormGroup

  constructor(private fb: FormBuilder, private stockSvc: StocksService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:this.fb.control('',[Validators.required]),
      email:this.fb.control("",[Validators.required, Validators.email]),
      subject: this.fb.control("",[Validators.required]),
      message: this.fb.control("",[Validators.required]),
      
    })
  }

    submitForm(){
    const formValue = this.form.value as Contact;
    console.info(formValue)
    this.stockSvc.sendContact(formValue)
    .then(data => {
      if (data?.data != "successful"){
        alert(`Your message was not able to be sent.`); 
      }
      else{
        alert(`Your message was sent successfully`); 
      }
      this.form.reset();
    })
    
    
    


  }

}
