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

			// Create new plupload instance
            self.plupload = new $.plupload.Uploader(settings);

            self.plupload.bind('PostInit', self['plupload::PostInit']);

            // @rule: Init() plupload before you bind except for postInit
            self.plupload.init();

            // Remap plupload event bindings
            for (binder in self)
            {
                if (!binder.match("plupload::")) continue;

                eventName = binder.replace("plupload::", '');

                self.plupload.bind(eventName, self[binder]);
            }
		},

        start: function() {

            self.plupload.start();
        },

        stop: function() {

            self.plupload.stop();

            self.complete();
        },

        complete: function() {

        },

        "plupload::PostInit": function(up) {

        },

        "plupload::FilesAdded": function(up, files) {

            self.element.trigger("filesAdded", arguments);
        },

        "plupload::BeforeUpload": function(up, file) {

            self.element.trigger("beforeUpload", arguments);
        },

        "plupload::UploadFile": function(up, file) {

            self.element.trigger("uploadFile", arguments);
        },

        "plupload::ChunkUploaded": function(up, file) {

            self.element.trigger("chunkUploaded", arguments);
        },

        "plupload::UploadProgress": function(up, file) {

            self.element.trigger("uploadProgress", arguments);
        },

        "plupload::FileUploaded": function(up, file, data) {

            var response, error;

            try {

                response = eval('('+data.response+')');

            } catch(e) {

                error = {
                    code: -100,
                    message: 'Invalid response from server.',
                    file: file,
                    data: data
                };

                self["plupload::Error"].apply(self, [up, error]);
            }

            if (!error) {
                self.element.trigger("fileUploaded", [up, file, response]);
            }
        },

        "plupload::Error": function(up, error) {

            try { console.log('plupload Error: ', up, error); } catch(e) {};

            self.element.trigger("uploadError", [up, error]);
        },

        "plupload::UploadComplete": function() {

            self.complete();

            self.element.trigger("uploadComplete", arguments);
        }

	}}

);
