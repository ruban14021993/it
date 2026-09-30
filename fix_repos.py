import os
import re

REPOS_DIR = "backend/app/repositories"

for filename in os.listdir(REPOS_DIR):
    if filename.startswith("admin_") and filename.endswith(".py"):
        filepath = os.path.join(REPOS_DIR, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # Replace _query() method to just return select(Model)
        content = re.sub(r'def _query\(self\):.*?return select\([a-zA-Z]+\).*?\)', 
                         lambda m: m.group(0).split('.options')[0], 
                         content, flags=re.DOTALL)
        
        with open(filepath, "w") as f:
            f.write(content)
print("Repositories cleaned.")
