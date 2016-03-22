#!/bin/bash

CITY_ID=$1
BACKEND_API=${QCON2016_API:-http://localhost:8080/api}

curl -H "Content-type: application/json" -X POST -d "{ cityId: '/cities/$CITY_ID' }" $BACKEND_API/orders; echo
