const graphql = require('graphql');
const Vendor = require('../../models/vendor');
const Hall = require('../../models/hall');
//Hall & Marquee

//Three responsibilities
//Define Types
//Define Relationship between types
//Define root queries

const {
    GraphQLObjectType, GraphQLString, GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
    } = graphql;

const _ = require('lodash');

// let halls = [{name: "Kehkashan", capacity: 1000, cost: 1200, id: "1", vendorId: "2"},
//     {name: "Hum", capacity: 2000, cost: 1200, id: "2", vendorId: "2"},
//     {name: "Ruth", capacity: 10000, cost: 2000, id: "3", vendorId: "1"}];

// const vendors = [
//     {name: 'Michael Scofield', user_email: "m@s.com", id: "1"},
//     {name: 'Lincoln Burrows', user_email: "l@b.com", id: "2"},
//     {name: 'Sara Tancredi', user_email: "s@t.com", id: "3"},
// ];

const HallType = new GraphQLObjectType({
    name: 'Hall',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        cost: { type: GraphQLInt },
        capacity: { type: GraphQLInt },
        contactNumber: { type: GraphQLString },
        vendor: {
            type: VendorType,
            resolve(parent, args) {
                return Vendor.findById(parent.vendorId);
                // return _.find(vendors, {id: parent.vendorId})
            }
        }
    })
});

const VendorType = new GraphQLObjectType({
    name: 'Vendor',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        user_email: { type: GraphQLString },
        halls: {
            type: new GraphQLList(HallType),
            resolve(parent, args) {
                return Hall.find({vendorId:parent.id});
                //return _.filter(halls, {vendorId: parent.id});

            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hall: {
            type: HallType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db / other source
                console.log(typeof args.id);
                return Hall.findById(args.id);
                //return _.find(halls, {id: args.id});
            }
        },
        halls: {
            type: new GraphQLList(HallType),
            resolve(parent, args) {
                return Hall.find({});
                //   return halls;
            }
        }
        ,
        vendor: {
            type: VendorType,
            args: {
                id: {
                    type: GraphQLID
                }
            }
            ,
            resolve(parent, args) {
                return Vendor.findById(args.id);
                //return _.find(vendors, {id: args.id});
            }
        }
        ,
        vendors: {
            type: new GraphQLList(VendorType),
            resolve(parent, args) {
                return Vendor.find({});
                // return vendors;
            }
        }
    }
})
    ;

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addVendor: {
            type: VendorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                user_email: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let vendor = new Vendor({
                    name: args.name,
                    user_email: args.user_email
                });
                return vendor.save();
            }
        },
        //[{name: "Kehkashan", capacity: 1000, cost: 1200, id: "1", vendorId: "2"},
        addHall: {
            type: HallType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                cost: { type: new GraphQLNonNull(GraphQLInt) },
                capacity: { type: new GraphQLNonNull(GraphQLInt) },
                vendorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let hall = new Hall({
                    name: args.name,
                    cost: args.cost,
                    capacity: args.capacity,
                    vendorId:args.vendorId
                });
                return hall.save();
            }
        }
    }
})
    ;

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});