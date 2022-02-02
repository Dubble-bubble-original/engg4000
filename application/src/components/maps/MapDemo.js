// React
import { useState } from 'react';

// Resources
import LocationPickerMap from './LocationPickerMap';
import StaticMap from './StaticMap';

function MapDemo() {

  // State variables
  const [position, setPosition] = useState(null);
  const [isTruePosition, setIsTruePosition] = useState(false);

  return (
    <div style={{textAlign:'left'}}>
      <b>Location Picker:</b><br/>
      latitude: {position?.lat} <br/>
      longitude: {position?.lng}
      isTruePosition: {isTruePosition}
      <div style={{width:'400px', height:'400px'}}>
        <LocationPickerMap onPositionChange={setPosition} setIsTruePosition={setIsTruePosition} />
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