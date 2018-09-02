import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getHallQuery } from '../queries/queries';

class HallDetails extends Component {

    displayHallDetails() {
        const { hall } = this.props.data;
        if (hall) {
            return (
                <div>
                    <h2>{hall.name}</h2>
                    <h2>{hall.capacity}</h2>
                    <h2>{hall.cost}</h2>
                    <h2>{hall.vendor.name}</h2>
                    <p>All Halls by this vendor. </p>
                    <ul className="other-books">
                        {hall.vendor.halls.map(item => {
                            return <li key={item.id}>{item.name}</li>;
                        })}

                    </ul>
                </div>
            );
        } else {
            return (
                <div>No hall selected...</div>
            )
        }
    }

    render() {



        return (
            <div id="hall-details">
                {this.displayHallDetails()}
            </div>
        );
    }
}

export default graphql(getHallQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.hallId
            }
        }
    }
})(HallDetails);
