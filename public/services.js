'use strict';

/* Services */  

// Demonstrate how to register services
// In this case it is a simple value service.
// http://docs.angularjs.org/guide/dev_guide.services.creating_services
app.factory('socket', function ($rootScope) {

  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

/* Services */  


