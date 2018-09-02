import {gql} from 'apollo-boost';

const getVendorsQuery = gql`
{
    vendors{
        name
        user_email
        id
    }
}
`


const getHallsQuery=gql`
{
    halls{
        name
        capacity
        id
    }
}
`

const getHallQuery=gql`
query($id:ID)
{
    hall(id:$id){
        name
        capacity
        cost
        id
        vendor{
            name
            id
            user_email
            halls{
                name
                id
            }
        }
    }
}
`


const addHallMutation=gql`
mutation($name:String!,$capacity:Int!,$cost:Int!,$vendorId:ID!) {
  addHall(name:$name,capacity:$capacity,cost:$cost,vendorId:$vendorId) {
    name
    capacity
    id
  }
}
`


export {getVendorsQuery,getHallsQuery,addHallMutation,getHallQuery};