import os
import subprocess
import time

PAGES = [
    ("index.html", "index"),
    ("pages/about.html", "about"),
    ("pages/register.html", "register"),
    ("pages/dashboard.html", "dashboard"),
    ("pages/events.html", "events"),
    ("pages/courses.html", "courses"),
    ("pages/assignment.html", "assignment"),
    ("pages/attendance.html", "attendance"),
    ("pages/result.html", "result"),
    ("pages/profile.html", "profile"),
    ("pages/login.html", "login"),
    ("pages/contact.html", "contact"),
    ("pages/faq.html", "faq"),
    ("pages/feedback.html", "feedback"),
    ("pages/admin.html", "admin"),
]

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_DIR = os.path.abspath(".")
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def capture(rel_path, name, width, height, suffix):
    full_html = os.path.join(BASE_DIR, rel_path.replace("/", "\\"))
    url = "file:///" + full_html.replace("\\", "/")
    out_file = os.path.join(SCREENSHOTS_DIR, f"{name}_{suffix}.png")
    
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--window-size={width},{height}",
        f"--screenshot={out_file}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        print(f"[OK] {name}_{suffix}.png ({os.path.getsize(out_file)} bytes)")
    else:
        print(f"[FAIL] {name}_{suffix}.png")

for rel_path, name in PAGES:
    capture(rel_path, name, 1280, 850, "desktop")
    capture(rel_path, name, 412, 915, "mobile")

print("Screenshot capture complete.")
