import re

# 1. Update Admin Login
with open("frontend/app/admin/login/page.tsx", "r") as f:
    code = f.read()

# Make sure Image is imported
if "import Image" not in code:
    code = code.replace('import { useState } from "react";', 'import { useState } from "react";\nimport Image from "next/image";')

# Replace the heading with the logo
code = code.replace(
'''<h2 className="text-center text-3xl font-extrabold text-gray-900">
            InfinityMind Tech
          </h2>''',
'''<div className="flex justify-center mb-6">
            <div className="relative h-16 w-64">
              <Image src="/images/logo.jpg" alt="InfinityMind Tech" fill className="object-contain" priority />
            </div>
          </div>
          <h2 className="text-center text-xl font-bold text-gray-900">
            Admin Portal
          </h2>'''
)
with open("frontend/app/admin/login/page.tsx", "w") as f:
    f.write(code)


# 2. Update Admin Shell
with open("frontend/components/admin/AdminShell.tsx", "r") as f:
    shell = f.read()

if "import Image" not in shell:
    shell = shell.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Image from "next/image";')

shell = shell.replace(
'''<div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">InfinityMind Tech</span>
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Admin Portal</span>
          </div>''',
'''<div className="flex flex-col bg-white px-2 py-1 rounded">
            <div className="relative h-8 w-40">
              <Image src="/images/logo.jpg" alt="InfinityMind Tech" fill className="object-contain object-left" />
            </div>
          </div>'''
)
with open("frontend/components/admin/AdminShell.tsx", "w") as f:
    f.write(shell)
