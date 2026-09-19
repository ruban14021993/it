industries_data = [
    ("Healthcare", "healthcare", 1),
    ("Banking & Finance", "banking-finance", 2),
    ("E-commerce", "e-commerce", 3),
    ("Manufacturing", "manufacturing", 4),
    ("Telecommunication", "telecommunication", 5),
    ("Education", "education", 6),
    ("Public Services", "public-services", 7),
    ("Energy", "energy", 8),
    ("Hospitality", "hospitality", 9),
    ("Real Estate", "real-estate", 10),
    ("Autonomous Vehicle", "autonomous-vehicle", 11),
    ("Logistics", "logistics", 12),
]

with open("frontend/lib/content/industries.ts", "w") as f:
    f.write('import type { IndustryListItem } from "@/lib/types";\n\nexport const MOCK_ALL_INDUSTRIES: IndustryListItem[] = [\n')
    for name, slug, order in industries_data:
        f.write('  {\n')
        f.write(f'    id: "ind-{slug}",\n')
        f.write(f'    name: "{name}",\n')
        f.write(f'    slug: "{slug}",\n')
        f.write(f'    short_description: null,\n')
        f.write(f'    image: null,\n')
        f.write(f'    is_active: true,\n')
        f.write(f'    display_order: {order},\n')
        f.write('  },\n')
    f.write('];\n')
