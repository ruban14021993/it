import os

# Fix lib/api/public.ts
with open("frontend/lib/api/public.ts", "r") as f:
    code = f.read()
code = code.replace("    related_products: []\n", "")
code = code.replace("    related_products: []\r\n", "")
with open("frontend/lib/api/public.ts", "w") as f:
    f.write(code)

# Fix industries detail metadata
with open("frontend/app/(public)/industries/[slug]/page.tsx", "r") as f:
    code = f.read()
code = code.replace("title: `${industry.name} Industry Solutions`,", "title: industry ? `${industry.name} Industry Solutions` : \"Industry Not Found\",")
with open("frontend/app/(public)/industries/[slug]/page.tsx", "w") as f:
    f.write(code)

# Fix products detail metadata
with open("frontend/app/(public)/products/[slug]/page.tsx", "r") as f:
    code = f.read()
code = code.replace("title: product.name,", "title: product ? product.name : \"Product Not Found\",")
code = code.replace("description: product.short_description || undefined,", "description: product?.short_description || undefined,")
with open("frontend/app/(public)/products/[slug]/page.tsx", "w") as f:
    f.write(code)

# Fix services detail metadata
with open("frontend/app/(public)/services/[slug]/page.tsx", "r") as f:
    code = f.read()
code = code.replace("title: service.name,", "title: service ? service.name : \"Service Not Found\",")
code = code.replace("description: service.short_description || undefined,", "description: service?.short_description || undefined,")
with open("frontend/app/(public)/services/[slug]/page.tsx", "w") as f:
    f.write(code)
