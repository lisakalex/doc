# Electrum CLI cheat sheet

Perfect. Here’s a **short, working Electrum CLI cheat sheet** for the current versions (≥4.5), matching the style you’re running.

---

## 🔧 Daemon management

```bash
electrum daemon -d      # start daemon in background
electrum stop           # stop daemon
electrum getinfo        # show status of daemon
```

---

## 👛 Wallet management

```bash
electrum create         # create a new wallet (default location ~/.electrum/wallets/default_wallet)
electrum restore        # restore wallet from seed or master key
electrum load_wallet    # load a wallet into the daemon
electrum list_wallets   # list loaded wallets
```

---

## 💳 Address handling

```bash
electrum createnewaddress          # generate a new receiving address
electrum listaddresses             # list all addresses in the wallet
electrum listaddresses --funded    # list addresses with balance
```

---

## 💰 Balances

```bash
electrum getbalance      # show wallet balance (confirmed + unconfirmed)
electrum getbalance -a   # show balance of all addresses
```

---

## 📤 Transactions

```bash
electrum payto <address> <amount>    # create transaction
electrum broadcast <raw_tx>          # broadcast raw transaction
electrum history                     # show transaction history
```

---

## 🔑 Security

```bash
electrum password                  # change wallet password
electrum getprivatekeys <address>  # export private key(s) for an address
```

---

⚡️ Pro tip:
If you want to script these in Django (via `subprocess` or JSON-RPC), the commands are the same — just remove interactive bits (like password prompts).

---

Do you want me to also give you the **equivalent JSON-RPC calls** (for each of these commands), so your Django app can talk directly to Electrum without `subprocess.run()`?
