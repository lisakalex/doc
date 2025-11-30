# Create the model, form, and migration

I'll help you create the model, form, and migration for the Deposit structure. Here's how to implement it:

1. First, create or update your `models.py`:

```python
from django.db import models
from django.core.validators import MinValueValidator

class Deposit(models.Model):
    PLAN_CHOICES = [
        (1, 'Plan 1'),
        (2, 'Plan 2'),
        (3, 'Plan 3'),
        (4, 'Plan 4'),
        (5, 'Plan 5'),
    ]

    plan = models.IntegerField(
        choices=PLAN_CHOICES,
        default=1,
        validators=[MinValueValidator(1)]
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Plan {self.plan} - ${self.amount}"

    class Meta:
        verbose_name = 'Deposit'
        verbose_name_plural = 'Deposits'
```


2. Create your `forms.py`:

```python
from django import forms
from .models import Deposit

class DepositForm(forms.ModelForm):
    class Meta:
        model = Deposit
        fields = ['plan', 'amount']
        widgets = {
            'plan': forms.Select(attrs={
                'class': 'form-control',
                'placeholder': 'Select Plan'
            }),
            'amount': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter amount'
            })
        }

    def clean_amount(self):
        amount = self.cleaned_data.get('amount')
        if amount <= 0:
            raise forms.ValidationError("Amount must be greater than zero")
        return amount
```


3. Create the migration by running these commands in your terminal:

```shell
python manage.py makemigrations
python manage.py migrate
```


4. Optional: Register the model in `admin.py` to manage deposits through Django admin:

```python
from django.contrib import admin
from .models import Deposit

@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    list_display = ('plan', 'amount', 'created_at')
    list_filter = ('plan', 'created_at')
    search_fields = ('plan',)
    ordering = ('-created_at',)
```


5. Example view to handle deposits (`views.py`):

```python
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from django.contrib.messages.views import SuccessMessageMixin
from .models import Deposit
from .forms import DepositForm

class DepositCreateView(SuccessMessageMixin, CreateView):
    model = Deposit
    form_class = DepositForm
    template_name = 'deposits/create_deposit.html'
    success_url = reverse_lazy('deposits:deposit_list')
    success_message = "Deposit was created successfully"
```


6. Add URL pattern in `urls.py`:

```python
from django.urls import path
from .views import DepositCreateView

app_name = 'deposits'

urlpatterns = [
    path('create/', DepositCreateView.as_view(), name='create_deposit'),
]
```


7. Create a template for the deposit form (`templates/deposits/create_deposit.html`):

```html
{% extends 'base.html' %}
{% load static %}

{% block content %}
<div class="container">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <h2>Create Deposit</h2>
            <form method="post">
                {% csrf_token %}
                {% if form.non_field_errors %}
                    <div class="alert alert-danger">
                        {{ form.non_field_errors }}
                    </div>
                {% endif %}
                
                {% for field in form %}
                    <div class="form-group">
                        {{ field.label_tag }}
                        {{ field }}
                        {% if field.errors %}
                            <div class="alert alert-danger">
                                {{ field.errors }}
                            </div>
                        {% endif %}
                    </div>
                {% endfor %}
                
                <button type="submit" class="btn btn-primary">Submit Deposit</button>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```


This implementation provides:
- A Deposit model with plan choices and amount fields
- Form validation
- Admin interface integration
- Migration files
- A view to handle deposit creation
- A template to display the deposit form

You can customize the amount ranges, add more fields, or modify the validation rules according to your specific requirements.

To use specific plan amounts or restrictions, you could add them to the model:

```python
class Deposit(models.Model):
    PLAN_AMOUNTS = {
        1: {'min': 10, 'max': 100},
        2: {'min': 101, 'max': 500},
        3: {'min': 501, 'max': 1000},
        4: {'min': 1001, 'max': 5000},
        5: {'min': 5001, 'max': 10000},
    }
```


And add validation in the form:

```python
def clean(self):
    cleaned_data = super().clean()
    plan = cleaned_data.get('plan')
    amount = cleaned_data.get('amount')
    
    if plan and amount:
        plan_limits = Deposit.PLAN_AMOUNTS.get(plan)
        if amount < plan_limits['min'] or amount > plan_limits['max']:
            raise forms.ValidationError(
                f"Plan {plan} amount must be between ${plan_limits['min']} and ${plan_limits['max']}"
            )
```
