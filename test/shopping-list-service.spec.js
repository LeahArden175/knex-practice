const { expect, should } = require("chai");
const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping list service object`, function () {
  let db;
  let testItems = [
    {
      id: 1,
      checked: false,
      name: "ice cream",
      price: "4.95",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      category: "Snack",
    },
    {
      id: 2,
      checked: false,
      name: "banana",
      price: "0.69",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      category: "Breakfast",
    },
    {
      id: 3,
      checked: true,
      name: "chicken",
      price: "7.95",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      category: "Main",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  //describe(`getAllItems()`, () => {
  context(`given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it(` getAllItems() resolves all items from 'shopping-list' table`, () => {
      //tests will go here
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql(testItems);
      });
    });

    it(`getById() resolves an item by id from 'shopping_list', table`, () => {
        const thirdId = 3
        const thirdTestItem = testItems[thirdId -1]
        return ShoppingListService.getById(db, thirdId)
            .then(actual => {
                expect(actual).to.eql({
                    id: thirdId,
                    name: thirdTestItem.name,
                    price: thirdTestItem.price,
                    date_added: thirdTestItem.date_added,
                    checked: thirdTestItem.checked,
                    category: thirdTestItem.category
                })
            })
    })

    it(`deleteItem() remove and item fron list by id from 'shopping_list' table`, () => {
        const itemId = 3
        return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(allItems => {
                const expected = testItems.filter(item => item.id !== itemId)
                expect(allItems).to.eql(expected)
            })
    })

    it(`updateItem() updates an item in 'shopping_list' table`, () => {
        const idOfItemToUpdate = 3
        const newItemData = {
            name: 'updated name',
            price: '10.00',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Lunch',

        }
        return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(()=> ShoppingListService.getById(db, idOfItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...newItemData,
                })
            })
    })
  });

  context(`Given 'shopping_list' has NO data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertItem() inserts a new item and give it an id`, () => {
        const newItem ={
            name: 'Test new name name',
            price: '5.05',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Lunch',
        }
        return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: newItem.date_added,
                    checked: newItem.checked,
                    category: newItem.category
                })
            })
    })
  });
});
