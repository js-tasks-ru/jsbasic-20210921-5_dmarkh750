import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  
  constructor(categories) {
    this.categories = categories;
    this.shift = 350;
    
    this.elem = document.createElement('div');
    this.elem.classList.add('ribbon');
    this.elem.innerHTML = 
      this.layoutRibbonArrow('left') + 
      this.layoutCategories() + 
      this.layoutRibbonArrow('right'); 
      
    this.initRibbon();
  }
  
  layoutRibbonArrow(way) {
    return `
      <button class="ribbon__arrow ribbon__arrow_${ way }">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `;
  }
  
  layoutCategories() {
    let aList = this.categories
      .map( item => `<a href="#" class="ribbon__item" data-id="${ item.id }">${ item.name }</a>` )
      .join('');
    return '<nav class="ribbon__inner">' + aList + '</nav>';
  }
  
  ribbonSub = suffix => this.elem.querySelector(`.ribbon__${suffix}`);
  
  initRibbon() {
    this.ribbonSub('arrow_right').classList.add('ribbon__arrow_visible');
    this.elem.addEventListener('click', this.onClickEvent);
  }
  
  onClickEvent = ({target}) => {
    if ( target.closest('.ribbon__item') )
      this.clickOnItem( target );
    
    if ( target.closest('.ribbon__arrow_left') )
      this.clickOnArrow( -1 );
    
    if ( target.closest('.ribbon__arrow_right') )
      this.clickOnArrow( 1 );
  }
  
  clickOnItem = (aimNew) => {
    event.preventDefault();
    
    const aimOld = this.ribbonSub('item_active');
    
    if ( aimOld !== aimNew ) {
      if ( aimOld !== null )
        aimOld.classList.remove('ribbon__item_active');
      aimNew.classList.add('ribbon__item_active');
      
      this.ribbonSelectedEvent(aimNew);
    }
  }
  
  clickOnArrow = multiplier => {
    const shift = this.shift;
    const arrowStyleSwitch = (scroll, mul, way) => {
      if ( scroll + ( mul * shift ) <= 1 ) {
        this.ribbonSub(`arrow_${way}`).classList.remove('ribbon__arrow_visible');
      } else {
        this.ribbonSub(`arrow_${way}`).classList.add('ribbon__arrow_visible');
      }
    }
    let menuWidth = 
      this.ribbonSub('inner').scrollWidth -
      this.ribbonSub('inner').clientWidth;
    
    let scrollLeft = this.ribbonSub('inner').scrollLeft;
    let scrollRight = menuWidth - scrollLeft;
    
    arrowStyleSwitch( scrollLeft, multiplier, 'left' );
    arrowStyleSwitch( scrollRight, -multiplier, 'right' );
    
    this.ribbonSub('inner').scrollBy( shift * multiplier, 0 );
  }
  
  ribbonSelectedEvent = aim => {
    this.elem.dispatchEvent( new CustomEvent('ribbon-select', {
      detail: aim.dataset.id,
      bubbles: true
    }));
  }
}