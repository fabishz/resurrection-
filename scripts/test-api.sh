#!/bin/bash

# RSS Renaissance - API Testing Script
# Test the /api/ingest and /api/summarize endpoints

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

API_URL="${API_URL:-http://localhost:3000}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}RSS Renaissance API Tests${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Ingest RSS Feed
echo -e "${YELLOW}Test 1: Ingest RSS Feed${NC}"
echo -e "POST ${API_URL}/api/ingest\n"

INGEST_RESPONSE=$(curl -s -X POST "${API_URL}/api/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "feedUrl": "https://hnrss.org/frontpage"
  }')

echo "$INGEST_RESPONSE" | jq '.'

FEED_ID=$(echo "$INGEST_RESPONSE" | jq -r '.feedId')
FIRST_ITEM_ID=$(echo "$INGEST_RESPONSE" | jq -r '.items[0].id')

if [ "$FEED_ID" != "null" ]; then
  echo -e "${GREEN}✓ Feed ingested successfully${NC}\n"
else
  echo -e "${RED}✗ Failed to ingest feed${NC}\n"
  exit 1
fi

# Test 2: Get Feed Details
echo -e "${YELLOW}Test 2: Get Feed Details${NC}"
echo -e "GET ${API_URL}/api/ingest?feedId=${FEED_ID}\n"

FEED_RESPONSE=$(curl -s "${API_URL}/api/ingest?feedId=${FEED_ID}")

echo "$FEED_RESPONSE" | jq '.'

if [ "$(echo "$FEED_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Feed details retrieved${NC}\n"
else
  echo -e "${RED}✗ Failed to get feed details${NC}\n"
fi

# Test 3: Summarize by Article ID
echo -e "${YELLOW}Test 3: Summarize by Article ID${NC}"
echo -e "POST ${API_URL}/api/summarize\n"

SUMMARIZE_RESPONSE=$(curl -s -X POST "${API_URL}/api/summarize" \
  -H "Content-Type: application/json" \
  -d "{
    \"articleId\": \"${FIRST_ITEM_ID}\",
    \"maxLength\": 150
  }")

echo "$SUMMARIZE_RESPONSE" | jq '.'

if [ "$(echo "$SUMMARIZE_RESPONSE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Article summarized successfully${NC}\n"
else
  echo -e "${RED}✗ Failed to summarize article${NC}\n"
fi

# Test 4: Summarize Custom Content
echo -e "${YELLOW}Test 4: Summarize Custom Content${NC}"
echo -e "POST ${API_URL}/api/summarize\n"

CUSTOM_SUMMARIZE=$(curl -s -X POST "${API_URL}/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial intelligence is transforming the technology industry. Machine learning models are becoming more sophisticated and accessible. Companies are investing heavily in AI research and development. The future of AI looks promising with many exciting applications on the horizon.",
    "title": "The Future of AI",
    "maxLength": 100
  }')

echo "$CUSTOM_SUMMARIZE" | jq '.'

if [ "$(echo "$CUSTOM_SUMMARIZE" | jq -r '.success')" == "true" ]; then
  echo -e "${GREEN}✓ Custom content summarized${NC}\n"
else
  echo -e "${RED}✗ Failed to summarize custom content${NC}\n"
fi

# Test 5: Error Handling - Invalid URL
echo -e "${YELLOW}Test 5: Error Handling - Invalid URL${NC}"
echo -e "POST ${API_URL}/api/ingest\n"

ERROR_RESPONSE=$(curl -s -X POST "${API_URL}/api/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "feedUrl": "not-a-valid-url"
  }')

echo "$ERROR_RESPONSE" | jq '.'

if [ "$(echo "$ERROR_RESPONSE" | jq -r '.success')" == "false" ]; then
  echo -e "${GREEN}✓ Error handled correctly${NC}\n"
else
  echo -e "${RED}✗ Error not handled${NC}\n"
fi

# Test 6: Error Handling - Missing Parameters
echo -e "${YELLOW}Test 6: Error Handling - Missing Parameters${NC}"
echo -e "POST ${API_URL}/api/summarize\n"

MISSING_PARAMS=$(curl -s -X POST "${API_URL}/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "$MISSING_PARAMS" | jq '.'

if [ "$(echo "$MISSING_PARAMS" | jq -r '.success')" == "false" ]; then
  echo -e "${GREEN}✓ Missing parameters handled${NC}\n"
else
  echo -e "${RED}✗ Missing parameters not handled${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All tests completed!${NC}"
echo -e "${BLUE}========================================${NC}\n"
