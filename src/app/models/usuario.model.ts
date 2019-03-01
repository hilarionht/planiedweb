export class Usuario{
    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public password: string,
        public username: string,
        public fotoPerfil?: string,
        public rol?: string,
        public google?: boolean,
        public estado?: boolean,
        public id?: string
    ) {

    }
}