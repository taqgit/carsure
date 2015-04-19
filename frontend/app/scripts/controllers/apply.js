'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:ApplyCtrl
 * @description
 * # ApplyCtrl
 * Controller of the carsureApp
 */
var app = angular.module('carsureApp');
app.controller('ApplyCtrl', function ($scope, $state, $stateParams, alert, $http, API_URL, $modal) {

    console.log('How do we get email here ?????????????    $stateParams  -> ' + $stateParams.client);
    $scope.place = null;

    $scope.sendText = function () {
        $http.post(API_URL + 'apply', {
            email: $scope.email,
            mobile: $scope.mobile
        }).success(function () {
            console.log('On Blur');
        });
    }

    $scope.showModal = function () {
        var modalInstance;
        //        if($scope.mobile){
        modalInstance = $modal.open({
                templateUrl: 'views/partials/verify-sms.html',
                controller: 'verifySmsCtrl'
            })
            //        }

    }

})


.directive('gPlacesAutocompleteCustom', [
            function () {
            return {
                restrict: 'A',
                require: 'gPlacesAutocomplete',
                transclude: true,
                priority: 999,
                //                    scope: true,
                link: function ($scope, iElem, iAttrs, controller) {
                        //                        iElem.unbind('blur');
                        //                        iElem.unbind('onBlur');
                        //                        $scope.$off('blur');
                        //                        $scope.$off('onBlur');
                        var street;

                        $scope.$on('g-places-autocomplete:select', function (event, data) {
                            console.log('Event', event);
                            console.log('Data', data);

                            console.log('-----------------------------------------------');
                            //                            console.log(angular.element(data.adr_address.split(',')[0])[0].innerHTML);
                            //                            console.log(angular.element(data.adr_address.split(',')[0]).text());
                            var elm = document.createElement('div');
                            elm.innerHTML = data.adr_address;

                            console.log(angular.element(elm.querySelector(".street-address")).text());


                            street = $scope.place = angular.element(elm.querySelector(".street-address")).text();
                            $scope.hideSearch = true;
                            $scope.showStreet = true;
                            $scope.cityProvZip = angular.element(elm.querySelector(".locality")).text() + ', ' + angular.element(elm.querySelector(".region")).text() + ', ' + angular.element(elm.querySelector(".postal-code")).text()
                            $scope.country = angular.element(elm.querySelector(".country-name")).text()


                            console.log('-----------------------------------------------');



                        }); //End select handler

                        iElem.on('blur', function (e) {
                            $scope.$apply(function () {
                                $scope.place = street;
                            });
                        });

                    } //End link


            }

            }
        ]


)

.controller('verifySmsCtrl', function ($scope, $modalInstance) {
    console.log('SMS Verify Controller ');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.verifySms = function () {
        console.log('Verify SMS here -------------- ');
        $modalInstance.close();
    };

})