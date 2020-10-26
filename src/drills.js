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


function paginateProducts(pageNumber){
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(2)

function addedAfterDate(daysAgo){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
          )
        .then(results => {
            console.log(results)
        })  
}

addedAfterDate(3)

function totalCategoryCost(){
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

totalCategoryCost();