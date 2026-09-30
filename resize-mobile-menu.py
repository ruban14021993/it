with open("frontend/components/public/layout/SiteHeader.tsx", "r") as f:
    code = f.read()
code = code.replace("top-16", "top-20")
code = code.replace("100vh-4rem", "100vh-5rem")
with open("frontend/components/public/layout/SiteHeader.tsx", "w") as f:
    f.write(code)
