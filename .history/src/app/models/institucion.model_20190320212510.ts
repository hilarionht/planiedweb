       
export class Institution {
    constructor(
        public cue: string,
        public name: string,
        public locality: string,
        public region: string,
        public sector?: string,
        public ambit?: string,
        public registrationNumber?: string,
        public employee?: string,
        public _id?: string
    ) {

    }
}