import os
import re
import subprocess

# 1. Read index.html and find all used assets
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

used_assets = set()
matches = re.findall(r'assets/[^\'"\s]+', content)
for match in matches:
    clean_path = match.split("'")[0].split('"')[0].split(')')[0]
    used_assets.add(clean_path)

# Also check for root images
root_images = ['mic.png', 'shapes.png', 'sphere.png']
for img in root_images:
    if img in content:
        used_assets.add(img)

print(f"Found {len(used_assets)} unique assets referenced in index.html")

# 2. Get all tracked files
try:
    # Use core.quotepath=false to get clean UTF-8 paths
    result = subprocess.run(['git', '-c', 'core.quotepath=false', 'ls-files'], capture_output=True, text=True, check=True)
    tracked_files = result.stdout.splitlines()
except subprocess.CalledProcessError as e:
    print(f"Error running git ls-files: {e}")
    tracked_files = []

print(f"Currently tracking {len(tracked_files)} files in total")

# 3. Find unused files and untrack them
unused_count = 0
for file_path in tracked_files:
    # Skip code files and git files
    if file_path in ['index.html', 'style.css', 'script.js', '.gitignore', 'cleanup.py']:
        continue
    
    if file_path.startswith('assets/'):
        if file_path not in used_assets:
            print(f"Untracking unused asset: {file_path}")
            subprocess.run(['git', 'rm', '--cached', file_path])
            unused_count += 1
    elif file_path in root_images:
        if file_path not in used_assets:
            print(f"Untracking unused root image: {file_path}")
            subprocess.run(['git', 'rm', '--cached', file_path])
            unused_count += 1

print(f"Total unused assets untracked: {unused_count}")
print("Done!")
