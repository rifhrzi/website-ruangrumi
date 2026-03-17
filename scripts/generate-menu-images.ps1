$root = Join-Path (Get-Location) "public/images/menu"
$files = @(
  "latte.jpg",
  "cappuccino.jpg",
  "espresso.jpg",
  "macchiato.jpg",
  "affogato.jpg",
  "mocha.jpg",
  "mango-smoothie.jpg",
  "choco-frappe.jpg",
  "berry-lemonade.jpg",
  "matcha.jpg",
  "earl-grey.jpg",
  "chamomile.jpg",
  "croissant.jpg",
  "danish.jpg",
  "cinnamon-roll.jpg",
  "pasta.jpg",
  "sandwich.jpg",
  "rice-bowl.jpg",
  "tiramisu.jpg",
  "cheesecake.jpg",
  "fries.jpg",
  "nachos.jpg"
)

$colors = @(
  "#D6C3A5",
  "#C7AF8A",
  "#BFA784",
  "#D9C2A0",
  "#CBB38A"
)

Add-Type -AssemblyName System.Drawing

New-Item -ItemType Directory -Force -Path $root | Out-Null

Get-ChildItem -File $root |
  Where-Object { $_.Name -in @("test.jpg", "one.jpg", "two.jpg") } |
  Remove-Item -Force

for ($i = 0; $i -lt $files.Count; $i++) {
  $fileName = $files[$i]
  $baseName = [IO.Path]::GetFileNameWithoutExtension($fileName)
  $title = [System.Globalization.CultureInfo]::InvariantCulture.TextInfo.ToTitleCase(
    ($baseName -replace "-", " ")
  )
  $path = Join-Path $root $fileName

  $bitmap = New-Object System.Drawing.Bitmap 1200, 900
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($colors[$i % $colors.Count]))

  $softBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
  $graphics.FillEllipse($softBrush, -80, -40, 420, 420)
  $graphics.FillEllipse($softBrush, 760, 120, 300, 300)

  $brandFont = New-Object System.Drawing.Font "Arial", 20, ([System.Drawing.FontStyle]::Bold)
  $titleFont = New-Object System.Drawing.Font "Arial", 40, ([System.Drawing.FontStyle]::Bold)
  $subFont = New-Object System.Drawing.Font "Arial", 18
  $darkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 58, 41, 27))
  $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 58, 41, 27))

  $graphics.DrawString("RUANG RUMI", $brandFont, $darkBrush, 88, 88)
  $graphics.DrawString($title, $titleFont, $darkBrush, (New-Object System.Drawing.RectangleF 88, 210, 860, 220))
  $graphics.DrawString("Menu image placeholder", $subFont, $mutedBrush, 92, 470)

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)

  $mutedBrush.Dispose()
  $darkBrush.Dispose()
  $subFont.Dispose()
  $titleFont.Dispose()
  $brandFont.Dispose()
  $softBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
