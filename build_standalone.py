import os
import base64
import re

dir_path = r'D:\Apps\AM'
with open(os.path.join(dir_path, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(dir_path, 'style.css'), 'r', encoding='utf-8') as f:
    css = f.read()

with open(os.path.join(dir_path, 'script.js'), 'r', encoding='utf-8') as f:
    js = f.read()

# Helper to convert asset path to base64 data URI
def get_data_uri(asset_rel):
    asset_full = os.path.join(dir_path, asset_rel.replace('/', os.sep))
    if os.path.exists(asset_full):
        ext = os.path.splitext(asset_full)[1].lower()
        mime = 'image/jpeg' if ext in ['.jpg', '.jpeg'] else 'image/png' if ext == '.png' else 'image/svg+xml'
        with open(asset_full, 'rb') as img_f:
            b64 = base64.b64encode(img_f.read()).decode('utf-8')
        return f"data:{mime};base64,{b64}"
    return asset_rel

# Convert script sticker references
def js_asset_replacer(match):
    rel_path = match.group(1)
    uri = get_data_uri(rel_path)
    return f"'{uri}'"

js_bundled = re.sub(r"'(assets/[^']+)'", js_asset_replacer, js)

# Replace stylesheet link with inline <style>
html = re.sub(r'<link rel="stylesheet" href="style\.css">', f'<style>\n{css}\n</style>', html)

# Replace script tag with inline bundled script
html = re.sub(r'<script src="script\.js"></script>', f'<script>\n{js_bundled}\n</script>', html)

# Replace HTML src references with data URIs
def html_src_replacer(match):
    rel_path = match.group(1)
    uri = get_data_uri(rel_path)
    return f'src="{uri}"'

html = re.sub(r'src="(assets/[^"]+)"', html_src_replacer, html)

out_path = os.path.join(dir_path, 'invitation_standalone.html')
with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.write(html)

print(f"Generated standalone HTML file: {out_path} ({len(html)} bytes)")
