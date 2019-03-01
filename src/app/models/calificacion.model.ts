
export class Calificacion{
    constructor(
        public puntos: string,
        public observacion: string,
        public usuario: string,
        public candidata: string,
        public criterio: string,
        public id?: string
    ) {

    }
}