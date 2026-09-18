import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LandingPage from './ui_kits/landing';
import './init';
import './_ds_bundle.js';
import './ui_kits/landing/icons';
import './ui_kits/landing/helpers';

describe('LandingPage component', () => {
  it('renders landing page component without throwing', () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });
});
