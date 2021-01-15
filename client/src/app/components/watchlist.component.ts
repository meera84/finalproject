
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { deleteSpac } from '../Models';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist=[];
  userid=""
  savedData:any;
  filteredData=[]
  merged=[];
  foundData = [];
  try1=[]
  totalWatchList: any;
  userSignedIn=false;
  ytd:any;
  gotData=false;
  
      constructor(private stockSvc: StocksService, private router: Router) { }

      async ngOnInit() {
        this.userSignedIn = await this.stockSvc.isLogin()
        this.userid = await this.stockSvc.userid;
        if (this.userid ||this.userid !=""){
          this.watchlist = await this.stockSvc.getWatchList(this.userid)
          if(this.watchlist.length <= 0){
            this.gotData = false;
          } else{
            this.gotData = true;
          }
        this.savedData = await this.stockSvc.sendStocklist()
        
        this.foundData = await this.getfiltereddata();
        
        this.totalWatchList = await this.stockSvc.getTotalWatchList(this.userid);
      
        }
      }

     async getfiltereddata(){

        

        for (let i=0; i<this.watchlist.length; i++) {
          console.log('this.saveddata',this.savedData)
          console.log('this.watchlist',this.watchlist)
          const watchStock = this.watchlist[i]
          const theOne = this.savedData.find(v => v.symbol == watchStock.ticker)
            console.log('theOne',theOne)
          if (null == theOne)
            continue;

          // calculate 
          const newObject: any = {
            ticker: watchStock.ticker,
            fullname: theOne.name,
            volume: theOne.volume,
            openPrice: theOne.open,
            watchlistPrice: watchStock.open_price,
            difference: Math.round(((+theOne.open) - (+watchStock.open_price))*100)/100,
            loggedDate: watchStock.loggeddate,
            idwatchlist : watchStock.idwatchlist,
            
        
          }
          this.filteredData.push(newObject)
        }
        
        return this.filteredData
      }

      async deleteWatchList(symbol,id){
        console.log(symbol,id)
        const data:deleteSpac = {
          userid : this.userid,
          id:id,
          ticker:  symbol
        }
       await this.stockSvc.delWatchList(data);
      //  window.location.reload();
      alert(`${symbol} has been deleted from your watchlist.`);

      }

      async authenticate(){
        await this.stockSvc.authenticate();
        this.userSignedIn = await this.stockSvc.isLogin()
        this.userid = await this.stockSvc.userid;
        if (this.userid ||this.userid !=""){
          this.watchlist = await this.stockSvc.getWatchList(this.userid)
          
        this.savedData = await this.stockSvc.sendStocklist()
        
        this.foundData = await this.getfiltereddata();
        
        this.totalWatchList = await this.stockSvc.getTotalWatchList(this.userid);
        }
        }

      
}


