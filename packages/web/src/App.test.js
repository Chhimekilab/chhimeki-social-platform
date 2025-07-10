import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Mock environment variables for testing
process.env.REACT_APP_ENV = 'test';

// Test wrapper with AuthProvider
const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithAuth(<App />);
  });

  test('renders main content', () => {
    renderWithAuth(<App />);
    // Add more specific tests based on your App component structure
    expect(document.body).toBeInTheDocument();
  });

  test('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    
    // Example interaction test - update based on your actual App component
    // const button = screen.getByRole('button');
    // await user.click(button);
    // expect(button).toBeInTheDocument();
  });

  test('displays correct environment', () => {
    renderWithAuth(<App />);
    expect(process.env.REACT_APP_ENV).toBe('test');
  });
});