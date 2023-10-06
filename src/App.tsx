import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, // Added showGraph property
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, // Initialize showGraph as false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) { // Render the graph only if showGraph is true
      return <Graph data={this.state.data} />;
    }
    return null; // Return null if showGraph is false
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from the server
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100); // Fetch data every 100ms

    // Stop fetching data when the component is unmounted
    return () => clearInterval(interval);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.setState({ showGraph: true }); // Set showGraph to true on button click
              const stopFetchingData = this.getDataFromServer(); // Start fetching data
              // Stop fetching data when the component is unmounted
              return () => stopFetchingData();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
