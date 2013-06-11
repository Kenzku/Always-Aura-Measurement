#!/usr/bin/env bash
# use node wamp.js to start a server
messageLength=$1
for i in `seq 1 10`
do
	phantomjs client.js $messageLength >> "data_$messageLength.txt"
done