#!/bin/bash

HERO_ADDRESS='0xc5751e6f92fe2bae9d1f165f31d0bf014c06788c21ad4d079bc8579327ffc593'
ITEM_OBJECT_ID='0x92e4c02b39ac3598efdddde2a050728e283b65307c986bbd1bcb087ffa6a0ff3'
ITEM='purchased'

ACCOUNT_SID=""
AUTH_TOKEN=""
FROM_NUMBER="+"
TO_NUMBER="+"

#SUI_RPC_HOST="https://fullnode.devnet.sui.io/"

#response=$(sui client call --package $PACKAGE --module purchase --function add_item --args $GAMEINFO 2 --gas-budget 10000000)

# 결과 출력
message="Player: $HERO_ADDRESS Item: $ITEM_OBJECT_ID $ITEM."
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  --data-urlencode "From=$FROM_NUMBER" \
  --data-urlencode "To=$TO_NUMBER" \
  --data-urlencode "Body=$message" \
  -u "$ACCOUNT_SID:$AUTH_TOKEN"
