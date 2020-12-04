'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SearchResultSchema extends Schema {
  up () {
    this.create('search_results', (table) => {
      table.increments()
      table.integer('pageIndex').notNullable()
      table.integer('position').notNullable()
      table.string('screenshotURL',255)
      table.timestamps()
    })
  }

  down () {
    this.drop('search_results')
  }
}

module.exports = SearchResultSchema
