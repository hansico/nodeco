class SelectionManager{
    #items
    constructor(){
        this.#items = new Set();
    }

    add(object){
        if(object instanceof Dnode){
            this.#items.add(object);
            object.view.indicateSelection();
        }
    }
    get(){
        return Array.from(this.#items);
    }
    isEmpty(){
        return this.#items.size === 0;
    }
    has(object){
        return this.#items.has(object)
    }
    remove(object){
        if(this.#items.delete(object)){
            object.view.retractSelection();
            return true;
        }
        return false;
    }
    clear(){
        this.#items.forEach(item=>{item.view.retractSelection()});
        this.#items.clear();
    }
}