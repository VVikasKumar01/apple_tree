# Generates a 150-student CSV template for one academic year
# Distribution: Nursery A/B (25 each), LKG A/B (25 each), UKG A/B (25 each)

$year = "2025-26"
$header = "admission_number,student_name,student_aadhaar,gender,date_of_birth,blood_group,nationality,religion,caste,class_grade,section,academic_year,height_cm,weight_kg,father_name,father_aadhaar,father_mobile,father_occupation,mother_name,mother_aadhaar,mother_mobile,mother_occupation,primary_mobile,emergency_contact,email,permanent_address,correspondence_address"

$groups = @(
    @{ class = "Nursery"; section = "A"; start = 1;   count = 25 },
    @{ class = "Nursery"; section = "B"; start = 26;  count = 25 },
    @{ class = "LKG";     section = "A"; start = 51;  count = 25 },
    @{ class = "LKG";     section = "B"; start = 76;  count = 25 },
    @{ class = "UKG";     section = "A"; start = 101; count = 25 },
    @{ class = "UKG";     section = "B"; start = 126; count = 25 }
)

$lines = @($header)

foreach ($grp in $groups) {
    for ($i = 0; $i -lt $grp.count; $i++) {
        $num   = $grp.start + $i
        $admNo = "2025" + $num.ToString("D3")
        # Pre-fill admission number, class, section, year — rest left blank for user to fill
        $lines += "$admNo,,,,,,,,,$($grp.class),$($grp.section),$year,,,,,,,,,,,,,,,,"
    }
}

$outPath = Join-Path $PSScriptRoot "student_import_template_150.csv"
$lines | Set-Content -Path $outPath -Encoding UTF8
Write-Host "Generated $($lines.Count - 1) student rows -> $outPath"
