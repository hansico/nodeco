class Noodle{
    /*
    Handles connection between two Dnodes logically and visually
    */
    constructor(){
        this.id;
        this.connecting = null;
        this.elem = this.createElement();
    }

    createElement(){
        var noodlelayer = document.getElementById("noodlelayer");
        var noodle = document.createElementNS("http://www.w3.org/2000/svg",'path');
        noodle.classList.add('noodle');            
        noodlelayer.appendChild(noodle);
        return noodle;
    }
    updateNoodlePath(sCoords=this.connecting[0].view.getOutputCoords(),eCoords=this.connecting[1].view.getInputCoords()){
        var pathstring = "M " + sCoords.x + " " + sCoords.y;
        pathstring += " L " + eCoords.x + " " + eCoords.y;
        /*
        if(eCoords.x<=sCoords.x){
            let halfwayx = (sCoords.x+eCoords.x)/2;
            let halfwayy = (sCoords.y+eCoords.y)/2;
            let qwayy = (3*sCoords.y+eCoords.y)/4;
            let c1x = sCoords.x+100;
            let c2x = eCoords.x-100;
            let qwayy2 = (3*eCoords.y+sCoords.y)/4;
            pathstring += " C "+c1x+" "+qwayy+", "+c1x+" "+qwayy+", "+halfwayx+" "+halfwayy+" C "+c2x+" "+qwayy2+", "+c2x+" "+qwayy2+", "+eCoords.x+" "+eCoords.y;
        }else{
            var halfwayx = (sCoords.x+eCoords.x)/2;
            pathstring += " C " + halfwayx +" "+ sCoords.y + ", " + halfwayx +" "+eCoords.y +", "+eCoords.x+" "+eCoords.y;
        }
        */
        this.elem.setAttributeNS(null,'d',pathstring);
    }
    setId(id){
        this.id = id;
        this.elem.setAttributeNS(null,'id',id);
    }
    setConnection(start,end){
        if(this.validateConnection(start,end)){
            if(this.id==null){
                this.id = uniq();
            }
            start.addOutgoing(end,this);
            end.addIncoming(start,this);
            this.connecting = [start,end];
            allnoodles[this.id] = this;
            this.updateNoodlePath(start.view.getOutputCoords(),end.view.getInputCoords());
        }else{
            this.destroy();
        }        
    }
    validateConnection(sDnode,eDnode){
        if(sDnode==eDnode){
            return false;
        }
        if(!Object.keys(sDnode.outgoingConnections()).includes(eDnode.id)){
            return true;
        }
        return false;
    }
    _disconnect(){
        this.connecting[0].disconnectOut(this.connecting[1].id);
        this.connecting[1].disconnectIn(this.connecting[0].id);
        this.connecting = null;
    }
    destroy(){
        if(this.connecting!=null){
            this._disconnect();
        }        
        this.elem.remove();
        this.elem = null;
        delete allnoodles[this.id];
        delete this;
    }
}