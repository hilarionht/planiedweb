    

export class Person{
    constructor(
        public lasname: string,
        public firstname: string,
        public identityDocument: string,
        public email: string,
        public address:string,
        public postalCode: string,
        public birthday: string,
        public position?: string,
        public locality?: string,
        public department?: string,
        public province?: string,   
        public state?: boolean,
        public id?: string
    ) {

    }
}