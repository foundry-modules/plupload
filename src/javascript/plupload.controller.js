$.Controller("plupload",

	{
		defaultOptions: {
			"{uploadButton}" : ".uploadButton",

			settings: {
				runtimes: "html5, html4",
				url: $.indexUrl,
				max_file_count: 20,
				unique_names: true
			}
		}
	},

	// Instance properties
	function(self) { return {

		init: function() {

			var settings = self.options.settings;

			// Create upload container identifier
			var uploadContainerId = $.uid("uploadContainer-");

            self.element
                .attr('id', uploadContainerId);

			settings.container = uploadContainerId;

			// Create upload button identifier
			var uploadButtonId = $.uid("uploadButton-");

			self.uploadButton()
				.attr('id', uploadButtonId);

			settings.browse_button = uploadButtonId;

            // Decide where the uploader events are binded to
            self.uploader = $(self.uploader()[0] || self.element);

			// Create new plupload instance
            self.plupload = new $.plupload.Uploader(settings);

            // @rule: Init() plupload before you bind except for postInit
            self.plupload.bind('PostInit', function() {
                self.eventHandler("PostInit", $.makeArray(arguments));
            });

            self.plupload.init();

            var events = [
                "BeforeUpload",
                "ChunkUploaded",
                "Destroy",
                "Error",
                "FilesAdded",
                "FilesRemoved",
                "FileUploaded",
                "Init",
                "QueueChanged",
                "Refresh",
                "StateChanged",
                "UploadComplete",
                "UploadFile",
                "UploadProgress"
            ];

            $.each(events, function(i, eventName) {

                self.plupload.bind(eventName, function(){
                    self.eventHandler(eventName, $.makeArray(arguments));
                });
            });
		},

        eventHandler: function(eventName, args) {

            var eventHandler = self["plupload::"+eventName],

                elementEventHandler = (function(){
                    var eventHandlers = (self.uploader.data("events") || {})[eventName];
                    return (eventHandlers) ? eventHandlers[0].handler : undefined;
                })(),

                elementEventHandlerArgs;

            if ($.isFunction(eventHandler)) {

                elementEventHandlerArgs = eventHandler.apply(self, args);
            }

            if (elementEventHandlerArgs!==false) {

                self.uploader.trigger(eventName, elementEventHandlerArgs || args);
            }
        },

        "plupload::FileUploaded": function(up, file, data, handler) {

            var response, error;

            try {

                response = eval('('+data.response+')');

            } catch(e) {

                error = {
                    code: -100,
                    message: 'Invalid response from server.',
                    data: data
                };

                self.uploader.trigger("FileError", [up, file, error]);
            }

            return (error) ? false : [up, file, response];
        },

        "plupload::Error": function(up, error) {

            try { console.log('plupload Error: ', up, error); } catch(e) {};
        }

	}}

);
