
import { useState } from 'react';
import { Image } from 'antd';
import { MdEdit } from "react-icons/md";

const SingleImage = ({ image, setImage, selectedImage, showModal }) => {

    const isSelected =  selectedImage?._id === image._id
 
    const onMouseEnter = (e) => {
        e.preventDefault();
    
        e.currentTarget.style.outline = "thin solid #f88a24";
     
      };

      const onMouseExit = (e) => {
        e.preventDefault();
    
        if(!isSelected)
        e.currentTarget.style.outline = "thin dotted #2fc1ff";

      };

    return <div onClick={() => !isSelected && setImage(image)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseExit} 
    style={{position: 'relative', outline: !isSelected ? "thin dotted #2fc1ff " : "thin solid #f88a24", cursor: 'grabbing'}}>
        
        <div style={{position: 'absolute', cursor: 'pointer', zIndex: 1, top: 5, right: 5, display: isSelected ? 'block' : 'none'}} onClick={showModal}>
          <MdEdit size="1rem" style={{verticalAlign: 'middle'}}/>
        </div>
        
        <Image 
    width={100}
    height={100}
    preview={false}
        src={ image.path || "/images/default/default-img.png"}
        fallback="/images/default/default-img.png" />
        </div>


};

export default SingleImage;
