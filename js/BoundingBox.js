class BoundingBox{
    constructor(sCoords){
        this.sCoords = sCoords;
        this.elem = this.createElement()
    }
    
    createElement(){
        var toolLayer = document.getElementById("tool_layer");
        var bbox = document.createElementNS("http://www.w3.org/2000/svg",'rect');
        bbox.classList.add('bbox');
        bbox.setAttributeNS(null, 'x', this.sCoords.x);
        bbox.setAttributeNS(null, 'y', this.sCoords.y);
        toolLayer.appendChild(bbox);
        return bbox;
    }
    updateSize(coords){
        let x = coords.x - this.sCoords.x;
        let y = coords.y - this.sCoords.y;
        let xs = [];
        let ys = [];
        if(x<0){
            this.elem.setAttributeNS(null,'x',coords.x);
            this.elem.setAttributeNS(null,'width',Math.abs(x));
            xs[0] = coords.x;
            xs[1] = this.sCoords.x;
        }else{
            this.elem.setAttributeNS(null, 'x', this.sCoords.x);
            this.elem.setAttributeNS(null,'width',x);
            xs[0] = this.sCoords.x;
            xs[1] = coords.x;
        }
        if(y<0){
            this.elem.setAttributeNS(null,'y',coords.y);
            this.elem.setAttributeNS(null,'height',Math.abs(y));
            ys[0] = coords.y;
            ys[1] = this.sCoords.y;
        }else{
            this.elem.setAttributeNS(null, 'y', this.sCoords.y);
            this.elem.setAttributeNS(null,'height',y);
            ys[0] = this.sCoords.y;
            ys[1] = coords.y;
        }
        return this._selectNodes(xs,ys);
    }
    _selectNodes(xs,ys){
        Object.values(allnodes).forEach(item =>{
            if(item.view.position.x>=xs[0] && item.view.position.x+item.view.wid <= xs[1]){
                if(item.view.position.y>=ys[0] && item.view.position.y+item.view.hei <= ys[1]){
                    selector.add(item);
                }else{
                    selector.remove(item);
                }
            }else{
                selector.remove(item);
            }
        })
    }
    destroy(){
        this.elem.remove();
        delete this;
    }
}