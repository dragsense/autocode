import { fetcher } from '../fetch';


const SearchServices = {

    search: async function (search, page, limit) {

        return await fetcher(`/api/search?limit=${limit}&page=${page}`, {
            method: 'POST',
            headers: {},
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ search }),
        });

    },
}

export default SearchServices;