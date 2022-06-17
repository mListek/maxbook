public with sharing class CustomAuthController {

    private static boolean isValidPassword(String password, String confirmPassword) {
        return password == confirmPassword;
    }
    
    private static void validatePassword(User u, String password, String confirmPassword) {
        Site.validatePassword(u, password, confirmPassword);
        return;
    }

    @AuraEnabled
    public static boolean userAlreadyExists(String email){
        try {
            List<User> userList = new List<User>();
            userList = [Select Id, Name, Email From User Where Email = :email];

            return !userList.isEmpty();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String registerUser(String firstName, String lastName, String email, String password, String confirmPassword, String startUrl){
        try {
            User u = new User();
            u.FirstName = firstName;
            u.LastName = lastName;
            u.Email = email;
            
            String nickname = firstName.substring(0,1) + lastName.substring(0,1);
            nickname += String.valueOf(Crypto.getRandomInteger()).substring(1,7);
            u.put('CommunityNickname', nickname);
            u.Username = email;

            if (!isValidPassword(password, confirmPassword)) {
                return Label.site.passwords_dont_match;
            }
            validatePassword(u, password, confirmPassword);

            String userId = Site.createExternalUser(u, null, password);

            if (userId != null) {

                try {
                    return Site.login(email, password, startUrl).getUrl();
                } catch (AuraHandledException e) {
                    throw e;
                }
            }
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());   
        }
    }

    @AuraEnabled
    public static String doLogin(String username, String password, String startUrl){

        try {
            return Site.login(username, password, startUrl).getUrl();
        } catch (AuraHandledException error) {
            throw error;
        }   
    }
}
