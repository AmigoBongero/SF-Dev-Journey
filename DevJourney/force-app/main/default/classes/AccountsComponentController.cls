public with sharing class AccountsComponentController {    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [
            SELECT Id, Name,
                (SELECT Id, Name
                FROM Contacts)
            FROM Account
            ORDER BY Name
        ];
    }
    
}