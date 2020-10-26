import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalSpace'
})
export class CapitalSpacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

}
