import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  
  constructor(products) {
    this.products = products;
    this.filters = {};
    
    this.layout();
    this.layoutGrid();
  }
  
  layout() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner"></div>
      </div>`
    );
  }
  
  layoutGrid() {
    const caseLine = product => {
      const caseA = this.filters.noNuts && product.nuts;
      const caseB = this.filters.vegeterianOnly && !product.vegeterian;
      const caseC = this.filters.maxSpiciness !== undefined && product.spiciness > this.filters.maxSpiciness;
      const caseD = this.filters.category && product.category !== this.filters.category;
      
      return ( caseA || caseB || caseC || caseD ) ? false : true;
    }
    const grid = this.elem.querySelector('.products-grid__inner');
    
    while( grid.firstChild )
      grid.removeChild( grid.firstChild );
    
    this.products
      .filter( product => caseLine(product) )
      .forEach( product => grid.append( new ProductCard(product).elem ) );
  }
  
  updateFilter = filters => {
    Object.assign( this.filters, filters );
    this.layoutGrid();
  }
}