// Case 1
var sum_to_n_a = function (n) {
  let result = 0;  
  for (let i = 1; i <= n; i++) {
    result += i;
  }

  return result;
};

// Case 2
var sum_to_n_b = function (n) {
  let result = 0;
  
  if (n === 0) {
    return 0
  }
  
  result = n + sum_to_n_b(n - 1)
  return result;
};

// Case 3
var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

// Test
let t = performance.now();

// Case 1
const result_a = sum_to_n_a(5);
t = performance.now();
console.log({ case: "a", n: 5, result_a, took: performance.now() - t });

// Case 2
t = performance.now();
const result_b = sum_to_n_b(5);
console.log({ case: "b", n: 5, result_b, took: performance.now() - t });

// Case 3
t = performance.now();
const result_c = sum_to_n_c(5);
console.log({ case: "c", n: 5, result_c, took: performance.now() - t });
