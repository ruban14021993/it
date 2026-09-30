import re

for filename in ["frontend/components/public/layout/SiteHeader.tsx", "frontend/components/public/layout/SiteFooter.tsx"]:
    with open(filename, "r") as f:
        code = f.read()
    code = code.replace(" Sparkles,", "")
    code = code.replace(", Sparkles", "")
    code = code.replace(" Sparkles", "")
    with open(filename, "w") as f:
        f.write(code)
