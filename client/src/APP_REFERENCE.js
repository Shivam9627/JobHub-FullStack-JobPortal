/**
 * NOVANECTOR JOB PORTAL - COMPLETE PAGE & FEATURE REFERENCE
 * ==========================================================
 * 
 * This file documents all pages, features, and how to access them
 */

// ============================================
// PAGE MAP & ROUTES
// ============================================

const PAGES = {
  // PUBLIC PAGES
  landing: {
    path: '/',
    name: 'Landing Page',
    description: 'Home page with hero section, features, and job preview',
    access: 'Public - No login required',
    features: [
      'Animated hero section with background blobs',
      'Feature showcase (4 cards)',
      'Popular jobs preview (6 jobs)',
      'Search bar for job search',
      'Role selection buttons',
      'Professional footer',
      'Responsive navbar with login/signup buttons'
    ],
    components_used: [
      'Framer Motion (animations)',
      'lucide-react (icons)',
      'React Router (navigation)'
    ]
  },

  login: {
    path: '/login',
    name: 'Login Page',
    description: 'User authentication page',
    access: 'Public - No login required',
    features: [
      'Email input field',
      'Password input with show/hide toggle',
      'Form validation',
      'Login button',
      'Forgot password link',
      'Sign up link',
      'Error messages',
      'Success toast notification',
      'Auto-redirect to dashboard after login'
    ],
    how_to_use: [
      '1. Click "Login" button on navbar',
      '2. Enter any email and 6+ character password',
      '3. Click "Login" button',
      '4. Auto-redirected to dashboard'
    ]
  },

  signup: {
    path: '/signup',
    name: 'Sign Up Page',
    description: 'User registration with role selection',
    access: 'Public - No login required',
    features: [
      'Role selector toggle (Job Seeker / Recruiter)',
      'Name input field',
      'Email input with validation',
      'Phone number input',
      'Company name input (for recruiters only)',
      'Password input with show/hide toggle',
      'Confirm password input',
      'Form validation',
      'Password matching check',
      'Dynamic form fields based on role',
      'Error messages for validation failures',
      'Success notification on signup',
      'Auto-redirect based on selected role'
    ],
    conditional_fields: {
      job_seeker: ['name', 'email', 'phone', 'password', 'confirm_password'],
      recruiter: ['name', 'email', 'phone', 'company', 'password', 'confirm_password']
    },
    how_to_use: [
      '1. Click "Sign Up" button on navbar',
      '2. Choose role (Job Seeker or Recruiter)',
      '3. Fill in all required fields',
      '4. Password must be 6+ characters',
      '5. Confirm password must match',
      '6. Click "Create Account"',
      '7. Auto-redirect to appropriate dashboard'
    ]
  },

  // AUTHENTICATED PAGES
  jobs_seeker: {
    path: '/jobs-seeker',
    name: 'Job Seeker Dashboard',
    description: 'Search and filter jobs, apply, and save jobs',
    access: 'Protected - Job Seeker login required',
    features: [
      'Advanced job search',
      'Keyword search (title, company, skill)',
      'Location filter dropdown',
      'Job type filter',
      'Salary range filter',
      'Clear filters button',
      'Job listing grid (responsive)',
      'Job cards with all details',
      'Save/bookmark jobs',
      'Apply button with confirmation',
      'Results counter',
      'Empty state message',
      'Hover effects on cards',
      'Mobile responsive'
    ],
    filters_available: {
      location: ['All', 'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Austin', 'Seattle', 'Boston'],
      job_type: ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      salary: ['All', '0-50k', '50-100k', '100-150k', '150k+']
    },
    sample_data: {
      total_jobs: 12,
      skills_shown: 30,
      companies: 12,
      locations: 8
    },
    how_to_use: [
      '1. Login or Sign Up as Job Seeker',
      '2. You\'ll land on /jobs-seeker page',
      '3. Use search bar to find jobs by keyword',
      '4. Use filters to narrow down results',
      '5. Click "Apply Now" to apply',
      '6. Click bookmark icon to save jobs',
      '7. Click job title to view full details'
    ]
  },

  recruiter_dashboard: {
    path: '/recruiter-dashboard',
    name: 'Recruiter Dashboard',
    description: 'Post jobs, manage listings, view applications',
    access: 'Protected - Recruiter login required',
    features: [
      'Dashboard statistics (4 cards)',
      'Active jobs counter',
      'Total applications counter',
      'Total views counter',
      'Profile visits counter',
      'Job management interface',
      'Posted jobs list',
      'Job details per posting',
      'View button for each job',
      'Edit button for each job',
      'Delete button for each job',
      'Post New Job modal',
      'Job form with validation',
      'Empty state guide',
      'Success/error notifications'
    ],
    dashboard_stats: [
      'Active Jobs - Number of jobs posted',
      'Total Applications - All applications received',
      'Total Views - Job posting views',
      'Profile Visits - Company profile visits'
    ],
    job_posting_form: {
      required_fields: ['title', 'location', 'salary'],
      optional_fields: ['description', 'skills_required', 'experience', 'company_info'],
      job_type_options: ['Full-time', 'Part-time', 'Contract', 'Freelance']
    },
    how_to_use: [
      '1. Login or Sign Up as Recruiter',
      '2. You\'ll land on /recruiter-dashboard',
      '3. See dashboard statistics',
      '4. Click "Post New Job" button',
      '5. Fill in job details in modal',
      '6. Click "Post Job" button',
      '7. Job appears in your postings list',
      '8. Click View/Edit/Delete to manage jobs'
    ]
  },

  job_details: {
    path: '/job-details',
    name: 'Job Details Page',
    description: 'View detailed information about a specific job',
    access: 'Public - No login required',
    features: [
      'Full job information display',
      'Company name and job title',
      'Job location, salary, type, experience',
      'Job description section',
      'Responsibilities and requirements',
      'Required skills list',
      'Benefits & perks section (8+ items)',
      'Company information card',
      'Company about section',
      'Job statistics',
      'Applicant count',
      'Job view count',
      'Posted date',
      'Apply button',
      'Save/bookmark button',
      'Share job link',
      'Back navigation',
      'Responsive 2-column layout',
      'Mobile optimized single column'
    ],
    job_information: [
      'Title and company',
      'Location and salary',
      'Job type and experience',
      'Full description',
      'Required skills',
      'Benefits offered',
      'Company details',
      'Application statistics'
    ],
    how_to_use: [
      '1. From /jobs-seeker page',
      '2. Click on a job card',
      '3. Or navigate directly to /job-details',
      '4. View all job information',
      '5. Click "Apply Now" to apply',
      '6. Click bookmark to save',
      '7. Click share to copy job link',
      '8. Click "Back to Jobs" to return'
    ]
  },

  dashboard: {
    path: '/dashboard',
    name: 'User Dashboard',
    description: 'General user dashboard',
    access: 'Protected - Login required',
    features: [
      'User profile information',
      'Account settings',
      'Dashboard navigation'
    ]
  }
};

