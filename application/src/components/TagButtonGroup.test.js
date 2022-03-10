import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagButtonGroup from './TagButtonGroup';


// Clear everything after each test
afterEach(cleanup);

// Mock functions
const setTags = jest.fn();
const tags = ['river', 'running', 'fall', 'scenery', 'seasonal'];

describe('TagButtonGroup Component', () => {

  beforeEach(() => {
    render(<TagButtonGroup tags={tags} setTags={setTags} />);
  });
    
  test('render TagButtonGroup', () => {
    expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    expect(screen.getByTestId('tag-group')).toBeInTheDocument();
  });

  test('check to make sure provided tags are selected', async () => {
    for (let index = 0; index < tags.length; index++) {
      let tag = await screen.findByDisplayValue(tags[index]);
      expect(tag).toHaveProperty('checked');
      expect(tag).toMatchSnapshot();
    }
  });

  test('Sanpshot test for tagList', async () => {
    expect(screen.getAllByTestId('tags')).toMatchSnapshot();
  });
});
