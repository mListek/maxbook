public without sharing class BookListController {
    
    @AuraEnabled(cacheable=true)
    public static List<Book__c> getAllBooks(String orderBy){
        
        List<Book__c> bookList = new List<Book__c>();

        String query = 
            'SELECT Id, Name, ISBN__c, Price__c, Author__c, Sales_Record__c, ' +
            'Category__c, Cover_Image__c, Description__c, ' +
            'isAvailable__c, Quantity__c, Release_Date__c ' +
            'FROM Book__c ' +
            'WITH SECURITY_ENFORCED ' +
            'ORDER BY ' + orderBy;
        
        bookList = Database.query(query);
        
        return bookList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getTopBooks(){
        
        List<Book__c> bookList = new List<Book__c>();
        List<Book__c> topBookList = new List<Book__c>();

        bookList = getAllBooks('Name DESC');

        Integer count = 0;

        while (topBookList.size() < 6) {
            count = Math.floor(Math.random() * bookList.size()).intValue();
            topBookList.add(bookList.remove(count));
        }
        
        return topBookList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getCategoryBooks(String category, String orderBy){
        
        List<Book__c> bookList = new List<Book__c>();

        String query = 
            'SELECT Id, Name, ISBN__c, Price__c, Author__c, Sales_Record__c, ' +
            'Category__c, Cover_Image__c, Description__c, ' +
            'isAvailable__c, Quantity__c, Release_Date__c ' +
            'FROM Book__c ' +
            'WHERE Category__c = :category ' +
            'WITH SECURITY_ENFORCED ' +
            'ORDER BY ' + orderBy;
        
        bookList = Database.query(query);

        return bookList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Book__c> searchBooks(String searchTerm, String category, String orderBy){
        
        List<Book__c> bookList = new List<Book__c>();

        searchTerm = searchTerm.trim();

        if (category != '') {
            return getCategoryBooks(category, orderBy);
        }
        
        if (searchTerm == '') {
            return getAllBooks(orderBy);
        }

        searchTerm = '%' + searchTerm + '%';

        String query = 
            'SELECT Id, Name, ISBN__c, Price__c, Author__c, Sales_Record__c, ' +
            'Category__c, Cover_Image__c, Description__c, ' +
            'isAvailable__c, Quantity__c, Release_Date__c ' +
            'FROM Book__c ' +
            'WHERE Name LIKE :searchTerm ' + 
            'WITH SECURITY_ENFORCED ' +
            'ORDER BY ' + orderBy;

        bookList = Database.query(query);
            
        return bookList;
    }
}
