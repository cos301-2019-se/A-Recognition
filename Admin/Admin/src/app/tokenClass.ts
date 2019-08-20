import { Injectable } from '@angular/core';
import * as crypto from 'crypto-ts';

@Injectable({
  providedIn: 'root'
})
export class TokenClass {

  tokenBook: any = [];
  clientEmail: any;
  
  constructor()
  {
  }
  public setTokenBook()
  {
    this.tokenBook[this.clientEmail] = 1;
  }
  public incrementNum()
  {
    this.tokenBook[this.clientEmail] += 1;
  }
  public getTokenBook()
  {
    if(this.tokenBook) 
    {
      return this.tokenBook[this.clientEmail];
    }
    else
    {
      return null;
    }
  }
  public setEmail(email:any)
  {
    this.clientEmail = email;
  }
  public getEmail()
  {
    return this.clientEmail;
  }
}