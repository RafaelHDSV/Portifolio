nvm_auto_use() {
  if [ -f .nvmrc ]; then
    local NVMRC_NODE=$(cat .nvmrc)
    if [[ "$(nvm current)" != "v$NVMRC_NODE" ]]; then
      nvm use "$NVMRC_NODE" > /dev/null
    fi
  fi
}

cd() {
  builtin cd "$@" && nvm_auto_use
}
