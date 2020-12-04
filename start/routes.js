'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'AdonisJS server started' }
})

/* Route.get('contact-mail', ({ view }) => {
  return view.render('mails.contact')
})

Route.get('confirmation-mail', ({ view }) => {
  return view.render('mails.contact')
}) */


Route.group(() => {
  Route.post('contact', 'MailController.sendContact')
}).prefix('api/arpen')



//API Routes
Route.group(() => {
  Route.get('search','SearchController.execute')
}).prefix('api/v1')
