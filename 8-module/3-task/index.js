export default class Cart {
  cartItems = []; 

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {

    if (!product) {
      return;
    }

    let newCart = {
      product: product, 
      count: 1
    };
    let indexCart =  this.cartItems.findIndex(cart => cart.product.name === product.name);

    if (indexCart === -1) {
      this.cartItems.push(newCart);

    } else {
      this.cartItems[indexCart].count++;
    }

    this.onProductUpdate(newCart);
  }

  updateProductCount(productId, amount) {
    this.cartItems.forEach((cart, index) => {
      if(cart.product.id == productId) {
        if (amount == 1) {
          cart.count++;
        } else if (amount == -1) {
          cart.count--;
        } 
        if (cart.count == 0) {
          this.cartItems.splice(index, 1);
        }
      }  
      this.onProductUpdate(cart);
    });
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;
    this.cartItems.forEach(cart => {
      totalCount += cart.count;
    });
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.cartItems.forEach(cart => {
      totalPrice += cart.product.price * cart.count;
    });
    return totalPrice;
  }

  onProductUpdate(cartItem) {
    

    this.cartIcon.update(this);
  }
}