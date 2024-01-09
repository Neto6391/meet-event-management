import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'UsersController.store')
    Route.put('/:id', 'UsersController.update')
  }).prefix('/users')
}).prefix('/api/v1')
