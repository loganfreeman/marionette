define([ 'angular', 'ui-bootstrap' ], function(angular) {

	var modalDemo = angular.module('modalDemo', [ 'ui.bootstrap.carousel' ]);

	modalDemo.controller('ModalDemoCtrl', function($scope, $modal, $log) {

		$scope.items = [ 'item1', 'item2', 'item3' ];

		$scope.open = function() {

			var modalInstance = $modal.open({
				templateUrl : 'myModalContent.html',
				controller : ModalInstanceCtrl,
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	});

	modalDemo.controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

		$scope.items = items;
		$scope.selected = {
			item : $scope.items[0]
		};

		$scope.ok = function() {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	})

	return modalDemo;

})