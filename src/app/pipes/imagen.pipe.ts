import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'user'): any {

    let url = URL_SERVICIOS + "/download/image" ;
console.log(url);
    if ( !img ) {
      return url + '/no-img.jpg';
    }
// console.log(url);
    // if ( img.indexOf('https') >= 0 ) {
    //   return img;
    // }

    switch ( tipo ) {

      case 'user':
        url += '/user/' + img;
      break;

      case 'candidata':
        url += '/candidata/downloadImage/' + img;
      break;

      case 'jurado':
         url += '/jurado/' + img;
      break;

      default:
        console.log('tipo de imagen no existe, user, candidata, jurado');
        url += 'no-img.jpg';
    }
    // console.log(url);
    
    return url;
  }

}
