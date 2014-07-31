all: build-plupload modularize-script minify-script

include ../../build/modules.mk

MODULE = plupload2
MODULARIZE_OPTIONS = -jq -d "moxie"
SOURCE_SCRIPT_FOLDER = js
SOURCE_SCRIPT_FILE_PREFIX =
SOURCE_SCRIPT_FILE_NAME = plupload.dev

build-plupload:
	jake mkjs