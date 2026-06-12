param([string]$m = "")
& (Join-Path $PSScriptRoot "tools\push-if-build.ps1") -Message $m
