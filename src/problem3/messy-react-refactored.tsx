import React from 'react';
import WalletRow from './WalletRow';
import { useWalletBalances, usePrices } from '@/hooks';
import { BoxProps } from '@/common/interfaces';
import classes from '@/styles/wallet-page';

interface IBaseWalletBalance {
  currency: string;
  amount: number;
}

interface IWalletBalance extends IBaseWalletBalance {
  blockchain: string
}

interface IFormattedWalletBalance extends IBaseWalletBalance {
  formatted: string;
}

interface IWalletPageProps extends BoxProps { }

const getPriority = (blockchain: string): number => {
  const blockchains = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  }

  return blockchains[blockchain] ?? -99;
}

export const WalletPage: React.FC<IWalletPageProps> = (props: IWalletPageProps) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = React.useMemo(() => {
    return balances.filter((balance: IWalletBalance) => {
      return lhsPriority > -99 && balance.amount <= 0;
    }).sort((lhs: IWalletBalance, rhs: IWalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);

      return leftPriority > rightPriority ? -1 : 1;
    });
  }, [balances, prices]);

  const rows = sortedBalances.map((balance: IFormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={`wallet-row-${index}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}