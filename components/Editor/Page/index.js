// import { useEffect, useState } from "react";
// import usePageStates from "../PageProvider";
// import PageServices from "@/lib/services/pages";
// import { message } from "antd";
// import Components from "./Components";
// import List from './Components/List'
// //import AddElement from './Components/Toolbar/gridItems';

// export default function Page({elements}) {

//     const { getBody, toolBar } = usePageStates();

//     return <>{getBody().map((block, index) => block.component ?
//         <Components key={block._uid}
//             block={block}
//             index={index}
//             props={{
//                 title: '[Page Title]',
//                 desc: '[Page Description]',
//                 status: '[Page Status]',
//                 image: '/images/default/default-img.png',
//                 content: '[Page Content]',
//                 logo: '/images/default/default-img.png',
//                 mobileLogo: '/images/default/default-img.png',
//                 placeholder: '/images/default/default-img.png',

//             }}
//             parent={null} />
//         :
//         <List
//             key={block._uid}
//             element={block}
//             index={index}
//             props={block.states}
//             parent={null} />)}


//        {toolBar?.full(toolBar?.is)}
//        {toolBar?.partial}
//     </>

// };

import Selection from '../Element/Selection';
import Elements, { InlineSkeleton } from './Elements';
import { useMemo } from 'react';
import { Alert } from 'antd';


export default function Page({ page, pageUpdated, loading }) {

    const memoizedPage = useMemo(() => {
        return pageUpdated ? <Elements _id={page._id}  pageUpdated={pageUpdated} loading={loading} /> : <InlineSkeleton />
    }, [page, pageUpdated]);



    return <>
        {memoizedPage}

    </>


}