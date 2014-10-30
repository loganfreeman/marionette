define([ 'angular', 'angular.treeview' ], function(angular) {
	var treeviewDemo = angular.module('treeviewDemo', [ 'angularTreeview' ]);
	treeviewDemo.controller('TreeViewCtrl', function($scope) {

		// test tree model 1
		$scope.roleList1 = [ {
			"roleName" : "User",
			"roleId" : "role1",
			"children" : [ {
				"roleName" : "subUser1",
				"roleId" : "role11",
				"children" : []
			}, {
				"roleName" : "subUser2",
				"roleId" : "role12",
				"children" : [ {
					"roleName" : "subUser2-1",
					"roleId" : "role121",
					"children" : [ {
						"roleName" : "subUser2-1-1",
						"roleId" : "role1211",
						"children" : []
					}, {
						"roleName" : "subUser2-1-2",
						"roleId" : "role1212",
						"children" : []
					} ]
				} ]
			} ]
		},

		{
			"roleName" : "Admin",
			"roleId" : "role2",
			"children" : []
		},

		{
			"roleName" : "Guest",
			"roleId" : "role3",
			"children" : []
		} ];

		// test tree model 2
		$scope.roleList2 = [ {
			"roleName" : "User",
			"roleId" : "role1",
			"children" : [ {
				"roleName" : "subUser1",
				"roleId" : "role11",
				"collapsed" : true,
				"children" : []
			}, {
				"roleName" : "subUser2",
				"roleId" : "role12",
				"collapsed" : true,
				"children" : [ {
					"roleName" : "subUser2-1",
					"roleId" : "role121",
					"children" : [ {
						"roleName" : "subUser2-1-1",
						"roleId" : "role1211",
						"children" : []
					}, {
						"roleName" : "subUser2-1-2",
						"roleId" : "role1212",
						"children" : []
					} ]
				} ]
			} ]
		},

		{
			"roleName" : "Admin",
			"roleId" : "role2",
			"children" : [ {
				"roleName" : "subAdmin1",
				"roleId" : "role11",
				"collapsed" : true,
				"children" : []
			}, {
				"roleName" : "subAdmin2",
				"roleId" : "role12",
				"children" : [ {
					"roleName" : "subAdmin2-1",
					"roleId" : "role121",
					"children" : [ {
						"roleName" : "subAdmin2-1-1",
						"roleId" : "role1211",
						"children" : []
					}, {
						"roleName" : "subAdmin2-1-2",
						"roleId" : "role1212",
						"children" : []
					} ]
				} ]
			} ]
		},

		{
			"roleName" : "Guest",
			"roleId" : "role3",
			"children" : [ {
				"roleName" : "subGuest1",
				"roleId" : "role11",
				"children" : []
			}, {
				"roleName" : "subGuest2",
				"roleId" : "role12",
				"collapsed" : true,
				"children" : [ {
					"roleName" : "subGuest2-1",
					"roleId" : "role121",
					"children" : [ {
						"roleName" : "subGuest2-1-1",
						"roleId" : "role1211",
						"children" : []
					}, {
						"roleName" : "subGuest2-1-2",
						"roleId" : "role1212",
						"children" : []
					} ]
				} ]
			} ]
		} ];

		// roleList1 to treeview
		$scope.roleList = $scope.roleList1;

	});
})