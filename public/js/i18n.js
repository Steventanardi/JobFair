/**
 * i18n — NQU Job Fair Internationalization
 * Supports: English (en), Traditional Chinese (zh)
 */

const I18N = {
  currentLang: localStorage.getItem('nqu-lang') || 'en',

  translations: {
    // ── Navigation ────────────────────────────────────────
    'nav.brand': { en: 'Job Fair', zh: '徵才博覽會' },
    'nav.latest': { en: 'Latest Info', zh: '最新資訊' },
    'nav.employer': { en: 'Employer', zh: '企業登入' },
    'nav.admin': { en: 'Admin', zh: '管理員' },
    'nav.home': { en: 'Home', zh: '首頁' },
    'nav.dashboard': { en: 'Dashboard', zh: '控制台' },
    'nav.logout': { en: 'Logout', zh: '登出' },
    'nav.adminPanel': { en: 'Admin Panel', zh: '管理面板' },

    // ── Hero ──────────────────────────────────────────────
    'hero.badge': { en: 'Career Fair', zh: '徵才博覽會' },
    'hero.title1': { en: 'National Quemoy University', zh: '國立金門大學' },
    'hero.title2': { en: 'Job Fair', zh: '徵才博覽會' },
    'hero.subtitle': { en: 'Connecting top employers with exceptional NQU talent.', zh: '連結優秀企業與金大頂尖人才。' },
    'hero.registerBtn': { en: 'Employer Registration', zh: '企業報名' },
    'hero.learnMore': { en: 'Learn More', zh: '了解更多' },

    // ── Event Cards ───────────────────────────────────────
    'event.date': { en: 'Event Date', zh: '活動日期' },
    'event.dateVal': { en: 'To Be Announced', zh: '待公佈' },
    'event.venue': { en: 'Venue', zh: '活動地點' },
    'event.venueVal': { en: 'NQU Student Activity Center', zh: '金大學生活動中心' },
    'event.open': { en: 'Open For', zh: '開放報名' },
    'event.openVal': { en: 'All Industries', zh: '各行各業' },
    'event.deadline': { en: 'Deadline', zh: '截止日期' },
    'event.deadlineVal': { en: 'To Be Announced', zh: '待公佈' },

    // ── Announcements ─────────────────────────────────────
    'ann.title': { en: 'Latest Information', zh: '最新資訊' },
    'ann.subtitle': { en: 'Stay updated with the latest information about the job fair.', zh: '掌握徵才博覽會最新資訊。' },
    'ann.loading': { en: 'Loading announcements...', zh: '載入公告中...' },
    'ann.empty': { en: 'No Announcements Yet', zh: '目前無公告' },
    'ann.emptyText': { en: 'Check back later for updates.', zh: '請稍後再查看更新。' },
    'ann.pinned': { en: 'Pinned', zh: '置頂' },

    // ── How It Works ──────────────────────────────────────
    'how.title': { en: 'How It Works', zh: '參加流程' },
    'how.step1': { en: 'Register', zh: '註冊帳號' },
    'how.step1desc': { en: 'Create your employer account on our platform.', zh: '在平台上建立企業帳號。' },
    'how.step2': { en: 'Submit', zh: '提交資料' },
    'how.step2desc': { en: 'Fill in company details, upload logo & list job openings.', zh: '填寫公司資料、上傳標誌及職缺。' },
    'how.step3': { en: 'Approval', zh: '等待審核' },
    'how.step3desc': { en: 'Our admin team reviews and approves your submission.', zh: '管理團隊審核您的報名。' },

    // ── Footer ────────────────────────────────────────────
    'footer.brand': { en: 'NQU Job Fair', zh: 'NQU 徵才博覽會' },
    'footer.uni': { en: 'National Quemoy University', zh: '國立金門大學' },
    'footer.copy': { en: '© NQU Career Center. All rights reserved.', zh: '© 金大就業輔導中心 版權所有' },

    // ── Employer Login ────────────────────────────────────
    'empLogin.title': { en: 'Employer Login', zh: '企業登入' },
    'empLogin.subtitle': { en: 'Sign in to manage your submission', zh: '登入以管理您的報名資料' },
    'empLogin.email': { en: 'Email', zh: '電子信箱' },
    'empLogin.password': { en: 'Password', zh: '密碼' },
    'empLogin.submit': { en: 'Sign In', zh: '登入' },
    'empLogin.submitting': { en: 'Signing in...', zh: '登入中...' },
    'empLogin.noAccount': { en: "Don't have an account?", zh: '還沒有帳號？' },
    'empLogin.registerLink': { en: 'Register here', zh: '點此註冊' },
    'empLogin.backHome': { en: '← Back to Home', zh: '← 返回首頁' },

    // ── Employer Register ─────────────────────────────────
    'empReg.title': { en: 'Create Account', zh: '企業註冊' },
    'empReg.subtitle': { en: 'Register to participate in the job fair', zh: '註冊以參加徵才博覽會' },
    'empReg.companyName': { en: 'Company Name', zh: '公司名稱' },
    'empReg.email': { en: 'Email', zh: '電子信箱' },
    'empReg.password': { en: 'Password', zh: '密碼' },
    'empReg.confirmPassword': { en: 'Confirm Password', zh: '確認密碼' },
    'empReg.passwordHint': { en: 'Minimum 6 characters', zh: '至少6個字元' },
    'empReg.submit': { en: 'Create Account', zh: '建立帳號' },
    'empReg.submitting': { en: 'Creating account...', zh: '建立帳號中...' },
    'empReg.hasAccount': { en: 'Already have an account?', zh: '已有帳號？' },
    'empReg.loginLink': { en: 'Sign in here', zh: '點此登入' },
    'empReg.backHome': { en: '← Back to Home', zh: '← 返回首頁' },
    'empReg.mismatch': { en: 'Passwords do not match', zh: '密碼不一致' },

    // ── Employer Dashboard ────────────────────────────────
    'empDash.title': { en: 'Dashboard', zh: '控制台' },
    'empDash.welcome': { en: 'Welcome back!', zh: '歡迎回來！' },
    'empDash.newSub': { en: '+ New Submission', zh: '+ 新增報名' },
    'empDash.noSubs': { en: 'No Submissions Yet', zh: '尚無報名資料' },
    'empDash.noSubsText': { en: 'Create your first submission to participate in the job fair.', zh: '建立您的第一筆報名資料以參加徵才博覽會。' },
    'empDash.edit': { en: 'Edit', zh: '編輯' },
    'empDash.delete': { en: 'Delete', zh: '刪除' },
    'empDash.loading': { en: 'Loading your submissions...', zh: '載入報名資料中...' },
    'empDash.booth': { en: 'Booth', zh: '攤位' },
    'empDash.adminNote': { en: 'Admin note', zh: '管理備註' },
    'empDash.confirmDel': { en: 'Are you sure you want to delete this submission?', zh: '確定要刪除此報名？' },

    // ── Submit Form ───────────────────────────────────────
    'submit.titleNew': { en: 'New Submission', zh: '新增報名' },
    'submit.titleEdit': { en: 'Edit Submission', zh: '編輯報名' },
    'submit.desc': { en: 'Fill in your company details and job information below.', zh: '請填寫以下公司及職缺資訊。' },
    'submit.companyInfo': { en: 'Company Information', zh: '公司資訊' },
    'submit.companyName': { en: 'Company Name', zh: '公司名稱' },
    'submit.industry': { en: 'Industry', zh: '產業類別' },
    'submit.selectIndustry': { en: 'Select industry', zh: '選擇產業' },
    'submit.logo': { en: 'Company Logo', zh: '公司標誌' },
    'submit.logoClick': { en: 'Click to upload', zh: '點擊上傳' },
    'submit.logoDrag': { en: 'or drag and drop', zh: '或拖曳檔案' },
    'submit.logoHint': { en: 'PNG, JPG, SVG up to 5MB', zh: 'PNG, JPG, SVG 最大5MB' },
    'submit.intro': { en: 'Company Introduction', zh: '公司簡介' },
    'submit.introPlace': { en: 'Brief description of your company...', zh: '簡要描述貴公司...' },
    'submit.contactInfo': { en: 'Contact Information', zh: '聯絡資訊' },
    'submit.contactPerson': { en: 'Contact Person', zh: '聯絡人' },
    'submit.contactEmail': { en: 'Contact Email', zh: '聯絡信箱' },
    'submit.contactPhone': { en: 'Contact Phone', zh: '聯絡電話' },
    'submit.jobInfo': { en: 'Job Information', zh: '職缺資訊' },
    'submit.positions': { en: 'Job Positions', zh: '職缺名稱' },
    'submit.positionsHint': { en: 'List each position on a new line', zh: '每個職缺請換行填寫' },
    'submit.requirements': { en: 'Requirements', zh: '職缺條件' },
    'submit.benefits': { en: 'Benefits & Perks', zh: '福利待遇' },
    'submit.cancel': { en: 'Cancel', zh: '取消' },
    'submit.submitBtn': { en: 'Submit', zh: '提交報名' },
    'submit.updateBtn': { en: 'Update', zh: '更新' },
    'submit.submitting': { en: 'Submitting...', zh: '提交中...' },
    'submit.optional': { en: 'optional', zh: '選填' },
    'submit.back': { en: '← Dashboard', zh: '← 返回' },

    // ── Industry Options ──────────────────────────────────
    'ind.tech': { en: 'Technology', zh: '科技業' },
    'ind.finance': { en: 'Finance', zh: '金融業' },
    'ind.manufacturing': { en: 'Manufacturing', zh: '製造業' },
    'ind.healthcare': { en: 'Healthcare', zh: '醫療業' },
    'ind.education': { en: 'Education', zh: '教育業' },
    'ind.retail': { en: 'Retail', zh: '零售業' },
    'ind.hospitality': { en: 'Hospitality', zh: '餐旅業' },
    'ind.construction': { en: 'Construction', zh: '營建業' },
    'ind.government': { en: 'Government', zh: '政府機關' },
    'ind.other': { en: 'Other', zh: '其他' },

    // ── Admin Login ───────────────────────────────────────
    'admLogin.title': { en: 'Admin Login', zh: '管理員登入' },
    'admLogin.subtitle': { en: 'Access the administration panel', zh: '進入管理面板' },
    'admLogin.username': { en: 'Username', zh: '帳號' },
    'admLogin.password': { en: 'Password', zh: '密碼' },
    'admLogin.submit': { en: 'Sign In', zh: '登入' },
    'admLogin.submitting': { en: 'Signing in...', zh: '登入中...' },
    'admLogin.backHome': { en: '← Back to Home', zh: '← 返回首頁' },

    // ── Admin Dashboard ───────────────────────────────────
    'adm.panelLabel': { en: 'Admin Panel', zh: '管理面板' },
    'adm.submissions': { en: 'Submissions', zh: '報名管理' },
    'adm.employers': { en: 'Employers', zh: '企業帳號' },
    'adm.announcements': { en: 'Announcements', zh: '公告' },
    'adm.logout': { en: 'Logout', zh: '登出' },
    'adm.home': { en: 'Home', zh: '首頁' },
    'adm.statTotal': { en: 'Total', zh: '總計' },
    'adm.statPending': { en: 'Pending', zh: '待審核' },
    'adm.statApproved': { en: 'Approved', zh: '已通過' },
    'adm.statRejected': { en: 'Rejected', zh: '已拒絕' },
    'adm.searchPlace': { en: 'Search company, contact...', zh: '搜尋公司、聯絡人...' },
    'adm.all': { en: 'All', zh: '全部' },
    'adm.pending': { en: 'Pending', zh: '待審' },
    'adm.approved': { en: 'Approved', zh: '通過' },
    'adm.rejected': { en: 'Rejected', zh: '拒絕' },
    'adm.thLogo': { en: 'Logo', zh: '標誌' },
    'adm.thCompany': { en: 'Company', zh: '公司' },
    'adm.thIndustry': { en: 'Industry', zh: '產業' },
    'adm.thContact': { en: 'Contact', zh: '聯絡人' },
    'adm.thStatus': { en: 'Status', zh: '狀態' },
    'adm.thBooth': { en: 'Booth', zh: '攤位' },
    'adm.thDate': { en: 'Date', zh: '日期' },
    'adm.thActions': { en: 'Actions', zh: '操作' },
    'adm.noSubs': { en: 'No submissions found', zh: '無報名資料' },
    'adm.empTitle': { en: 'Employer Accounts', zh: '企業帳號' },
    'adm.thId': { en: 'ID', zh: '編號' },
    'adm.thEmail': { en: 'Email', zh: '信箱' },
    'adm.thSubCount': { en: 'Submissions', zh: '報名數' },
    'adm.thRegistered': { en: 'Registered', zh: '註冊日' },
    'adm.annTitle': { en: 'Announcements', zh: '公告管理' },
    'adm.newAnn': { en: '+ New', zh: '+ 新增公告' },
    'adm.thAnnTitle': { en: 'Title', zh: '標題' },
    'adm.thPinned': { en: 'Pinned', zh: '置頂' },
    'adm.thPriority': { en: 'Priority', zh: '優先' },
    'adm.thCreated': { en: 'Created', zh: '建立日' },
    'adm.reviewTitle': { en: 'Review Submission', zh: '審核報名' },
    'adm.adminNotes': { en: 'Admin Notes', zh: '管理備註' },
    'adm.adminNotesPlace': { en: 'Reason for approval/rejection...', zh: '通過/拒絕原因...' },
    'adm.reject': { en: '✕ Reject', zh: '✕ 拒絕' },
    'adm.approve': { en: '✓ Approve', zh: '✓ 通過' },
    'adm.assignBooth': { en: 'Assign Booth', zh: '分配攤位' },
    'adm.boothNumber': { en: 'Booth Number', zh: '攤位編號' },
    'adm.assign': { en: 'Assign', zh: '分配' },
    'adm.newAnnTitle': { en: 'New Announcement', zh: '新增公告' },
    'adm.editAnnTitle': { en: 'Edit Announcement', zh: '編輯公告' },
    'adm.annFormTitle': { en: 'Title', zh: '標題' },
    'adm.annFormContent': { en: 'Content', zh: '內容' },
    'adm.annFormPriority': { en: 'Priority', zh: '優先級' },
    'adm.annFormPinned': { en: 'Pinned', zh: '置頂' },
    'adm.yes': { en: 'Yes', zh: '是' },
    'adm.no': { en: 'No', zh: '否' },
    'adm.save': { en: 'Save', zh: '儲存' },
    'adm.cancel': { en: 'Cancel', zh: '取消' },
    'adm.delete': { en: 'Delete', zh: '刪除' },
    'adm.edit': { en: 'Edit', zh: '編輯' },
    'adm.detail': { en: 'Submission Detail', zh: '報名詳情' },
    'adm.confirmDelSub': { en: 'Delete this submission? This cannot be undone.', zh: '確認刪除此報名？此操作無法復原。' },
    'adm.confirmDelEmp': { en: 'Delete employer and ALL their submissions?', zh: '確認刪除企業及其所有報名？' },
    'adm.confirmDelAnn': { en: 'Delete this announcement?', zh: '確認刪除此公告？' },
    'adm.loading': { en: 'Loading...', zh: '載入中...' },
    'adm.downloadLogo': { en: 'Download Logo', zh: '下載標誌' },
    'adm.resetPassword': { en: 'Reset Password', zh: '重設密碼' },
    'adm.resetPwTitle': { en: 'Reset Employer Password', zh: '重設企業密碼' },
    'adm.newPassword': { en: 'New Password', zh: '新密碼' },
    'adm.newPwPlace': { en: 'Enter new password (min 6 chars)', zh: '輸入新密碼（至少6個字元）' },
    'adm.resetBtn': { en: 'Reset Password', zh: '重設密碼' },
    'empLogin.forgot': { en: 'Forgot your password?', zh: '忘記密碼？' },
    'empLogin.forgotTip': { en: 'Contact the admin to reset it.', zh: '請聯繫管理員重設密碼。' },

    // ── Toasts / Messages ─────────────────────────────────
    'msg.loginSuccess': { en: 'Login successful!', zh: '登入成功！' },
    'msg.pwResetOk': { en: 'Password has been reset!', zh: '密碼已重設！' },
    'msg.regSuccess': { en: 'Account created! Redirecting...', zh: '帳號建立成功！' },
    'msg.welcomeAdmin': { en: 'Welcome, Admin!', zh: '歡迎，管理員！' },
    'msg.logoutFail': { en: 'Logout failed', zh: '登出失敗' },
    'msg.subCreated': { en: 'Submission created!', zh: '已提交！' },
    'msg.subUpdated': { en: 'Submission updated!', zh: '已更新！' },
    'msg.subDeleted': { en: 'Submission deleted', zh: '已刪除' },
    'msg.subApproved': { en: 'Submission approved!', zh: '已通過！' },
    'msg.subRejected': { en: 'Submission rejected!', zh: '已拒絕！' },
    'msg.boothAssigned': { en: 'Booth assigned!', zh: '攤位已分配！' },
    'msg.annCreated': { en: 'Announcement created!', zh: '已新增！' },
    'msg.annUpdated': { en: 'Announcement updated!', zh: '已更新！' },
    'msg.annDeleted': { en: 'Announcement deleted', zh: '已刪除' },
    'msg.empDeleted': { en: 'Employer deleted', zh: '已刪除' },
    'msg.required': { en: 'Title and content are required', zh: '請填寫標題和內容' },
  },

  /**
   * Get translated text
   */
  t(key) {
    const entry = this.translations[key];
    if (!entry) return key;
    return entry[this.currentLang] || entry['en'] || key;
  },

  /**
   * Switch language
   */
  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('nqu-lang', lang);
    this.applyAll();
    // Update toggle button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
    });
  },

  /**
   * Apply translations to all [data-i18n] elements on the page
   */
  applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
  },

  /**
   * Create and insert the language toggle into a container
   */
  createToggle(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.innerHTML = `
      <button class="lang-btn ${this.currentLang === 'en' ? 'lang-btn--active' : ''}" data-lang="en" onclick="I18N.setLang('en')">EN</button>
      <button class="lang-btn ${this.currentLang === 'zh' ? 'lang-btn--active' : ''}" data-lang="zh" onclick="I18N.setLang('zh')">中文</button>
    `;
    container.appendChild(toggle);
  },

  /**
   * Initialize — apply translations and create toggle
   */
  init(toggleContainerId) {
    if (toggleContainerId) {
      this.createToggle(toggleContainerId);
    }
    this.applyAll();
  }
};
