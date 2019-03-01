
export class Candidata{
    constructor(
        public numero: string,
        public apellido: string,
        public nombre: string,
        public fecha_nacimiento: string,
        public turno:  string,
        public curso: string,
        public division: string,
        public dni: string,
        public foto?: string,
        public estado?: boolean,
        public id?: string,
        public descripcion?:string,
        public permite?:boolean
    ) {

    }
}