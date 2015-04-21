'use strict';

/**
 * @ngdoc function
 * @name carsureApp.controller:ApplyCtrl
 * @description
 * # ApplyCtrl
 * Controller of the carsureApp
 */
var app = angular.module('carsureApp');
app.controller('ApplyCtrl', function ($scope, $state, $stateParams, alert, $http, API_URL, $modal, clientmanagement, $filter, $rootScope) {
    console.log($rootScope.client);

    var code = null;
    var client = {};
    client.client_id = $stateParams.client_id;

    $scope.currentDate = new Date(); // $filter("date")(new Date(), "yyyy-MM-dd");;

    $scope.licenseTypes = ['G', 'G2', 'G1'];

    clientmanagement.findClientById($rootScope.client._id).then(function (res) {
        $scope.email = res.data.email;
        $scope.client = res.data;
        code = Math.floor((Math.random() * 1000) + 1);
        console.log('SMS verification code ----------------------------------------------------------> ' + code);
    });

    $scope.place = null;

    $scope.sendText = function () {
        //commenting for now
        //        $http.post(API_URL + 'apply', {
        //            email: $scope.email,
        //            mobile: $scope.mobile
        //        }).success(function () {
        //            console.log('On Blur');
        //        });
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

            client.applied = true;
            client.name = $scope.name;
            client.dob = $filter('date')($scope.birthday, 'mediumDate');
            client.street = $scope.place;
            client.cityProvZip = $scope.cityProvZip;
            client.country = $scope.country;
            client.licenseType = $scope.licenseType;
            client.licenseDate = $filter('date')($scope.licenseDate, 'mediumDate');
            console.log(' Let us see   the client ----------------------------------------------------> msa check box ' + JSON.stringify(client));
            clientmanagement.updateClient(client).then(function (res) {
                console.log('Successfully updated client in apply.js ============================');
            }, function (err) {
                console.log("Could not update in apply,js #######################################");
            });
            $state.go('main');
            alert('success', 'You are close to get your dream car', ' Somebody will contact you soon!');
        });
    }

    //DOB handling
    // create function which calculates the age given the birthday as a datetime object
    //    $scope.age = function () {
    //        if (!$scope.birthday || $scope.birthday > new Date()) // if the birthday is not defined yet return 'undefined'
    //            return 'undefined';
    //        var now = new Date();
    //        var ageinyears = Math.round((now - $scope.birthday) / (100 * 60 * 60 * 24 * 365)) / 10;
    //        if (ageinyears < 18)
    //            slef.apply.age.$setValidity("valid", false);
    //        return Math.round((now - $scope.birthday) / (100 * 60 * 60 * 24 * 365)) / 10; // calculate the age in years with one decimal
    //    };



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
                            //                            console.log('Event', event);
                            //                            console.log('Data', data);

                            //                            console.log('-----------------------------------------------');
                            //                            console.log(angular.element(data.adr_address.split(',')[0])[0].innerHTML);
                            //                            console.log(angular.element(data.adr_address.split(',')[0]).text());
                            var elm = document.createElement('div');
                            elm.innerHTML = data.adr_address;

                            //                            console.log(angular.element(elm.querySelector(".street-address")).text());


                            street = $scope.place = angular.element(elm.querySelector(".street-address")).text();
                            $scope.hideSearch = true;
                            $scope.showStreet = true;
                            $scope.cityProvZip = angular.element(elm.querySelector(".locality")).text() + ', ' + angular.element(elm.querySelector(".region")).text() + ', ' + angular.element(elm.querySelector(".postal-code")).text()
                            $scope.country = angular.element(elm.querySelector(".country-name")).text()


                            //                            console.log('-----------------------------------------------');



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
        console.log('Verification code matched ->' + matched);
        if (matched)
            $modalInstance.close();
        else
            alert('warning', 'Something went wrong: (', 'Code not matching)');
    };

})