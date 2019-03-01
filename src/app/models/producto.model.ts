export class Producto{
    constructor(
        public nombre: string,
        public tipoProducto: string,
        public precioCompra: string,
        public precioVenta: string,
        public cantidad:number,
        public fechaUltimoCambio: number,
        public cantidadAdvertencia:number,
        public descripcion?: string,
        public marca?: string,
        public modelo?: string,
        public _id?: string
    ) {

    }
}