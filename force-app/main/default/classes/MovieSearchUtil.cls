public with sharing class MovieSearchUtil {
    
    @AuraEnabled(cacheable=true)
    public static string getEndPoint(){
        try {
           return [SELECT Id, EndPoint from NamedCredential WHERE DeveloperName =: Label.NamedCred_OMDBAPI_DevName LIMIT 1].EndPoint;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}