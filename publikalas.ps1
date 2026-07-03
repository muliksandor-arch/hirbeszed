param(
  [switch]$DryRun,
  [switch]$RetryDeployment,
  [switch]$SkipWait,
  [switch]$OpenSystemBrowser,
  [string]$Message = "",
  [string]$RemoteUrl = "https://github.com/muliksandor-arch/hirbeszed.git",
  [string]$PagesUrl = "https://muliksandor-arch.github.io/hirbeszed/",
  [string]$AuthorName = "muliksandor-arch",
  [string]$AuthorEmail = "muliksandor@keepbiz.com",
  [int]$WaitTimeoutSeconds = 240
)

$ErrorActionPreference = "Stop"

function Write-Step($Text) {
  Write-Host ""
  Write-Host "== $Text ==" -ForegroundColor Cyan
}

function Require-File($Path) {
  if (!(Test-Path -LiteralPath $Path)) {
    throw "Hianyzo fajl: $Path"
  }
}

function Get-GitPath {
  $BundledGit = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
  if (Test-Path -LiteralPath $BundledGit) {
    return $BundledGit
  }

  $PathGit = Get-Command git -ErrorAction SilentlyContinue
  if ($null -ne $PathGit) {
    return $PathGit.Source
  }

  throw "Git nem talalhato."
}

function Get-AppVersion($Root) {
  $IndexPath = Join-Path $Root "index.html"
  Require-File $IndexPath
  $Index = Get-Content -Raw -LiteralPath $IndexPath
  $Version = [regex]::Match($Index, '<meta\s+name="app-version"\s+content="([^"]+)"')
  if (!$Version.Success) {
    throw "Nem talalom az app-version meta sort az index.html fajlban."
  }
  return $Version.Groups[1].Value
}

function Get-AssetMarker($Root) {
  $IndexPath = Join-Path $Root "index.html"
  $Index = Get-Content -Raw -LiteralPath $IndexPath
  $Marker = [regex]::Match($Index, '\?v=([^"]+)')
  if (!$Marker.Success) {
    throw "Nem talalom az asset verziojelolot az index.html fajlban."
  }
  return $Marker.Groups[1].Value
}

function Invoke-Git {
  param(
    [string]$Git,
    [string[]]$GitArgs,
    [string]$WorkDir
  )

  if ($DryRun) {
    Write-Host "DRY-RUN git $($GitArgs -join ' ')" -ForegroundColor DarkYellow
    return @()
  }

  Push-Location $WorkDir
  try {
    & $Git @GitArgs
    if ($LASTEXITCODE -ne 0) {
      throw "Git parancs hibat adott: git $($GitArgs -join ' ')"
    }
  } finally {
    Pop-Location
  }
}

function Get-GitOutput {
  param(
    [string]$Git,
    [string[]]$GitArgs,
    [string]$WorkDir
  )

  Push-Location $WorkDir
  try {
    $Output = & $Git @GitArgs
    if ($LASTEXITCODE -ne 0) {
      throw "Git parancs hibat adott: git $($GitArgs -join ' ')"
    }
    return $Output
  } finally {
    Pop-Location
  }
}

