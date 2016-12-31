var getTotal = function (price, quantity) {
  if (quantity > 10) {
    quantity = quantity + 1;
  }
  return price * quantity;
}
