/**
 * ==========================================================================
 * StudentHub - Dynamic Data Fetcher, Search, Filter, Sort & Pagination Engine
 * 
 * Powered by Fetch API with comprehensive error handling, fallback caching,
 * live debounced search, multi-field filtering, multi-criteria sorting,
 * dynamic pagination, view mode toggling, and accessible modal inspection.
 * ==========================================================================
 */

(function () {
  'use strict';

  // Ensure StudentHub global namespace
  window.StudentHub = window.StudentHub || {};

  /* --------------------------------------------------------------------------
     1. IN-MEMORY FALLBACK DATA CACHE
     (Guarantees full functionality even when opened directly via file://)
     -------------------------------------------------------------------------- */
  const FallbackData = {
    events: [
      {
        id: "evt-001",
        title: "Annual Tech Fest - Innovate 2026",
        category: "Technical",
        date: "2026-07-25",
        formattedDate: "25 Jul 2026",
        day: "25",
        month: "Jul",
        time: "10:00 AM - 5:00 PM",
        location: "Main Auditorium & Tech Quad",
        organizer: "Department of Computer Science",
        summary: "Flagship university technology exhibition showcasing student robotics, project demonstrations, and industry keynote speakers.",
        description: "Innovate 2026 brings together over 1,500 students, faculty, and industry pioneers. Features include live autonomous drone races, hardware hacking arenas, software project expos, and guest speeches from leading tech executives.",
        capacity: 500,
        registeredCount: 435,
        registrationFee: "Free",
        status: "Registrations Open",
        tags: ["Technology", "Robotics", "Innovation"],
        icon: "🤖"
      },
      {
        id: "evt-002",
        title: "National 36-Hour Coding Hackathon",
        category: "Technical",
        date: "2026-08-02",
        formattedDate: "02 Aug 2026",
        day: "02",
        month: "Aug",
        time: "09:00 AM (36 Hours Continuous)",
        location: "Advanced Computing Lab 301",
        organizer: "CodeCrafters Student Club",
        summary: "Intensive team coding sprint tackling real-world problems in AI, healthcare technology, and green energy solutions.",
        description: "Form teams of 2 to 4 developers and build end-to-end web, mobile, or AI prototypes within 36 hours. Cash prizes, cloud credits, and direct interview opportunities with sponsoring companies will be awarded.",
        capacity: 200,
        registeredCount: 188,
        registrationFee: "Free",
        status: "Almost Full",
        tags: ["Coding", "Hackathon", "AI"],
        icon: "💻"
      },
      {
        id: "evt-003",
        title: "Cultural Harmony Night & Music Gala",
        category: "Cultural",
        date: "2026-08-10",
        formattedDate: "10 Aug 2026",
        day: "10",
        month: "Aug",
        time: "06:00 PM - 10:30 PM",
        location: "Open Amphitheatre",
        organizer: "Student Cultural Council",
        summary: "An enchanting evening featuring classical dances, rock band performances, theatrical skits, and global food stalls.",
        description: "Celebrate campus cultural diversity! Featuring performances from the university symphony, dramatic societies, folk dance troupes, and a special celebrity guest musical ensemble.",
        capacity: 1200,
        registeredCount: 890,
        registrationFee: "Free",
        status: "Registrations Open",
        tags: ["Music", "Dance", "Food"],
        icon: "🎭"
      },
      {
        id: "evt-004",
        title: "Inter-College Sports Championship 2026",
        category: "Sports",
        date: "2026-08-18",
        formattedDate: "18 Aug 2026",
        day: "18",
        month: "Aug",
        time: "08:00 AM - 06:00 PM",
        location: "University Sports Complex & Stadium",
        organizer: "Department of Physical Education",
        summary: "High-octane multi-sport tournament spanning Football, Cricket, Badminton, Volleyball, and Track & Field events.",
        description: "Competing against 24 partner colleges across the state. Cheer for your departmental teams or participate in athletic trials.",
        capacity: 800,
        registeredCount: 620,
        registrationFee: "Free",
        status: "Registrations Open",
        tags: ["Sports", "Athletics", "Football"],
        icon: "⚽"
      },
      {
        id: "evt-005",
        title: "Hands-on Generative AI & LLM Workshop",
        category: "Workshops",
        date: "2026-08-25",
        formattedDate: "25 Aug 2026",
        day: "25",
        month: "Aug",
        time: "02:00 PM - 05:30 PM",
        location: "Seminar Hall A",
        organizer: "AI & Data Science Society",
        summary: "Master practical prompt engineering, fine-tuning, and building multi-agent AI applications with modern frameworks.",
        description: "A comprehensive practical workshop led by Google and HuggingFace community advocates. Bring your laptop to build interactive chatbots.",
        capacity: 150,
        registeredCount: 145,
        registrationFee: "Free",
        status: "Almost Full",
        tags: ["AI", "Python", "Workshop"],
        icon: "🧠"
      },
      {
        id: "evt-006",
        title: "Distinguished Lecture: Cybersecurity in Web3",
        category: "Academic",
        date: "2026-09-01",
        formattedDate: "01 Sep 2026",
        day: "01",
        month: "Sep",
        time: "11:00 AM - 01:00 PM",
        location: "Lecture Hall 1",
        organizer: "Faculty of Engineering & Technology",
        summary: "Keynote presentation exploring cryptographic vulnerabilities, zero-trust network architectures, and threat mitigation.",
        description: "International guest speaker Dr. Elena Vance discusses state-sponsored cyber incursions, zero-day threat prevention, and quantum cryptography resilience.",
        capacity: 300,
        registeredCount: 210,
        registrationFee: "Free",
        status: "Registrations Open",
        tags: ["Cybersecurity", "Networking", "Cryptography"],
        icon: "🛡️"
      }
    ],
    students: [
      {
        id: "stu-001",
        studentId: "25CE056",
        name: "Krishna Makwana",
        email: "krishna.makwana@student.edu.in",
        department: "Computer Science",
        semester: "Semester 5",
        semNumber: 5,
        cgpa: 8.75,
        enrollmentYear: 2024,
        status: "Active",
        avatarInitials: "KM",
        phone: "+91 98765 43210",
        skills: ["JavaScript", "Python", "Cloud Architecture", "System Design"],
        bio: "Passionate full-stack developer and AI researcher interested in distributed systems and open-source tooling.",
        attendance: "94%",
        achievements: "1st Place Campus Hackathon 2025, Dean's Honor Roll"
      },
      {
        id: "stu-002",
        studentId: "25CE042",
        name: "Aarav Sharma",
        email: "aarav.sharma@student.edu.in",
        department: "Computer Science",
        semester: "Semester 5",
        semNumber: 5,
        cgpa: 9.15,
        enrollmentYear: 2024,
        status: "Honors",
        avatarInitials: "AS",
        phone: "+91 98234 11223",
        skills: ["C++", "Competitive Programming", "Algorithms"],
        bio: "Competitive programmer and algorithms enthusiast with candidate master rating and research in graph databases.",
        attendance: "96%",
        achievements: "ACM-ICPC Regionalist, Codeforces Master"
      },
      {
        id: "stu-003",
        studentId: "25IT018",
        name: "Priya Patel",
        email: "priya.patel@student.edu.in",
        department: "Information Technology",
        semester: "Semester 6",
        semNumber: 6,
        cgpa: 8.92,
        enrollmentYear: 2023,
        status: "Active",
        avatarInitials: "PP",
        phone: "+91 97123 44556",
        skills: ["Machine Learning", "PyTorch", "Data Science", "SQL"],
        bio: "Data science enthusiast working on computer vision for medical diagnostics and automated crop defect detection.",
        attendance: "91%",
        achievements: "Published paper in IEEE Student Symposium"
      },
      {
        id: "stu-004",
        studentId: "25EC031",
        name: "Rohan Deshmukh",
        email: "rohan.deshmukh@student.edu.in",
        department: "Electronics & Comm.",
        semester: "Semester 4",
        semNumber: 4,
        cgpa: 7.85,
        enrollmentYear: 2025,
        status: "Active",
        avatarInitials: "RD",
        phone: "+91 96543 88776",
        skills: ["Embedded Systems", "VLSI", "MATLAB", "IoT"],
        bio: "Hardware tinkerer working on smart energy metering and low-power wearable biomedical electronics.",
        attendance: "88%",
        achievements: "Best Hardware Prototype at State Tech Expo"
      },
      {
        id: "stu-005",
        studentId: "25ME014",
        name: "Ananya Joshi",
        email: "ananya.joshi@student.edu.in",
        department: "Mechanical Eng.",
        semester: "Semester 7",
        semNumber: 7,
        cgpa: 9.40,
        enrollmentYear: 2023,
        status: "Honors",
        avatarInitials: "AJ",
        phone: "+91 99887 66554",
        skills: ["SolidWorks", "FEA Analysis", "Robotics"],
        bio: "Lead suspension designer in university Formula Student team, passionate about electric vehicle powertrain efficiency.",
        attendance: "98%",
        achievements: "Formula Bharat 2025 3rd Overall"
      },
      {
        id: "stu-006",
        studentId: "25CV022",
        name: "Vikramaditya Rao",
        email: "vikram.rao@student.edu.in",
        department: "Civil Eng.",
        semester: "Semester 6",
        semNumber: 6,
        cgpa: 8.10,
        enrollmentYear: 2023,
        status: "Active",
        avatarInitials: "VR",
        phone: "+91 98450 12398",
        skills: ["AutoCAD", "Structural Analysis", "GIS"],
        bio: "Focusing on sustainable urban infrastructure, earthquake-resistant design, and rainwater harvesting modeling.",
        attendance: "89%",
        achievements: "State Smart Cities Innovation Grantee"
      }
    ],
    notices: [
      {
        id: "not-001",
        title: "Spring 2026 Examination Notice & Timetable Release",
        category: "Exam",
        date: "2026-08-01",
        formattedDate: "01 Aug 2026",
        priority: "High",
        department: "Office of Controller of Examinations",
        summary: "Final comprehensive examination schedule and hall ticket download instructions for all undergraduate and postgraduate degrees.",
        content: "All candidates appearing for the forthcoming End-Semester Spring Examinations are instructed to download their authorized hall tickets from the student portal before August 10th. Strict identity verification via biometric or student RFID badge is mandatory at the examination center entrance.",
        attachmentName: "Exam_Schedule_Spring_2026.pdf",
        author: "Dr. R. K. Saxena (CoE)"
      },
      {
        id: "not-002",
        title: "Campus Placement Drive 2026: Tier-1 Tech Recruiters",
        category: "Placement",
        date: "2026-08-05",
        formattedDate: "05 Aug 2026",
        priority: "High",
        department: "Training & Placement Cell",
        summary: "Registration open for Google, Microsoft, Amazon, and Tata Consultancy campus recruitment drives for eligible 6th & 8th semester students.",
        content: "Eligible candidates with an overall CGPA >= 7.5 and no active backlogs must upload their updated single-page resume and GitHub portfolios to the T&P portal by August 14.",
        attachmentName: "Placement_Eligibility_Matrix_2026.pdf",
        author: "Prof. S. N. Mehra (Head, T&P)"
      },
      {
        id: "not-003",
        title: "Mandatory Biometric & RFID Attendance System Upgrade",
        category: "Academic",
        date: "2026-08-08",
        formattedDate: "08 Aug 2026",
        priority: "Medium",
        department: "Dean Academic Affairs",
        summary: "New contactless attendance readers installed across all 40 smart lecture halls and laboratories starting next Monday.",
        content: "Students are reminded that the minimum statutory requirement of 75% attendance in each registered subject remains strictly enforced to qualify for end-semester examinations.",
        attachmentName: "Attendance_Regulations_2026.pdf",
        author: "Dr. Manisha Roy (Dean Academics)"
      }
    ],
    faqs: [
      {
        id: "faq-001",
        question: "How do I register for courses and departmental electives?",
        category: "courses",
        categoryName: "Courses & Electives",
        answer: "Visit the Courses page and browse through the departmental and open electives. Choose your desired subjects, review prerequisite coursework, and click 'Confirm Registration' prior to the semester add/drop deadline.",
        views: 2450,
        helpfulCount: 389
      },
      {
        id: "faq-002",
        question: "How can I check my attendance percentage and lecture records?",
        category: "attendance",
        categoryName: "Attendance",
        answer: "Go to the Attendance page from your student dashboard to inspect subject-wise lecture attendance percentages, attended vs. delivered counts, and real-time shortfall warnings.",
        views: 3120,
        helpfulCount: 512
      },
      {
        id: "faq-003",
        question: "When are semester results and official scorecards published?",
        category: "exams",
        categoryName: "Exams & Results",
        answer: "Results are officially verified and published within two weeks following the conclusion of the examination period. You can check subject grades, SGPA, and download provisional PDF scorecards on the Results page.",
        views: 2980,
        helpfulCount: 420
      }
    ]
  };

  /* --------------------------------------------------------------------------
     2. DATA FETCHER (Fetch API Wrapper)
     -------------------------------------------------------------------------- */
  const DataFetcher = {
    /**
     * Resolves the relative path to the /data directory based on current location
     */
    resolveDataUrl(resourceName) {
      const isInsidePagesDir = window.location.pathname.includes('/pages/') || 
                              window.location.pathname.endsWith('/pages') ||
                              document.querySelector('script[src*="../js/"]');
      const basePrefix = isInsidePagesDir ? '../data/' : './data/';
      return `${basePrefix}${resourceName}.json`;
    },

    /**
     * Asynchronously loads external JSON resource using Fetch API
     * @param {string} resourceName - 'events' | 'students' | 'notices' | 'faqs'
     * @returns {Promise<{data: Array, source: 'fetch' | 'fallback', error: null | string}>}
     */
    async load(resourceName) {
      const url = this.resolveDataUrl(resourceName);
      let isFetchSuccess = false;
      let dataset = [];

      try {
        // Native Fetch API call
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          cache: 'no-cache'
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: Failed to load ${url}`);
        }

        dataset = await response.json();
        isFetchSuccess = true;
        console.log(`[StudentHub Fetch API] Successfully loaded ${dataset.length} items from ${url}`);
      } catch (err) {
        console.warn(`[StudentHub Fetch API Notice] Fetch for ${url} encountered: ${err.message}.`);
        
        // If fetch fails (e.g. browser strict CORS on file:// URL), use embedded fallback
        if (FallbackData[resourceName]) {
          dataset = FallbackData[resourceName];
          console.info(`[StudentHub Fallback] Loaded embedded fallback for ${resourceName}.`);
        } else {
          // If no pre-cached fallback, try fetching with alternate relative path
          const altUrl = url.startsWith('../') ? url.replace('../', './') : `../${url.replace('./', '')}`;
          try {
            const altRes = await fetch(altUrl);
            if (altRes.ok) {
              dataset = await altRes.json();
              isFetchSuccess = true;
            }
          } catch (altErr) {
            console.error(`[StudentHub Fetch API] Both primary and alternate fetch failed for ${resourceName}.`, altErr);
          }
        }
      }

      return {
        data: dataset,
        source: isFetchSuccess ? 'fetch' : 'fallback',
        resourceName,
        url
      };
    }
  };

  /* --------------------------------------------------------------------------
     3. REUSABLE DATA CONTROLLER CLASS
     (Handles state, debounced search, filtering, sorting, pagination)
     -------------------------------------------------------------------------- */
  class DataController {
    constructor(options) {
      this.resourceName = options.resourceName;
      this.container = typeof options.container === 'string' 
        ? document.querySelector(options.container) 
        : options.container;

      if (!this.container) return;

      this.searchKeys = options.searchKeys || ['title', 'name', 'category', 'description'];
      this.filterKey = options.filterKey || 'category';
      this.defaultSort = options.defaultSort || 'date-desc';
      this.pageSize = options.pageSize || 6;
      this.renderItem = options.renderItem;
      this.renderTableItem = options.renderTableItem;
      this.onDataLoaded = options.onDataLoaded;
      this.emptyIcon = options.emptyIcon || '🔍';
      this.emptyTitle = options.emptyTitle || 'No matching results found';
      this.emptyText = options.emptyText || 'Try clearing your search query or adjusting active filters.';

      // Internal State
      this.state = {
        raw: [],
        filtered: [],
        currentPage: 1,
        pageSize: this.pageSize,
        searchQuery: '',
        activeFilter: 'all',
        sortBy: this.defaultSort,
        viewMode: options.defaultView || 'grid', // 'grid' | 'table'
        loading: true,
        source: 'fetch'
      };

      this.init();
    }

    async init() {
      this.renderSkeleton();
      const result = await DataFetcher.load(this.resourceName);
      this.state.raw = Array.isArray(result.data) ? result.data : [];
      this.state.source = result.source;
      this.state.loading = false;

      // Cache raw data in fallback map
      if (this.state.raw.length > 0 && !FallbackData[this.resourceName]) {
        FallbackData[this.resourceName] = this.state.raw;
      }

      this.bindControls();
      this.applyPipeline();

      if (typeof this.onDataLoaded === 'function') {
        this.onDataLoaded(this.state.raw, this.state.source);
      }
    }

    renderSkeleton() {
      const itemsContainer = this.container.querySelector('[data-items-target]');
      if (!itemsContainer) return;

      const skeletonCount = this.pageSize || 6;
      let skeletonsHtml = '';
      for (let i = 0; i < skeletonCount; i++) {
        skeletonsHtml += `
          <div class="skeleton-card" aria-hidden="true">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="skeleton" style="width: 50px; height: 50px; border-radius: 8px;"></div>
              <div style="flex: 1;">
                <div class="skeleton" style="width: 40%; height: 16px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="width: 70%; height: 20px;"></div>
              </div>
            </div>
            <div class="skeleton" style="width: 100%; height: 14px; margin-top: 8px;"></div>
            <div class="skeleton" style="width: 85%; height: 14px;"></div>
            <div style="display: flex; justify-content: space-between; margin-top: 12px;">
              <div class="skeleton" style="width: 30%; height: 24px; border-radius: 9999px;"></div>
              <div class="skeleton" style="width: 25%; height: 28px; border-radius: 6px;"></div>
            </div>
          </div>
        `;
      }
      itemsContainer.innerHTML = skeletonsHtml;
    }

    bindControls() {
      // 1. Search Input
      const searchInput = this.container.querySelector('[data-control="search"]');
      const clearSearchBtn = this.container.querySelector('[data-control="clear-search"]');

      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.state.searchQuery = e.target.value.trim().toLowerCase();
            this.state.currentPage = 1;
            if (clearSearchBtn) {
              clearSearchBtn.classList.toggle('is-visible', this.state.searchQuery.length > 0);
            }
            this.applyPipeline();
          }, 200);
        });

        if (clearSearchBtn) {
          clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            this.state.searchQuery = '';
            this.state.currentPage = 1;
            clearSearchBtn.classList.remove('is-visible');
            searchInput.focus();
            this.applyPipeline();
          });
        }
      }

      // 2. Filter Buttons
      const filterButtons = this.container.querySelectorAll('[data-filter-value]');
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.state.activeFilter = btn.getAttribute('data-filter-value') || 'all';
          this.state.currentPage = 1;
          this.applyPipeline();
        });
      });

      // 3. Sort Select
      const sortSelect = this.container.querySelector('[data-control="sort"]');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.state.sortBy = e.target.value;
          this.applyPipeline();
        });
      }

      // 4. Page Size Select
      const pageSizeSelect = this.container.querySelector('[data-control="page-size"]');
      if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
          const val = parseInt(e.target.value, 10);
          this.state.pageSize = isNaN(val) ? 6 : val;
          this.state.currentPage = 1;
          this.applyPipeline();
        });
      }

      // 5. View Mode Switcher (Grid / Table)
      const viewButtons = this.container.querySelectorAll('[data-view-mode]');
      viewButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          viewButtons.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.state.viewMode = btn.getAttribute('data-view-mode');
          this.renderItems();
        });
      });

      // 6. Source Protocol Badge
      const sourceBadge = this.container.querySelector('[data-source-badge]');
      if (sourceBadge) {
        sourceBadge.innerHTML = this.state.source === 'fetch'
          ? '⚡ Fetched via Fetch API'
          : '📂 Local Data Cache';
        sourceBadge.title = this.state.source === 'fetch' 
          ? 'Data successfully fetched asynchronously from external JSON file' 
          : 'Fallback data active';
      }
    }

    /**
     * Executes the Search -> Filter -> Sort pipeline
     */
    applyPipeline() {
      let result = [...this.state.raw];

      // Step 1: Search
      if (this.state.searchQuery) {
        const query = this.state.searchQuery;
        result = result.filter(item => {
          return this.searchKeys.some(key => {
            const val = item[key];
            if (val === undefined || val === null) return false;
            if (Array.isArray(val)) {
              return val.some(v => String(v).toLowerCase().includes(query));
            }
            return String(val).toLowerCase().includes(query);
          });
        });
      }

      // Step 2: Category / Field Filter
      if (this.state.activeFilter && this.state.activeFilter !== 'all') {
        const active = this.state.activeFilter.toLowerCase();
        result = result.filter(item => {
          const val = item[this.filterKey];
          if (Array.isArray(val)) {
            return val.some(v => String(v).toLowerCase() === active);
          }
          return String(val).toLowerCase() === active;
        });
      }

      // Step 3: Sorting
      result = this.sortDataset(result, this.state.sortBy);

      this.state.filtered = result;

      // Adjust current page bounds
      const totalPages = Math.ceil(this.state.filtered.length / this.state.pageSize) || 1;
      if (this.state.currentPage > totalPages) {
        this.state.currentPage = totalPages;
      }

      // Update Filter Counters
      this.updateFilterCounts();

      // Render items and pagination UI
      this.renderItems();
      this.renderPagination();
    }

    /**
     * Sorts dataset based on selected option
     */
    sortDataset(data, sortBy) {
      return data.sort((a, b) => {
        switch (sortBy) {
          case 'title-asc':
          case 'name-asc':
            return (a.title || a.name || '').localeCompare(b.title || b.name || '');

          case 'title-desc':
          case 'name-desc':
            return (b.title || b.name || '').localeCompare(a.title || a.name || '');

          case 'date-asc':
            return new Date(a.date || 0) - new Date(b.date || 0);

          case 'date-desc':
            return new Date(b.date || 0) - new Date(a.date || 0);

          case 'cgpa-desc':
            return (b.cgpa || 0) - (a.cgpa || 0);

          case 'cgpa-asc':
            return (a.cgpa || 0) - (b.cgpa || 0);

          case 'capacity-desc':
            return (b.capacity || 0) - (a.capacity || 0);

          case 'popular-desc':
            return (b.views || b.helpfulCount || b.registeredCount || 0) - 
                   (a.views || a.helpfulCount || a.registeredCount || 0);

          default:
            return 0;
        }
      });
    }

    /**
     * Updates badge count numbers on filter buttons
     */
    updateFilterCounts() {
      const filterButtons = this.container.querySelectorAll('[data-filter-value]');
      filterButtons.forEach((btn) => {
        const cat = btn.getAttribute('data-filter-value');
        const countSpan = btn.querySelector('.data-filter-count');
        if (!countSpan) return;

        if (cat === 'all') {
          countSpan.textContent = this.state.raw.length;
        } else {
          const matchCount = this.state.raw.filter(item => {
            const val = item[this.filterKey];
            if (Array.isArray(val)) {
              return val.some(v => String(v).toLowerCase() === cat.toLowerCase());
            }
            return String(val).toLowerCase() === cat.toLowerCase();
          }).length;
          countSpan.textContent = matchCount;
        }
      });
    }

    /**
     * Slices the current page items and renders them to the target container
     */
    renderItems() {
      const itemsContainer = this.container.querySelector('[data-items-target]');
      const tableWrapper = this.container.querySelector('[data-table-target-wrap]');
      const tableBody = this.container.querySelector('[data-table-body]');
      const resultCountSpan = this.container.querySelector('[data-count-target]');

      const totalItems = this.state.filtered.length;

      // Update count indicator
      if (resultCountSpan) {
        resultCountSpan.textContent = totalItems === 1 ? '1 item' : `${totalItems} items`;
      }

      // Check empty state
      if (totalItems === 0) {
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (itemsContainer) {
          itemsContainer.style.display = 'block';
          itemsContainer.innerHTML = `
            <div class="data-empty-state">
              <span class="data-empty-icon" aria-hidden="true">${this.emptyIcon}</span>
              <h4 class="data-empty-title">${this.emptyTitle}</h4>
              <p class="data-empty-desc">${this.emptyText}</p>
              <button type="button" class="btn btn-sm btn-outline" data-action="reset-filters">
                Clear Filters &amp; Search
              </button>
            </div>
          `;

          const resetBtn = itemsContainer.querySelector('[data-action="reset-filters"]');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              this.resetControls();
            });
          }
        }
        return;
      }

      // Calculate pagination slice
      const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
      const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
      const pageItems = this.state.filtered.slice(startIndex, endIndex);

      // Render according to viewMode (grid cards vs table)
      if (this.state.viewMode === 'table' && this.renderTableItem && tableWrapper && tableBody) {
        if (itemsContainer) itemsContainer.style.display = 'none';
        tableWrapper.style.display = 'block';
        tableBody.innerHTML = pageItems.map((item, idx) => this.renderTableItem(item, startIndex + idx)).join('');
      } else {
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (itemsContainer) {
          itemsContainer.style.display = '';
          itemsContainer.innerHTML = pageItems.map(item => this.renderItem(item)).join('');
        }
      }

      // Attach any item-specific action listeners (e.g. "View Details" modal buttons)
      this.attachItemListeners();
    }

    /**
     * Attaches interactive click handlers for item buttons
     */
    attachItemListeners() {
      // Detail inspection triggers
      const detailBtns = this.container.querySelectorAll('[data-action="view-detail"]');
      detailBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const itemId = btn.getAttribute('data-item-id');
          const item = this.state.raw.find(d => String(d.id) === String(itemId));
          if (item) {
            this.showDetailModal(item);
          }
        });
      });

      // Quick action triggers (e.g., Register Free button)
      const actionBtns = this.container.querySelectorAll('[data-action="register-event"]');
      actionBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const title = btn.getAttribute('data-item-title') || 'Event';
          btn.textContent = 'Registered ✓';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-success');
          btn.disabled = true;

          if (window.StudentHub && window.StudentHub.toast) {
            window.StudentHub.toast(`Successfully registered for "${title}"! Check your email for confirmation.`, 'success', 3500);
          }
        });
      });
    }

    /**
     * Renders pagination navigation controls
     */
    renderPagination() {
      const paginationContainer = this.container.querySelector('[data-pagination-target]');
      if (!paginationContainer) return;

      const totalItems = this.state.filtered.length;
      if (totalItems <= this.state.pageSize) {
        paginationContainer.innerHTML = `
          <div class="pagination-info">Showing all <strong>${totalItems}</strong> entries</div>
          <div></div>
        `;
        return;
      }

      const totalPages = Math.ceil(totalItems / this.state.pageSize);
      const currentPage = this.state.currentPage;
      const startEntry = (currentPage - 1) * this.state.pageSize + 1;
      const endEntry = Math.min(currentPage * this.state.pageSize, totalItems);

      let buttonsHtml = '';

      // First & Prev Buttons
      buttonsHtml += `
        <button type="button" class="pagination-btn" data-page="1" ${currentPage === 1 ? 'disabled' : ''} aria-label="First page" title="First page">&laquo;</button>
        <button type="button" class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page" title="Previous page">&lsaquo; Prev</button>
      `;

      // Page numbers with ellipsis logic
      const maxButtons = 5;
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        buttonsHtml += `<button type="button" class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) {
          buttonsHtml += `<span class="pagination-ellipsis">&hellip;</span>`;
        }
      }

      for (let p = startPage; p <= endPage; p++) {
        const isActive = p === currentPage;
        buttonsHtml += `
          <button type="button" class="pagination-btn ${isActive ? 'is-active' : ''}" 
                  data-page="${p}" 
                  ${isActive ? 'aria-current="page"' : ''}
                  aria-label="Page ${p}">
            ${p}
          </button>
        `;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttonsHtml += `<span class="pagination-ellipsis">&hellip;</span>`;
        }
        buttonsHtml += `<button type="button" class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
      }

      // Next & Last Buttons
      buttonsHtml += `
        <button type="button" class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page" title="Next page">Next &rsaquo;</button>
        <button type="button" class="pagination-btn" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last page" title="Last page">&raquo;</button>
      `;

      paginationContainer.innerHTML = `
        <div class="pagination-info">
          Showing <strong>${startEntry}</strong> to <strong>${endEntry}</strong> of <strong>${totalItems}</strong> entries
        </div>
        <div class="pagination-controls" role="navigation" aria-label="Pagination Navigation">
          ${buttonsHtml}
        </div>
      `;

      // Bind page navigation clicks
      paginationContainer.querySelectorAll('[data-page]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetPage = parseInt(btn.getAttribute('data-page'), 10);
          if (targetPage && targetPage !== this.state.currentPage && targetPage >= 1 && targetPage <= totalPages) {
            this.state.currentPage = targetPage;
            this.renderItems();
            this.renderPagination();

            // Smooth scroll back to top of container
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    /**
     * Resets all filters, search query, and returns to page 1
     */
    resetControls() {
      this.state.searchQuery = '';
      this.state.activeFilter = 'all';
      this.state.currentPage = 1;

      const searchInput = this.container.querySelector('[data-control="search"]');
      if (searchInput) searchInput.value = '';

      const clearBtn = this.container.querySelector('[data-control="clear-search"]');
      if (clearBtn) clearBtn.classList.remove('is-visible');

      const filterBtns = this.container.querySelectorAll('[data-filter-value]');
      filterBtns.forEach(btn => {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-value') === 'all');
      });

      this.applyPipeline();
    }

    /**
     * Shows detail modal for selected item
     */
    showDetailModal(item) {
      let modalElement = document.getElementById('dynamic-data-modal');
      if (!modalElement) {
        modalElement = document.createElement('div');
        modalElement.id = 'dynamic-data-modal';
        modalElement.className = 'modal-backdrop';
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.appendChild(modalElement);
      }

      // Build content based on item type
      let contentHtml = '';
      if (item.category && item.capacity) {
        // Event Item
        const fillPercent = Math.min(100, Math.round((item.registeredCount / item.capacity) * 100));
        contentHtml = `
          <div class="modal-dialog">
            <div class="modal-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.75rem;">${item.icon || '📅'}</span>
                <div>
                  <span class="badge badge-primary" style="margin-bottom: 0.25rem;">${item.category}</span>
                  <h3 class="modal-title" style="margin: 0; font-size: 1.25rem;">${item.title}</h3>
                </div>
              </div>
              <button type="button" class="modal-close-btn" data-modal-close aria-label="Close dialog">&times;</button>
            </div>
            <div class="modal-body">
              <p style="font-size: var(--font-size-md); color: var(--color-text-main); margin-bottom: var(--space-4);">
                ${item.description || item.summary}
              </p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-4); background: var(--color-bg); padding: var(--space-4); border-radius: var(--radius-md);">
                <div><strong>📅 Date:</strong> ${item.formattedDate || item.date}</div>
                <div><strong>⏰ Time:</strong> ${item.time}</div>
                <div><strong>📍 Location:</strong> ${item.location}</div>
                <div><strong>🏛️ Organizer:</strong> ${item.organizer}</div>
                <div><strong>🎟️ Registration:</strong> <span class="badge badge-success">${item.registrationFee || 'Free'}</span></div>
                <div><strong>⚡ Status:</strong> <span class="badge badge-info">${item.status}</span></div>
              </div>

              <div style="margin-bottom: var(--space-4);">
                <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: 4px;">
                  <span>Capacity: ${item.registeredCount} / ${item.capacity} registered</span>
                  <span><strong>${fillPercent}% Filled</strong></span>
                </div>
                <div class="event-capacity-bar" style="height: 8px;">
                  <div class="event-capacity-fill" style="width: ${fillPercent}%; background: ${fillPercent > 85 ? 'var(--color-danger)' : 'var(--color-primary)'};"></div>
                </div>
              </div>

              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: var(--space-2);">
                ${(item.tags || []).map(t => `<span class="badge badge-outline">#${t}</span>`).join('')}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" data-modal-close>Close</button>
              <button type="button" class="btn btn-primary" data-action="register-event" data-item-title="${item.title}">Register Free Now</button>
            </div>
          </div>
        `;
      } else if (item.studentId) {
        // Student Item
        contentHtml = `
          <div class="modal-dialog">
            <div class="modal-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="student-card-avatar" style="width: 50px; height: 50px; font-size: 1.2rem;">${item.avatarInitials}</div>
                <div>
                  <span class="badge badge-${item.status === 'Honors' ? 'warning' : 'primary'}">${item.status} Scholar</span>
                  <h3 class="modal-title" style="margin: 0; font-size: 1.25rem;">${item.name}</h3>
                </div>
              </div>
              <button type="button" class="modal-close-btn" data-modal-close aria-label="Close dialog">&times;</button>
            </div>
            <div class="modal-body">
              <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-4);">
                ${item.bio}
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); background: var(--color-bg); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4);">
                <div><strong>Student ID:</strong> ${item.studentId}</div>
                <div><strong>Department:</strong> ${item.department}</div>
                <div><strong>Semester:</strong> ${item.semester}</div>
                <div><strong>CGPA:</strong> <span class="badge badge-success">${item.cgpa} / 10.0</span></div>
                <div><strong>Attendance:</strong> ${item.attendance}</div>
                <div><strong>Email:</strong> ${item.email}</div>
                <div><strong>Phone:</strong> ${item.phone}</div>
                <div><strong>Enrollment:</strong> Class of ${item.enrollmentYear}</div>
              </div>
              <div style="margin-bottom: var(--space-3);">
                <strong>🏆 Key Achievements:</strong>
                <p style="font-size: var(--font-size-sm); color: var(--color-text-main); margin-top: 4px;">${item.achievements}</p>
              </div>
              <div>
                <strong>Skills &amp; Technologies:</strong>
                <div class="student-card-skills" style="margin-top: 6px;">
                  ${item.skills.map(s => `<span class="student-skill-tag">${s}</span>`).join('')}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" data-modal-close>Close</button>
              <a href="mailto:${item.email}" class="btn btn-primary">&#9993; Send Email</a>
            </div>
          </div>
        `;
      } else if (item.department && item.priority) {
        // Notice Item
        contentHtml = `
          <div class="modal-dialog">
            <div class="modal-header">
              <div>
                <span class="badge badge-${item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'info'}">${item.priority} Priority</span>
                <span class="badge badge-outline">${item.category}</span>
                <h3 class="modal-title" style="margin-top: 0.35rem; font-size: 1.2rem;">${item.title}</h3>
              </div>
              <button type="button" class="modal-close-btn" data-modal-close aria-label="Close dialog">&times;</button>
            </div>
            <div class="modal-body">
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-3);">
                Published on <strong>${item.formattedDate || item.date}</strong> &bull; Issued by <strong>${item.department}</strong>
              </div>
              <div style="line-height: 1.7; color: var(--color-text-main); margin-bottom: var(--space-4);">
                ${item.content}
              </div>
              <div style="background: var(--color-bg); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span aria-hidden="true">&#128206;</span> <strong>Attachment:</strong> ${item.attachmentName}
                </div>
                <button type="button" class="btn btn-xs btn-outline" onclick="window.StudentHub.toast && window.StudentHub.toast('Downloading ${item.attachmentName}...', 'info')">
                  Download PDF &darr;
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-right: auto;">Authority: ${item.author}</span>
              <button type="button" class="btn btn-primary" data-modal-close>Acknowledge Notice</button>
            </div>
          </div>
        `;
      }

      modalElement.innerHTML = contentHtml;

      // Open via StudentHub modal or custom
      if (window.StudentHub && window.StudentHub.modal) {
        window.StudentHub.modal.open('#dynamic-data-modal');
      } else {
        modalElement.classList.add('is-active');
        document.body.classList.add('modal-open');
      }

      // Bind close buttons
      modalElement.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.StudentHub && window.StudentHub.modal) {
            window.StudentHub.modal.close('#dynamic-data-modal');
          } else {
            modalElement.classList.remove('is-active');
            document.body.classList.remove('modal-open');
          }
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. RENDERERS & TEMPLATES FOR DATASETS
     -------------------------------------------------------------------------- */

  // 4.1 Campus Events Renderer
  const EventsAdapter = {
    renderCard(item) {
      const categoryBadges = {
        'Technical': 'badge-primary',
        'Cultural': 'badge-danger',
        'Sports': 'badge-success',
        'Workshops': 'badge-info',
        'Academic': 'badge-secondary'
      };
      const badgeClass = categoryBadges[item.category] || 'badge-primary';
      const fillPercent = Math.min(100, Math.round((item.registeredCount / item.capacity) * 100));

      return `
        <article class="event-card" data-event-id="${item.id}">
          <div class="event-card-header">
            <div class="event-date-badge">
              <span class="event-date-day">${item.day}</span>
              <span class="event-date-month">${item.month}</span>
            </div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge ${badgeClass}">${item.category}</span>
                <span style="font-size: 1.1rem;" title="${item.category}">${item.icon || '📅'}</span>
              </div>
              <h3 style="font-size: var(--font-size-md); margin-top: 0.25rem; margin-bottom: 0;">${item.title}</h3>
            </div>
          </div>
          <div class="event-card-body">
            <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-3); color: var(--color-text-muted); line-height: 1.5;">
              ${item.summary}
            </p>
            <div class="event-meta-item">
              <span aria-hidden="true">&#128205;</span>
              <span>${item.location}</span>
            </div>
            <div class="event-meta-item">
              <span aria-hidden="true">&#9200;</span>
              <span>${item.time}</span>
            </div>
            <div style="margin-top: auto; padding-top: var(--space-2);">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted);">
                <span>Seats: ${item.registeredCount}/${item.capacity}</span>
                <span>${fillPercent}% Full</span>
              </div>
              <div class="event-capacity-bar">
                <div class="event-capacity-fill" style="width: ${fillPercent}%;"></div>
              </div>
            </div>
          </div>
          <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
            <button type="button" class="btn btn-sm btn-outline" data-action="view-detail" data-item-id="${item.id}">
              Details
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="register-event" data-item-title="${item.title}">
              Register Free
            </button>
          </div>
        </article>
      `;
    },

    renderTableRow(item, index) {
      const categoryBadges = {
        'Technical': 'badge-primary',
        'Cultural': 'badge-danger',
        'Sports': 'badge-success',
        'Workshops': 'badge-info',
        'Academic': 'badge-secondary'
      };
      const badgeClass = categoryBadges[item.category] || 'badge-primary';

      return `
        <tr>
          <td><strong>${item.formattedDate || item.date}</strong></td>
          <td>
            <div style="font-weight: 600;">${item.title}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.organizer}</div>
          </td>
          <td><span class="badge ${badgeClass}">${item.category}</span></td>
          <td>${item.location}</td>
          <td>${item.time}</td>
          <td>
            <button type="button" class="btn btn-xs btn-outline" data-action="view-detail" data-item-id="${item.id}">
              View
            </button>
          </td>
        </tr>
      `;
    }
  };

  // 4.2 Student Profiles Renderer
  const StudentsAdapter = {
    renderCard(item) {
      return `
        <article class="student-profile-card" data-student-id="${item.id}">
          <div class="student-card-header">
            <div class="student-card-avatar">${item.avatarInitials}</div>
            <div style="flex: 1; overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge badge-info">${item.studentId}</span>
                <span class="badge badge-${item.status === 'Honors' ? 'warning' : 'primary'}">${item.status}</span>
              </div>
              <h3 style="font-size: var(--font-size-md); margin-top: 0.2rem; margin-bottom: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${item.name}
              </h3>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                ${item.department} &bull; ${item.semester}
              </p>
            </div>
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.5;">
            ${item.bio}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); background: var(--color-bg); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm);">
            <span><strong>CGPA:</strong> ${item.cgpa}</span>
            <span><strong>Attendance:</strong> ${item.attendance}</span>
            <span><strong>Year:</strong> ${item.enrollmentYear}</span>
          </div>
          <div class="student-card-skills">
            ${item.skills.slice(0, 3).map(s => `<span class="student-skill-tag">${s}</span>`).join('')}
            ${item.skills.length > 3 ? `<span class="student-skill-tag">+${item.skills.length - 3}</span>` : ''}
          </div>
          <div style="margin-top: auto; padding-top: var(--space-2); display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-sm btn-outline" data-action="view-detail" data-item-id="${item.id}" style="width: 100%;">
              View Full Profile
            </button>
          </div>
        </article>
      `;
    },

    renderTableRow(item) {
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div class="student-card-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${item.avatarInitials}</div>
              <div>
                <strong>${item.name}</strong>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.email}</div>
              </div>
            </div>
          </td>
          <td><code>${item.studentId}</code></td>
          <td>${item.department}</td>
          <td>${item.semester}</td>
          <td><strong>${item.cgpa}</strong></td>
          <td><span class="badge badge-${item.status === 'Honors' ? 'warning' : 'primary'}">${item.status}</span></td>
          <td>
            <button type="button" class="btn btn-xs btn-outline" data-action="view-detail" data-item-id="${item.id}">
              Inspect
            </button>
          </td>
        </tr>
      `;
    }
  };

  // 4.3 Campus Notices Renderer
  const NoticesAdapter = {
    renderCard(item) {
      const priorityClass = item.priority === 'High' ? 'priority-high' : item.priority === 'Medium' ? 'priority-medium' : 'priority-normal';
      const badgeClass = item.priority === 'High' ? 'badge-danger' : item.priority === 'Medium' ? 'badge-warning' : 'badge-info';

      return `
        <article class="notice-board-card ${priorityClass}">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.25rem;">
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              <span class="badge ${badgeClass}">${item.priority}</span>
              <span class="badge badge-outline">${item.category}</span>
            </div>
            <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${item.formattedDate || item.date}</span>
          </div>
          <h4 style="font-size: var(--font-size-md); margin-top: 0.25rem; margin-bottom: 0;">${item.title}</h4>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; line-height: 1.5;">
            ${item.summary}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--font-size-xs); margin-top: var(--space-2); padding-top: var(--space-2); border-top: 1px solid var(--color-border);">
            <span style="color: var(--color-text-light);">&#127891; ${item.department}</span>
            <button type="button" class="btn btn-xs btn-outline" data-action="view-detail" data-item-id="${item.id}">
              Read Notice &rarr;
            </button>
          </div>
        </article>
      `;
    }
  };

  // 4.4 Dynamic FAQs Renderer
  const FAQsAdapter = {
    renderAccordionItem(item, isOpen = false) {
      return `
        <div class="faq-accordion-item ${isOpen ? 'is-open' : ''}" data-category="${item.category}" data-faq-id="${item.id}">
          <button type="button" class="faq-accordion-header" id="faq-header-${item.id}" aria-expanded="${isOpen}">
            <span>${item.question}</span>
            <span class="faq-accordion-icon" aria-hidden="true">+</span>
          </button>
          <div class="faq-accordion-content" id="faq-content-${item.id}">
            <div class="faq-accordion-inner">
              <div class="faq-accordion-body">
                <p style="margin-bottom: var(--space-3);">${item.answer}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: var(--space-2);">
                  <span>Category: <strong>${item.categoryName || item.category}</strong></span>
                  <div style="display: flex; gap: 0.75rem;">
                    <span>👁️ ${item.views} views</span>
                    <span>👍 ${item.helpfulCount} helpful</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  /* --------------------------------------------------------------------------
     5. INITIALIZERS FOR PAGES
     -------------------------------------------------------------------------- */

  function initDynamicEvents() {
    const eventsSection = document.getElementById('dynamic-events-section');
    if (!eventsSection) return;

    window.StudentHub.eventsController = new DataController({
      resourceName: 'events',
      container: eventsSection,
      searchKeys: ['title', 'category', 'location', 'summary', 'description', 'organizer', 'tags'],
      filterKey: 'category',
      defaultSort: 'date-asc',
      pageSize: 6,
      defaultView: 'grid',
      renderItem: EventsAdapter.renderCard,
      renderTableItem: EventsAdapter.renderTableRow,
      emptyTitle: 'No events found',
      emptyText: 'No campus events match your current search query or category filter.'
    });
  }

  function initDynamicStudents() {
    const studentsSection = document.getElementById('dynamic-students-section');
    if (!studentsSection) return;

    window.StudentHub.studentsController = new DataController({
      resourceName: 'students',
      container: studentsSection,
      searchKeys: ['name', 'studentId', 'department', 'email', 'skills', 'bio'],
      filterKey: 'department',
      defaultSort: 'cgpa-desc',
      pageSize: 6,
      defaultView: 'grid',
      renderItem: StudentsAdapter.renderCard,
      renderTableItem: StudentsAdapter.renderTableRow,
      emptyTitle: 'No students found',
      emptyText: 'No student profiles match your search criteria or selected department.'
    });
  }

  function initDynamicNotices() {
    const noticesSection = document.getElementById('dynamic-notices-section');
    if (!noticesSection) return;

    window.StudentHub.noticesController = new DataController({
      resourceName: 'notices',
      container: noticesSection,
      searchKeys: ['title', 'summary', 'content', 'department', 'category', 'author'],
      filterKey: 'category',
      defaultSort: 'date-desc',
      pageSize: 4,
      defaultView: 'grid',
      renderItem: NoticesAdapter.renderCard,
      emptyTitle: 'No notices found',
      emptyText: 'No campus announcements match your current filter.'
    });
  }

  function initDynamicFAQs() {
    const faqContainer = document.getElementById('dynamic-faq-section');
    if (!faqContainer) return;

    const accordionTarget = faqContainer.querySelector('[data-faq-accordion-target]');
    if (!accordionTarget) return;

    // Load FAQs via Fetch API
    DataFetcher.load('faqs').then(result => {
      const faqs = result.data || [];
      const sourceBadge = faqContainer.querySelector('[data-source-badge]');
      if (sourceBadge) {
        sourceBadge.innerHTML = result.source === 'fetch'
          ? '⚡ Fetched via Fetch API'
          : '📂 Local Data Cache';
      }

      let activeCategory = 'all';
      let searchQuery = '';

      function filterAndRenderFAQs() {
        let filtered = faqs;
        if (searchQuery) {
          filtered = filtered.filter(f => 
            f.question.toLowerCase().includes(searchQuery) || 
            f.answer.toLowerCase().includes(searchQuery) ||
            f.category.toLowerCase().includes(searchQuery)
          );
        }
        if (activeCategory !== 'all') {
          filtered = filtered.filter(f => f.category.toLowerCase() === activeCategory.toLowerCase());
        }

        const countBadge = faqContainer.querySelector('.faq-count-badge');
        if (countBadge) {
          countBadge.textContent = `Showing ${filtered.length} questions`;
        }

        if (filtered.length === 0) {
          accordionTarget.innerHTML = `
            <div class="data-empty-state">
              <span class="data-empty-icon" aria-hidden="true">❓</span>
              <h4 class="data-empty-title">No matching questions found</h4>
              <p class="data-empty-desc">Try different keywords or view all categories.</p>
            </div>
          `;
          return;
        }

        accordionTarget.innerHTML = filtered.map((f, i) => FAQsAdapter.renderAccordionItem(f, i === 0)).join('');

        // Bind accordion expansion toggles
        accordionTarget.querySelectorAll('.faq-accordion-header').forEach(header => {
          header.addEventListener('click', () => {
            const item = header.closest('.faq-accordion-item');
            const wasOpen = item.classList.contains('is-open');
            // Toggle
            item.classList.toggle('is-open', !wasOpen);
            header.setAttribute('aria-expanded', !wasOpen);
          });
        });
      }

      // Initial render
      filterAndRenderFAQs();

      // Search input binding
      const searchInput = faqContainer.querySelector('.faq-search-input');
      const clearBtn = faqContainer.querySelector('.faq-clear-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim().toLowerCase();
          if (clearBtn) clearBtn.classList.toggle('is-visible', searchQuery.length > 0);
          filterAndRenderFAQs();
        });

        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearBtn.classList.remove('is-visible');
            filterAndRenderFAQs();
          });
        }
      }

      // Category buttons binding
      const catBtns = faqContainer.querySelectorAll('.faq-cat-btn');
      catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          catBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          activeCategory = btn.getAttribute('data-category') || 'all';
          filterAndRenderFAQs();
        });
      });

      // Expand / Collapse all
      const expandBtn = faqContainer.querySelector('[data-faq-action="expand-all"]');
      const collapseBtn = faqContainer.querySelector('[data-faq-action="collapse-all"]');
      if (expandBtn) {
        expandBtn.addEventListener('click', () => {
          accordionTarget.querySelectorAll('.faq-accordion-item').forEach(item => {
            item.classList.add('is-open');
            const h = item.querySelector('.faq-accordion-header');
            if (h) h.setAttribute('aria-expanded', 'true');
          });
        });
      }
      if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
          accordionTarget.querySelectorAll('.faq-accordion-item').forEach(item => {
            item.classList.remove('is-open');
            const h = item.querySelector('.faq-accordion-header');
            if (h) h.setAttribute('aria-expanded', 'false');
          });
        });
      }
    });
  }

  // Export to StudentHub global namespace
  window.StudentHub.DataFetcher = DataFetcher;
  window.StudentHub.DataController = DataController;
  window.StudentHub.EventsAdapter = EventsAdapter;
  window.StudentHub.StudentsAdapter = StudentsAdapter;
  window.StudentHub.NoticesAdapter = NoticesAdapter;
  window.StudentHub.FAQsAdapter = FAQsAdapter;

  // Initialize all components when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicEvents();
    initDynamicStudents();
    initDynamicNotices();
    initDynamicFAQs();
  });

})();
