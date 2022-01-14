// React
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
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
  // Use regular expression to do case-insensitive matching for the filter
  const regexFilter = new RegExp(props.filter, 'i');

  return (
    <ToggleButtonGroup
        className="tag-container justify-content-center"
        type="checkbox"
        value={props.tags}
        onChange={(val)=>{props.setTags(val)}}
    >
      {
        tagList
          .filter(tag => props.filter ? regexFilter.test(tag) : true)
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
  );
}

TagButtonGroup.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  setTags: PropTypes.func.isRequired,
  filter: PropTypes.string,
}

export default TagButtonGroup;