

import { useDrag } from 'react-dnd';

function Form({ form, children }) {


    const [, drag] = useDrag({
        item: () => { return { component: form } },
        type: 'component',
        end: (item, monitor) => {

        }
    });



    return (
        <div ref={drag}>
            {children}
        </div>
    );

}

export default Form;