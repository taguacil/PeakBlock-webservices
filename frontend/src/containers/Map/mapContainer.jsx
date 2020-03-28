import React, { useState ,PureComponent} from 'react';
import ReactMapGL , {Marker} from 'react-map-gl';
import { Icon } from 'semantic-ui-react';

export function Map() {
  const [viewport, setViewport] = useState({
    width: 800,
    height: 500,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const data =[
    {name:'America',longitude:'12.5',latitude:'-69.96666666'},
    {name:'Kabul',longitude:'33',latitude:'65'},
    {name:'America',longitude:'12.5',latitude:'-69.96666666'}
  ] 
  
  return (
     <ReactMapGL {...viewport}    
     mapboxApiAccessToken={'pk.eyJ1IjoibW9oYW1lZGl4IiwiYSI6ImNrOGFxeXcyYTA1MWgzbW11YjRkZGo3NG4ifQ.tOEwHyE2XAibeYsI2kBFNQ'}
     onViewportChange={setViewport}>
     <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
     hey<Icon name='circle'/>
     </Marker>
     <Marker latitude={37.32} longitude={-123.69} offsetLeft={-20} offsetTop={-10}>
     hey<Icon name='circle'/>
     </Marker>
   </ReactMapGL>
  );
}