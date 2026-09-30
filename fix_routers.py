import os

ROUTERS_DIR = "backend/app/routers/admin"

MAPPING = {
    "category.py": {
        "import": "from app.schemas.admin_crud import CategoryResponse",
        "old_schema": "ProductCategoryOut",
        "new_schema": "CategoryResponse"
    },
    "product.py": {
        "import": "from app.schemas.admin_crud import ProductResponse",
        "old_schema": "ProductDetailOut",
        "new_schema": "ProductResponse"
    },
    "service.py": {
        "import": "from app.schemas.admin_crud import ServiceResponse",
        "old_schema": "ServiceDetailOut",
        "new_schema": "ServiceResponse"
    },
    "industry.py": {
        "import": "from app.schemas.admin_crud import IndustryResponse",
        "old_schema": "IndustryDetailOut",
        "new_schema": "IndustryResponse"
    },
    "training.py": {
        "import": "from app.schemas.admin_crud import TrainingResponse",
        "old_schema": "TrainingDetailOut",
        "new_schema": "TrainingResponse"
    }
}

for filename, mapping in MAPPING.items():
    filepath = os.path.join(ROUTERS_DIR, filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    content = content.replace(f", {mapping['old_schema']}", "")
    content = content.replace(f" {mapping['old_schema']}", "")
    content = content.replace(mapping['old_schema'], mapping['new_schema'])
    
    # Add the new import after the other schemas import
    if "from app.schemas import" in content:
        lines = content.split("\n")
        new_lines = []
        for line in lines:
            new_lines.append(line)
            if line.startswith("from app.schemas import"):
                new_lines.append(mapping['import'])
        content = "\n".join(new_lines)
        
    with open(filepath, "w") as f:
        f.write(content)

print("Routers updated.")
