export class Marca{

    constructor(
      public nombre: string,
      public descripcion: string,
      public deleted: boolean,
      public fechaAlta: Date,
      public usuario:string,
      public userMod:string,
      public _id?: string
    )
    {
    
    }
    }