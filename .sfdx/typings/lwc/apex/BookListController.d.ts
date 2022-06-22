declare module "@salesforce/apex/BookListController.getAllBooks" {
  export default function getAllBooks(param: {orderBy: any}): Promise<any>;
}
declare module "@salesforce/apex/BookListController.getTopBooks" {
  export default function getTopBooks(): Promise<any>;
}
declare module "@salesforce/apex/BookListController.getCategoryBooks" {
  export default function getCategoryBooks(param: {category: any, orderBy: any}): Promise<any>;
}
declare module "@salesforce/apex/BookListController.searchBooks" {
  export default function searchBooks(param: {searchTerm: any, category: any, orderBy: any}): Promise<any>;
}
