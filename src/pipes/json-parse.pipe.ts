import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonParse'
})
export class JsonParsePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    console.log(JSON.parse(value));
    return JSON.parse(value);
  }

}
