param(
    [string]$Name = "",
    [string]$SnapshotRoot = "",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [Console]::OutputEncoding

function Get-FullPathValue {
    param([string]$Path)
    return [System.IO.Path]::GetFullPath($Path)
}

function ConvertTo-SafeName {
    param([string]$Value)

    $safe = $Value.Trim().ToLowerInvariant()
    foreach ($char in [System.IO.Path]::GetInvalidFileNameChars()) {
        $safe = $safe -replace [regex]::Escape([string]$char), "-"
    }
    $safe = $safe -replace "\s+", "-"
    $safe = $safe -replace "[^a-z0-9._-]+", "-"
    $safe = $safe -replace "-+", "-"
    $safe = $safe.Trim("-._")
    if ([string]::IsNullOrWhiteSpace($safe)) {
        return "snapshot"
    }
    return $safe
}

function Get-RelativePath {
    param(
        [string]$Root,
        [string]$Path
    )

    $rootWithSlash = (Get-FullPathValue $Root).TrimEnd("\") + "\"
    $fullPath = Get-FullPathValue $Path
    return $fullPath.Substring($rootWithSlash.Length).Replace("\", "/")
}

function Test-PathStartsWith {
    param(
        [string]$Path,
        [string]$Parent
    )

    $fullPath = (Get-FullPathValue $Path).TrimEnd("\")
    $fullParent = (Get-FullPathValue $Parent).TrimEnd("\")
    return $fullPath.Equals($fullParent, [System.StringComparison]::OrdinalIgnoreCase) -or
        $fullPath.StartsWith($fullParent + "\", [System.StringComparison]::OrdinalIgnoreCase)
}

function Get-PrototypeMarker {
    param([string]$ProjectRoot)

    $candidates = @(
        (Join-Path $ProjectRoot "sw.js"),
        (Join-Path $ProjectRoot "index.html"),
        (Join-Path $ProjectRoot "app.js")
    )

    foreach ($file in $candidates) {
        if (-not (Test-Path -LiteralPath $file)) {
            continue
        }

        $content = Get-Content -LiteralPath $file -Raw -Encoding UTF8
        if ($content -match "2\.1-[A-Za-z0-9._-]+-v\d+") {
            return $Matches[0]
        }
    }

    return "local-snapshot"
}

function Test-ExcludedItem {
    param(
        [System.IO.FileSystemInfo]$Item,
        [string]$ProjectRoot,
        [string]$SnapshotRoot
    )

    $excludedNames = @(".publish", ".git", "node_modules", ".cache", "_snapshot_meta")
    $excludedFiles = @("local-server.log", "local-server.err.log")

    if ($excludedNames -contains $Item.Name) {
        return $true
    }

    if ((-not $Item.PSIsContainer) -and ($excludedFiles -contains $Item.Name)) {
        return $true
    }

    if (Test-PathStartsWith -Path $Item.FullName -Parent $SnapshotRoot) {
        return $true
    }

    return $false
}

$projectRoot = Get-FullPathValue (Split-Path -Parent $MyInvocation.MyCommand.Path)
$projectName = Split-Path -Leaf $projectRoot

if ([string]::IsNullOrWhiteSpace($SnapshotRoot)) {
    $SnapshotRoot = Join-Path (Split-Path -Parent $projectRoot) ($projectName + "_verziok")
}

$snapshotRootFull = Get-FullPathValue $SnapshotRoot
if ($snapshotRootFull.TrimEnd("\").Equals($projectRoot.TrimEnd("\"), [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "A mentesi gyoker nem lehet maga a projektmappa: $snapshotRootFull"
}

$marker = Get-PrototypeMarker -ProjectRoot $projectRoot
if ($marker -match "(v\d+)") {
    $versionLabel = $Matches[1]
}
else {
    $versionLabel = "snapshot"
}

if ([string]::IsNullOrWhiteSpace($Name)) {
    $nameSource = ($marker -replace "^2\.1-", "") -replace "-v\d+$", ""
}
else {
    $nameSource = $Name
}

$safeName = ConvertTo-SafeName $nameSource
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$snapshotFolderName = "$stamp`_$versionLabel`_$safeName"
$snapshotDir = Join-Path $snapshotRootFull $snapshotFolderName

Write-Host "Helyi mentes elokeszitese"
Write-Host "Projekt: $projectRoot"
Write-Host "Mentesi gyoker: $snapshotRootFull"
Write-Host "Marker: $marker"
Write-Host "Celmappa: $snapshotDir"

if ($DryRun) {
    Write-Host "DryRun: nem keszult mentes."
    exit 0
}

if (Test-Path -LiteralPath $snapshotDir) {
    throw "A mentesi celmappa mar letezik: $snapshotDir"
}

New-Item -ItemType Directory -Path $snapshotDir -Force | Out-Null

$topLevelItems = Get-ChildItem -LiteralPath $projectRoot -Force
foreach ($item in $topLevelItems) {
    if (Test-ExcludedItem -Item $item -ProjectRoot $projectRoot -SnapshotRoot $snapshotRootFull) {
        continue
    }

    $destination = Join-Path $snapshotDir $item.Name
    Copy-Item -LiteralPath $item.FullName -Destination $destination -Recurse -Force
}

$metaDir = Join-Path $snapshotDir "_snapshot_meta"
New-Item -ItemType Directory -Path $metaDir -Force | Out-Null

$snapshotInfoPath = Join-Path $metaDir "SNAPSHOT_INFO.txt"
$snapshotInfo = @"
Hirbeszed helyi verzio mentese

Projekt: $projectName
Forras: $projectRoot
Mentes: $snapshotDir
Datum: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Marker: $marker
Nev: $safeName

Kihagyott elemek:
- .publish
- .git
- node_modules
- .cache
- _snapshot_meta
- local-server.log
- local-server.err.log

Megnyitas helyben:
1. Lepj be ebbe a mentett mappaba.
2. Indits kulon statikus szervert egy szabad porton, peldaul:
   python -m http.server 8010 --bind 127.0.0.1
3. Nyisd meg:
   http://127.0.0.1:8010/

Osszehasonlitas az aktualis projekttel:
.\helyi_osszehasonlitas.cmd -Snapshot "$snapshotFolderName"

Biztonsagos visszaallitas:
1. Eloszor keszits uj mentest az aktualis allapotrol.
2. Csak ezutan allits vissza fajlokat a kivalasztott snapshotbol.
3. A visszaallitas nem automatikus, hogy veletlenul ne irjon felul munkat.
"@
Set-Content -LiteralPath $snapshotInfoPath -Value $snapshotInfo -Encoding UTF8

$manifestPath = Join-Path $metaDir "SNAPSHOT_MANIFEST.tsv"
$manifestRows = New-Object System.Collections.Generic.List[string]
$manifestRows.Add("Path`tSize`tLastWriteTimeUtc`tSHA256")

$snapshotFiles = Get-ChildItem -LiteralPath $snapshotDir -Recurse -Force -File |
    Where-Object { -not (Test-PathStartsWith -Path $_.FullName -Parent $metaDir) } |
    Sort-Object FullName

foreach ($file in $snapshotFiles) {
    $relativePath = Get-RelativePath -Root $snapshotDir -Path $file.FullName
    $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash
    $manifestRows.Add("$relativePath`t$($file.Length)`t$($file.LastWriteTimeUtc.ToString("o"))`t$hash")
}

Set-Content -LiteralPath $manifestPath -Value $manifestRows -Encoding UTF8

Write-Host ""
Write-Host "Helyi mentes elkeszult:"
Write-Host $snapshotDir
Write-Host ""
Write-Host "Osszehasonlitas:"
Write-Host ".\helyi_osszehasonlitas.cmd -Snapshot `"$snapshotFolderName`""
