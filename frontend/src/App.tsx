import { useState, useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import { Chat } from './components/Chat';
import { Map } from './components/Map';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      if (import.meta.env.VITE_FIREBASE_API_KEY) {
        await signInWithPopup(auth, googleProvider);
      } else {
         // Mock login if firebase isn't configured
         setUser({ displayName: 'Demo User' } as User);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    if (import.meta.env.VITE_FIREBASE_API_KEY) {
      await signOut(auth);
    } else {
      setUser(null);
    }
  };

  if (!authChecked && import.meta.env.VITE_FIREBASE_API_KEY) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          {user ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.displayName}</span>
                <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem 1rem' }}>Logout</button>
             </div>
          ) : (
            <button onClick={login}>Sign In with Google</button>
          )}
        </div>
        <h1>Mera Vote, Meri Taaqat</h1>
        <p>Your Intelligent Guide to the Indian Election Process</p>
      </header>

      {user ? (
         <div className="main-grid">
            <Chat />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <Map />
                <div className="glass-panel">
                  <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>📋 Quick Links</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li><a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>→ Register to Vote</a></li>
                    <li><a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>→ Check Electoral Roll</a></li>
                    <li><a href="https://eci.gov.in/candidate-political-parties/kyc/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>→ Know Your Candidate (KYC)</a></li>
                  </ul>
                </div>
            </div>
         </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to understand your voting rights?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Sign in to interact with our AI assistant, find your nearest polling station, and get personalized guidance on the election process.
            </p>
            <button onClick={login} style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>Get Started Securely</button>
        </div>
      )}
    </div>
  );
}

export default App;
