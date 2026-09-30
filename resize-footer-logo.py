with open("frontend/components/public/layout/SiteFooter.tsx", "r") as f:
    code = f.read()
code = code.replace('className="relative h-12 w-56"', 'className="relative h-16 w-72"')
with open("frontend/components/public/layout/SiteFooter.tsx", "w") as f:
    f.write(code)
