#!/bin/bash

ID=$1
CITY_ID=$2
BACKEND_API=${QCON2016_API:-http://localhost:8080/api}

curl -H "Content-type: application/json" -X PATCH -d "{ cityId: '/cities/$CITY_ID' }" $BACKEND_API/orders/$ID; echo
