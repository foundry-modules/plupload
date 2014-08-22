all: join-script-files modularize-script minify-script create-script-folder copy-moxie

include ../../build/modules.mk

MODULE = plupload2
MODULARIZE_OPTIONS =
SOURCE_SCRIPT_FOLDER = js
SOURCE_SCRIPT_FILE_PREFIX =
SOURCE_SCRIPT_FILES = js/moxie.js \
	js/plupload.dev.js

copy-moxie:
	cp js/Moxie.swf ${TARGET_SCRIPT_FOLDER}/Moxie.swf
	cp js/Moxie.xap ${TARGET_SCRIPT_FOLDER}/Moxie.xap