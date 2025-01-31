public with sharing class AccountsComponentController {

    private static final Id USER_ID = UserInfo.getUserId();

    @AuraEnabled
    public static List<Account> getMyAccounts() {
        return [
                SELECT   Id, Name, Industry, Phone
                FROM     Account
                WHERE    OwnerId = :USER_ID
                WITH SECURITY_ENFORCED
                ORDER BY Name
                LIMIT    500
        ];
    }

    @AuraEnabled
    public static List<Account> getRecentlyViewedAccounts() {
        return [
                SELECT   Id, Name, Industry, Phone
                FROM     Account
                WHERE    LastViewedDate != NULL
                WITH SECURITY_ENFORCED
                ORDER BY LastViewedDate DESC
                LIMIT    50
        ];
    }

}