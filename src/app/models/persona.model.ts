

export class Persona{
    constructor(
        public apellido: string,
        public nombre: string,
        public dni: string,
        public email: string,
        //public telefonos:Array<Telefono>,
        public telefono: string,
        public direccion: string,
        public fechaNacimiento: string,
        public fotoPerfil?: string,
        //public cargo?: Array<Institucion>,
        //public instituciones: Array<Institucion>,
        public supervisor?: Persona,
        public estado?: boolean,
        public _id?: string
    ) {

    }
}