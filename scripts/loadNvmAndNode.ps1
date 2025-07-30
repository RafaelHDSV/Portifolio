$env:NVM_DIR="$env:USERPROFILE\.nvm"
. "$env:NVM_DIR\nvm.ps1"
if (Test-Path .nvmrc) {
    $NODE_VERSION = Get-Content .nvmrc
    nvm use $NODE_VERSION -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -ne 0) {
        nvm install $NODE_VERSION
    }
} else {
    nvm use default
}
