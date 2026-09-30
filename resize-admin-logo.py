with open("frontend/components/admin/AdminShell.tsx", "r") as f:
    code = f.read()
code = code.replace('className="relative h-8 w-40"', 'className="relative h-10 w-48"')
with open("frontend/components/admin/AdminShell.tsx", "w") as f:
    f.write(code)
