export default class StepSlider {
  
  constructor({ steps, value }) {
    this.steps = steps;
    this.value = (!value) ? 0 : value ; 
    
    this.elem = document.createElement('div');
    this.elem.classList.add('slider');
    this.elem.innerHTML = this.layout();
    
    this.magnetToSocket();
    this.eventChainInit();
  }
  
  layout() {
    return `
      <div class="slider__thumb">
        <span class="slider__value">${ this.value }</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps">
        <span class="slider__step-active"></span>
        ${ '<span class></span>'.repeat( this.steps - 1 ) }
      </div>
    `;
  }
  
  slider = suffix => this.elem.querySelector(`.slider__${suffix}`);
  
  eventChainInit() {
    this.slider('thumb').ondragstart = () => false;
    this.slider('thumb').style.position = 'absolute';
    this.slider('thumb').addEventListener('pointerdown', this.onPointerDown);
    
    this.elem.addEventListener('click', this.onClick);
  }
  
  onPointerDown = eventDown => {
    eventDown.preventDefault();
    
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  onPointerMove = eventMove => {
    eventMove.preventDefault();
    
    this.elem.classList.add('slider_dragging');
    
    const sliderRect = this.elem.getBoundingClientRect();
    const sliderSegments = this.steps - 1;
    
    const shiftByWidth = (eventMove.clientX - sliderRect.left) / this.elem.offsetWidth;
    const rawValue = Math.round( shiftByWidth * sliderSegments );
    
    this.value = numLimiter(rawValue, sliderSegments);
    this.slider('progress').style.width = numLimiter(shiftByWidth, 1) * 100 + '%';
    this.slider('thumb').style.left = numLimiter(shiftByWidth, 1) * 100 + '%';
    this.slider('value').textContent = this.value;
    
    this.stepActiveSwitch();
    
    function numLimiter(shift, x) {
      if (shift < 0) shift = 0;
      if (shift > x) shift = x;
      return shift;
    }
  }
  
  onPointerUp = eventUp => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    
    this.elem.classList.remove('slider_dragging');
    
    this.customEvent();
  }
  
  onClick = eventClick => {
    const sliderRect = this.elem.getBoundingClientRect();
    const sliderSegments = this.steps - 1;
    
    this.value = Math.round( (eventClick.clientX - sliderRect.left) / this.elem.offsetWidth * sliderSegments );
    this.slider('value').textContent = this.value;
    
    this.magnetToSocket();
    this.customEvent();
  }
  
  magnetToSocket = () => {
    this.stepActiveSwitch();
    
    const percentsByValue = 100 * this.value / ( this.steps - 1 );
    
    this.slider('thumb').style.left = Math.round( percentsByValue ) + '%';
    this.slider('progress').style.width = Math.round( percentsByValue ) + '%';
  }
  
  stepActiveSwitch = () => {
    const sliderSegmentOld = this.slider('step-active');
    const sliderSegmentNew = this.slider('steps').children.item( this.value );
    
    if (sliderSegmentNew === sliderSegmentOld) {
      this.sameValue = true;
      
    } else {
      sliderSegmentOld.classList.remove('slider__step-active');
      sliderSegmentNew.classList.add('slider__step-active');
      this.sameValue = false;
    }
  }
  
  customEvent = () => {
    if (!this.sameValue) {
      this.elem.dispatchEvent( new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true
      }));
    }
  }
}