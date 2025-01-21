# 99tech-interview-frontend-tamnguyen

## Messy React Refactor

#### 1. Interface:

- I added prefix `I` before interface name.
- I created `IBaseWalletBalance` so that other interfaces can inherit.
- I added missing properties `blockchain: string`.
- Old:

  ```ts
  interface WalletBalance {
    currency: string;
    amount: number;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }

  interface Props extends BoxProps {}
  ```

- Refactored:

  ```ts
  interface IBaseWalletBalance {
    currency: string;
    amount: number;
  }

  interface IWalletBalance extends IBaseWalletBalance {
    blockchain: string;
  }

  interface IFormattedWalletBalance extends IBaseWalletBalance {
    formatted: string;
  }
  interface IWalletPageProps extends BoxProps {}
  ```

#### 2. getPriority function:

- We can handle the switch case below with object to clean code and beautiful.
- We can move getPriority function to utils folder and import them.
- Old:

  ```ts
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };
  ```

- Refactored:

  ```ts
  const getPriority = (blockchain: string): number => {
    const blockchains = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };

    return blockchains[blockchain] ?? -99;
  };
  ```

#### 3. sortedBalances function:

- We can write ```return lhsPriority > -99 && balance.amount <= 0``` because ```lhsPriority > -99``` and ```balance.amount <= 0``` return boolean.
- We can write ```return leftPriority > rightPriority ? -1 : 1``` to shorten the code.
- Old:

  ```ts
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);
  ```

- Refactored:

  ```ts
  const sortedBalances = React.useMemo(() => {
    return balances
      .filter((balance: IWalletBalance) => {
        return lhsPriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: IWalletBalance, rhs: IWalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        return leftPriority > rightPriority ? -1 : 1;
      });
  }, [balances, prices]);
  ```

#### 4. rows component:

- Let use ```key={`wallet-row-${index}`}``` instead of ```key={index}``` to define keys.
- Old:

  ```ts
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );
  ```

- Refactored:

  ```ts
  const rows = sortedBalances.map(
    (balance: IFormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={`wallet-row-${index}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );
  ```
