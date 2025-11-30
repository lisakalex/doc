# Django forms code

I'll explain the key components of this Django forms code:

1. **Base Mixins and Imports**:
```python
class UserCacheMixin:
    user_cache: User | None = None
```

This mixin provides user caching functionality used by various forms.

2. **Sign In Forms**:
- `SignIn`: Base form for authentication with password field
- `SignInViaUsernameForm`: Login using username
- `SignInViaEmailForm`: Login using email
- `SignInViaEmailOrUsernameForm`: Login using either email or username

Key features:
- Optional "Remember me" checkbox based on settings
- Password validation
- User caching

3. **SignUpForm**:
```python
class SignUpForm(UserCreationForm):
```

Registration form with fields:
- Username
- First name
- Last name
- Email
- Password fields
- Styled form fields using CSS classes
- Email uniqueness validation

4. **Password Recovery Forms**:
- `RestorePasswordForm`: Base password reset form
- `ResendActivationCodeForm`: For resending account activation codes
- `ResendActivationCodeViaEmailForm`: Email-specific activation resend

5. **Profile Management Forms**:
- `ChangeProfileForm`: Update user profile details
- `ChangeEmailForm`: Change email address with validation
- `RemindUsernameForm`: Username recovery

Key Features:
- Form validation using clean_* methods
- Translation support using gettext_lazy
- Django widget customization
- Security checks for activation codes
- Email uniqueness validation

The forms implement:
- User authentication
- Registration
- Password reset
- Profile management
- Account activation
- Email change functionality

The code follows Django best practices with:
- Form inheritance
- Clean validation methods
- Proper widget configuration
- Internationalization support
- Security considerations

These forms work together with the views and models to provide a complete user authentication and management system.

Would you like me to explain any specific part in more detail?