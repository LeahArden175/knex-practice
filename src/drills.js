require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
    client: "pg",
    connection: process.env.DB_URL,
  });
  


function searchByTerm(searchterm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchterm}%`)
        .then(result =>{
            console.log(result)
        })
}

searchByTerm('urger')
