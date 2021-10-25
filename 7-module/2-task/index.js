import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  
  constructor() {
    this.modal = this._layout();
    this._keydownEvent();
    this._buttonEvent();
  }
  
  _layout() {
    let scheme = `
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `;
    return createElement(scheme);
  }
  
  open() {
    document.body.classList.add('is-modal-open');
    document.body.appendChild(this.modal);
  }
  
  close() {
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', this._keydownEvent);
    this.modal.remove();
  }
  
  setTitle(text) {
    const modalTitle = this.modal.querySelector('.modal__title');
    if (modalTitle) modalTitle.textContent = text;
  }
  
  setBody(node) {
    const modalBody = this.modal.querySelector('.modal__body');
    if (modalBody) modalBody.appendChild(node);
  }
  
  _keydownEvent() {
    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') { 
        e.preventDefault(); 
        this.close();
      }
    });
  }
  
  _buttonEvent() {
    const crossButton = this.modal.querySelector('.modal__close');
    crossButton.addEventListener('click', () => this.close());
  }
}