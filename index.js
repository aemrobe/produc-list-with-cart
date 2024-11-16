const { useState, useEffect } = React;

function App() {
  const [addToTheCartList, setAddToTheCartList] = useState([]);

  const handleAddedToCartList = function (newProduct) {
    setAddToTheCartList((prevCart) => {
      const productIndex = prevCart.findIndex(
        (product) => product.name === newProduct.name
      );

      if (productIndex !== -1) {
        const updatedCart = [...prevCart];

        updatedCart[productIndex] = {
          ...updatedCart[productIndex],
          quantity: newProduct.quantity,
          totalPrice: newProduct.quantity * newProduct.price,
        };

        return updatedCart;
      } else {
        return [...prevCart, newProduct];
      }
    });
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <ProductList onAddToTheCartList={handleAddedToCartList} />
        <Cart />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1 className="title">Desserts</h1>
    </header>
  );
}

function ProductList({ onAddToTheCartList }) {
  const [productList, setProductList] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch("data.json");

      const data = await response.json();

      setProductList(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {productList && (
        <ul>
          {productList.map((el, i) => {
            return (
              <Product
                product={el}
                onAddToTheCartList={onAddToTheCartList}
                key={productList[i]["name"]}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}

function Product({ product, onAddToTheCartList }) {
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [productInTheCartInfo, setProductInTheCartInfo] = useState({});

  const [quantity, setQuantity] = useState(0);

  const handleSelectedProduct = function (e) {
    console.log("affected");

    if (!selectedProduct) {
      setSelectedProduct(true);
      setQuantity(1);

      onAddToTheCartList({
        image: product["image"]?.mobile,
        quantity: 1,
        name: product["name"],
        price: product["price"],
        totalPrice: 1 * product["price"],
      });
    }
  };

  const handleIncreaseQuantity = function (e) {
    setQuantity((quantity) => {
      onAddToTheCartList({
        image: product["image"]?.mobile,
        quantity: quantity + 1,
        name: product["name"],
        price: product["price"],
        totalPrice: quantity * product["price"],
      });

      return quantity + 1;
    });
  };

  const handleDecreaseQuantity = function (e) {
    setQuantity((quantity) => {
      onAddToTheCartList({
        image: product["image"]?.mobile,
        quantity: Math.max(1, quantity - 1),
        name: product["name"],
        price: product["price"],
        totalPrice: quantity * product["price"],
      });
      return Math.max(1, quantity - 1);
    });
  };

  //when the add to the cart list is clciked it will add a product to the list

  return (
    <li className="product">
      <div className="product__img-container">
        <img
          src={product["image"]?.mobile}
          className={`product__image ${
            selectedProduct ? "product--added-to-a-cart" : ""
          }`}
          alt={product["name"]}
        />

        <Button
          className={`product__btn ${
            selectedProduct ? "product__btn--selected" : ""
          }`}
          onClick={handleSelectedProduct}
        >
          {selectedProduct === true ? (
            <>
              <img
                src="./assets/images/icon-decrement-quantity.svg"
                alt="increase a product quantity"
                className="product__quantity-change-element product__quantity-decrement"
                onClick={handleDecreaseQuantity}
              />

              <span className="product__quantity">{quantity}</span>

              <img
                src="./assets/images/icon-increment-quantity.svg"
                alt="increase a product quantity"
                className="product__quantity-increment product__quantity-change-element"
                onClick={handleIncreaseQuantity}
              />
            </>
          ) : (
            <>
              <img src="./assets/images/icon-add-to-cart.svg" />
              Add to Cart
            </>
          )}
        </Button>
      </div>

      <h2 className="product__category">{product["category"]}</h2>

      <h3 className="product__name">{product["name"]}</h3>
      <p className="product__price">
        {new Intl.NumberFormat("en-Us", {
          style: "currency",
          currency: "USD",
        }).format(product["price"])}
      </p>
    </li>
  );
}

function Button({ className, children, onClick }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function Cart() {
  return (
    <div className="cart">
      <h2 className="cart__name ">Your Cart ()</h2>

      <div className="cart__order-confirmed hidden">
        <img src="./assets/images/icon-order-confirmed.svg" />

        <h3 className="cart__order-confirmed-title">Order Confirmed</h3>

        <p className="cart__order-confirmed-message">
          We hope you enjoy your food!
        </p>
      </div>

      {/* empy cart */}
      <img
        src="./assets/images/illustration-empty-cart.svg"
        className="cart__img hidden"
      />

      <p className="cart__message hidden">Your added items will appear here</p>

      {/* When user Selected some item from the product list */}
      {/* cart container */}
      <div className="cart__container ">
        <ul className="cart__items-list">
          {/* cart item */}
          <li className="cart-item">
            <img
              src="./assets/images/image-tiramisu-mobile.jpg"
              className="cart-item__img"
            />

            {/* cart items list information */}
            <div className="cart-item__items-list-info">
              <h3 className="cart-item__name">Classic Tiramisu</h3>

              <div className="cart-item__numbers">
                <p className="cart-item__quantity">1x</p>

                <div className="cart-item__price-cotainer">
                  @<p className="cart-item__price">$5.50</p>
                </div>

                <p className="cart-item__total-price">$5.50</p>
              </div>
            </div>

            {/* remove item from the cart button */}
            <img
              className="cart-item__remove-btn"
              src="./assets/images/icon-remove-item.svg"
            />
          </li>

          {/* cart item */}
          <li className="cart-item">
            <img
              src="./assets/images/image-creme-brulee-mobile.jpg"
              className="cart-item__img"
            />

            {/* cart items list information */}
            <div className="cart-item__items-list-info">
              <h3 className="cart-item__name">Vanila Bean Creme Brulee</h3>

              <div className="cart-item__numbers">
                <p className="cart-item__quantity">4x</p>

                <div className="cart-item__price-cotainer">
                  @<p className="cart-item__price">$7.00</p>
                </div>

                <p className="cart-item__total-price">$28.00</p>
              </div>
            </div>

            {/* remove item from the cart button */}
            <img
              className="cart-item__remove-btn"
              src="./assets/images/icon-remove-item.svg"
            />
          </li>

          {/* cart item 
          {
          cart-item__img: margin-right: 0.9rem;
          }
          */}
          <li className="cart-item">
            <img
              src="./assets/images/image-panna-cotta-mobile.jpg"
              className="cart-item__img"
            />

            {/* cart items list information */}
            <div className="cart-item__items-list-info">
              <h3 className="cart-item__name">Vanila Panna Cotta</h3>

              <div className="cart-item__numbers">
                <p className="cart-item__quantity">2x</p>

                <div className="cart-item__price-cotainer">
                  @<p className="cart-item__price">$6.50</p>
                </div>

                <p className="cart-item__total-price">$13.00</p>
              </div>
            </div>

            {/* remove item from the cart button */}
            <img
              className="cart-item__remove-btn"
              src="./assets/images/icon-remove-item.svg"
            />
          </li>
        </ul>

        <div className="cart__total-price-section">
          <p className="cart__total-price-title">Order Total</p>
          <p className="cart__total-price">$46.50</p>
        </div>
      </div>

      <div className="cart__delivery-info">
        <img src="./assets/images/icon-carbon-neutral.svg" />

        <p>
          This is a{" "}
          <em className="font-style-normal font--ff-Red-Hat-semibold">
            carbon-neutral
          </em>{" "}
          delivery
        </p>
      </div>

      <Button className="cart__btn cart__confirm-btn">Confirm Order</Button>
    </div>
  );
}

function CartItem() {
  return (
    <li>
      <p></p>
    </li>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="attribution">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge">
          Frontend Mentor
        </a>
        . Coded by
        <a href="https://www.frontendmentor.io/profile/aemrobe">Aemro Bekalu</a>
        .
      </div>
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
