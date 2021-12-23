// React
import { useState } from 'react';

// Resources
import LocationPickerMap from './LocationPickerMap';
import StaticMap from './StaticMap';

function MapDemo() {

  // State variables
  const [position, setPosition] = useState(null);

  return (
    <div style={{textAlign:'left'}}>
      <b>Location Picker:</b><br/>
      latitude: {position?.lat} <br/>
      longitude: {position?.lng}
      <div style={{width:'400px', height:'400px'}}>
        <LocationPickerMap onPositionChange={setPosition} />
      </div>
      <br/>
      <b>Static Map</b>
      <div style={{width:'400px', height:'400px'}}>
        <StaticMap width={400} height={400} position={position} />
      </div>
      <br/>
    </div>
  )
}

export default MapDemo;