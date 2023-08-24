import { fetcher } from '../fetch';

const API_URL = 'http://localhost:3001' 
const API_KEY = '123456789'

const CollectionServices = {

    get: function (id, API_URL, API_KEY) {
      
        return fetcher(`${API_URL}/api/collections/${id}`, {
            method: 'Get',
            headers: {'x-api-key': API_KEY },
        });
    },
    getAll: function (API_URL, API_KEY) {
        return fetcher(`${API_URL}/api/collections`, {
            method: 'Get',
            headers: {'x-api-key': API_KEY },
        });
    },
    save: function (id, obj, API_URL, API_KEY) {
        return fetcher(`${API_URL}/api/collections/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
            body: JSON.stringify(obj),
        });
    }
}

export default CollectionServices;