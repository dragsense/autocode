import slug from 'slug';

export const slugUsername = (username) => slug(username, '_');

export function isEmpty(value) {

    if(!value)
    return true;

    return Object.keys(value).length === 0
        && value.constructor === Object;
}
