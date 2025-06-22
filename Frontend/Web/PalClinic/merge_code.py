import os

# Define your project root directory
project_root = '.'  # <-- Change this to your actual project path
output_file = 'merged_code.txt'
script_name = os.path.basename(__file__)  # Name of this script

# File extensions to include
allowed_extensions = ['.py', '.js', '.html', '.css', '.cpp', '.c', '.java', '.ts','.jsx']  # Modify as needed

# Folders to ignore
excluded_dirs = {'node_modules', '.git', '__pycache__'}

with open(output_file, 'w', encoding='utf-8') as outfile:
    for root, dirs, files in os.walk(project_root):
        # Exclude unwanted folders
        dirs[:] = [d for d in dirs if d not in excluded_dirs]

        for file in files:
            if file == script_name:
                continue  # Skip this script itself
            if any(file.endswith(ext) for ext in allowed_extensions):
                filepath = os.path.join(root, file)
                relative_path = os.path.relpath(filepath, project_root)
                outfile.write(f"\n--- FILE: {relative_path} ---\n\n")
                try:
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                        outfile.write("\n\n")
                except Exception as e:
                    outfile.write(f"[Error reading file: {e}]\n\n")

print(f"\n✅ All code merged into: {output_file}")
