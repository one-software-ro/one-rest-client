# OneRestClient
OneRestClient allows you to quickly bootstrap a ONE Framework REST client for your JavaScript application using your preffered HTTP Client (we recommend *[Axios](https://axios-http.com/docs/intro)*).

## Constructor
The OneRestClient constructor takes the following arguments:
- client: your preffered HTTP Client (you can even roll your own)
- host: the url of your ONE Framework instance
- securityToken: can either be null or your API key for your ONE Framework instance
- getCookie: can either be null or a function to retrieve the CSRF token from your preffered cookie store (looks for *one.erp.rest.csrf.token* cookie)

## Methods
- auth(username, password)
- get(entityName, key)
- put(entityName, entity)
- update(entityName, entity)
- delete(entityName, entityKey)
- fetch(query)
- workflow(wfName, wfMethod, wfRequest)
- storage(stream)