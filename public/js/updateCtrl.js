// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var updateCtrl = angular.module('updateCtrl', ['geolocation', 'gservice']);
updateCtrl.controller('updateCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var queryBody = {};

    $scope.locations = [];
    $http.get('/locations').success(function(response){
        // Then convert the results into map points
        $scope.locations = response;
    }).error(function(){});

   
    // Take query parameters and incorporate into a JSON queryBody
    $scope.updateLocation = function(){

        // Assemble Query Body
        updateBody = {
            selectedLocation : $scope.formData.selectedLocation,
            availableSlots: parseInt($scope.formData.availableSlots)
        };
        
        // Post the updateBody to the /update POST route 
       $http.post('/update', updateBody)

            // Store the filtered results in queryResults
            .success(function(){

                // Pass the filtered results to the Google Map Service and refresh the map
                //gservice.refresh(updateBody.selectedLocation.location.latitude, updateBody.selectedLocation.location.longitude);

            })
            .error(function(){
            })
    };
});

