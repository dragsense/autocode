import Rect from "./rect";

function BoxModel(parentRect) {
    
    this.margin = new Rect();
    this.padding = new Rect();
    this.content = new Rect();
    this.parent = parentRect;


    this.update = function (computedStyle, factor = 1) {

        let marginTop = parseFloat(computedStyle.marginTop);
        let marginLeft = parseFloat(computedStyle.marginLeft);
        let marginRight = parseFloat(computedStyle.marginRight);
        let marginBottom = parseFloat(computedStyle.marginBottom);

        let paddingTop = parseFloat(computedStyle.paddingTop);
        let paddingLeft = parseFloat(computedStyle.paddingLeft);
        let paddingRight = parseFloat(computedStyle.paddingRight);
        let paddingBottom = parseFloat(computedStyle.paddingBottom);

        this.setMargin(marginTop,marginLeft ,marginRight, marginBottom, {t: 10 * factor, l: 0* factor, r: 0* factor, b: 10* factor});
        this.margin.update();

        this.setPadding(paddingTop, paddingLeft, paddingRight, paddingBottom,{t: 0* factor, l: 10* factor, r: 10* factor, b: 0* factor});
        this.padding.update();

        this.setContent(paddingTop, paddingLeft, paddingRight, paddingBottom, {t: 10* factor, l: 10* factor, r: 10* factor, b: 10* factor});
        this.content.update();
    } 

    this.setMargin = function (marginTop,marginLeft ,marginRight, marginBottom, offset={t: 10, l: 0, r: 0, b: 10}) {
   

        marginTop = marginTop <= 5 ? marginTop + offset.t: marginTop;
        marginLeft = marginLeft <= 5 ? marginLeft + offset.l: marginLeft;
        marginRight = marginRight <= 5 ? marginRight + offset.r: marginRight;
        marginBottom = marginBottom <= 5 ? marginBottom + offset.b: marginBottom;


        this.margin.x = this.parent.x - marginLeft;
        this.margin.y = this.parent.y - marginTop;
        this.margin.right = this.parent.right + marginRight;
        this.margin.bottom = this.parent.bottom + marginBottom;
        this.margin.width = this.parent.width + marginRight + marginLeft;
        this.margin.height = this.parent.height + marginBottom + marginTop;
    }

    this.setPadding = function (paddingTop, paddingLeft, paddingRight, paddingBottom, offset={t: 0, l: 10, r: 10, b: 0}) {
  
        
        // paddingTop = paddingTop <= 5 ? paddingTop + offset.t: paddingTop;
        // paddingLeft = paddingLeft <= 5 ? paddingLeft + offset.l: paddingLeft;
        // paddingRight = paddingRight <= 5 ? paddingRight + offset.r: paddingRight;
        // paddingBottom = paddingBottom <= 5 ? paddingBottom + offset.b: paddingBottom;

        this.padding.x = this.parent.x + offset.l; 
        this.padding.y = this.parent.y + offset.t;
        this.padding.right = this.parent.right - offset.r;
        this.padding.bottom = this.parent.bottom - offset.b;
        this.padding.width = this.parent.width;
        this.padding.height = this.parent.height;
    }



    this.setContent = function (paddingTop, paddingLeft, paddingRight, paddingBottom, offset={t: 10, l: 18, r: 18, b: 10}) {
       
  paddingTop = paddingTop <= 5 ? paddingTop + offset.t: paddingTop;
        paddingLeft = paddingLeft <= 5 ? paddingLeft + offset.l: paddingLeft;
        paddingRight = paddingRight <= 5 ? paddingRight + offset.r: paddingRight;
        paddingBottom = paddingBottom <= 5 ? paddingBottom + offset.b: paddingBottom;
    

        this.content.x = this.padding.x + paddingLeft;
        this.content.y = this.padding.y + paddingTop;
        
        this.content.right = this.padding.right - paddingRight;
        this.content.bottom = this.padding.bottom - paddingBottom;

        this.content.width = this.padding.width - paddingRight - paddingLeft;
        this.content.height = this.padding.height - paddingBottom - paddingTop;

    }

}

export default BoxModel;