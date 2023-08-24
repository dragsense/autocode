

import { useDrag } from 'react-dnd';

function Template({ template, children }) {


    const [, drag] = useDrag({
        item: () => { return { template } },
        type: 'template',
        end: (item, monitor) => {

        }
    });



    return (
        <div ref={drag}>
            {children}
        </div>
    );

}

export default Template;