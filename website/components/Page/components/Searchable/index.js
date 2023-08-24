import React, { useState, useEffect, useRef, useMemo } from 'react';
import SearchServices from '@/lib/services/search';

const Searchable =
    (props) => {
        const {
            children,
            states,
            element,
            node,
            updateStates
        } = props;

        const ref = useRef();
 
    
        const limit = states['limit'] ? states['limit'].defaultValue : 10;
        const search = states['search'] ? states['search'].defaultValue : '';

        const total = states['total'] ? states['total'].defaultValue : 0;
        const activeIndex = states['currentIndex'] ? states['currentIndex'].defaultValue : 1;

        useEffect(() => {

            const loadResults = async () => {

                try {
                    const res = await SearchServices.search(search, activeIndex, limit);
                    const results = Array.isArray(res.results) ? res.results : [];
                    const maxPage = res.total;

                    console.log(res)
                    updateStates('pages', results, 'states');
                    updateStates('items', maxPage, 'states');


                } catch (e) {
                    console.log(e?.message || "Something went wrong.")
                }
            }

            loadResults();

        }, [activeIndex]);


        const searchableItem = useMemo(
            () => element(
                node,
                children
            ),
            [children]
        );

        return searchableItem;

    };

export default Searchable;