function Ensure-PublishRepo($Git, $Root, $Publish, $RemoteUrl) {
  $PublishParent = Split-Path -Parent $Publish
  if (!(Test-Path -LiteralPath $PublishParent)) {
    New-Item -ItemType Directory -Path $PublishParent -Force | Out-Null
  }

  if (Test-Path -LiteralPath (Join-Path $Publish ".git")) {
    Write-Host "Meglevo .publish git repo hasznalata."
    Invoke-Git -Git $Git -GitArgs @("remote", "set-url", "origin", $RemoteUrl) -WorkDir $Publish
    Invoke-Git -Git $Git -GitArgs @("fetch", "origin", "main") -WorkDir $Publish
    Invoke-Git -Git $Git -GitArgs @("checkout", "-B", "main", "origin/main") -WorkDir $Publish
    return
  }

  if (Test-Path -LiteralPath $Publish) {
    $ResolvedPublish = (Resolve-Path $Publish).Path
    $ResolvedRoot = (Resolve-Path $Root).Path
    if (!$ResolvedPublish.StartsWith($ResolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "Nem biztonsagos publish utvonal: $ResolvedPublish"
    }
    if (!$DryRun) {
      Remove-Item -LiteralPath $Publish -Recurse -Force
    }
  }

  Write-Host "Uj .publish git repo letrehozasa klonozassal."
  if ($DryRun) {
    Write-Host "DRY-RUN git clone $RemoteUrl $Publish" -ForegroundColor DarkYellow
    return
  }

  & $Git clone $RemoteUrl $Publish
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Klonozas nem sikerult, ures repo inicializalasa." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Publish -Force | Out-Null
    Invoke-Git -Git $Git -GitArgs @("init") -WorkDir $Publish
    Invoke-Git -Git $Git -GitArgs @("checkout", "-B", "main") -WorkDir $Publish
    Invoke-Git -Git $Git -GitArgs @("remote", "add", "origin", $RemoteUrl) -WorkDir $Publish
  } else {
    Invoke-Git -Git $Git -GitArgs @("checkout", "-B", "main", "origin/main") -WorkDir $Publish
  }
}

function Sync-PublishFiles($Root, $Publish) {
  $ResolvedRoot = (Resolve-Path $Root).Path
  $ResolvedPublish = (Resolve-Path $Publish).Path
  if (!$ResolvedPublish.StartsWith($ResolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Nem biztonsagos publish utvonal: $ResolvedPublish"
  }

  Write-Host "Publikalasi munkamappa tisztitasa."
  if (!$DryRun) {
    Get-ChildItem -Force -LiteralPath $Publish |
      Where-Object { $_.Name -ne ".git" } |
      ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force }
  }

  $Exclude = @(".publish", ".preview", ".agents", ".git", "tmp-screenshots")
  Write-Host "Aktualis projektfajlok masolasa .publish ala."
  Get-ChildItem -Force -LiteralPath $Root |
    Where-Object { $Exclude -notcontains $_.Name } |
    ForEach-Object {
      if ($DryRun) {
        Write-Host "DRY-RUN copy $($_.Name)" -ForegroundColor DarkYellow
      } else {
        Copy-Item -LiteralPath $_.FullName -Destination $Publish -Recurse -Force
      }
    }
}

function Wait-GitHubActions($HeadSha, $WaitTimeoutSeconds) {
  if ($SkipWait) {
    Write-Host "Actions varakozas kihagyva."
    return $null
  }

  $Headers = @{ "User-Agent" = "Hirbeszed-Publisher" }
  $RunsUrl = "https://api.github.com/repos/muliksandor-arch/hirbeszed/actions/runs?branch=main&per_page=10"
  $Started = Get-Date
  Write-Host "GitHub Actions varakozas erre a commitra: $HeadSha"

  while (((Get-Date) - $Started).TotalSeconds -lt $WaitTimeoutSeconds) {
    $Runs = Invoke-RestMethod -Uri $RunsUrl -Headers $Headers -TimeoutSec 30
    $Run = $Runs.workflow_runs | Where-Object { $_.head_sha -eq $HeadSha } | Select-Object -First 1
    if ($null -ne $Run) {
      Write-Host ("Run {0}: {1} / {2}" -f $Run.id, $Run.status, $Run.conclusion)
      if ($Run.status -eq "completed") {
        if ($Run.conclusion -ne "success") {
          throw "GitHub Pages deploy sikertelen: $($Run.html_url)"
        }
        return $Run
      }
    } else {
      Write-Host "Varakozas az Actions futas megjelenesere..."
    }
    Start-Sleep -Seconds 5
  }

  throw "GitHub Actions varakozasi ido lejart."
}

