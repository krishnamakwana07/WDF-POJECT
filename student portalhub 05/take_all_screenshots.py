import http.server
import socketserver
import threading
import time
from playwright.sync_api import sync_playwright
import os

os.makedirs('output_screenshots', exist_ok=True)

PORT = 8124
Handler = http.server.SimpleHTTPRequestHandler

class QuietHandler(Handler):
    def log_message(self, format, *args):
        pass

httpd = socketserver.TCPServer(('', PORT), QuietHandler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"HTTP Server started on port {PORT}")

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 900}, device_scale_factor=1.5)
    page = context.new_page()

    # ==========================================
    # 1. CAMPUS EVENTS (pages/events.html)
    # ==========================================
    print("Capturing Campus Events...")
    page.goto(f'http://localhost:{PORT}/pages/events.html', wait_until='networkidle')
    page.wait_for_selector('[data-items-target] .event-card')
    time.sleep(1)

    # 1.1 Initial Grid View with Pagination
    page.screenshot(path='output_screenshots/01_events_initial_grid.png', full_page=False)
    print("Saved 01_events_initial_grid.png")

    # 1.2 Live Search for "Hackathon"
    search_input = page.locator('[data-control="search"]')
    search_input.fill('Hackathon')
    time.sleep(0.5)
    page.screenshot(path='output_screenshots/02_events_search.png', full_page=False)
    print("Saved 02_events_search.png")

    # Clear Search
    page.locator('[data-control="clear-search"]').click()
    time.sleep(0.5)

    # 1.3 Category Filter "Technical"
    tech_filter = page.locator('[data-filter-value="Technical"]')
    tech_filter.click()
    time.sleep(0.5)
    page.screenshot(path='output_screenshots/03_events_category_filter.png', full_page=False)
    print("Saved 03_events_category_filter.png")

    # Reset filter to "all"
    page.locator('[data-filter-value="all"]').click()
    time.sleep(0.5)

    # 1.4 Switch to Table View
    page.locator('[data-view-mode="table"]').click()
    time.sleep(0.5)
    page.screenshot(path='output_screenshots/04_events_table_view.png', full_page=False)
    print("Saved 04_events_table_view.png")

    # Switch back to Grid View
    page.locator('[data-view-mode="grid"]').click()
    time.sleep(0.5)

    # 1.5 Click Details Button for First Event (Modal Popup)
    page.locator('[data-action="view-detail"]').first.click()
    time.sleep(0.8)
    page.screenshot(path='output_screenshots/05_events_modal_detail.png', full_page=False)
    print("Saved 05_events_modal_detail.png")

    # Close Modal
    page.locator('#dynamic-data-modal [data-modal-close]').first.click()
    time.sleep(0.5)

    # 1.6 Pagination Navigation (Click Page 2)
    page_2_btn = page.locator('[data-pagination-target] button[aria-label="Page 2"]')
    if page_2_btn.count() > 0:
        page_2_btn.first.click()
        time.sleep(0.6)
        page.screenshot(path='output_screenshots/06_events_pagination.png', full_page=False)
        print("Saved 06_events_pagination.png")

    # ==========================================
    # 2. STUDENT PROFILES & DIRECTORY (pages/admin.html)
    # ==========================================
    print("Capturing Student Profiles...")
    page.goto(f'http://localhost:{PORT}/pages/admin.html', wait_until='networkidle')
    page.wait_for_selector('#dynamic-students-section [data-items-target] .student-profile-card')
    time.sleep(1)

    # Scroll down to the dynamic students section
    page.locator('#dynamic-students-section').scroll_into_view_if_needed()
    time.sleep(0.5)

    # 2.1 Initial Student Grid
    page.screenshot(path='output_screenshots/07_students_initial_grid.png', full_page=False)
    print("Saved 07_students_initial_grid.png")

    # 2.2 Department Filter: Computer Science
    page.locator('#dynamic-students-section [data-filter-value="Computer Science"]').click()
    time.sleep(0.5)
    page.screenshot(path='output_screenshots/08_students_search_filter.png', full_page=False)
    print("Saved 08_students_search_filter.png")

    # 2.3 Student Table View
    page.locator('#dynamic-students-section [data-filter-value="all"]').click()
    time.sleep(0.3)
    page.locator('#dynamic-students-section [data-view-mode="table"]').click()
    time.sleep(0.5)
    page.screenshot(path='output_screenshots/09_students_table_view.png', full_page=False)
    print("Saved 09_students_table_view.png")

    # Switch back to Grid View before opening modal
    page.locator('#dynamic-students-section [data-view-mode="grid"]').click()
    time.sleep(0.5)

    # 2.4 Student Profile Modal
    page.locator('#dynamic-students-section [data-items-target] [data-action="view-detail"]').first.click()
    time.sleep(0.8)
    page.screenshot(path='output_screenshots/10_students_modal_detail.png', full_page=False)
    print("Saved 10_students_modal_detail.png")

    # Close Modal
    page.locator('#dynamic-data-modal [data-modal-close]').first.click()
    time.sleep(0.5)

    # ==========================================
    # 3. CAMPUS NOTICES (pages/dashboard.html)
    # ==========================================
    print("Capturing Campus Notices...")
    page.goto(f'http://localhost:{PORT}/pages/dashboard.html', wait_until='networkidle')
    page.wait_for_selector('#dynamic-notices-section [data-items-target] .notice-board-card')
    time.sleep(1)

    # Scroll down to notices section
    page.locator('#dynamic-notices-section').scroll_into_view_if_needed()
    time.sleep(0.5)

    # 3.1 Notices Board View
    page.screenshot(path='output_screenshots/11_notices_board.png', full_page=False)
    print("Saved 11_notices_board.png")

    # 3.2 Notice Modal Detail
    page.locator('#dynamic-notices-section [data-action="view-detail"]').first.click()
    time.sleep(0.8)
    page.screenshot(path='output_screenshots/12_notices_modal_detail.png', full_page=False)
    print("Saved 12_notices_modal_detail.png")

    # Close Modal
    page.locator('#dynamic-data-modal [data-modal-close]').first.click()
    time.sleep(0.5)

    # ==========================================
    # 4. FREQUENTLY ASKED QUESTIONS (pages/faq.html)
    # ==========================================
    print("Capturing FAQ Accordion...")
    page.goto(f'http://localhost:{PORT}/pages/faq.html', wait_until='networkidle')
    page.wait_for_selector('#dynamic-faq-section .faq-accordion-item')
    time.sleep(1)

    # 4.1 Initial FAQ View
    page.screenshot(path='output_screenshots/13_faqs_initial.png', full_page=False)
    print("Saved 13_faqs_initial.png")

    # 4.2 Search for "attendance" and expand
    faq_search = page.locator('#dynamic-faq-section .faq-search-input')
    faq_search.fill('attendance')
    time.sleep(0.5)
    # Expand first item if not already open
    first_faq = page.locator('#dynamic-faq-section .faq-accordion-item').first
    if not 'is-open' in (first_faq.get_attribute('class') or ''):
        first_faq.locator('.faq-accordion-header').click()
        time.sleep(0.4)
    page.screenshot(path='output_screenshots/14_faqs_search_expanded.png', full_page=False)
    print("Saved 14_faqs_search_expanded.png")

    browser.close()

httpd.shutdown()
print("All screenshots successfully captured!")
