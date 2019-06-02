export class User{
    constructor(
        public username:string, 
        public password:string, 
        public createdAt:string,
        public updatedAt:string,
        public state: boolean, 
        public email: string,
        public image?:string,
        public role?: string,
        public roleId?:string,
        public id?: string
        ){

    }
}