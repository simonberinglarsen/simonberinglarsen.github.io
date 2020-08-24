function Is-Valid-Npi($npi) {
    $i = $npi.Length
    if ($i -eq 15 -And $npi.IndexOf("80840") -eq 0) {
        $sum = 0
    }
    elseif ($i -eq 10) {
        $sum = 24
    }
    else {
        return 0
    }
    $j = 0
    while ($i -ne 0) {
        $tmp = [int]$npi.Substring($i - 1, 1)
        if ( ($j % 2) -ne 0) {
            $tmp = $tmp * 2
            if ($tmp -gt 9) {
                $tmp = $tmp - 10;
                $tmp = $tmp + 1;
            }
        }
        $sum = $sum + $tmp

        $j = $j + 1
        $i = $i - 1
    }
    if (($sum % 10) -eq 0 ) {
        return 1
    }
    else {
        return 0
    }
}

function Check-Digit-Npi($npi9) {
    $i = $npi9.Length;
    if (($i -eq 14) -And ($npi9.IndexOf("80840") -eq 0)) {
        $sum = 0;
    }
    elseif ($i -eq 9) {
        $sum = 24;
    }
    else {
        return "!";
    }
                
    $j = 1;
    while ($i -ne 0) {
        $tmp = [int]$npi9.Substring($i - 1, 1);
        if (($j % 2) -ne 0) {
            $tmp = $tmp * 2
            if ($tmp -gt 9) {
                $tmp = $tmp - 10;
                $tmp = $tmp + 1;
            }
        }
        $j = $j + 1
        $sum = $sum + $tmp;
        $i = $i - 1
    }
    $charCode = ((10 - ($sum % 10)) % 10 + 48);
    $char = [char]$charCode; 
    return $char
}

function Generate-Npi {
    $randomNumber = [string]((Get-Random -Maximum 900000000) + 100000000)
    $asdf = Check-Digit-Npi $randomNumber
    "$randomNumber$asdf"
    return 
}


##
## This is how to use the functions
##
$testRuns = 50
Write-host "Running 50 tests to check the program"
while ($testRuns -ne 0) {
    $generatedCode = Generate-Npi 
    Write-host "generated code = $generatedCode";
    $res = Is-Valid-Npi $generatedCode
    if ($res -eq 1) {
        Write-host "code is valid";
    }
    else {
        Write-host "code is invalid";
    }
    $testRuns = $testRuns - 1
}



