#!/usr/bin/env bash
# Importa prints e vídeos de depoimentos para apps/landing/public/media/quiz-evidence
set -euo pipefail

SRC="${1:-/home/gerson.moreira/Downloads/Imagens-20260606T003746Z-3-001/Imagens}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/apps/landing/public/media/quiz-evidence"

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g' | cut -c1-80
}

mkdir -p "$DEST/proof/faturamento" "$DEST/proof/notificacoes" "$DEST/proof/mencoes-erick" "$DEST/videos"

copy_category() {
  local src_dir="$1" dest_sub="$2" prefix="$3"
  local i=1
  find "$src_dir" -type f \( -iname '*.jpeg' -o -iname '*.jpg' -o -iname '*.png' \) | sort | while read -r f; do
    ext="${f##*.}"
    ext="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
    num=$(printf '%02d' "$i")
    cp "$f" "$DEST/proof/$dest_sub/${prefix}-${num}.${ext}"
    i=$((i + 1))
  done
}

copy_category "$SRC/Faturamento - 10 Vendas" "faturamento" "fat"
copy_category "$SRC/Notificações De Vendas" "notificacoes" "notif"
copy_category "$SRC/Mensões ao Erick" "mencoes-erick" "erick"

i=1
find "$SRC/Videos" -type f -iname '*.mp4' | sort | while read -r f; do
  base="$(basename "$f" .mp4)"
  slug="$(slugify "$base")"
  num=$(printf '%02d' "$i")
  cp "$f" "$DEST/videos/${num}-${slug}.mp4"
  i=$((i + 1))
done

echo "Importado em $DEST"
find "$DEST" -type f | wc -l
