define(['angular', 'angular-dragdrop', 'css!../partials/dnddemo/style'], function(){
	 var App = angular.module('dndDemo', ['ngDragDrop']);

     App.controller('DndDemoCtrl', function($scope, $timeout) {
       $scope.images = [{'thumb': '1.png'},{'thumb': '2.png'},{'thumb': '3.png'},{'thumb': '4.png'}]
       $scope.list1 = [];
       angular.forEach($scope.images, function(val, key) {
         $scope.list1.push({});
       });
       $scope.list2 = [
         { 'title': 'Item 1', 'drag': true },
         { 'title': 'Item 2', 'drag': true },
         { 'title': 'Item 3', 'drag': true },
         { 'title': 'Item 4', 'drag': true }
       ];

       $scope.startCallback = function(event, ui, title) {
         console.log('You started draggin: ' + title.title);
         $scope.draggedTitle = title.title;
       };

       $scope.stopCallback = function(event, ui) {
         console.log('Why did you stop draggin me?');
       };

       $scope.dragCallback = function(event, ui) {
         console.log('hey, look I`m flying');
       };

       $scope.dropCallback = function(event, ui) {
         console.log('hey, you dumped me :-(' , $scope.draggedTitle);
       };

       $scope.overCallback = function(event, ui) {
         console.log('Look, I`m over you');
       };

       $scope.outCallback = function(event, ui) {
         console.log('I`m not, hehe');
       };
     });
     
     return App;
})