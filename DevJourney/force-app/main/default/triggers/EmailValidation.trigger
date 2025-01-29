trigger EmailValidation on Case_Party__c (before insert, before update) {
 for (Case_Party__c obj : Trigger.new) {
        if (obj.Email__c != null && !Pattern.matches(
            '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', obj.Email__c)) {
            obj.addError('Please enter a valid email address.');
        }
    }
}