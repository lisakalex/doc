To capitalize a string in Python, you have several options depending on your specific needs. Here are the main methods you can use:

1. capitalize() method:
   This method capitalizes the first character of the string and converts the rest to lowercase.

```python
text = "hello, world!"
capitalized = text.capitalize()
print(capitalized)  # Output: Hello, world!
```

2. title() method:
   This method capitalizes the first character of each word in the string.

```python
text = "hello, world!"
titled = text.title()
print(titled)  # Output: Hello, World!
```

3. upper() method:
   This method converts all characters in the string to uppercase.

```python
text = "hello, world!"
uppercase = text.upper()
print(uppercase)  # Output: HELLO, WORLD!
```

4. capwords() function from the string module:
   This function capitalizes the first character of each word, similar to title().

```python
import string

text = "hello, world!"
capwords = string.capwords(text)
print(capwords)  # Output: Hello, World!
```

5. Custom function using indexing:
   You can create a custom function to capitalize only the first character:

```python
def capitalize_first(text):
    return text[0].upper() + text[1:]

text = "hello, world!"
custom_cap = capitalize_first(text)
print(custom_cap)  # Output: Hello, world!
```

Key points to remember:

1. The capitalize() method is most commonly used for capitalizing the first letter of a sentence.
2. These methods return new strings; they don't modify the original string.
3. For more complex capitalization needs, you might need to combine methods or write custom functions.
4. Be aware that these methods may behave differently with non-ASCII characters or in different locales.

Choose the method that best fits your specific capitalization needs in your Python program.

Citations:
[1] https://www.geeksforgeeks.org/string-capitalize-python/
[2] https://www.programiz.com/python-programming/methods/string/capitalize
[3] https://www.tutorialspoint.com/python/string_capitalize.htm
[4] https://www.shiksha.com/online-courses/articles/understanding-capitalize-in-python/
[5] https://www.w3schools.com/python/ref_string_capitalize.asp
[6] https://flexiple.com/python/python-capitalize-first-letter
[7] https://python-forum.io/thread-7844.html
[8] https://www.simplilearn.com/tutorials/python-tutorial/remove-duplicates-from-list-python
