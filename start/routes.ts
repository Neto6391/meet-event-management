import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'UsersController.store')
  }).prefix('/users')
}).prefix('/api/v1')
