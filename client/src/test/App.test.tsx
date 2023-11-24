import App from '../App';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App', () => {
    it('should render without crashing', () => {
        render(<App />);
        expect(screen.getByText(/MLOps/i)).toBeInTheDocument();
    });
});