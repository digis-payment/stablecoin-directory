class CoinItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set coin(coin) {
    const template = document.createElement("template");
    template.innerHTML = `
            <style>
                .coin-item {
                    background-color: #1e293b; /* Dark background */
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                .coin-item h2 {
                    margin: 0 0 10px 0;
                    color: #3b82f6; /* Light blue for the title */
                }
                a {
                    color: #f59e0b; /* Orange link */
                    text-decoration: none;
                }
                .addresses {
                    margin-top: 10px;
                }
                .address {
                    background-color: #334155; /* Slightly lighter background for addresses */
                    padding: 5px;
                    border-radius: 5px;
                    margin-bottom: 5px;
                }
            </style>
            <div class="coin-item">
                <h2>${coin.name} (${coin.symbol})</h2>
                <a href="${coin.website}" target="_blank">Website</a>
                <div class="addresses">
                    ${Object.entries(coin.addresses)
                      .map(
                        ([protocol, address]) => `
                        <div class="address">${protocol.toUpperCase()}: <a target="_blank" href="${toLink(
                          address,
                          protocol
                        )}""><code>${formatAddress(address)}</code></a>
                       
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("coin-item", CoinItem);

class CoinList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._coins = {}; // Initialize an internal property to store the coin data
    this.filterCurrency = ""; // Assuming there's a filter mechanism
  }

  // Getter and Setter for coins
  get coins() {
    return this._coins;
  }

  set coins(coins) {
    this._coins = coins; // Store the coins data
    this.render(); // Call render whenever coins data is updated
  }

  set filterCurrency(value) {
    this._filterCurrency = value;
    this.render(); // Re-render the component when the filter is updated
  }

  // Render method
  render() {
    // Clear existing content
    this.shadowRoot.innerHTML = "";

    // Render new content based on the coins data
    Object.entries(this._coins)
      .filter(
        ([symbol, coin]) =>
          !this._filterCurrency || coin.currency === this._filterCurrency
      )
      .forEach(([symbol, coin]) => {
        const coinItem = document.createElement("coin-item");
        coinItem.coin = { ...coin, symbol };
        this.shadowRoot.appendChild(coinItem);
      });
  }

  // ... other methods ...
}

customElements.define("coin-list", CoinList);

class CurrencyList extends HTMLElement {
  static get observedAttributes() {
    return ["currencies"];
  }

  connectedCallback() {
    this.addEventListener("click", this.handleItemClick);
  }

  handleItemClick = (event) => {
    // Identify the clicked item
    let target = event.target;
    while (target && target.tagName !== "LI" && target !== this) {
      target = target.parentNode;
    }
    if (target && target.tagName === "LI") {
      const currencyCode = target.getAttribute("data-code");
      // Do something with the clicked item, for example, emit a custom event
      this.dispatchEvent(
        new CustomEvent("currencySelected", {
          bubbles: true,
          detail: { code: currencyCode },
        })
      );
    }
  };

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "currencies") {
      const currencies = JSON.parse(newValue);
      this.renderList(currencies);
    }
  }

  renderList(currencies) {
    this.innerHTML =
      `<ul class="flex flex-row flex-wrap justify-start items-center mt-3">` + // Use flexbox for horizontal alignment
      currencies
        .map(
          (currency) =>
            `<li data-code="${
              currency.code
            }" class="flex items-center mr-4 py-1">
                 <button class="p-2 rounded bg-blue-200 text-gray-600 hover:bg-blue-400">${this.getFlagEmoji(
                   currency.country
                 )} <span class="ml-2">${currency.code}</span></button></li>` // Add margin for spacing between items
        )
        .join("") +
      `</ul>`;
  }

  getFlagEmoji(countryCode) {
    if (!countryCode) return "";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
}

customElements.define("currency-list", CurrencyList);
