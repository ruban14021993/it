with open("frontend/app/(public)/products/category/[slug]/page.tsx", "r") as f:
    code = f.read()
code = code.replace("products={categoryProducts as any}", "products={categoryProducts}")
with open("frontend/app/(public)/products/category/[slug]/page.tsx", "w") as f:
    f.write(code)
