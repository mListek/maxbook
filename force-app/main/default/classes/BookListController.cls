public without sharing class BookListController {

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBooks(String searchTerm, String category, String orderBy){
        try {
            List<Book__c> bookList = new List<Book__c>();

            String query = 'SELECT Id, Name, ISBN__c, Price__c, Author__c, Sales_Record__c, ' +
            'Category__c, Cover_Image__c, Description__c, ' +
            'isAvailable__c, Quantity__c, Release_Date__c ' +
            'FROM Book__c';
            String condition = '';
            String choosenOrder = '';

            searchTerm = searchTerm.trim();
            searchTerm = '%' + searchTerm + '%';

            if (searchTerm != '' && category != '') {
                condition = ' WHERE Name LIKE :searchTerm AND Category__c = :category';
            } else if (searchTerm != '') {
                condition = ' WHERE Name LIKE :searchTerm';
            } else if (category != '') {
                condition = ' WHERE Category__c = :category';
            }

            if (orderBy != '') {
                choosenOrder = ' ORDER BY ' + orderBy;
            }

            bookList = Database.query(query + condition + choosenOrder);
            
            return bookList;

        } catch (Exception e) {
            throw new AuraHandledException('error occured while getting books: ' + e.getMessage());
        }
    }
}
