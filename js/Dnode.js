class Dnode{
    /*
    Contains the data of single node.
    */

    constructor(id,jsonobj){
        try{
            this.id = id;
            this.title = jsonobj.title;
            this.date_added = jsonobj.date_added;
            this.completed = jsonobj.completed;
            this.completion_date = jsonobj.completion_date;
            this.view = null;
            this.connections = {'incoming':{},'outgoing':{}}
        }catch(error){
            // TODO
            console.log(error);
        }
    }

    getTitle(){
        return this.title;
    }
    incomingConnections(){
        return this.connections.incoming;
    }
    outgoingConnections(){
        return this.connections.outgoing;
    }
    addIncoming(dnode, noodle){
        this.connections.incoming[dnode.id] = noodle;
    }
    addOutgoing(dnode,noodle){
        this.connections.outgoing[dnode.id] = noodle;
    }
    disconnectOut(nodeid){
        delete this.connections.outgoing[nodeid];
    }
    disconnectIn(nodeid){
        delete this.connections.incoming[nodeid];
    }
    destroy(){
        delete this;
    }
}