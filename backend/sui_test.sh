#!/bin/bash

HERO_ADDRESS='0xc5751e6f92fe2bae9d1f165f31d0bf014c06788c21ad4d079bc8579327ffc593'
ITEM_OBJECT_ID='0xdd235ff1e61e1d6f204eb567d1b4b5eca752dc2ce05d8bb23ccb82654f76c8ce'
ITEM='purchased'

ACCOUNT_SID="ACdcb3466cff2cb55fc81aecd61c634b9a"  # Twilio 계정 SID
AUTH_TOKEN="f9c5e9d08b76f5611f64f678444e5e38"    # Twilio 인증 토큰
FROM_NUMBER="+13613217376"  # Twilio에서 발송하는 전화번호
TO_NUMBER="+821057163717"   # 수신자 휴대폰 번호

#SUI_RPC_HOST="https://fullnode.devnet.sui.io/"

#response=$(sui client call --package $PACKAGE --module purchase --function add_item --args $GAMEINFO 2 --gas-budget 10000000)

# 결과 출력
message="Player: $HERO_ADDRESS Item: $ITEM_OBJECT_ID $ITEM."
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  --data-urlencode "From=$FROM_NUMBER" \
  --data-urlencode "To=$TO_NUMBER" \
  --data-urlencode "Body=$message" \
  -u "$ACCOUNT_SID:$AUTH_TOKEN"
