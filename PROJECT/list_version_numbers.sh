#!/bin/bash

root_folder=("citybikes")

files=("js/bikemap.js" "index.html" "css/bikemap.css")

for i in ${files[@]}
do
	printf "%s " $i
	grep "Version: " $root_folder/$i
	echo ""
done
