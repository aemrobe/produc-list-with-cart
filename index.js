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

  const handleRemoveProductItemFromTheList = function (ItemToBeRemoved) {
    const indexOfItemToBeRemoved = addToTheCartList.findIndex(
      (productInTheCart) => productInTheCart.name === ItemToBeRemoved.name
    );

    setAddToTheCartList(
      addToTheCartList.filter((_, i) => i !== indexOfItemToBeRemoved)
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <ProductList
          onAddToTheCartList={handleAddedToCartList}
          productItemInTheCart={addToTheCartList}
          onRemoveProductItemFromTheList={handleRemoveProductItemFromTheList}
        />
        <Cart
          addToTheCartList={addToTheCartList}
          onRemoveProductItemFromTheList={handleRemoveProductItemFromTheList}
        />
      </main>

      <Footer />
    </div>
  );
}

//a function which changes number to usd dollar format
function numberToCurrencyConverter(number) {
  return new Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

function Header() {
  return (
    <header className="header">
      <h1 className="title">Desserts</h1>
    </header>
  );
}

function ProductList({
  onAddToTheCartList,
  productItemInTheCart,
  onRemoveProductItemFromTheList,
}) {
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
        <ul className="product-list">
          {productList.map((el, i) => {
            return (
              <Product
                product={el}
                onAddToTheCartList={onAddToTheCartList}
                onRemoveProductItemFromTheList={onRemoveProductItemFromTheList}
                key={productList[i]["name"]}
                productItemInTheCart={productItemInTheCart}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}

function Product({
  product,
  onAddToTheCartList,
  onRemoveProductItemFromTheList,
  productItemInTheCart,
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mouseOverDecrement, setMouseOverDecrement] = useState(false);
  const [mouseOverIncrement, setMouseOverIncrement] = useState(false);

  useEffect(function () {
    const handleResize = function () {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [quantity, setQuantity] = useState(0);

  const isTheProductInTheCart = productItemInTheCart.find(
    (productInTheCart) => productInTheCart.name === product.name
  )
    ? true
    : false;

  const handleSelectedProduct = function (e) {
    if (!isTheProductInTheCart) {
      setQuantity(1);
    }
  };

  const handleIncreaseQuantity = function (e) {
    setQuantity((quantity) => {
      return quantity + 1;
    });
  };

  const handleDecreaseQuantity = function (e) {
    setQuantity((quantity) => {
      return Math.max(1, quantity - 1);
    });
  };

  const returnImageBasedOnScreenSize = function () {
    let imageSrc;

    if (windowWidth < 950) {
      imageSrc = product["image"]?.mobile;
    } else if (windowWidth >= 950 && windowWidth < 1440) {
      imageSrc = product["image"]?.tablet;
    } else if (windowWidth >= 1440) {
      imageSrc = product["image"]?.desktop;
    }

    return imageSrc;
  };

  return (
    <li className="product">
      <div className="product__img-container">
        <img
          src={returnImageBasedOnScreenSize()}
          className={`product__image ${
            isTheProductInTheCart ? "product--added-to-a-cart" : ""
          }`}
          alt={product["name"]}
        />

        <Button
          className={`product__btn ${
            isTheProductInTheCart ? "product__btn--selected" : ""
          }`}
          onClick={() => {
            handleSelectedProduct();

            if (!isTheProductInTheCart)
              onAddToTheCartList({
                image: product["image"]?.mobile,
                quantity: 1,
                name: product["name"],
                price: product["price"],
                totalPrice: 1 * product["price"],
                addedToTheCart: true,
              });
          }}
        >
          {isTheProductInTheCart === true ? (
            <>
              <img
                src={`./assets/images/${
                  mouseOverDecrement
                    ? "icon-decrement-quantity-red.svg"
                    : "icon-decrement-quantity.svg"
                }`}
                alt="decrease a product quantity"
                className="product__quantity-change-element product__quantity-decrement"
                onClick={function () {
                  handleDecreaseQuantity();
                  if (quantity === 1 && isTheProductInTheCart) {
                    setMouseOverDecrement(false);
                    onRemoveProductItemFromTheList(product);
                    return;
                  }

                  onAddToTheCartList({
                    image: product["image"]?.mobile,
                    quantity: Math.max(1, quantity - 1),
                    name: product["name"],
                    price: product["price"],
                    totalPrice: Math.max(1, quantity - 1) * product["price"],
                  });
                }}
                onMouseEnter={() => setMouseOverDecrement(true)}
                onMouseLeave={() => setMouseOverDecrement(false)}
              />

              <span className="product__quantity">{quantity}</span>

              <img
                src={`./assets/images/${
                  mouseOverIncrement
                    ? "icon-increment-quantity-red.svg"
                    : "icon-increment-quantity.svg"
                }`}
                alt="increase a product quantity"
                className="product__quantity-increment product__quantity-change-element"
                onClick={function () {
                  handleIncreaseQuantity();
                  onAddToTheCartList({
                    image: product["image"]?.mobile,
                    quantity: quantity + 1,
                    name: product["name"],
                    price: product["price"],
                    totalPrice: (quantity + 1) * product["price"],
                  });
                }}
                onMouseEnter={() => setMouseOverIncrement(true)}
                onMouseLeave={() => setMouseOverIncrement(false)}
              />
            </>
          ) : (
            <>
              <img
                src="./assets/images/icon-add-to-cart.svg"
                alt="add a product to the cart"
              />
              Add to Cart
            </>
          )}
        </Button>
      </div>

      <h2 className="product__category">{product["category"]}</h2>

      <h3 className="product__name">{product["name"]}</h3>
      <p className="product__price">
        {numberToCurrencyConverter(product["price"])}
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

function Cart({ addToTheCartList, onRemoveProductItemFromTheList }) {
  const noOfProductItemInTheCart = addToTheCartList.reduce(function (
    accumulator,
    curProduct
  ) {
    return accumulator + curProduct["quantity"];
  },
  0);

  const [actionInsideTheButton, setActionInsideTheButton] =
    useState("Confirm Order");

  const handleConfirmOrder = function () {
    setActionInsideTheButton((prevAction) =>
      prevAction === "Confirm Order" ? "Start New Order" : "Confirm Order"
    );
  };

  return (
    <div
      className={`container ${
        actionInsideTheButton === "Start New Order"
          ? "container-order-confirmed"
          : ""
      }`}
    >
      <div
        className={`cart ${
          actionInsideTheButton === "Start New Order"
            ? "cart--order-confirmed"
            : ""
        }`}
      >
        <h2
          className={`cart__name ${
            noOfProductItemInTheCart > 0 &&
            actionInsideTheButton === "Start New Order" &&
            "hidden"
          }`}
        >
          Your Cart ({noOfProductItemInTheCart})
        </h2>

        <div
          className={`cart__order-confirmed ${
            actionInsideTheButton === "Start New Order" ? "" : "hidden"
          }`}
        >
          <img src="./assets/images/icon-order-confirmed.svg" />

          <h3 className="cart__order-confirmed-title">Order Confirmed</h3>

          <p className="cart__order-confirmed-message">
            We hope you enjoy your food!
          </p>
        </div>

        {/* empy cart */}
        <img
          src="./assets/images/illustration-empty-cart.svg"
          className={`cart__img ${
            noOfProductItemInTheCart === 0 ? "" : "hidden"
          } `}
         alt =""
        />

        <p
          className={`cart__message ${
            noOfProductItemInTheCart === 0 ? "" : "hidden"
          } `}
        >
          Your added items will appear here
        </p>

        {/* When user Selected some item from the product list */}
        {/* cart container */}
        <div
          className={`cart__container ${
            actionInsideTheButton === "Start New Order" ? "order-confirmed" : ""
          }`}
        >
          <ul className="cart__items-list">
            {addToTheCartList?.map((product) => (
              <CartItem
                actionInsideTheButton={actionInsideTheButton}
                key={product["name"]}
                product={product}
                onRemoveProductItemFromTheList={onRemoveProductItemFromTheList}
              />
            ))}
          </ul>

          <div
            className={`cart__total-price-section ${
              noOfProductItemInTheCart === 0 ? "hidden" : ""
            } `}
          >
            <p className="cart__total-price-title">Order Total</p>
            <p className="cart__total-price">
              {numberToCurrencyConverter(
                addToTheCartList?.reduce(
                  (accumulator, product) => accumulator + product["totalPrice"],
                  0
                )
              )}
            </p>
          </div>
        </div>

        <div
          className={`cart__delivery-info ${
            noOfProductItemInTheCart === 0
              ? "hidden"
              : "" || actionInsideTheButton === "Start New Order"
              ? "hidden"
              : ""
          } `}
        >
          <img src="./assets/images/icon-carbon-neutral.svg" />

          <p>
            This is a{" "}
            <em className="font-style-normal font--ff-Red-Hat-semibold">
              carbon-neutral
            </em>{" "}
            delivery
          </p>
        </div>

        <>
          {noOfProductItemInTheCart > 0 ? (
            <Button
              onClick={handleConfirmOrder}
              className="cart__btn cart__confirm-btn"
            >
              {actionInsideTheButton}
            </Button>
          ) : (
            ""
          )}
        </>
      </div>
    </div>
  );
}

function CartItem({
  product,
  onRemoveProductItemFromTheList,
  actionInsideTheButton,
}) {
  const [mouseOverRemoveBtn, setMouseOverRemoveBtn] = useState(false);

  return (
    <li className="cart-item">
      <img
        src={`${product["image"]}`}
        className={`cart-item__img  ${
          actionInsideTheButton === "Start New Order" ? "" : "hidden"
        }`}
        alt="an image of the product in the cart"
      />

      {/* cart items list information */}
      <div className="cart-item__items-list-info">
        <h3
          className={`cart-item__name ${
            actionInsideTheButton === "Start New Order"
              ? "cart-item__name--order-confirmed"
              : ""
          }`}
        >
          {product["name"]}
        </h3>

        <div className="cart-item__numbers">
          <p className="cart-item__quantity">{product["quantity"]}x</p>

          <div className="cart-item__price-cotainer">
            @
            <p className="cart-item__price">
              {numberToCurrencyConverter(product["price"])}
            </p>
          </div>

          <p
            className={`cart-item__total-price ${
              actionInsideTheButton === "Confirm Order" ? "" : "hidden"
            }`}
          >
            {numberToCurrencyConverter(product["totalPrice"])}
          </p>
        </div>
      </div>

      <p
        className={`cart-item__total-price ${
          actionInsideTheButton === "Start New Order"
            ? "cart-item__total-price--order-confirmed"
            : "hidden"
        }`}
      >
        {numberToCurrencyConverter(product["totalPrice"])}
      </p>

      {/* remove item from the cart button */}
      <img
        className={`cart-item__remove-btn ${
          actionInsideTheButton === "Start New Order" ? "hidden" : ""
        }`}
        src={`./assets/images/${
          mouseOverRemoveBtn
            ? "icon-remove-item-black.svg"
            : "icon-remove-item.svg"
        }`}
        onClick={() => onRemoveProductItemFromTheList(product)}
        onMouseEnter={() => setMouseOverRemoveBtn(true)}
        onMouseLeave={() => setMouseOverRemoveBtn(false)}
      />
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
