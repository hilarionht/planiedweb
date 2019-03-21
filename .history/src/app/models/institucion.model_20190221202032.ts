       
export class Institucion{
    constructor(
        public nombre: string,
        public domicilio: string,
        public email: string,
        //public telefono: Array<Telefono>,
        public idRegion: string,
        public estado?: boolean,
        public _id?: string
    ) {

    }
}