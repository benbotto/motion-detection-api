#!/bin/bash

for file in *.enc
do
  plain="${file%.enc}"

  echo "Decrypting \"${file}\" to \"${plain}\""

  ./decrypt.sh "${file}" > ${plain}
done

