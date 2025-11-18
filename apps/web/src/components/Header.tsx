import React, { useEffect, useState } from 'react';

interface BalanceResponse {
  balance: number;
}

const Header: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/balance', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BalanceResponse = await response.json();
        setBalance(data.balance);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
      }}
    >
      <h1 style={{ margin: 0 }}>My App</h1>
      <div style={{ fontSize: '1rem', fontWeight: 500 }}>
        {loading && 'Loading balance...'}
        {error && `Error: ${error}`}
        {!loading && !error && `Balance: $${balance?.toFixed(2) ?? '0.00'}`}
      </div>
    </header>
  );
};

export default Header;