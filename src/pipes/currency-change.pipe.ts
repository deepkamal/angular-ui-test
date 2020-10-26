import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyChange'
})
export class CurrencyChangePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if(value == 0) {
      return 0;
  }
  else
  {        
    // hundreds
    if(value <= 999){
      return value ;
    }
    // thousands
    else if(value >= 1000 && value <= 99999){
      return (value / 1000) + 'K';
    }
    else if(value >= 100000 && value <= 999999){
      return (value / 100000) + 'LAC';
    }
    // billions
    // else if(value >= 1000000000 && value <= 999999999999){
    //   return (value / 1000000000) + 'B';
    // }
    else
      return value ;
    }
    // return null;
  }

}