// ============================================
// COMPONENTS & THEIR FEATURES
// ============================================

const COMPONENTS = {
  Navbar: {
    location: 'src/components/Navbar.jsx',
    type: 'Navigation',
    features: [
      'Fixed positioning (top of page)',
      'Logo with home link',
      'Desktop navigation menu',
      'Mobile hamburger menu',
      'Auth-aware menu items',
      'Login/signup buttons',
      'Welcome message when logged in',
      'Logout button',
      'Role-based menu items',
      'Dark theme with glass effect',
      'Responsive design',
      'Smooth animations'
    ]
  },

  Layout: {
    location: 'src/components/layout/Layout.jsx',
    type: 'Wrapper',
    features: [
      'Wraps pages with navbar',
      'Includes footer',
      'Consistent spacing',
      'Background gradient',
      'Min height of screen'
    ]
  },

  Landing: {
    location: 'src/pages/Landing.jsx',
    type: 'Page',
    features: [
      'Hero section with animations',
      'Background blob animations',
      'Features showcase',
      'Job preview cards',
      'Footer section',
      'Responsive layout'
    ]
  },

  Login: {
    location: 'src/pages/Login.jsx',
    type: 'Page',
    features: [
      'Email input',
      'Password input',
      'Show/hide password toggle',
      'Form validation',
      'Error messages',
      'Success notification',
      'Links to signup and home'
    ]
  },

  Signup: {
    location: 'src/pages/Signup.jsx',
    type: 'Page',
    features: [
      'Role selection toggle',
      'Multiple form fields',
      'Conditional fields based on role',
      'Show/hide password toggles',
      'Form validation',
      'Password matching',
      'Error messages',
      'Success notification',
      'Auto-redirect based on role'
    ]
  },

  JobsSeeker: {
    location: 'src/pages/JobsSeeker.jsx',
    type: 'Page',
    features: [
      'Search functionality',
      'Multiple filter dropdowns',
      'Job listing grid',
      'Job cards with details',
      'Save/bookmark toggle',
      'Apply button',
      'Results counter',
      'Empty state message',
      'Responsive layout',
      'Real-time filtering'
    ]
  },

  RecruiterDashboard: {
    location: 'src/pages/RecruiterDashboard.jsx',
    type: 'Page',
    features: [
      'Dashboard statistics',
      'Job management list',
      'Post new job modal',
      'Job form with validation',
      'Edit/delete job buttons',
      'Empty state guide',
      'Toast notifications',
      'Responsive design'
    ]
  },

  JobDetailsPage: {
    location: 'src/pages/JobDetailsPage.jsx',
    type: 'Page',
    features: [
      'Full job information',
      'Job description',
      'Skills list',
      'Benefits list',
      'Company information',
      'Job statistics',
      'Apply button',
      'Save job button',
      'Share button',
      'Responsive 2-column layout'
    ]
  }
};

