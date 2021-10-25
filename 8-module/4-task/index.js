import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
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

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');

    let divContainerProduct = createElement('<div></div>');

    this.cartItems.forEach(cart => {
      divContainerProduct.append(this.renderProduct(cart.product, cart.count));
    });
    divContainerProduct.append(this.renderOrderForm());
    this.modal.setBody(divContainerProduct);
    this.modal.open();

    divContainerProduct.addEventListener('click', (event) => {
      let idCartProduct = event.target.closest('.cart-product').dataset.productId;
      
      if (event.target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(idCartProduct, -1);
      } 
      if (event.target.closest('.cart-counter__button_plus')) {
        this.updateProductCount(idCartProduct, 1);
      }
    });

    divContainerProduct.querySelector('.cart-form').addEventListener('submit', (event) => this.onSubmit(event));
  }

  onProductUpdate(cartItem) {
    if (document.body.classList.contains('is-modal-open')) {

      let modal = document.querySelector('.modal__body');
  
      let divProductCount = modal.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-counter__count`);
      let divProductPrice = modal.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-product__price`);
      let divTotalPrice = modal.querySelector(`.cart-buttons__info-price`);
      
      divProductCount.innerHTML = cartItem.count;
      divProductPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      divTotalPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
      
      if (cartItem.count == 0) {
        modal.querySelector(`[data-product-id="${cartItem.product.id}"]`).remove();
      }
      if (this.isEmpty()) {
        this.modal.close();
      }
    }

    this.cartIcon.update(this);
  }

  onSubmit(event) {
    console.log(document.forms.order);
    event.preventDefault();
    event.target.querySelector('button[type = submit]').classList.add('.is-loading');

    let formData = new FormData(document.forms[0]);

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData
    })
    .then(() => {
      this.modal.setTitle('Success!');
      this.cartItems.length = 0;
      this.modal.setBody(createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>`));
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}