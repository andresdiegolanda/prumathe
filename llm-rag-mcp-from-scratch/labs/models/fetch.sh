#!/bin/sh
# Downloads the course models into the models volume and checks each SHA256 against manifest.txt.
# A model already verified is not downloaded again; an interrupted download resumes where it was.
set -eu
cd /models

verify() { echo "$2  $1" | sha256sum -c --status; }

while read -r file sha size url; do
  case "$file" in ''|'#'*) continue ;; esac
  if [ -f "$file" ] && [ "$(stat -c %s "$file")" = "$size" ]; then
    if [ -f "$file.verified" ] && [ "$(cat "$file.verified")" = "$sha" ]; then
      echo "OK    $file, already verified"
      continue
    fi
    echo "CHECK $file"
    if verify "$file" "$sha"; then
      echo "$sha" > "$file.verified"
      echo "OK    $file, sha256 $sha"
      continue
    fi
    echo "BAD   $file: its SHA256 does not match the manifest; downloading it again"
    rm -f "$file" "$file.verified"
  fi
  echo "GET   $file, $((size / 1000000)) MB"
  if [ ! -f "$file.part" ] || [ "$(stat -c %s "$file.part")" -lt "$size" ]; then
    curl -fL --retry 3 -C - --progress-bar -o "$file.part" "$url"
  fi
  if verify "$file.part" "$sha"; then
    mv "$file.part" "$file"
    echo "$sha" > "$file.verified"
    echo "OK    $file, sha256 $sha"
  else
    rm -f "$file.part"
    echo "FAIL  $file: its SHA256 does not match the manifest. Run the command again." >&2
    exit 1
  fi
done < /course/models/manifest.txt
echo "Models ready in the models volume."
