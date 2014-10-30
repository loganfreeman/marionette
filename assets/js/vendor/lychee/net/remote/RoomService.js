
lychee.define('lychee.net.remote.RoomService').exports(function(lychee, global) {

	var _userId  = 0;
	var _remotes = [];
	var _rooms   = [];

	var _createRoom = function(id, title) {

		_rooms[id] = {
			id:       id,
			title:    title,
			users:    [],
			messages: []
		};

	};


	var Class = function() {

		this.remote = null;

	};


	Class.prototype = {

		/*
		 * SERVICE API
		 */

		plug: function(remote) {

			this.remote = remote;
			_remotes.push(remote);

		},

		unplug: function() {

			if (this.remote !== null) {

				for (var r = 0, rl = _remotes.length; r < rl; r++) {
					if (_remotes[r] === this.remote) {
						_remotes.splice(r, 1);
						break;
					}
				}


				this.remote = null;

			}

		},

		getId: function() {
			return 'RoomService';
		},



		/*
		 * CUSTOM API
		 */

		enter: function(data) {

			if (data instanceof Object) {

				var roomId = typeof data.roomId === 'number' ? data.roomId : 0;
				var userId = typeof data.userId === 'string' ? data.userId : ('user-' + _userId++);


				if (_rooms[roomId] === undefined) {
					_createRoom(roomId, 'New Room (#' + _rooms.length + ')');
				}


				var room = _rooms[roomId];
				if (room.users.indexOf(userId) === -1) {

					room.users.push(userId);


					var response = {
						userId:   userId,
						roomId:   roomId,
						users:    room.users,
						title:    room.title,
						messages: room.messages
					};


					this.remote.send(response, {
						id:     this.getId(),
						method: 'update'
					});


					var oresponse = {
						roomId: roomId,
						users:  room.users
					};


					for (var r = 0, rl = _remotes.length; r < rl; r++) {

						if (_remotes[r] === this.remote) continue;

						_remotes[r].send(oresponse, {
							id:     this.getId(),
							method: 'update'
						});

					}

				} else {

					var response = {
						userId: userId,
						roomId: null
					};

					this.remote.send(response, {
						id:     this.getId(),
						method: 'update'
					});

				}

			}

		},

		leave: function(data) {

			if (data instanceof Object) {

				var roomId = typeof data.roomId === 'number' ? data.room : 0;
				var userId = typeof data.userId === 'string' ? data.user : null;


				if (userId !== null) {

					if (_rooms[roomId] !== undefined) {

						var room = _rooms[roomId];

						for (var u = 0, ul = room.users.length; u < ul; u++) {

							if (room.users[u] === userId) {
								room.users.splice(u, 1);
								ul--;
							}

						}


						if (room.users.length === 0) {
							delete _rooms[roomId];
						}

					}


					var response = {
						roomId: null,
						userId: userId
					};

					this.remote.send(response, {
						id:     this.getId(),
						method: 'update'
					});

				}

			}

		},

		message: function(data) {

			if (data instanceof Object) {

				var roomId  = typeof data.roomId === 'number'  ? data.roomId  : null;
				var userId  = typeof data.userId === 'string'  ? data.userId  : null;
				var message = typeof data.message === 'string' ? data.message : null;


				if (
					   roomId !== null
					&& userId !== null
					&& message !== null
				) {

					var room = _rooms[roomId];
					if (
						   room !== undefined
						&& room.users.indexOf(userId) !== -1
					) {

						var message = {
							user:    userId,
							time:    Date.now(),
							content: message
						};

						room.messages.push(message);


						// Update ALL remotes
						var response = {
							roomId:  roomId,
							message: message
						};


						for (var r = 0, rl = _remotes.length; r < rl; r++) {

							_remotes[r].send(response, {
								id:     this.getId(),
								method: 'update'
							});

						}

					}

				}

			}

		}

	};


	return Class;

});

