$BASE = "http://localhost:5000/api"
$script:pass = 0
$script:fail = 0

function Check($label, $cond) {
  if ($cond) { Write-Host "  [PASS] $label" -ForegroundColor Green; $script:pass++ }
  else        { Write-Host "  [FAIL] $label" -ForegroundColor Red;   $script:fail++ }
}

function GetStatus($uri, $method, $body, $hdrs) {
  try {
    $p = @{ Uri=$uri; Method=$method; Headers=$hdrs; ErrorAction="Stop" }
    if ($body) { $p.Body=$body; $p.ContentType="application/json" }
    Invoke-RestMethod @p | Out-Null
    return 200
  } catch {
    return [int]$_.Exception.Response.StatusCode.value__
  }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  TaskFlow Backend API Tests" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Admin Login
Write-Host "1. POST /api/auth/login (admin)" -ForegroundColor Yellow
try {
  $r = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -Body '{"email":"admin@test.com","password":"admin123"}' -ContentType "application/json"
  Check "Token returned"           ($null -ne $r.token)
  Check "Role is admin"            ($r.user.role -eq "admin")
  Check "No password in response"  ($null -eq $r.user.password)
  $adminToken = $r.token
} catch {
  Write-Host "  [FAIL] Admin login error: $_" -ForegroundColor Red; $script:fail++
}

# 2. User Login
Write-Host ""
Write-Host "2. POST /api/auth/login (user1)" -ForegroundColor Yellow
try {
  $r2 = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -Body '{"email":"user1@test.com","password":"user123"}' -ContentType "application/json"
  Check "Token returned"           ($null -ne $r2.token)
  Check "Role is user"             ($r2.user.role -eq "user")
  Check "No password in response"  ($null -eq $r2.user.password)
  $userToken = $r2.token
  $userEmail = $r2.user.email
} catch {
  Write-Host "  [FAIL] User1 login error: $_" -ForegroundColor Red; $script:fail++
}

# 3. Wrong password
Write-Host ""
Write-Host "3. POST /api/auth/login (wrong creds, expect 401)" -ForegroundColor Yellow
$s = GetStatus "$BASE/auth/login" "POST" '{"email":"admin@test.com","password":"wrong"}' @{}
Check "401 on bad password" ($s -eq 401)

# 4. Admin GET tasks
Write-Host ""
Write-Host "4. GET /api/tasks as admin (expect all 5)" -ForegroundColor Yellow
try {
  $ah = @{ Authorization = "Bearer $adminToken" }
  $at = Invoke-RestMethod -Uri "$BASE/tasks" -Headers $ah
  Check "5 tasks returned"                 ($at.data.Count -eq 5)
  Check "assignedTo populated with name"   ($null -ne $at.data[0].assignedTo.name)
  Check "createdBy populated with name"    ($null -ne $at.data[0].createdBy.name)
  Check "No password in assignedTo"        ($null -eq $at.data[0].assignedTo.password)
  $otherTaskId = ($at.data | Where-Object { $_.assignedTo.email -ne "user1@test.com" } | Select-Object -First 1)._id
} catch {
  Write-Host "  [FAIL] Admin tasks error: $_" -ForegroundColor Red; $script:fail++
}

# 5. User GET tasks (filtered)
Write-Host ""
Write-Host "5. GET /api/tasks as user1 (expect only assigned tasks)" -ForegroundColor Yellow
try {
  $uh = @{ Authorization = "Bearer $userToken" }
  $ut = Invoke-RestMethod -Uri "$BASE/tasks" -Headers $uh
  Check "Fewer than 5 tasks returned"     ($ut.data.Count -lt 5)
  $wrongOwner = ($ut.data | Where-Object { $_.assignedTo.email -ne "user1@test.com" }).Count
  Check "All tasks belong to user1"       ($wrongOwner -eq 0)
  Write-Host "    -> user1 sees $($ut.data.Count) task(s)"
} catch {
  Write-Host "  [FAIL] User tasks error: $_" -ForegroundColor Red; $script:fail++
}

# 6. User POST task (expect 403)
Write-Host ""
Write-Host "6. POST /api/tasks as user1 (expect 403)" -ForegroundColor Yellow
$uh2 = @{ Authorization = "Bearer $userToken" }
$s2 = GetStatus "$BASE/tasks" "POST" '{"title":"Illegal Task","assignedTo":"000000000000000000000001"}' $uh2
Check "403 on user create task" ($s2 -eq 403)

# 7. User PUT task not assigned to them (expect 403)
Write-Host ""
Write-Host "7. PUT /api/tasks/:id (user1 updates task not theirs, expect 403)" -ForegroundColor Yellow
if ($otherTaskId) {
  $uh3 = @{ Authorization = "Bearer $userToken" }
  $s3 = GetStatus "$BASE/tasks/$otherTaskId" "PUT" '{"status":"completed"}' $uh3
  Check "403 on unowned task update" ($s3 -eq 403)
} else {
  Write-Host "  [SKIP] Could not find a task not assigned to user1" -ForegroundColor Yellow
}

# 8. No password anywhere in task list
Write-Host ""
Write-Host "8. Password field not leaked in any task response" -ForegroundColor Yellow
try {
  $ah4 = @{ Authorization = "Bearer $adminToken" }
  $all = Invoke-RestMethod -Uri "$BASE/tasks" -Headers $ah4
  $leak = ($all.data | Where-Object { $_.assignedTo.password -ne $null -or $_.createdBy.password -ne $null }).Count
  Check "Zero password leaks in task data" ($leak -eq 0)
} catch {
  Write-Host "  [FAIL] Leak check error: $_" -ForegroundColor Red; $script:fail++
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
$color = if ($script:fail -eq 0) { "Green" } else { "Red" }
Write-Host "  PASSED: $($script:pass)  |  FAILED: $($script:fail)" -ForegroundColor $color
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
