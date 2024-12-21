import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Cars from './pages/Cars';
import './styles/global.css';
import { Sellers } from './pages/Sellers';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CarPage from './pages/Car/[id]';
import CreateOrEditCar from './pages/Car/CreateOrEditCar';
import authService from './services/api/authService';
import { AuthRole, UserType } from './types/user';
import AccountPage from './pages/Acount';
import { SellerDetails } from './pages/Seller/[id]';
import UsersPage from './pages/Users';

function App() {
  const [user, setUser] = useState<UserType | null>(null);

  const token = localStorage.getItem('access_token');

  const fetchUser = async () => {
    const user = await authService.fetchUserRole();
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <Router>
      <div
        style={{ display: 'flex', height: '100vh', backgroundColor: '#ebf4fc' }}
      >
        {/* Sidebar */}
        <nav
          style={{
            width: '15%',
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Autopify</h1>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link
                to="/cars"
                style={{
                  color: '#ecf0f1',
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
              >
                Авто
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link
                to="/sellers"
                style={{
                  color: '#ecf0f1',
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
              >
                Продавцы
              </Link>
            </li>
            <li style={{ marginBottom: '20px' }}>
              <Link
                to="/account"
                style={{
                  color: '#ecf0f1',
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
              >
                Аккаунт
              </Link>
            </li>
            {user?.role === AuthRole.Admin && (
              <>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
                  Админ
                </h3>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    to="/users"
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      fontSize: '18px',
                    }}
                  >
                    Пользователи
                  </Link>
                </li>
                <li>
                  <Link
                    to="/publish-requests"
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      fontSize: '18px',
                    }}
                  >
                    Публикации
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, boxSizing: 'border-box', overflowY: 'auto' }}>
          <Routes>
            <Route path="/cars" element={<Cars />} />
            <Route path="/view-car/:id" element={<CarPage />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/seller/:id" element={<SellerDetails />} />
            {/* TODO: change that */}
            {user && (
              <Route path="/account" element={<AccountPage user={user} />} />
            )}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/publish-requests" element={<Sellers />} />
            {/* Default Route */}
            <Route path="*" element={<Cars />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars/new" element={<CreateOrEditCar user={user} />} />
            <Route
              path="/cars/edit/:carId"
              element={<CreateOrEditCar user={user} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// TODO: сделать страницу для админа где он сможет блокировать/подтвержать заявки на продавца
// TODO: сделать страницу для админа где он сможет одобрять/запрещать публикацию авто
