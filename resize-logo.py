with open("frontend/components/public/layout/SiteHeader.tsx", "r") as f:
    code = f.read()
code = code.replace("shadow-sm h-16", "shadow-sm h-20")
code = code.replace('className="relative h-10 w-48"', 'className="relative h-14 w-64 lg:h-16 lg:w-72"')
with open("frontend/components/public/layout/SiteHeader.tsx", "w") as f:
    f.write(code)
