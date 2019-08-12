export class ChecklistModel {

    constructor(public title: string, public items: any[]){

    }

    addItem(item){
        this.items.push({
            title: item,
            checked: false
        });
    }

    removeItem(item){

        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items.splice(i, 1);
            }
        }

    }

    renameItem(item, title){
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items[i].title = title;
            }
        }
    }

    setTitle(title){
        this.title = title;
    }
}