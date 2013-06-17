all: join-script-files insert-version finalize-script modularize-script minify-script

include ../../build/modules.mk

MODULE = plupload
MODULARIZE_OPTIONS = -jq

SOURCE_SCRIPT_FOLDER = src/javascript
SOURCE_SCRIPT_FILES = ${SOURCE_SCRIPT_FOLDER}/plupload.js\
	${SOURCE_SCRIPT_FOLDER}/plupload.html4.js\
	${SOURCE_SCRIPT_FOLDER}/plupload.html5.js\
	${SOURCE_SCRIPT_FOLDER}/plupload.controller.js

PLUPLOAD_VERSION = $(shell cat version)
INSERT_VERSION = sed "s/@@version@@/${PLUPLOAD_VERSION}/"

insert-version:
	cat ${TARGET_SCRIPT_UNCOMPRESSED} | ${INSERT_VERSION} > ${TARGET_SCRIPT_RAW}
