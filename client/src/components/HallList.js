import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getHallsQuery } from '../queries/queries';

//components
import HallDetails from './HallDetails';


class HallList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
    }

    displayHalls() {
        let data = this.props.data;
        if (data.loading) {
            return (<div>Loading halls...</div>);
        } else {
            //   return (<li>ZEEE</li>)
            return data.halls.map(hall => {
                return (
                    <li key={hall.id} onClick={(e) => {
                        this.setState({ selected: hall.id })
                    }}> {hall.name}</li>
                );
            });
        }
    }

    render() {
        return (
            <div className="main">
                <ul id="hall-list">
                    {this.displayHalls()}
                </ul>
                <HallDetails hallId={this.state.selected} />
            </div>
        );
    }
}

export default graphql(getHallsQuery)(HallList);
