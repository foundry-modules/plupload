$.Controller("plupload",

	{
        defaultOptions: {
            "{uploader}" : ".uploader",
            "{uploadButton}" : ".uploadButton",
            "{uploadDropsite}" : ".uploadDropsite",

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

            self.uploadButtonMain = 
                self.uploadButton(":first")
                    .attr('id', uploadButtonId);

            settings.browse_button = uploadButtonId;

            // Create upload drop site identifier
            var uploadDropsiteId = $.uid("uploadDropsite-");

            if (self.uploadDropsite().length > 0) {

                self.uploadDropsite()
                            .attr('id', uploadDropsiteId);

                settings.drop_element = uploadDropsiteId;
            }

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

        "{uploadButton} click": function(uploadButton) {

            if (uploadButton[0]==self.uploadButtonMain[0]) return;

            self.uploadButtonMain.click();
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

            var response;

            try {

                response = eval('('+data.response+')');

            } catch(e) {

                response = {
                    type: "error",
                    message: "Unable to parse server response.",
                    data: data
                };
            }

            // If response type is an error, trigger FileError event
            if (response.type=="error") {

                self.uploader.trigger("FileError", [up, file, response]);

                // This ensure the FileUploaded event
                // doesn't get triggered anymore.
                return false;
            }

            // Trigger FileUploaded event with the following params
            return [up, file, response];
        },

        "plupload::Error": function(up, error) {

            try { console.log('plupload Error: ', up, error); } catch(e) {};
        }

	}}

);
