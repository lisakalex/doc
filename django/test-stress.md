# Goals of Stress/Load Testing

To test how much traffic your Django site (with Gunicorn + Nginx or Apache) can handle, you can use **stress testing and load testing tools** to simulate real-world traffic and measure response times, concurrency, and failure points.

Here’s how to do it:

---

## ✅ **Goals of Stress/Load Testing**

* Find the **maximum number of concurrent users** your app can handle
* Measure **response time under load**
* Identify **bottlenecks** (CPU, DB, memory, etc.)
* Ensure your app can handle **spikes or sustained traffic**

---

## 🧪 Recommended Tools

| Tool                   | What it Does                           | Usage Level  |
| ---------------------- | -------------------------------------- | ------------ |
| **`ab` (ApacheBench)** | Simple benchmark tool                  | Beginner     |
| **`wrk`**              | Modern HTTP benchmark tool             | Intermediate |
| **`Locust`**           | Python-based, user-behavior simulation | Advanced     |
| **`k6`**               | JavaScript-based, developer-friendly   | Advanced     |
| **`Siege`**            | CLI-based HTTP load tester             | Intermediate |

---

## 🧰 1. **Basic Test with ApacheBench (ab)**

```bash
ab -n 1000 -c 100 http://127.0.0.1/
```

* `-n`: total number of requests
* `-c`: number of concurrent users

**Install:**

```bash
sudo apt install apache2-utils
```

📈 Example output:

```
Requests per second:    250 [#/sec] (mean)
Time per request:       400 ms
```

---

## 🧰 2. **Modern Tool: `wrk`**

Install:

```bash
sudo apt install wrk
```

Run:

```bash
wrk -t4 -c100 -d30s http://127.0.0.1/
```

* `-t4`: 4 threads
* `-c100`: 100 concurrent connections
* `-d30s`: run for 30 seconds

Example result:

```
Requests/sec: 3120
Latency: 58ms
```

---

## 🧠 3. **Advanced Simulation: Locust**

### Step-by-step:

1. Install:

```bash
pip install locust
```

2. Create a test file (e.g. `locustfile.py`):

```python
from locust import HttpUser, task

class MySiteUser(HttpUser):
    @task
    def index(self):
        self.client.get("/")
```

3. Run:

```bash
locust -f locustfile.py --host=http://127.0.0.1
```

Then open your browser at `http://127.0.0.1:8089`, set:

* Number of users
* Spawn rate
* Start the test

Locust simulates **real users with behavior patterns**, useful for production-like testing.

---

## 🛑 What to Watch For

* High **latency** or timeout errors (`5xx`)
* Gunicorn worker crashes or slowdowns
* CPU or memory spikes (use `htop`, `vmstat`)
* Nginx or DB bottlenecks
* Error logs (check `/var/log/nginx/`, Gunicorn logs)

---

## 🧰 Monitor Your System

While testing, monitor performance:

```bash
htop        # CPU, memory
iotop       # disk I/O
netstat -an # open connections
tail -f /var/log/nginx/error.log
```

Or install:

```bash
sudo apt install dstat
dstat -cdngyt --top-cpu
```

---

## 📚 References

* [ApacheBench docs](https://httpd.apache.org/docs/2.4/programs/ab.html)
* [wrk GitHub](https://github.com/wg/wrk)
* [Locust.io docs](https://docs.locust.io/en/stable/)
* [k6.io performance testing](https://k6.io/docs/)

---

Would you like help setting up a full test plan using Locust or scripting a test with real user paths?
