param(
    [string]$Snapshot = "",
    [switch]$Latest,
    [string]$SnapshotRoot = ""
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [Console]::OutputEncoding

function Get-FullPathValue {
    param([string]$Path)
    return [System.IO.Path]::GetFullPath($Path)
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

function Test-ExcludedFile {
    param(
        [System.IO.FileInfo]$File,
        [string]$Root,
        [string]$SnapshotRoot
    )

    $relative = Get-RelativePath -Root $Root -Path $File.FullName
    $segments = $relative -split "/"
    $excludedDirs = @(".publish", ".git", "node_modules", ".cache", "_snapshot_meta")
    $excludedFiles = @("local-server.log", "local-server.err.log")

    foreach ($dir in $excludedDirs) {
        if ($segments -contains $dir) {
            return $true
        }
    }

    if ($excludedFiles -contains $File.Name) {
        return $true
    }

    $rootIsInsideSnapshotRoot = Test-PathStartsWith -Path $Root -Parent $SnapshotRoot
    if ((-not $rootIsInsideSnapshotRoot) -and (Test-PathStartsWith -Path $File.FullName -Parent $SnapshotRoot)) {
        return $true
    }

    return $false
}

function Get-FileMap {
    param(
        [string]$Root,
        [string]$SnapshotRoot
    )

    $map = @{}
    $files = Get-ChildItem -LiteralPath $Root -Recurse -Force -File |
        Where-Object { -not (Test-ExcludedFile -File $_ -Root $Root -SnapshotRoot $SnapshotRoot) }

    foreach ($file in $files) {
        $relative = Get-RelativePath -Root $Root -Path $file.FullName
        $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash
        $map[$relative] = [pscustomobject]@{
            Path = $relative
            Hash = $hash
            Size = $file.Length
        }
    }

    return $map
}

function Show-AvailableSnapshots {
    param([string]$SnapshotRoot)

    if (-not (Test-Path -LiteralPath $SnapshotRoot)) {
        Write-Host "Meg nincs mentesi gyoker: $SnapshotRoot"
        return
    }

    Write-Host "Elerheto helyi mentesek:"
    Get-ChildItem -LiteralPath $SnapshotRoot -Directory |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 10 |
        ForEach-Object { Write-Host "- $($_.Name)" }
}

$projectRoot = Get-FullPathValue (Split-Path -Parent $MyInvocation.MyCommand.Path)
$projectName = Split-Path -Leaf $projectRoot

if ([string]::IsNullOrWhiteSpace($SnapshotRoot)) {
    $SnapshotRoot = Join-Path (Split-Path -Parent $projectRoot) ($projectName + "_verziok")
}

$snapshotRootFull = Get-FullPathValue $SnapshotRoot

if ($Latest -or [string]::IsNullOrWhiteSpace($Snapshot)) {
    if (-not (Test-Path -LiteralPath $snapshotRootFull)) {
        Show-AvailableSnapshots -SnapshotRoot $snapshotRootFull
        exit 1
    }

    $latestSnapshot = Get-ChildItem -LiteralPath $snapshotRootFull -Directory |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($null -eq $latestSnapshot) {
        Show-AvailableSnapshots -SnapshotRoot $snapshotRootFull
        exit 1
    }

    $snapshotDir = $latestSnapshot.FullName
}
else {
    if ([System.IO.Path]::IsPathRooted($Snapshot)) {
        $snapshotDir = Get-FullPathValue $Snapshot
    }
    else {
        $snapshotDir = Join-Path $snapshotRootFull $Snapshot
    }
}

if (-not (Test-Path -LiteralPath $snapshotDir)) {
    Write-Host "Nem talalhato a megadott mentes: $snapshotDir"
    Show-AvailableSnapshots -SnapshotRoot $snapshotRootFull
    exit 1
}

Write-Host "Helyi mentes osszehasonlitasa"
Write-Host "Aktualis projekt: $projectRoot"
Write-Host "Mentes: $snapshotDir"
Write-Host ""

$currentMap = Get-FileMap -Root $projectRoot -SnapshotRoot $snapshotRootFull
$snapshotMap = Get-FileMap -Root $snapshotDir -SnapshotRoot $snapshotRootFull

$allPaths = New-Object System.Collections.Generic.HashSet[string]
foreach ($key in $currentMap.Keys) {
    [void]$allPaths.Add($key)
}
foreach ($key in $snapshotMap.Keys) {
    [void]$allPaths.Add($key)
}

$differences = New-Object System.Collections.Generic.List[object]
foreach ($path in ($allPaths | Sort-Object)) {
    $inCurrent = $currentMap.ContainsKey($path)
    $inSnapshot = $snapshotMap.ContainsKey($path)

    if ($inCurrent -and -not $inSnapshot) {
        $differences.Add([pscustomobject]@{ Status = "UJ"; Path = $path })
        continue
    }

    if (-not $inCurrent -and $inSnapshot) {
        $differences.Add([pscustomobject]@{ Status = "TOROLT"; Path = $path })
        continue
    }

    if ($currentMap[$path].Hash -ne $snapshotMap[$path].Hash) {
        $differences.Add([pscustomobject]@{ Status = "MODOSULT"; Path = $path })
    }
}

if ($differences.Count -eq 0) {
    Write-Host "Nincs elteres az aktualis projekt es a mentes kozott."
    exit 0
}

Write-Host "Elteresek:"
$differences | Format-Table -AutoSize
exit 2
