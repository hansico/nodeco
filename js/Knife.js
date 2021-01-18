class Knifetool{
    constructor(sCoords){
        this.sCoords = sCoords;
        this.str = "M " + sCoords.x + " "+sCoords.y;
        this.elem = this.createElement()
    }
    
    createElement(){
        var toolLayer = document.getElementById("tool_layer");
        var knife = document.createElementNS("http://www.w3.org/2000/svg",'path');
        knife.classList.add('knife');
        knife.setAttributeNS(null, 'd', this.str);
        toolLayer.appendChild(knife);
        return knife;
    }
    updatePath(eCoords){
        let path = this.str + " L " + eCoords.x + " " + eCoords.y;
        this.elem.setAttributeNS(null, 'd', path);
    }
    intersecting(eCoords){

        var selection = [];
        
        for(let n in allnoodles){
            let spl = allnoodles[n].elem.getAttributeNS(null,'d').split(" ");
            let arr = [parseFloat(spl[1]),parseFloat(spl[2]),parseFloat(spl[4]),parseFloat(spl[5])];
            
            // Cramer's rule    
            let eq1 = [eCoords.x-this.sCoords.x, -(arr[2]-arr[0]), arr[0]-this.sCoords.x];
            let eq2 = [eCoords.y-this.sCoords.y, -(arr[3]-arr[1]), arr[1]-this.sCoords.y];
            
            let det = eq1[0]*eq2[1]-eq1[1]*eq2[0];
            if(det==0){
                console.log("Determinant was zero!");
            }else{
                let d1 = eq1[2]*eq2[1]-eq1[1]*eq2[2];
                let d2 = eq1[0]*eq2[2]-eq1[2]*eq2[0];
                
                let s = d1/det;
                let t = d2/det;
                if(0<=s && s<=1 && 0<=t && t<=1){
                    selection.push(allnoodles[n].id);
                    allnoodles[n].destroy();                
                }
            }            
        }
        return selection;
    }
    destroy(){
        this.str = null;
        this.elem.remove();
        delete this;
    }

}