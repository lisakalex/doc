# Django forms

This module defines a set of Django **forms** that handle:

* User login (with username, email, or either)
* User registration
* Password recovery
* Account activation and re-activation
* Profile and email updates
* Username reminders

It works with:

* Django’s default `User` model
* A custom `Activation` model (for email confirmation)

---

## Core Components

### 1. `UserCacheMixin`

A mixin that stores a user instance (`user_cache`) found during form validation. Used to pass a valid user between
fields and views.

```python
class UserCacheMixin:
    user_cache: User | None = None
```

---

### 2. Authentication Forms

#### `SignIn`

Base class for sign-in forms. Handles password field and optional "remember me" logic.

Key points:

* Adds `remember_me` checkbox if enabled in settings.
* Validates the password against `user_cache`.

#### `SignInViaUsernameForm`

Adds a `username` field and validates:

* User exists with the given username.
* User is active.
* Stores the user in `user_cache`.

#### `EmailForm`

Defines an `email` field with validation:

* User exists with given email (case-insensitive).
* User is active.
* Stores the user in `user_cache`.

#### `SignInViaEmailForm`

Combines `SignIn` and `EmailForm`. Overrides `email` widget for custom placeholder and class.

#### `EmailOrUsernameForm`

Accepts either an email or username. Validates:

* A matching user exists.
* User is active.
* Stores the user in `user_cache`.

#### `SignInViaEmailOrUsernameForm`

Combines `SignIn` with `EmailOrUsernameForm`.

---

### 3. Registration Form

#### `SignUpForm`

Extends `UserCreationForm` with fields:

* `username`
* `first_name`
* `last_name`
* `email`
* `password1`, `password2`

Also includes widget customization for input styling and a `clean_email` method to enforce email uniqueness.

---

### 4. Activation Code Forms

#### `ResendActivationCodeForm`

Validates:

* Email or username maps to a user.
* User is not active.
* An activation code exists and hasn’t been resent in the last 24 hours.

#### `ResendActivationCodeViaEmailForm`

Same logic as above but only validates against email.

---

### 5. Password and Username Recovery

#### `RestorePasswordForm` and `RestorePasswordViaEmailOrUsernameForm`

Inherit from `EmailForm` and `EmailOrUsernameForm` respectively. Used for password reset requests.

#### `RemindUsernameForm`

Inherits from `EmailForm` and allows users to retrieve their username using email.

---

### 6. Profile and Email Management

#### `ChangeProfileForm`

Simple form to update `first_name` and `last_name`.

#### `ChangeEmailForm`

Validates:

* The new email is not the same as the current one.
* No other user already uses this email.

---

## Supporting Details

* Uses Django’s translation system (`gettext_lazy`) for multilingual support.
* Uses `Q()` for complex OR-based user lookups.
* Uses time delta logic (`timezone.now() - timedelta(hours=24)`) to throttle activation email resending.
* Consistently validates that users are active before allowing further actions.

---

## Summary

| Feature                     | Related Form Class                                             |
|-----------------------------|----------------------------------------------------------------|
| Login via Username          | `SignInViaUsernameForm`                                        |
| Login via Email             | `SignInViaEmailForm`                                           |
| Login via Email or Username | `SignInViaEmailOrUsernameForm`                                 |
| Registration                | `SignUpForm`                                                   |
| Password Recovery           | `RestorePasswordForm`, `RestorePasswordViaEmailOrUsernameForm` |
| Activation Code Resend      | `ResendActivationCodeForm`, `ResendActivationCodeViaEmailForm` |
| Username Reminder           | `RemindUsernameForm`                                           |
| Profile Change              | `ChangeProfileForm`                                            |
| Email Change                | `ChangeEmailForm`                                              |

This structure is modular, easy to extend, and supports clean UI integration via form widgets. It also emphasizes
security (e.g., user.is\_active checks and email throttling) and reusability (through mixins and inheritance).

Let me know if you'd like help wiring this into views or templates.
[Click here to try a new GPT!](https://f614.short.gy/Code)
