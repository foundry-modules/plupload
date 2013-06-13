all: join insert-version finalize modularize minify

include ../../build/modules.mk

MODULE = plupload
MODULARIZE_OPTIONS = -jq

SOURCE_DIR = src/javascript
SOURCE_FILES = ${SOURCE_DIR}/plupload.js\
	${SOURCE_DIR}/plupload.html4.js\
	${SOURCE_DIR}/plupload.html5.js\
	${SOURCE_DIR}/plupload.controller.js

PLUPLOAD_VERSION = $(shell cat version)
INSERT_VERSION = sed "s/@@version@@/${PLUPLOAD_VERSION}/"

insert-version:
	cat ${SOURCE_FILE} | ${INSERT_VERSION} > ${RAW_FILE}
