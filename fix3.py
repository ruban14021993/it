with open("frontend/lib/api/public.ts", "r") as f:
    code = f.read()
code = code.replace(".map((b, i) =>", ".map((b: any, i: any) =>")
with open("frontend/lib/api/public.ts", "w") as f:
    f.write(code)
