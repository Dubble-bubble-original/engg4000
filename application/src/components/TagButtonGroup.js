// React
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types'

const tagList = [
  // Location
  'Forest',
  'Mountain',
  'Desert',
  'River',
  'Lake',
  'Ocean',
  'Cave',
  'Trail',
  'Farm',
  'City',
  'Building',
  'Wilderness',

  // Activity
  'Hiking',
  'Climbing',
  'Hunting',
  'Walking',
  'Running',
  'Cycling',
  'Sports',
  'Tourism',
  'Event',
  'Food',
  'Entertainment',

  // Season
  'Summer',
  'Fall',
  'Winter',
  'Spring',

  // Object
  'Nature',
  'Scenery',
  'Sky',
  'Animal',
  'Art',
  'Architecture',

  // Adjective
  'Unique',
  'Free',
  'Cheap',
  'Expensive',
  'Underground',
  'Seasonal',
  'Dangerous',
  'Other',
];

function TagButtonGroup(props) {
  // State variables
  const [tagFilter, setTagFilter] = useState('');

  return (
    <>
      <InputGroup className="mb-3" style={{maxWidth:250}}>
        <InputGroup.Text>Filter:</InputGroup.Text>
        <FormControl
          type="text"
          value={tagFilter}
          onChange={(e)=> {setTagFilter(e.target.value)}}
        />
      </InputGroup>
      <ToggleButtonGroup
          className="tag-container justify-content-center"
          type="checkbox"
          value={props.tags}
          onChange={(val)=>{props.setTags(val)}}
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
  setTags: PropTypes.func.isRequired,
  filter: PropTypes.string,
}

export default TagButtonGroup;