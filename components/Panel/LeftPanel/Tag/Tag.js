

// import { useDrag } from 'react-dnd';

// import { Card } from 'antd';

// import { useEffect, useMemo } from 'react';
// import { usePageStates } from "@/components/Editor/PageProvider";

// function Item({ tag, selectedTag, color, onSelect, children, gridStyle }) {

//     const { onDragging } = usePageStates();



//     const [{ isDragging, opacity }, drag, dragPreview] = useDrag({
//         item: () => { return { tag } },
//         type: 'newItem',
//         end: (item, monitor) => {

//         },
//         collect: (monitor) => ({
//             opacity: monitor.isDragging() ? 0.4 : 1,
//             isDragging: monitor.isDragging()
//         }),
//     });

//     useEffect(() => {
//         onDragging(isDragging);
//     }, [isDragging])

//     const onSelectItem = (e) => {
//         e.preventDefault();

//         if (onSelect)
//             onSelect(tag);
//     }

//     const onDragStart = (e) => {
//         e.preventDefault();
//         const data = tag;
//         e.dataTransfer.setData('application/json', JSON.stringify(data));

    

//     };

//     const render = useMemo(() => {

//         return <Card.Grid onClick={onSelectItem} draggable
//             onDragStart={onDragStart}
//             style={{ ...gridStyle, opacity, ...(selectedTag == tag ? { border: `1px solid ${color}` } : {}), cursor: 'dragable' }}>

//             <div style={{ textAlign: 'center' }}
//                 dangerouslySetInnerHTML={{ __html: tag.html ? tag.html : tag.tag }}>

//             </div>
//         </Card.Grid>

//     }, [])



//     return render;



// }

// export default Item;


import { Card } from 'antd';
import { useMemo } from 'react';
import { usePageStates } from "@/components/Editor/PageProvider";

function Item({ tag, selectedTag, color, onSelect, children, gridStyle }) {

  const { onDragging } = usePageStates();

  const onSelectItem = (e) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(tag);
    }
  };

  const onDragStart = (e) => {

    e.dataTransfer.setData('text/plain', JSON.stringify(tag));
  };



  const render = useMemo(() => {
    return (
      <Card.Grid onClick={onSelectItem}
        draggable={true}

        onDragStart={onDragStart}
        style={{ ...gridStyle, ...(selectedTag === tag ? { border: `1px solid ${color}` } : {}), cursor: 'grabbing' }}>
        <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: tag.html ? tag.html : tag.tag }} />
      </Card.Grid>
    );
  }, [selectedTag]);

  return render;
}

export default Item;