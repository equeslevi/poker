import { MongoClient, ServerApiVersion } from 'mongodb';

let db
/*

params = {
    election: 'TEST2022'
    type: 'config' / 'candidates' / 'voters' in order to create collection = test2022-candidates/test2022-voters
    task: 'createCollection'
    query: { candidateId: {$gte:4} };
    options: {
        sort: { candidateId : -1 },
        projection: { _id: 0, candidateId: 1, lastname: 1 },
    }
}
        
    $eq - Matches values that are equal to a specified value.                       db.inventory.find( { qty: 20 } ) || db.inventory.find( { qty: { $eq: 20 } } )
    $gt - Matches values that are greater than a specified value.                   db.inventory.find( { quantity: { $gt: 20 } } )
    $gte - Matches values that are greater than or equal to a specified value.      db.inventory.find( { quantity: { $gte: 20 } } )
    $in - Matches any of the values specified in an array.                          db.inventory.find( { quantity: { $in: [ 5, 15 ] } }, { _id: 0 } )
    $lt - Matches values that are less than a specified value.                      db.inventory.find( { quantity: { $lt: 20 } } )
    $lte - Matches values that are less than or equal to a specified value.         db.inventory.find( { quantity: { $lte: 20 } } )
    $ne - Matches all values that are not equal to a specified value.               db.inventory.find( { quantity: { $ne: 20 } } )
    $nin - Matches none of the values specified in an array.                        db.inventory.find( { quantity: { $nin: [ 5, 15 ] } }, { _id: 0 } )

    $and - Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.  db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] })
    $not - Inverts the effect of a query expression and returns documents that do not match the query expression.   db.inventory.find( { price: { $not: { $gt: 1.99 } } } )
    $nor - Joins query clauses with a logical NOR returns all documents that fail to match both clauses.            db.inventory.find( { $nor: [ { price: 1.99 }, { sale: true } ]  } )
    $or - Joins query clauses with a logical OR returns all documents that match the conditions of either clause.   db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )


    SAMPLE:

    const query = { candidateId: {$gte:4} };
    const options = {
        // sort matched documents in descending order by rating
        sort: { candidateId : -1 },
        // Include only the `title` and `imdb` fields in the returned document
        projection: { _id: 0, candidateId: 1, lastname: 1 },
    };
    let candidates = await db.collection(`candidates`).findOne(query, options).toArray()
    console.log(candidates)

*/

const dbname = process.env.DBNAME
const mongoUser = process.env.MONGOUSER
const mongoPassword = process.env.MONGOPASSWORD
const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0-nzipa.mongodb.net/?retryWrites=true&maxPoolSize=20w=majority&connectTimeoutMS=10000&socketTimeoutMS=90000`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const mongoTasks = async (params, tasks) => {
    if (params == 'undefined') { throw `params cannot be blank` }
    let results
    //must contain a params.election
    let collection
    if (params.type == 'config' || params.type == 'sponsors' || params.type == 'backend') {
        if (params.type == 'config') {
            collection = db.collection(`config`)
        } else if (params.type == 'sponsors') {
            collection = db.collection(`sponsors`)
        } else if (params.type == 'backend') {
            collection = db.collection(`backend`)
        }
    } else {
        collection = db.collection(`${params.election.toLowerCase()}-${params.type.toLowerCase()}`)
    }
    const query = params.query || {};
    const options = params.options || {};
    const updateDoc = params.updateDoc || {};
    const delquery = params.delquery || {};
    const deloptions = params.deloptions || {};
    //================================================================
    //========FIND====================================================
    //================================================================
    if (tasks === 'findOne') {
        results = await collection.findOne(query, options)
    }
    if (tasks === 'find') {
        results = await collection.find(query, options).toArray()
    }
    //================================================================
    //========INSERTS=================================================
    //================================================================
    if (tasks === 'insertOne') {
        results = await collection.insertOne(query, options)
    }
    if (tasks === 'insertMany') {
        results = await collection.insertMany(query, options)
    }
    //================================================================
    //========UPDATES=================================================
    //================================================================
    if (tasks === 'updateOne') {
        results = await collection.updateOne(query, updateDoc, options)
    }
    if (tasks === 'updateMany') {
        results = await collection.updateMany(query, updateDoc, options)
    }
    //================================================================
    //========DELETES=================================================
    //================================================================
    if (tasks === 'deleteOne') {
        results = await collection.deleteOne(query, options)
    }
    if (tasks === 'deleteMany') {
        results = await collection.deleteMany(query, options)
    }
    //================================================================
    //========COUNT===================================================
    //================================================================
    if (tasks === 'count') {
        results = await collection.countDocuments(query, options)
    }
    //================================================================
    //========CHECK COLLECTION========================================
    //================================================================
    if (tasks === 'exists') {
        results = await db.listCollections({}, { nameOnly: true }).toArray()
        const found = results.find(element => element.name == `${params.election.toLowerCase()}-${params.type.toLowerCase()}`);
        if (found == undefined) {
            return false
        } else {
            return true
        }
    }
    //================================================================
    //========CHECK COLLECTION========================================
    //================================================================
    if (tasks === 'createCollection') {
        results = await db.createCollection(`${params.election.toLowerCase()}-${params.type.toLowerCase()}`)
    }

    if (tasks === 'createCollection') {
        results = await db.createCollection(`${params.election.toLowerCase()}-${params.type.toLowerCase()}`)
    }
    return results
}


const mongo = {
    connect: async () => {
        console.log(`connecting to database...`);
        console.log(`dbname: ${dbname}`);
        if (
            dbname == undefined || dbname == '' ||
            mongoUser == undefined || mongoUser == '' ||
            mongoPassword == undefined || mongoPassword == ''
        ) {
            throw `mongo database not found, check credentials`
        } else {
            try {
                await client.connect();
                db = client.db(dbname)
                console.log(`CONNECTION ESTABLISHED`)
                return true
            } catch (e) {
                console.log(e)
            }
        }
    },
    find: async (params) => {
        let results = await mongoTasks(params, 'find')
        return results
    },
    findOne: async (params) => {
        let results = await mongoTasks(params, 'findOne')
        return results
    },
    insertOne: async (params) => {
        let results = await mongoTasks(params, 'insertOne')
        return results
    },
    insertMany: async (params) => {
        let results = await mongoTasks(params, 'insertMany')
        return results
    },
    updateOne: async (params) => {
        let results = await mongoTasks(params, 'updateOne')
        return results
    },
    updateMany: async (params) => {
        let results = await mongoTasks(params, 'updateMany')
        return results
    },
    deleteOne: async (params) => {
        let results = await mongoTasks(params, 'deleteOne')
        return results
    },
    deleteMany: async (params) => {
        let results = await mongoTasks(params, 'deleteMany')
        return results
    },
    count: async (params) => {
        let results = await mongoTasks(params, 'count')
        return results
    },
    exists: async (params) => {
        let results = await mongoTasks(params, 'exists')
        return results
    },
    createCollection: async (params) => {
        let results = await mongoTasks(params, 'createCollection')
        return results
    },
    mustRefresh: async (params) => {
        let results = await mongoTasks(params, 'mustRefresh')
        return results
    }
}

export default mongo;

