#!/bin/bash

response=$(sui client call --package 0x6b9510bef5fe832a7d026d1f672634ac7857be1845c4120a580b5b78364f86cc --module purchase --function add_item --args 0x49f34f0f2f7c1d69bcad8f82baba04f2188e4b340998ef83cddf9dc6cf834089 2 --gas-budget 10000000)

sender1=$(echo "$result" | awk -F'"sender\": String\("' '{print $2}' | awk -F'"' '{print $1}')
sender2=$(echo "$result" | awk -F'"sender\": String\("' '{print $3}' | awk -F'"' '{print $1}')

echo "Sender 1: $sender1"
echo "Sender 2: $sender2"
