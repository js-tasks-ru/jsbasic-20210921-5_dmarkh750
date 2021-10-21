function sumSalary(salaries) {
  let sum = 0;
  for (let key in salaries) {
    if (
      typeof salaries[key] === 'number' &&
      !isNaN(salaries[key]) &&
      salaries[key] != Infinity &&
      salaries[key] != -Infinity
    ) {
      sum += salaries[key];
    } 
  }
  return sum;
}

