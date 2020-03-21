#!/bin/bash

SVC=$(cat secrets/collabshop19.json)
bin/server-darwin --svc=$SVC >>server.log &
echo $! >server.pid
