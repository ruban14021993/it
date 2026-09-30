import sys

file_path = 'frontend/components/admin/AdminShell.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """<div className="relative h-8 w-36">
              <Image src="/images/logo.jpg" alt="InfinityMind Tech" fill sizes="150px" className="object-contain object-left" />
            </div>"""

replacement = """<Image src="/images/logo.jpg" alt="InfinityMind Tech" width={144} height={32} className="h-8 w-auto object-contain" />"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
