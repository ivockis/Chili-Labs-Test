import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const mockProps = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    categories: ['electronics', 'jewelery'],
    selectedCategory: '',
    setSelectedCategory: jest.fn(),
    sortOption: '',
    setSortOption: jest.fn(),
  };

  it('renders search input', () => {
    render(<Navigation {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category select', () => {
    render(<Navigation {...mockProps} />);
    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toBeInTheDocument();
  });

  it('renders sort select', () => {
    render(<Navigation {...mockProps} />);
    const sortSelect = screen.getByDisplayValue('Sort By');
    expect(sortSelect).toBeInTheDocument();
  });
});
