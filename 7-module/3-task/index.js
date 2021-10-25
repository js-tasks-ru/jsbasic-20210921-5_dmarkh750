export default class StepSlider {
  
  constructor({ steps, value = 0 }) {
    this._steps = steps;
    this._value = value; 
    
    this.elem = document.createElement('div');
    this.elem.classList.add('slider');
    this.elem.innerHTML = this._layout();
    
    this.elem.addEventListener('click', this._clickEvent);
  }
  
  _layout() {
    return `
      <div class="slider__thumb" style="left: 0%;">
        <span class="slider__value">0</span>
      </div>
      <div class="slider__progress" style="width: 0%;"></div>
      <div class="slider__steps">
        <span class="slider__step-active"></span>
        ${'<span class></span>'.repeat(this._steps - 1)}
      </div>
    `;
  }
  
  _clickEvent = event => {
    const slider = suffix => this.elem.querySelector(`.slider__${suffix}`);
    const sliderRect = this.elem.getBoundingClientRect();
    const sliderSegments = this._steps - 1;
    const sliderSegmentOld = slider('step-active');
    const sliderSegmentNewId = Math.round( (event.clientX - sliderRect.left) / this.elem.offsetWidth * sliderSegments );
    const sliderSegmentNew = slider('steps').children.item( sliderSegmentNewId );
    
    const percentsByStep = Math.round( 100 * sliderSegmentNewId / sliderSegments ) + '%';
    
    sliderSegmentOld.classList.remove('slider__step-active');
    sliderSegmentNew.classList.add('slider__step-active');
    
    slider('value').textContent = sliderSegmentNewId;
    slider('thumb').style.left = percentsByStep;
    slider('progress').style.width = percentsByStep;
    
    const changeSlideEvent = new CustomEvent('slider-change', {
      detail: sliderSegmentNewId,
      bubbles: true
    });
    this.elem.dispatchEvent(changeSlideEvent);
  }
}