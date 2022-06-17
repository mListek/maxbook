public with sharing class OrderController {

    @AuraEnabled
    public static String createOrder(String bookString){
        
        List<BookData> bookList = (List<BookData>)JSON.deserialize(bookString, List<BookData>.class);
        List<BookOrderAssociation__c> bookOrderAssociations = new List<BookOrderAssociation__c>();

        Order__c o = new Order__c();

        o.Status__c = 'New';
        o.User__c = UserInfo.getUserId();

        insert o;

        for (BookData book : bookList) {

            Book__c b = [SELECT Id, Name, Quantity__c, Sales_Record__c FROM Book__c WHERE Id = :book.id];

            if (b.Quantity__c < book.quantity) {
                String errorMessage = 'We don\'t have enough books in stock: "' + b.Name + '"';
                throw new AuraHandledException(errorMessage);
            }

            b.Quantity__c -= book.quantity;
            b.Sales_Record__c += book.quantity;

            update b;
            
            BookOrderAssociation__c bookOrder = new BookOrderAssociation__c();
    
            bookOrder.Book__c = book.id;
            bookOrder.Order__c = o.Id;
            bookOrder.Quantity__c = book.quantity;
    
            insert bookOrder;

            bookOrderAssociations.add(bookOrder);
        }


        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] {UserInfo.getUserEmail()};
        Order__c orderNumber = [SELECT Name FROM Order__c WHERE Id = :o.Id WITH SECURITY_ENFORCED];
        message.setSubject('Order number ' + orderNumber.Name);
        String emailBody =
            'Hello ' + UserInfo.getName() + '!<br>'
            + 'Your order has been created. Thank you for shopping in our bookstore.<br>'
            + 'These are the books you ordered:<br><br>';

        for (BookOrderAssociation__c book : [SELECT Book__r.Name, Book__r.Price__c, Quantity__c FROM BookOrderAssociation__c WHERE Id in :bookOrderAssociations WITH SECURITY_ENFORCED]) {
            emailBody += (' - <b>Title:</b> ' + book.Book__r.Name + ',  <b>Quantity:</b> ' + book.Quantity__c + ',  <b>Price</b>: ' + book.Book__r.Price__c + ' zł<br>');
        }

        emailBody += '<br>Have a nice day<br> MAXBOOK';

        message.setHtmlBody(emailBody);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {message});

        return o.Id;
    }

    private class BookData{
        Id id {get; set;}
        String title {get; set;}
        Double quantity {get; set;}
        Double price {get; set;}
        Double sumPrice {get; set;}
        String coverImage {get; set;}
        String detailsLink {get; set;}
    }
}
