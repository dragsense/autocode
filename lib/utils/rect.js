


import Point from './point';

function Rect() {
    this.x = 0;
    this.y = 0;
    this.right = 0;
    this.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.type = "default";
    this.boundingBoxes = [];



    for (let i = 0; i < 4; i++) {
        this.boundingBoxes[i] = new Point();
    }
   

    this.update = function (isContent = false) {

      
        this.boundingBoxes[0].x = 'calc(0% - 1px)';
        this.boundingBoxes[0].y = `calc(50% - 10px)`;

        this.boundingBoxes[1].x = `calc(50% - 10px)`;
        this.boundingBoxes[1].y = 'calc(0% - 1px)';

        this.boundingBoxes[2].x = 'calc(100% - 2px)';
        this.boundingBoxes[2].y = `calc(50% - 10px)`;

        this.boundingBoxes[3].x = `calc(50% - 10px)`;
        this.boundingBoxes[3].y = 'calc(100% - 2px)';
        

    }

 


}


export default Rect;