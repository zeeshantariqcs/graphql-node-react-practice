import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// components
import HallList from './components/HallList';
import AddHall from './components/AddHall';

//apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:7107/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="main">
          <h1>Halls List</h1>
          <HallList />
          <AddHall/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
