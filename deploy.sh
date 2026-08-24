#!/bin/bash
set -e

# מגיע מג'נקינס; ברירות מחדל לבדיקה ידנית
BUILD_NUMBER="${BUILD_NUMBER:-manual}"
COMMIT_SHA="${COMMIT_SHA:-local}"

# 1. מי הצבע הפעיל כרגע, ומי החדש
if docker ps --format '{{.Names}}' | grep -q '^web-blue$'; then
  ACTIVE="blue"; NEW="green"
else
  ACTIVE="green"; NEW="blue"
fi
echo ">>> Active: web-$ACTIVE | Deploying: web-$NEW (build $BUILD_NUMBER)"

# 2. בניית ה-image החדש עם חותמת הבנייה
docker build \
  --build-arg BUILD_NUMBER="$BUILD_NUMBER" \
  --build-arg COMMIT_SHA="$COMMIT_SHA" \
  -t "web-service:$BUILD_NUMBER" ./web

# 3. הרצת הגרסה החדשה לצד הישנה (הישנה ממשיכה לשרת!)
docker rm -f "web-$NEW" 2>/dev/null || true
docker run -d --name "web-$NEW" --network app-network \
  -e PORT=8080 -e API_URL=http://api:3000 \
  "web-service:$BUILD_NUMBER"

# 4. בדיקת בריאות מול הגרסה החדשה (עד ~20 שניות)
echo ">>> Health checking web-$NEW..."
HEALTHY=0
for i in $(seq 1 10); do
  if docker exec "web-$NEW" wget -qO- http://localhost:8080/health 2>/dev/null | grep -q '"status":"ok"'; then
    HEALTHY=1; break
  fi
  sleep 2
done

# 5. עברה → מעבירים תעבורה ומכבים את הישנה | נכשלה → מוחקים החדשה, הישנה חיה, אדום
if [ "$HEALTHY" -eq 1 ]; then
  echo ">>> Health OK. Switching nginx -> web-$NEW"
  sed "s/web-[a-z]*:8080/web-$NEW:8080/" nginx/default.conf > /tmp/default.conf
  docker cp /tmp/default.conf nginx-proxy:/etc/nginx/conf.d/default.conf
  docker kill -s HUP nginx-proxy
  cp /tmp/default.conf nginx/default.conf
  docker rm -f "web-$ACTIVE" 2>/dev/null || true
  echo ">>> Done. web-$NEW is LIVE, web-$ACTIVE removed."
else
  echo ">>> Health FAILED. Rolling back — removing web-$NEW, keeping web-$ACTIVE."
  docker rm -f "web-$NEW" 2>/dev/null || true
  exit 1
fi