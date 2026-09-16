import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAuth } from '@/context/AuthContext';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AuthLayout Session Auto-Redirect Integration Test', () => {
  it('harus melakukan redirect ke /dashboard jika sesi pengguna aktif (user terautentikasi)', () => {
    useAuth.mockReturnValue({
      user: { id: 'user_123', email: 'test@pitchku.id' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Form</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Form')).not.toBeInTheDocument();
  });

  it('harus merender halaman Auth (misal Login) jika pengguna belum login', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Form</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
  });
});
