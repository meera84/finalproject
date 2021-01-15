import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AddSpac, Contact, deleteSpac, SpacName } from './Models';

@Injectable({
  providedIn: 'root'
})
export class StocksService implements CanActivate {

  savedData:any;
  private token = ""
  userid = ""
  isAdmin: boolean;
 

  constructor(private http: HttpClient, private router:Router) { }
 

  async getStockList(): Promise<any[]> {
    return await this.http.get<any[]>(`/table`)
      .toPromise()
  }

  //this deleteSpac - Deletes from the main table. 
  async deleteSpac(id,ticker): Promise<any> {
    const params = new HttpParams()
    .set('id',id)
    .set('ticker',ticker)
    return await this.http.get<any>(`/deletefromTable`,{params})
      .toPromise()
  }
  async insertSpac(spac:SpacName): Promise<any> {
    console.info("here",spac)
    return await this.http.post<any>(`/table/`,{spac})
      .toPromise()
  }


  async getAllStocks(): Promise<any[]> {
    return await this.http.get<any[]>(`/allstocks`)
      .toPromise()
  }

  //HomePage Component - Also used for WatchList
  sendStocklist(){
    return this.getStockList()
    .then(
      r=>{
        const ticker = []
        const stockList = r;
        console.log('this stocjlist', stockList)
        for(var i = 0; i < stockList.length; i++){
          ticker.push(stockList[i].ticker);
        }
        return ticker
      }
    )
    .then(
      r=>{
        let tickersString="";
        let tickersConverted="";
        tickersString =r.toString(); 
        tickersString.toUpperCase();
        tickersConverted = tickersString.replace(/,/g, '%2C%20')
        console.log('tickersConverted',tickersConverted)
        return tickersConverted
      })
    .then(
      r=>{
        const spacsList = r;
        console.log('spacslist',spacsList)
        return this.http.post<any[]>(`/spacstocks`,{spacsList})
        .toPromise()
      }) 
      .then(
          r=> {
            const stockList = []
            for (const key in r){
            stockList.push(r[key])
            }
            return stockList
          }
        )  
  }

  async getNews(): Promise<any[]> {
    return await this.http.get<any[]>(`/news`)
      .toPromise()
  }

  async sendContact(message:Contact){
    console.log('m',message)
    return await this.http.post<any>(`/contact`,{message})
    .toPromise()
  }

  //Details Page
  async getStockDetail(symbol){
    return await this.http.get<any[]>(`/stocks/${symbol}`)
      .toPromise()
  }

  //Google Login
  async authenticate(){
      window.open(`/auth/google`,"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
     let listener = window.addEventListener('message', (message) => {
       //message will contain google user and details
       this.token = message.data.token
       this.userid = message.data.user[0].google_id
       this.isAdmin = message.data.adminUser
       console.log('token',this.token)
       console.log('userid',this.userid)
       console.log('isAdmin',this.isAdmin)
       if (this.token != ""){
          this.router.navigate(['/'])
      }
      
     });

   
  }

  isLogin(){
    return this.token != ""
  }
 
 isthisAdmin(){
   return this.isAdmin;
 }

  async logOut(){
    this.userid="";
    this.isAdmin = false;
    return await this.http.get<any[]>(`/auth/logout`)
    .toPromise()
  }


  async addToWatchList(data:AddSpac){
    console.log('d',data)
    return await this.http.post<any[]>(`/watchlist`,{data})
    .toPromise()
  }

  async delWatchList(data:deleteSpac){
    console.log('d',data)
    return await this.http.post<any[]>(`/deletewatchlist`,{data})
    .toPromise()
  }

  async getWatchList(userid):Promise<any>{
    //userid = userid.toString();
    const params = new HttpParams()
    .set('userid',userid);
    return await this.http.get<any[]>(`/getwatchlist`,{params})
    .toPromise()
  }

  async getTotalWatchList(userid):Promise<any>{
    //userid = userid.toString();
    const params = new HttpParams()
    .set('userid',userid);
    return await this.http.get<any[]>(`/totalwatchlist`,{params})
    .toPromise()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin())
      return true
    return this.router.parseUrl('/error')
  }


}
