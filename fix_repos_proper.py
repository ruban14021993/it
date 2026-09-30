import os
import re

REPOS_DIR = "backend/app/repositories"

for filename in os.listdir(REPOS_DIR):
    if filename.startswith("admin_") and filename.endswith(".py"):
        filepath = os.path.join(REPOS_DIR, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # We will just rewrite the _query method cleanly.
        model_name = re.search(r'class Admin([A-Za-z]+)Repository:', content).group(1)
        if model_name == 'ProductCategory':
            model = 'ProductCategory'
        elif model_name == 'TrainingProgram':
            model = 'TrainingProgram'
        else:
            model = model_name
            
        content = re.sub(r'def _query\(self\):.*?\)[\n\s]+async def list_all',
                         f'def _query(self):\n        return select({model})\n\n    async def list_all',
                         content, flags=re.DOTALL)
        
        with open(filepath, "w") as f:
            f.write(content)
print("Repositories properly cleaned.")
