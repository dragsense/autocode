import { fetcher } from '../fetch';

const API_KEY = '$2a$10$2/Mhv8cWWpnLFffXWQOPUutKot7zSU8OH2I5djuoVlvXyPmZt45eq'

const PageServices = {

    get: function (id) {
        return fetcher(`/api/pages/${id}`, {
            method: 'Get',
            headers: {'x-api-key': API_KEY },
        });
    }
}

export default PageServices;