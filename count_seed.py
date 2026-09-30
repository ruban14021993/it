import ast

with open('backend/seed.py', 'r', encoding='utf-8') as f:
    source = f.read()

tree = ast.parse(source)

for node in ast.walk(tree):
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name):
                if target.id in ['CATEGORIES', 'PRODUCTS', 'SERVICES', 'INDUSTRIES', 'TRAINING_PROGRAMS', 'BRANCHES']:
                    if isinstance(node.value, ast.List):
                        print(f"{target.id}: {len(node.value.elts)}")
