var allnodes = {};
var allnoodles = {};
var selector = new SelectionManager();

function runApp(){
    addEventLogic();
}

function addEventLogic(){
    var appbox = document.getElementById("appbox");
    makeDraggable(appbox);
    appbox.addEventListener("dblclick",dummy);

    // Delete Dnodes
    document.addEventListener("keydown",evt=>{
        if(evt.code==='Delete'){
            selector.get().forEach(node=>{node.view.destroy()})
        }
    });
}

function dummy(evt){
    var defaultnode = {'title':'My title','date_added':'None','completed':false,'completion_date':'None'}
    let id = uniq();
    var dnode = new Dnode(id,defaultnode);
    var dnodevis = new Dnode_vis(dnode,getMousePosition(evt));
    allnodes[id] = dnode;
    dnode.view = dnodevis;
}

function uniq(){
    var id = '_' + Math.random().toString(36).substr(2, 9);
    return id;
}

function makeDraggable(targ){
    // Based on
    // http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    targ.addEventListener("mousedown",startDrag);
    targ.addEventListener("mousemove",drag);
    targ.addEventListener("mouseup",endDrag);
    targ.addEventListener("mouseleave",endDrag);

    var elemSelected = false;
    var nodeobj;
    var initOffsets = []; // offsets to element(s) on click
    
    var nodeput = false;
    var snodepos = {x:null,y:null};
    var noodle;
    // Keypress flags
    var altkeypressed = false;
    var ctrlpressed = false;
    var knife;
    var bbox;

    function startDrag(evt){
        // Draggable elements
        if(evt.target.classList.contains("draggable")){
            
            if(evt.altKey){
                altkeypressed = true;
            }
            
            elemSelected = evt.target;
            nodeobj = allnodes[evt.target.parentNode.getAttributeNS(null,'id')];
            
            // Selection nullifying logic
            if(evt.ctrlKey){
                selector.add(nodeobj);
            }
            if(!selector.has(nodeobj)){
                selector.clear();
            }
            if(selector.isEmpty()){
                selector.add(nodeobj);
            }
            // Fill array with offsets
            initOffsets = [];
            let mousepos = getMousePosition(evt);
            selector.get().forEach(object=>{
                initOffsets.push(mousepos.x - object.view.position.x);
                initOffsets.push(mousepos.y - object.view.position.y);
            })            
        }else{
            selector.clear();
        }
        // Noodles
        if(evt.target.classList.contains("nodeput")){
            nodeput = evt.target;
            noodle = new Noodle();

            snodepos.x = parseFloat(nodeput.getAttributeNS(null, "cx"));
            snodepos.y = parseFloat(nodeput.getAttributeNS(null, "cy"));
        }
        // Tools
        if(evt.target.id=="appbox"){
            // Knife
            if(evt.ctrlKey){
                ctrlpressed = true;
                knife = new Knifetool(getMousePosition(evt));
            }
            if(!evt.ctrlKey){
                bbox = new BoundingBox(getMousePosition(evt));
            }
        }
    }

    function drag(evt){
        evt.preventDefault(); // Prevents text selections, when moving nodes over others
        var mousepos = getMousePosition(evt);
        if(elemSelected){
            selector.get().forEach((nodeobj,index)=>{
                // alt+drag to disconnect ALL noodles from node(s)
                if(altkeypressed){
                    nodeobj.view.disconnectAllNoodles();
                }
                nodeobj.view.moveDnode(mousepos,{x:initOffsets[2*index],y:initOffsets[2*index+1]});
            })
            altkeypressed = false;
        }
        if(nodeput){
            if(nodeput.classList.contains('input')){
                noodle.updateNoodlePath(mousepos,snodepos);
            }else{
                noodle.updateNoodlePath(snodepos,mousepos);
            }            
        }
        if(ctrlpressed){
            knife.updatePath(mousepos);
        }
        if(bbox){
            bbox.updateSize(mousepos);
        }
    }

    function endDrag(evt){
        if(elemSelected){
            selector.get().forEach((nodeobj,index)=>{
                //nodeobj.view.moveDnode(getMousePosition(evt),initOffset);
                nodeobj.view.moveDnode(getMousePosition(evt),{x:initOffsets[2*index],y:initOffsets[2*index+1]});                
            })
            elemSelected = null;
        }
        if(nodeput){
            if(evt.target.classList.contains("nodeput")){
                let io = detectIO(nodeput,evt.target);
                if(io){
                    noodle.setConnection(io[0],io[1]);
                }else{
                    noodle.destroy();
                }
            }else{
                noodle.destroy();
            }
            noodle = null;
            nodeput = null;
        }
        if(knife){
            knife.intersecting(getMousePosition(evt));
            knife.destroy();
            knife = null;
            ctrlpressed = false;
        }
        if(bbox){
            bbox.updateSize(getMousePosition(evt));
            bbox.destroy();
            bbox = null;
        }
    }
}
function detectIO(nodeput1,nodeput2){
    if(nodeput1.classList.contains('input')){
        if(nodeput2.classList.contains('output')){
            let start = allnodes[nodeput2.parentNode.getAttributeNS(null,'id')];
            let end = allnodes[nodeput1.parentNode.getAttributeNS(null,'id')];
            return [start, end];
        }
        return false;
    }
    if(nodeput1.classList.contains('output')){
        if(nodeput2.classList.contains('input')){
            let start = allnodes[nodeput1.parentNode.getAttributeNS(null,'id')];
            let end = allnodes[nodeput2.parentNode.getAttributeNS(null,'id')];            
            return [start, end];
        }
        return false;
    }
    return false;
}
function getMousePosition(evt){
    /*
    Returns x,y coordinates of current mouse position
    */
   var targ = evt.target;
   var CTM = targ.getScreenCTM();
   return {
       x: (evt.clientX - CTM.e) / CTM.a,
       y: (evt.clientY - CTM.f) / CTM.d
   };
}
function getTargetElementPosition(target){
    /*
    Returns x,y "origin" coordinates of target element
    */
   return {
       x: parseFloat(target.getAttributeNS(null,"cx")),
       y: parseFloat(target.getAttributeNS(null,"cy"))
   }
}
window.addEventListener('load',runApp);