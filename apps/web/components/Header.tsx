import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

interface BalanceResponse {
  balance: number;
}

const Header: React.FC = () => {
  const { data, error } = useSWR<BalanceResponse>('/api/user/balance', fetcher);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f5f5f5' }}>
      <nav>
        <Link href="/"><a style={{ marginRight: '1rem' }}>Home</a></Link>
        <Link href="/profile"><a>Profile</a></Link>
      </nav>
      <div>
        {error && <span style={{ color: 'red' }}>Error loading balance</span>}
        {!error && !data && <span>Loading...</span>}
        {data && <span>Balance: ${data.balance.toFixed(2)}</span>}
      </div>
    </header>
  );
};

export default Header;