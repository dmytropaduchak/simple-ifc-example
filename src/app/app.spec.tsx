import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { App } from './app';

describe('src/app/app.tsx', () => {
  it('render', async () => {
    render(<App />);
    const element = await screen.findByTestId('app');
    expect(element).toHaveClass('App');
  });
});