// ============================================
// FEATURE QUICK REFERENCE
// ============================================

const FEATURES_BY_USER = {
  non_authenticated_user: {
    can_access: ['/', '/login', '/signup', '/job-details'],
    can_do: [
      'View landing page',
      'See popular jobs',
      'Read job details',
      'Login to account',
      'Create new account'
    ]
  },

  job_seeker: {
    can_access: ['/', '/jobs-seeker', '/job-details', '/dashboard'],
    can_do: [
      'Search jobs',
      'Filter by location',
      'Filter by job type',
      'Filter by salary',
      'Apply to jobs',
      'Save jobs',
      'View job details',
      'See application confirmation'
    ]
  },

  recruiter: {
    can_access: ['/', '/recruiter-dashboard', '/dashboard'],
    can_do: [
      'Post new jobs',
      'View job postings',
      'Edit job listings',
      'Delete job postings',
      'See job statistics',
      'View applications',
      'See engagement metrics'
    ]
  }
};

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_JOBS = [
  {
    title: 'Senior React Developer',
    company: 'Tech Innovations Inc',
    location: 'New York',
    salary: '120-150k',
    type: 'Full-time'
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Solutions',
    location: 'San Francisco',
    salary: '100-130k',
    type: 'Full-time'
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Los Angeles',
    salary: '80-110k',
    type: 'Full-time'
  },
  {
    title: 'Node.js Developer',
    company: 'Backend Solutions',
    location: 'Austin',
    salary: '110-140k',
    type: 'Full-time'
  },
  {
    title: 'Full Stack Developer',
    company: 'WebTech Corp',
    location: 'New York',
    salary: '130-160k',
    type: 'Full-time'
  },
  {
    title: 'Junior Developer',
    company: 'StartUp Hub',
    location: 'Remote',
    salary: '60-80k',
    type: 'Full-time'
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Seattle',
    salary: '125-155k',
    type: 'Full-time'
  },
  {
    title: 'QA Engineer',
    company: 'Quality First',
    location: 'Boston',
    salary: '70-95k',
    type: 'Contract'
  },
  {
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'San Francisco',
    salary: '140-180k',
    type: 'Full-time'
  },
  {
    title: 'Freelance Writer',
    company: 'Content Agency',
    location: 'Remote',
    salary: '30-60k',
    type: 'Freelance'
  },
  {
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'New York',
    salary: '130-170k',
    type: 'Full-time'
  },
  {
    title: 'Mobile Developer',
    company: 'App Builders',
    location: 'Remote',
    salary: '100-130k',
    type: 'Full-time'
  }
];

// ============================================
// KEYBOARD NAVIGATION & ACCESSIBILITY
// ============================================

const ACCESSIBILITY = {
  keyboard_shortcuts: [
    'Tab - Navigate through interactive elements',
    'Enter - Activate buttons and submit forms',
    'Space - Toggle checkboxes and buttons',
    'Escape - Close modals'
  ],
  
  screen_reader_support: [
    'Alt text on images',
    'ARIA labels on buttons',
    'Semantic HTML structure',
    'Color not the only indicator'
  ],

  mobile_optimization: [
    'Touch-friendly button sizes',
    'Readable font sizes',
    'Proper spacing',
    'Responsive layouts',
    'Mobile-first design'
  ]
};

// ============================================
// PERFORMANCE METRICS
// ============================================

const PERFORMANCE = {
  page_load_time: 'Sub 1 second (with Vite HMR)',
  animation_performance: '60 FPS (hardware accelerated)',
  responsive_breakpoints: [
    '320px - Mobile phones',
    '768px - Tablets',
    '1024px - Desktops',
    '1280px - Large screens'
  ],
  bundle_size: 'Optimized with Vite',
  code_splitting: 'Available for expansion'
};

export {
  PAGES,
  COMPONENTS,
  FEATURES_BY_USER,
  SAMPLE_JOBS,
  ACCESSIBILITY,
  PERFORMANCE
};
