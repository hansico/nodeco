class Dnode_vis{
    /*
    Visual representation of Dnode.
    Acts as an user interface.
    */
   #minHei;
   #maxWid;
    constructor(dnode,position){
        this.dnode = dnode;
        this.contelem = null;
        this.position = position;
        this.wid = 150;
        this.hei = 25;
        this.#minHei = 25;
        this.#maxWid = 225;
        this.inputelem = null;
        this.outputelem = null;
        this.createDnode();
    }

    createDnode(){
        var appbox = document.getElementById("appbox");
        var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttributeNS(null,'id',this.dnode.id);
        
        var rec = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rec.setAttribute('x',this.position.x);
        rec.setAttribute('y',this.position.y);
        rec.setAttribute('width', this.wid);
        rec.setAttribute('height', this.hei);
        rec.classList.add('dnode','draggable');
    
        // Drawing input/output circles
        var inputCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        this.inputelem = inputCircle;
        inputCircle.classList.add('input','circle','nodeput')
        inputCircle.setAttribute('r', 4);
        inputCircle.setAttribute('cx', this.position.x);
        inputCircle.setAttribute('cy', this.position.y+this.hei/2);
    
        var outputCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");    
        this.outputelem = outputCircle;
        outputCircle.classList.add('output','circle','nodeput')
        outputCircle.setAttribute('r', 4);
        outputCircle.setAttribute('cx', this.position.x+this.wid);
        outputCircle.setAttribute('cy', this.position.y+this.hei/2);
    
        // foreignObject allows "easy" edit of the text
        var titleCont = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
        var title = document.createElement('div');
        title.classList.add('title');
        titleCont.style.pointerEvents = 'none';
        title.style.pointerEvents = 'none';
        title.style.width = this.wid.toString() + 'px';
    
        titleCont.setAttribute('x', this.position.x);
        titleCont.setAttribute('y', this.position.y);
        titleCont.setAttribute('width', this.wid);
        titleCont.setAttribute('height', this.hei);
        // selection nulling
        const selection = window.getSelection();
        selection.removeAllRanges();
        rec.addEventListener('dblclick',toggleEdit);
        function toggleEdit(evt){
            evt.stopPropagation();
            titleCont.style.pointerEvents = 'auto';
            title.setAttribute('contentEditable','true');
            
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(title);
            selection.removeAllRanges();
            selection.addRange(range);

            selector.clear()
            
            appbox.addEventListener('click',makeUneditable,{once:true});
        }
        function donothing(e){
            e.stopPropagation();
        }
        function makeUneditable(evt){
            evt.stopPropagation();
            titleCont.style.pointerEvents = 'none';
            title.setAttribute('contentEditable','false');
        }
        if(this.dnode!=null){
            title.innerHTML = this.dnode.getTitle();            
        }else{
            title.innerHTML = "My title";
        }
        titleCont.appendChild(title);
        g.appendChild(rec);
        g.appendChild(titleCont);
        g.appendChild(inputCircle);
        g.appendChild(outputCircle);
        appbox.appendChild(g);
        this.contelem = g;
        
        this.resize(title,this);

        title.addEventListener('keydown',this.resizehandler(title,this));
        title.addEventListener('keyup',this.resizehandler(title,this));
    }
    resize(elem,obj){
        // Quick and dirty solution for now
        if(elem.clientHeight!=obj.hei){
            let puts = Array.from(obj.contelem.getElementsByClassName('nodeput'));
            if(elem.clientHeight>obj.hei){
                if(elem.clientWidth < obj.#maxWid){
                    elem.style.width = obj.#maxWid.toString() + 'px';
                    obj.wid = obj.#maxWid;
                    obj.contelem.childNodes[0].setAttribute('width',obj.#maxWid);
                    obj.contelem.childNodes[1].setAttribute('width',obj.#maxWid);
                    puts[1].setAttributeNS(null,'cx',obj.position.x+obj.wid);
                }
                if(elem.clientWidth > obj.#maxWid){
                    obj.#maxWid = elem.clientWidth;
                    obj.wid = obj.#maxWid;
                    elem.style.width = obj.#maxWid.toString() + 'px';                
                    obj.contelem.childNodes[0].setAttribute('width',obj.#maxWid);
                    obj.contelem.childNodes[1].setAttribute('width',obj.#maxWid);
                    puts[1].setAttributeNS(null,'cx',obj.position.x+obj.wid);
                }
            }      
            obj.hei = elem.clientHeight;
            obj.contelem.childNodes[0].setAttribute('height',elem.clientHeight);
            obj.contelem.childNodes[1].setAttribute('height',elem.clientHeight);
            puts.forEach(nodeput=>{
                nodeput.setAttributeNS(null,'cy',obj.position.y+obj.hei/2);
            })
            Object.values(obj.dnode.incomingConnections()).forEach(noodle => noodle.updateNoodlePath());
            Object.values(obj.dnode.outgoingConnections()).forEach(noodle => noodle.updateNoodlePath());
        }else if(elem.clientWidth > obj.wid){
            let puts = Array.from(obj.contelem.getElementsByClassName('nodeput'));
            obj.#maxWid = elem.clientWidth;
            obj.wid = obj.#maxWid;
            elem.style.width = obj.#maxWid.toString() + 'px';                
            obj.contelem.childNodes[0].setAttribute('width',obj.#maxWid);
            obj.contelem.childNodes[1].setAttribute('width',obj.#maxWid);
            puts[1].setAttributeNS(null,'cx',obj.position.x+obj.wid);
            Object.values(obj.dnode.incomingConnections()).forEach(noodle => noodle.updateNoodlePath());
            Object.values(obj.dnode.outgoingConnections()).forEach(noodle => noodle.updateNoodlePath());
        }
    }
    
    resizehandler(elem,obj){
        return function() {
            obj.resize(elem, obj); 
        };
    }
    moveDnode(coords,initOffset={x:0,y:0}){

        var children = this.contelem.childNodes;
        this.position = {x:coords.x-initOffset.x,y:coords.y-initOffset.y};
        
        children.forEach(child =>{
            if(child.classList.contains('circle')){
                if(child.classList.contains('input')){
                    child.setAttribute("cx",this.position.x)
                    child.setAttribute("cy",this.position.y + this.hei/2)
                }
                if(child.classList.contains('output')){
                    child.setAttribute("cx",this.position.x + this.wid)
                    child.setAttribute("cy",this.position.y + this.hei/2)
                }
            }else{
                child.setAttributeNS(null, "x", this.position.x);
                child.setAttributeNS(null, "y", this.position.y);
            }
        })
        // Invoke noodle updates
        Object.values(this.dnode.incomingConnections()).forEach(noodle => noodle.updateNoodlePath());
        Object.values(this.dnode.outgoingConnections()).forEach(noodle => noodle.updateNoodlePath());
    }
    getInputCoords(){
        return {x: parseFloat(this.inputelem.getAttributeNS(null,'cx')), y: parseFloat(this.inputelem.getAttributeNS(null,'cy'))};
    }
    getOutputCoords(){
        return {x: parseFloat(this.outputelem.getAttributeNS(null,'cx')), y: parseFloat(this.outputelem.getAttributeNS(null,'cy'))};
    }
    disconnectAllNoodles(){
        Object.values(this.dnode.incomingConnections()).forEach(noodle => noodle.destroy());
        Object.values(this.dnode.outgoingConnections()).forEach(noodle => noodle.destroy());
    }
    indicateSelection(){
        this.contelem.childNodes[0].classList.add('selected');
    }
    retractSelection(){
        this.contelem.childNodes[0].classList.remove('selected');
    }
    destroy(){
        this.disconnectAllNoodles();
        delete allnodes[this.dnode.id];
        this.dnode.destroy();
        this.dnode = null;
        this.contelem.remove();
        delete this;
    }
}