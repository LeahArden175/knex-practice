const ShoppingListService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertItem(knex, newItem){
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('shopping_list')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteItem(knex, id){
        return knex
            .from('shopping_list')
            .where({ id })
            .delete()
    },
    updateItem(knex, id, updatedata){
        return knex
            .from('shopping_list')
            .where({ id })
            .update(updatedata)
    },
}

module.exports = ShoppingListService