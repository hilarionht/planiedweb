    

export class Person {
    constructor(
        public lasname: string,
        public firstname: string,
        public identityDocument: string,
        public email: string,
        public address: string,
        public postalCode: string,
        public birthday: Date,
        public localityId?: string,
        public departmentId?: string,
        public provinceId?: string,
        public state?: boolean,
        public id?: string
    ) {

    }
}