function Verify-LiveSite($PagesUrl, $AppVersion, $AssetMarker) {
  $Url = $PagesUrl.TrimEnd("/") + "/?cachebust=publish-script-$AppVersion-" + [DateTimeOffset]::Now.ToUnixTimeSeconds()
  Write-Host "Elo oldal ellenorzese: $Url"
  $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
  $Content = $Response.Content

  $FoundVersion = [regex]::Match($Content, '<meta\s+name="app-version"\s+content="([^"]+)"')
  if (!$FoundVersion.Success) {
    throw "Az elo oldalon nem talalhato app-version meta."
  }
  if ($FoundVersion.Groups[1].Value -ne $AppVersion) {
    throw "Az elo oldal verzioja nem egyezik. Elo: $($FoundVersion.Groups[1].Value), vart: $AppVersion"
  }
  if (!$Content.Contains($AssetMarker)) {
    throw "Az elo oldalon nem talalhato az asset marker: $AssetMarker"
  }

  Write-Host "Elo oldal rendben: app-version=$AppVersion, asset=$AssetMarker" -ForegroundColor Green
  if ($OpenSystemBrowser) {
    Start-Process $Url
  }
  return $Url
}

Write-Step "Hirbeszed GitHub publikacio"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = (Resolve-Path $Root).Path
$Publish = Join-Path $Root ".publish\hirbeszed-full-repo"
$Git = Get-GitPath
$AppVersion = Get-AppVersion $Root
$AssetMarker = Get-AssetMarker $Root

Write-Host "Projekt: $Root"
Write-Host "Publish: $Publish"
Write-Host "Git: $Git"
Write-Host "App version: $AppVersion"
Write-Host "Asset marker: $AssetMarker"

Require-File (Join-Path $Root ".github\workflows\pages.yml")
Require-File (Join-Path $Root ".nojekyll")
Require-File (Join-Path $Root "index.html")
Require-File (Join-Path $Root "app.js")
Require-File (Join-Path $Root "styles.css")
Require-File (Join-Path $Root "sw.js")

Write-Step "Publikalasi repo elokeszitese"
Ensure-PublishRepo $Git $Root $Publish $RemoteUrl

Write-Step "Fajlok szinkronizalasa"
Sync-PublishFiles $Root $Publish

Write-Step "Git beallitas es commit"
Invoke-Git -Git $Git -GitArgs @("config", "user.name", $AuthorName) -WorkDir $Publish
Invoke-Git -Git $Git -GitArgs @("config", "user.email", $AuthorEmail) -WorkDir $Publish
Invoke-Git -Git $Git -GitArgs @("add", "-A") -WorkDir $Publish

$Status = Get-GitOutput -Git $Git -GitArgs @("status", "--short") -WorkDir $Publish
if ($Status) {
  Write-Host "Valtozasok:"
  $Status | ForEach-Object { Write-Host $_ }
} else {
  Write-Host "Nincs fajlvaltozas."
}

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "chore: publish prototype $AppVersion"
}

if ($DryRun) {
  Write-Host "DRY-RUN: commit/push/verify kihagyva." -ForegroundColor Yellow
  exit 0
}

if ($Status) {
  Invoke-Git -Git $Git -GitArgs @("commit", "-m", $Message) -WorkDir $Publish
} elseif ($RetryDeployment) {
  Invoke-Git -Git $Git -GitArgs @("commit", "--allow-empty", "-m", "chore: retry prototype $AppVersion pages deploy") -WorkDir $Publish
} else {
  Write-Host "Nincs mit publikalni. Ha csak uj Pages futast akarsz, hasznald: -RetryDeployment" -ForegroundColor Yellow
  exit 0
}

$HeadSha = (Get-GitOutput -Git $Git -GitArgs @("rev-parse", "HEAD") -WorkDir $Publish | Select-Object -First 1).Trim()

Write-Step "Push GitHubra"
Invoke-Git -Git $Git -GitArgs @("push", "origin", "main") -WorkDir $Publish

Write-Step "GitHub Pages varakozas"
$Run = Wait-GitHubActions $HeadSha $WaitTimeoutSeconds

Write-Step "Elo oldal ellenorzese"
$LiveUrl = Verify-LiveSite $PagesUrl $AppVersion $AssetMarker

Write-Host ""
Write-Host "Publikalas kesz." -ForegroundColor Green
Write-Host "Commit: $HeadSha"
if ($Run) {
  Write-Host "Actions: $($Run.html_url)"
}
Write-Host "Elo link: $LiveUrl"
