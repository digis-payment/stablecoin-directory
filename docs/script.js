function formatAddress(address, length = 10) {
  if (address && address.length > 10) {
    return `${address.substring(0, length / 2)}...${address.substring(
      address.length - 4
    )}`;
  }
  return address;
}

function toLink(address, protocol) {
  switch (protocol.toLowerCase()) {
    case "ethereum":
      return `https://etherscan.io/token/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/token/${address}`;
    case "optimism":
      return `https://optimistic.etherscan.io/token/${address}`;
    case "solana":
      return `https://solscan.io/account/${address}`;
    case "avalanche":
      return `https://snowtrace.io/address/${address}`;
    case "bsc":
      return `https://bscscan.com/token/${address}`;
    case "polygon":
      return `https://polygonscan.com/token/${address}`;
    default:
      return "#";
  }
}

async function loadStableCoins() {
  try {
    const response = await fetch("stablecoins.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const stableCoins = await response.json();

    const coinListElement = document.querySelector("coin-list");
    coinListElement.coins = stableCoins;
  } catch (error) {
    console.error("Could not load stablecoins:", error);
  }
}
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
  }

  set coins(coins) {
    Object.entries(coins).forEach(([symbol, coin]) => {
      const coinItem = document.createElement("coin-item");
      coinItem.coin = { ...coin, symbol };
      this.shadowRoot.appendChild(coinItem);
    });
  }
}

customElements.define("coin-list", CoinList);
