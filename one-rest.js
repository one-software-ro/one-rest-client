var qs = require('qs');
var FormData = require('form-data');

module.exports = class OneRestClient {
    constructor(client, host, securityToken, getCookie) {
        this.client = client;
        this.host = host;
        this.securityToken = '';
        if (securityToken && securityToken.length) {
            this.securityToken = securityToken;
        }
        if (getCookie !== null && getCookie !== undefined) {
            this.getCookie = getCookie;
        } else {
            this.getCookie = async function (cookieName) {
                return null;
            }
        }
    }
  
    async handleAuth(config) {
        let csrfToken = await this.getCookie('one.erp.rest.csrf.token');
        if (csrfToken) {
          config.postConfig.headers['X-CSRF-TOKEN'] = csrfToken;
        } 
        if (this.securityToken) {
          config.postConfig.headers['X-API-Key'] = this.securityToken;
        }
    }

    async auth(username, password) {
        let form = {
            'user': username,
            'password': password
        }
        let config = {
            path: this.host + '/auth',
            postConfig: {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }
        };
        let response = await this.client.post(config.path, qs.stringify(form), config.postConfig)
        return response.data;
    }
  
    async get(entityName, key) {
        let config = {
            path: this.host + '/rest/entity/' + entityName + '/' + key,
            postConfig: {
                headers: {}
            }
        }
        await this.handleAuth(config);
        let response = await this.client.get(config.path, config.postConfig);
        return response.data;
    }
  
    async put(entityName, entity) {
        let config = {
            path: this.host + '/rest/entity/' + entityName,
            postConfig: {
                headers: {}
            }
        }
        await this.handleAuth(config);
        let response = await this.client.post(config.path, entity, config.postConfig);
        return response.data.key;
    }
  
    async update(entityName, entity) {
        let config = {
            path: this.host + '/rest/entity/' + entityName + '/' + entity.properties.key,
            postConfig: {
                headers: {}
            }
        }
        await this.handleAuth(config);
        let response = await this.client.post(config.path, entity, config.postConfig);
        return response.data.key;
    }
  
    async delete(entityName, entityKey) {
        let config = {
            path: this.host + '/rest/entity/' + entityName + '/' + entityKey,
            postConfig: {
                headers: {}
            }
        }
        await this.handleAuth(config);
        await this.client.delete(config.path, config.postConfig);
        return true;
    }
  
    async fetch(query) {
        let config = {
            path: this.host + '/rest/fetch',
            postConfig: {
                headers: {
                    'Content-Type': 'text/plain; charset=UTF-8'
                }
            }
        }
        await this.handleAuth(config);
        let response = await this.client.post(config.path, query, config.postConfig);
        return response.data;
    }
  
    async workflow(wfName, wfMethod, wfRequest) {
        let config = {
            path: this.host + '/rest/workflow/' + wfName + '/' + wfMethod,
            postConfig: {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            }
        }
        await this.handleAuth(config);
        let response = await this.client.post(config.path, wfRequest || {}, config.postConfig);
        return response;
    }

    async storage(stream, maxContentLengthParam, maxBodyLengthParam) {
        let maxContentLength = 100000000;
        let maxBodyLength = 1000000000;
        if (maxContentLengthParam !== null && maxContentLengthParam !== undefined) {
            maxContentLength = maxContentLengthParam;
        }
        if (maxBodyLengthParam !== null && maxBodyLengthParam !== undefined) {
            maxBodyLength = maxBodyLengthParam;
        }
        let formData = new FormData();
        formData.append('file', stream);
        let config = {
            path: this.host + '/storage',
            postConfig: {
                headers: {
                    ...formData.getHeaders()
                },
                maxContentLength: maxContentLength,
                maxBodyLength: maxBodyLength
            }
        };
        await this.handleAuth(config);
        let response = await this.client.post(config.path, formData, config.postConfig);
        return response.data[0].id;
    }
}