import { fetcher } from '../fetch';

const API_KEY = '$2a$10$2/Mhv8cWWpnLFffXWQOPUutKot7zSU8OH2I5djuoVlvXyPmZt45eq';

const DocumentServices = {

    get: function (id,name) {
        return fetcher(`/api/documents/${name}/${id}`, {
            method: 'Get',
            headers: {'x-api-key': API_KEY },
        });
    },
    getAll: function (name, limit = 10, page=1) {
        return fetcher(`/api/documents/${name}?limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: {'x-api-key': API_KEY },
        });
    }
}

export default DocumentServices;