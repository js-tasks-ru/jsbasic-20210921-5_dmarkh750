import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  
  constructor(slides) {
    this.slides = slides;
    
    this.elem = document.createElement('div');
    this.elem.classList.add('carousel');
    this.elem.innerHTML = 
      this.layoutArrows('right') +
      this.layoutArrows('left') +
      this.layoutSlides();
    
    this.initCarousel();
  }
  
  layoutArrows(way) {
    return `
      <div class="carousel__arrow carousel__arrow_${ way }">
        <img src="/assets/images/icons/angle${ way === 'left' ? '-left' : '' }-icon.svg" alt="icon">
      </div>
    `;
  }
  
  layoutSlides() {
    let slidesStack = this.slides
      .map(item => `
        <div class="carousel__slide" data-id="${ item.id }">
          <img src="/assets/images/carousel/${ item.image }" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${ item.price.toFixed(2) }</span>
            <div class="carousel__title">${ item.name }</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>`)
      .join('');
      
    return '<div class="carousel__inner">' + slidesStack + '</div>';
  }
  
  carouselSub = suffix => this.elem.querySelector(`.carousel__${suffix}`);
  
  initCarousel() {
    let currentSlide = 0;
    
    this.slidesCount = this.carouselSub('inner').querySelectorAll('.carousel__slide').length;
    this.carouselSub('arrow_left').style.display = 'none';
    
    this.elem.addEventListener('click', ({target}) => {
      const slidesWidth = this.carouselSub('slide').offsetWidth;
      
      if ( target.closest('.carousel__button') ) 
          this.itemFromCarouselToCart( currentSlide );
      
      if ( target.closest('.carousel__arrow_left') ) 
          this.arrowStyleSwitcher( --currentSlide );
      
      if ( target.closest('.carousel__arrow_right') ) 
          this.arrowStyleSwitcher( ++currentSlide );
      
      this.carouselSub('inner').style.transform = 'translateX(-' + currentSlide * slidesWidth + 'px)';
    });
  }
  
  arrowStyleSwitcher = num => {
    this.carouselSub('arrow_left').style.display = num == 0 ? 'none' : '' ;
    this.carouselSub('arrow_right').style.display = num == this.slidesCount - 1 ? 'none' : '' ;
  }
  
  itemFromCarouselToCart = i => {
    this.elem.dispatchEvent( new CustomEvent('product-add', {
      detail: this.slides[i].id,
      bubbles: true
    }));
  }
}