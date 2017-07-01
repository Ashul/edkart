module.exports = function Cart(storedItem){
    this.items = storedItem.items || {};
    this.totalprice = storedItem.totalprice || 0;
    this.totalcount = storedItem.totalcount || 0;

    this.addProducts = function(item, id){
        var storeProduct = this.items[id];
        if(!storeProduct){
            storeProduct = this.items[id] = {item:item, qty:0, price:0}
        }
        storeProduct.qty++;
        storeProduct.price = storeProduct.item.price * storeProduct.qty;
        this.totalcount++;
        this.totalprice += storeProduct.item.price;

    }
    this.removeProducts = function(id){
        var storeProduct = this.items[id];
        storeProduct.qty--;
        storeProduct.price = storeProduct.item.price * storeProduct.qty;
        this.totalcount--;
        this.totalprice -= storeProduct.item.price;
        if(storeProduct.qty <= 0){
            delete this.items[id]
        }

    }

}