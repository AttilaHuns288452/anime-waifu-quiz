#!/usr/bin/env python
"""Remove duplicate entries from characters.ts"""
import re

with open('lib/characters.ts', 'r') as f:
    lines = f.readlines()

# Find all id lines with line numbers
id_lines = []
for i, line in enumerate(lines):
    m = re.search(r'id: "([^"]+)"', line)
    if m:
        id_lines.append((i, m.group(1)))

# Find duplicates (second+ occurrences)
ids_seen = set()
duplicate_ids = []
for line_no, id_val in id_lines:
    if id_val in ids_seen:
        duplicate_ids.append((line_no, id_val))
    else:
        ids_seen.add(id_val)

print(f"Total entries: {len(id_lines)}")
print(f"Unique IDs: {len(ids_seen)}")
print(f"Duplicate IDs found: {len(duplicate_ids)}")

# For each duplicate, find the full block it belongs to
# Walk backwards to find the opening '{' and forwards to find the closing '},'
ranges_to_remove = []
for line_no, id_val in duplicate_ids:
    # Find start of block (going back to opening brace or '},')
    start = line_no
    while start > 0:
        start -= 1
        line_stripped = lines[start].strip()
        if line_stripped == '{':
            break
        if line_stripped == '},':
            start += 1
            break
    
    # Find end of block (going forward to closing '},')
    end = line_no
    while end < len(lines):
        line_stripped = lines[end].strip()
        if line_stripped.startswith('},'):
            end += 1  # Include this line
            break
        end += 1
    
    # Verify this is the SECOND occurrence by checking the id
    block_text = ''.join(lines[start:end])
    id_match = re.search(r'id: "([^"]+)"', block_text)
    if id_match:
        block_id = id_match.group(1)
        # Check if there's an earlier occurrence of this same ID
        # by scanning from the beginning
        if block_id in {v for _, v in duplicate_ids}:
            ranges_to_remove.append((start, end))
            print(f"Will remove: {id_val} at lines {start+1}-{end}")

# Remove in reverse order
for start, end in sorted(ranges_to_remove, reverse=True):
    del lines[start:end]

# Write back
with open('lib/characters.ts', 'w') as f:
    f.writelines(lines)

new_id_lines = 0
for line in lines:
    if re.search(r'id: "([^"]+)"', line):
        new_id_lines += 1

print(f"\nNew total entries: {new_id_lines}")
print(f"Removed {len(ranges_to_remove)} duplicate entries")

# Verify no duplicate IDs remain
ids = [m.group(1) for m in re.finditer(r'id: "([^"]+)"', ''.join(lines))]
from collections import Counter
remaining_dupes = {k: v for k, v in Counter(ids).items() if v > 1}
if remaining_dupes:
    print(f"WARNING: {len(remaining_dupes)} duplicate IDs still remain!")
    for k, v in sorted(remaining_dupes.items()):
        print(f"  {k}: {v} times")
else:
    print("All duplicate IDs removed successfully!")
