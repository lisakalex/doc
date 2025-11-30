The `grep` command in Linux is a powerful tool for searching text using patterns. Below is a step-by-step tutorial covering common `grep` usage.

### 1. **Basic Syntax**
   ```bash
   grep [options] pattern [file...]
   ```

   - `pattern`: The string or regex pattern to search for.
   - `file`: The file(s) to search in.

### 2. **Basic Examples**

   - **Simple Search**: Find lines containing "hello" in `file.txt`:
     ```bash
     grep "hello" file.txt
     ```

   - **Search in Multiple Files**: Find "hello" in all `.txt` files:
     ```bash
     grep "hello" *.txt
     ```

   - **Case-Insensitive Search**: Add `-i` to ignore case sensitivity:
     ```bash
     grep -i "hello" file.txt
     ```

### 3. **Regular Expressions**

   - **Exact Match**: Use `^` and `$` for start and end of line:
     ```bash
     grep "^hello$" file.txt  # Matches lines with "hello" only
     ```

   - **Match Any Character**: Use `.` for any character:
     ```bash
     grep "h.llo" file.txt  # Matches "hello", "hallo", etc.
     ```

   - **Match One or More Characters**: Use `*` for zero or more, `+` for one or more.
     ```bash
     grep "hel*o" file.txt  # Matches "heo", "helo", "helllo", etc.
     ```

### 4. **Options**

   - **Recursive Search** (`-r`): Search through all files in a directory and its subdirectories:
     ```bash
     grep -r "hello" /path/to/directory
     ```

   - **Count Matches** (`-c`): Show the number of matching lines.
     ```bash
     grep -c "hello" file.txt
     ```

   - **Show Line Numbers** (`-n`): Display line numbers with matches.
     ```bash
     grep -n "hello" file.txt
     ```

   - **Invert Match** (`-v`): Show lines that do *not* contain the pattern.
     ```bash
     grep -v "hello" file.txt
     ```

   - **Match Whole Word** (`-w`): Match the whole word only.
     ```bash
     grep -w "hello" file.txt
     ```

### 5. **Combining with Other Commands**

   - **Pipe with `grep`**: Use `grep` with other commands to filter output. For example, filtering processes:
     ```bash
     ps aux | grep "apache"
     ```

   - **Finding Files with `grep` and `find`**:
     ```bash
     find /path -type f -name "*.log" | xargs grep "error"
     ```

### 6. **Advanced Examples**

   - **Multiple Patterns** (`-e`): Search for multiple patterns by using `-e` multiple times.
     ```bash
     grep -e "error" -e "fail" file.txt
     ```

   - **Context Options**: Use `-A`, `-B`, or `-C` to include lines around matches.
     - **After context** (`-A`): Show lines after a match.
       ```bash
       grep -A 2 "hello" file.txt  # Shows 2 lines after each match
       ```
     - **Before context** (`-B`): Show lines before a match.
       ```bash
       grep -B 2 "hello" file.txt  # Shows 2 lines before each match
       ```
     - **Around context** (`-C`): Show lines around a match.
       ```bash
       grep -C 2 "hello" file.txt  # Shows 2 lines before and after each match
       ```

### 7. **Useful Tips**

   - **Ignore Binary Files** (`-I`): Ignore binary files in recursive searches.
   - **Output Only Matching Parts** (`-o`): Print only the matching text, not the entire line.
     ```bash
     grep -o "hello" file.txt
     ```

By mastering `grep`, you can search and filter text with high efficiency across logs, data files, and outputs in Linux!
