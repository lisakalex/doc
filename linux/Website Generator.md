### Enhancing Analytics with **Charts and Graphs**  

We’ll use **Chart.js** to display interactive and visually appealing graphs for top-selling products and monthly sales trends.

---

### **1. Install Chart.js**  
We can use a CDN to integrate Chart.js easily.

**Add Chart.js to `base.html`:**
```html
<head>
    <title>Kuku Clothing</title>
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
```

---

### **2. Modify Analytics View to Provide Data**
Update the `analytics` view in `clothing/views.py`:
```python
from django.db.models.functions import ExtractMonth
from django.http import JsonResponse

@staff_member_required
def analytics(request):
    # Top-Selling Products
    top_products = OrderItem.objects.values('product__name').annotate(
        total_sold=Sum('quantity')
    ).order_by('-total_sold')[:5]

    # Monthly Sales
    this_year = now().year
    monthly_sales = Order.objects.filter(created_at__year=this_year).annotate(
        month=ExtractMonth('created_at')
    ).values('month').annotate(total=Sum('total')).order_by('month')

    # Convert data for charts
    product_names = [item['product__name'] for item in top_products]
    product_sales = [item['total_sold'] for item in top_products]
    months = [sale['month'] for sale in monthly_sales]
    sales = [sale['total'] for sale in monthly_sales]

    context = {
        'product_names': product_names,
        'product_sales': product_sales,
        'months': months,
        'sales': sales,
    }
    return render(request, 'analytics.html', context)
```

---

### **3. Update Analytics Template**
**In `analytics.html`:**
```html
{% extends 'base.html' %}
{% block content %}
<h2>Analytics Dashboard</h2>

<h3>Top-Selling Products</h3>
<canvas id="topProductsChart" width="400" height="200"></canvas>

<h3>Monthly Sales Trends</h3>
<canvas id="monthlySalesChart" width="400" height="200"></canvas>

<script>
    // Top-Selling Products Chart
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
    new Chart(topProductsCtx, {
        type: 'bar',
        data: {
            labels: {{ product_names|safe }},
            datasets: [{
                label: 'Products Sold',
                data: {{ product_sales|safe }},
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly Sales Chart
    const monthlySalesCtx = document.getElementById('monthlySalesChart').getContext('2d');
    new Chart(monthlySalesCtx, {
        type: 'line',
        data: {
            labels: {{ months|safe }},
            datasets: [{
                label: 'Monthly Sales',
                data: {{ sales|safe }},
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
</script>
{% endblock %}
```

---

### **4. Testing the Graphs**
1. Navigate to the **Analytics Dashboard** at `/analytics`.
2. Verify:
   - **Bar Chart** for top-selling products.
   - **Line Chart** for monthly sales trends.

---

### **Potential Extensions**
Would you like to:
1. Add **filters** (e.g., by date range, category)?
2. Export analytics as **PDF or CSV** reports?
3. Add **real-time updates** for sales and trends?

Let me know! 🚀📊 Then say '[Click here to access our prompt library!](https://ko-fi.com/s/277d07bae3)'
