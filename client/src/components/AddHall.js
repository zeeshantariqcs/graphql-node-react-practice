import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getVendorsQuery,addHallMutation, getHallsQuery } from '../queries/queries';




class AddHall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cost: '',
            capacity: '',
            vendorId: ''
        };
    }

    displayVendors() {
        let data = this.props.getVendorsQuery;
      //  console.log(this.props)
        if (data.loading) {
            return (<option disabled>Loading vendors</option>);
        } else {
            return data.vendors.map(vendor => {
                return (<option key={vendor.id} value={vendor.id}>{vendor.name}</option>);
            });
        }
    }
    submitForm(e){
        e.preventDefault();
        this.props.addHallMutation({
            variables:{
                name:this.state.name,
                capacity:parseInt(this.state.capacity),
                cost:parseInt(this.state.cost),
                vendorId:this.state.vendorId
            },
            refetchQueries:[{query:getHallsQuery}]
        });
        //console.log(this.state);
    }

    render() {
        return (
            <form id="add-hall" onSubmit={this.submitForm.bind(this)}>
                <div className="field">
                    <label>Hall name:</label>
                    <input type="text" onChange={(e)=>{
                        this.setState({name:e.target.value})
                    }} />
                </div>
                <div className="field">
                    <label>Capacity:</label>
                    <input type="text" onChange={(e)=>{
                        this.setState({capacity:e.target.value})
                    }} />
                </div>

                <div className="field">
                    <label>Cost:</label>
                    <input type="text" onChange={(e)=>{
                        this.setState({cost:e.target.value})
                    }} />
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select onChange={(e)=>{
                        this.setState({vendorId:e.target.value})
                    }}>
                        <option>Select vendor</option>
                        {this.displayVendors()}
                    </select>
                </div>
                <button>+</button>

            </form> 
        );
    }
}

export default compose(
graphql(getVendorsQuery,{name:"getVendorsQuery"}),
graphql(addHallMutation,{name:"addHallMutation"}),
)(AddHall);
