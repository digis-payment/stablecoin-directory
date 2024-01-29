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
    case "celo":
      return `https://celoscan.io/token/${address}`;
    case "base":
      return `https://basescan.io/token/${address}`;
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

async function loadCurrencies() {
  const response = await fetch("currencies.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const currencies = await response.json();
  const clist = document.querySelector("currency-list");
  clist.renderList(currencies);
}

const load = () => {
  loadStableCoins();
  loadCurrencies();
};
