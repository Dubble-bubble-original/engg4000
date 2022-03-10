// React
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types'

const tagList = [
  // Location
  'forest',
  'mountain',
  'desert',
  'river',
  'lake',
  'ocean',
  'cave',
  'trail',
  'farm',
  'city',
  'building',
  'wilderness',

  // Activity
  'hiking',
  'climbing',
  'hunting',
  'walking',
  'running',
  'cycling',
  'sports',
  'tourism',
  'event',
  'food',
  'entertainment',

  // Season
  'summer',
  'fall',
  'winter',
  'spring',

  // Object
  'nature',
  'scenery',
  'sky',
  'animal',
  'art',
  'architecture',

  // Adjective
  'unique',
  'free',
  'cheap',
  'expensive',
  'underground',
  'seasonal',
  'dangerous',
  'other',
];

function TagButtonGroup(props) {
  // State variables
  const [tagFilter, setTagFilter] = useState('');

  return (
    <>
      <InputGroup className="mb-3" style={{maxWidth:250}} data-testid="filter-input">
        <InputGroup.Text>Filter:</InputGroup.Text>
        <FormControl
          type="text"
          value={tagFilter}
          id="filter-input-field"
          onChange={(e)=> {setTagFilter(e.target.value)}}
        />
      </InputGroup>
      <ToggleButtonGroup
          className="tag-container justify-content-center"
          type="checkbox"
          value={props.tags}
          onChange={(val)=>{props.setTags(val)}}
          data-testid="tag-group"
      >
        {
          tagList
            // Use regular expression to do case-insensitive matching for the filter
            .filter(tag => tagFilter ? (new RegExp(tagFilter, 'i')).test(tag) : true)
            .map(tag =>
              <ToggleButton
                variant="outline-primary"
                className="tag"
                value={tag}
                key={tag}
                id={'tgb-btn-'+tag}
                data-testid="tags"
              >
                {tag}
              </ToggleButton>
            )
        }
      </ToggleButtonGroup>
    </>
  );
}

TagButtonGroup.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  setTags: PropTypes.func.isRequired
}

export default TagButtonGroup;