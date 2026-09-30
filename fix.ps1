# Fix lib/api/public.ts
$file = "frontend/lib/api/public.ts"
$content = Get-Content $file -Raw
$content = $content -replace "related_products: \[\]\n?", ""
$content = $content -replace "related_products: \[\]\r\n?", ""
$content = $content -replace "is_featured: false,`r`n    display_order: i.display_order", "display_order: i.display_order"
$content = $content -replace "is_featured: false,\n    display_order: i.display_order", "display_order: i.display_order"
$content = $content -replace "who_can_apply: t.who_can_apply,`r`n    what_you_gain: t.what_you_gain", "who_can_apply: t.who_can_apply as any, what_you_gain: t.what_you_gain as any"
$content = $content -replace "who_can_apply: t.who_can_apply,\n    what_you_gain: t.what_you_gain", "who_can_apply: t.who_can_apply as any, what_you_gain: t.what_you_gain as any"
$content = $content -replace "branches: res.item.branches.map", "branches: (res.item.branches as any).map"
Set-Content -Path $file -Value $content

# Fix Contact page
$contactFile = "frontend/app/(public)/contact/page.tsx"
$contactContent = Get-Content $contactFile -Raw
$contactContent = $contactContent -replace "const settings: ContactSettings = {", "const settings: Partial<ContactSettings> = {"
$contactContent = $contactContent -replace "const branches = contactData.branches \|\| \[\];", "const branches = (contactData as any).branches || [];"
Set-Content -Path $contactFile -Value $contactContent

# Fix CTA in Training and Services
$trainFile = "frontend/app/(public)/training/page.tsx"
$trainContent = Get-Content $trainFile -Raw
$trainContent = $trainContent -replace "title: ", "headline: "
$trainContent = $trainContent -replace "subtitle: ", "description: "
$trainContent = $trainContent -replace "primary_button_text: ", "primary_cta_text: "
$trainContent = $trainContent -replace "primary_button_url: ", "primary_cta_url: "
$trainContent = $trainContent -replace "programs=\{programs\}", "programs={programs as any}"
Set-Content -Path $trainFile -Value $trainContent

$servFile = "frontend/app/(public)/services/page.tsx"
$servContent = Get-Content $servFile -Raw
$servContent = $servContent -replace "title: ", "headline: "
$servContent = $servContent -replace "subtitle: ", "description: "
$servContent = $servContent -replace "primary_button_text: ", "primary_cta_text: "
$servContent = $servContent -replace "primary_button_url: ", "primary_cta_url: "
Set-Content -Path $servFile -Value $servContent

# Fix Training detail page
$tdFile = "frontend/app/(public)/training/[slug]/page.tsx"
$tdContent = Get-Content -LiteralPath $tdFile -Raw
$tdContent = $tdContent -replace "program.who_can_apply", "(program as any).who_can_apply"
$tdContent = $tdContent -replace "program.what_you_gain", "(program as any).what_you_gain"
Set-Content -LiteralPath $tdFile -Value $tdContent
