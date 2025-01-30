public with sharing class myAccountsController {
    @AuraEnabled(Cacheable=true)
    public static List<Account> getMyAccounts(){
        return [
                SELECT Id,Name, Industry, Phone
                FROM Account
                WHERE OwnerId = :UserInfo.getUserId()
                WITH SECURITY_ENFORCED
                ORDER BY Name];
    }
}