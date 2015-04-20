'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:ApplyCtrl
 * @description
 * # ApplyCtrl
 * Controller of the carsureApp
 */
var app = angular.module('carsureApp');
app.controller('ApplyCtrl', function ($scope, $state, $stateParams, alert, $http, API_URL, $modal, clientmanagement) {

    var code = null;
    var client = {};

    clientmanagement.findClientById($stateParams.client_id).then(function (res) {
        $scope.email = res.data.email;
        $scope.client = res.data;
        code = Math.floor((Math.random() * 1000) + 1);
        console.log('SMS verification code ----------------------------------------------------------> ' + code);
    });

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
            controller: 'verifySmsCtrl',
            resolve: {
                code: function () {
                    return code;
                }
            }
        })

        modalInstance.result.then(function () {
            $state.go('main');
            alert('success', 'You are close to get your dream car', ' Somebody will contact you soon!');
        });
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

.controller('verifySmsCtrl', function ($scope, $modalInstance, code) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.verifySms = function () {
        var matched = (parseInt(code) === parseInt($scope.verificationcode))
        console.log(matched);
        if (matched)
            $modalInstance.close();
        else
            alert('warning', 'Something went wrong: (', 'Code not matching)');
    };

})