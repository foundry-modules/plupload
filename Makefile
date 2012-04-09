include ../../build/modules.mk

MODULE = plupload
FILENAME = ${MODULE}.js
RAWFILE = ${DEVELOPMENT_DIR}/plupload.raw.js

SOURCE_DIR = src/javascript
SOURCE = ${SOURCE_DIR}/plupload.js\
	${SOURCE_DIR}/plupload.html4.js\
	${SOURCE_DIR}/plupload.html5.js\
	${SOURCE_DIR}/plupload.controller.js

PRODUCTION = ${PRODUCTION_DIR}/${FILENAME}
DEVELOPMENT = ${DEVELOPMENT_DIR}/${FILENAME}

PLUPLOAD_VERSION = $(shell cat version)
INSERT_VERSION = sed "s/@@version@@/${PLUPLOAD_VERSION}/"

all:
	cat ${SOURCE} | ${INSERT_VERSION} > ${RAWFILE}
	${MODULARIZE} -jq -n "${MODULE}" ${RAWFILE} > ${DEVELOPMENT}
	${UGLIFYJS} ${DEVELOPMENT} > ${PRODUCTION}
	rm -fr ${RAWFILE}
