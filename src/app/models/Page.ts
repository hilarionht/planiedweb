export class Page {
    entities: any[] = [];
    //The number of elements in the page
    limit: number = 0;
    //The total number of elements
    totalEntities: number = 0;
    //The total number of pages
    totalPages: number = 0;
    //The current page number
    numberPage: number = 0;
    prop: string = '';
    dir: string = '';
}