let dataLoaded = false;
let parsedData = null;

function Seismograph () {
    let [ jsonData, setJsonData ] = React.useState();

    // load data from json
    if ( !dataLoaded ) {
        fetch( `./sensor_data.json` ).then( response => response.json() ).then( json => { 

            // parse data for friendlier use
            parsedData = json.map( event => {
            return {
                date: event.timestamp.split( `T` )[0],
                timestamp: event.timestamp.split( `T` )[1].split( `Z` )[0],
                location: event.location,
                magnitude: event.magnitude,
                type: event.type
            } } );

            // set react state & don't load data again
            dataLoaded = true;
            setJsonData( [ ...parsedData ] );

            // set data for graph (wait 5 sec for DOM to render)
            setTimeout( () => {
                const Plot = createPlotlyComponent( Plotly );
                ReactDOM.render( React.createElement( 
                    Plot, { 
                        data: [ { 
                            x: [1, 2, 3],
                            y: [2, 6, 3],
                            text: [`hey`, `you`, `suck`],
                            type: `scatter`,
                    } ] }, document.querySelector( `#graph` )
                ) );
            }, 5000 );
                
        } ); 
    }

    return (
        <div className={ "seismograph-panel" }>
            <div className={ `title` }>
                <div>Seismograph</div>
                <div>
                    <img id={ `flames` } src={ `https://cdn.freebiesupply.com/logos/large/2x/calgary-flames-logo.png` } />                    
                    <img id={ `flames` } src={ `https://cdn.7tv.app/emote/60b7ef8a55c320f0e87437fc/4x.webp` } />                    
                </div>
            </div>
            <input className={ `input` } onChange={ ( e ) => handleSearch( e.target.value ) } placeholder={ `Search...` }></input>
            { jsonData ? 
                <div style={ { display: `flex`, flexDirection: `row`, overflow: `auto` } }>
                    <div className={ "table" }>
                        <div className={ `row header` }>
                            <span style={ { paddingRight: `10px`, width: `100px` } }>Date</span>
                            <span style={ { paddingRight: `10px`, width: `80px` } }>Time</span>
                            <span style={ { paddingRight: `10px`, width: `225px` } }>Location</span>
                            <span style={ { paddingRight: `10px`, width: `100px` } }>Magnitude</span>
                            <span style={ { paddingRight: `10px`, width: `50px` } }>Type</span>
                        </div>
                        { jsonData.map( ( event, index ) => 
                            <div className={ `row` } key={ index }>
                                <span style={ { paddingRight: `10px`, width: `100px` } }>{ event.date }</span>
                                <span style={ { paddingRight: `10px`, width: `80px` } }>{ event.timestamp }</span>
                                <span style={ { paddingRight: `10px`, width: `225px` } }><a href={ `http://maps.google.com/?q=${ event.location }` } target={ `_blank` }>{ event.location }</a></span>
                                <span style={ { paddingRight: `10px`, width: `100px` } }>{ event.magnitude }</span>
                                <span style={ { paddingRight: `10px`, width: `50px` } }>{ event.type }</span>
                            </div>
                        ) }
                    </div>
                    <div id={ "graph" }></div>
                </div>
            : <img src={`https://res.cloudinary.com/bytesizedpieces/image/upload/v1656084931/article/a-how-to-guide-on-making-an-animated-loading-image-for-a-website/animated_loader_gif_n6b5x0.gif`}/> }
        </div>
    );

    /**
     * Simple search function that iterates through each 
     * event's cells to identify any matches with the query.
     * */
    function handleSearch ( input ) {

        // filter through the parsed data
        const filteredData = parsedData.filter( ( event ) => {

            // only interested in the values of the data in this filter
            const data = Object.values( event );

            for ( const cell of data ) {
                // make sure the input is a string and lowercase
                if ( String( cell ).toLowerCase().includes( input.toLowerCase() ) ) {
                    return true;
                }
            }

            return false;
        } )

        // set react state to update the list
        setJsonData( [ ...filteredData ] );
    }
}

ReactDOM.render(<Seismograph/>, document.getElementById( `root` ) );