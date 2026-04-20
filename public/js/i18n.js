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

    // ── Submit Form (General) ─────────────────────────────
    'submit.back': { en: '← Dashboard', zh: '← 返回控制台' },
    'submit.formTitle': { en: 'NQU 2026 Campus Job Fair Registration', zh: '2026 國立金門大學校園巡迴博覽會報名表' },
    'submit.formSubtitle': { en: 'Please complete all required fields below.', zh: '請完整填寫以下各項資料。' },
    'submit.titleEdit': { en: 'Edit Submission', zh: '編輯報名資料' },

    // ── Section & Card Titles ─────────────────────────────
    'sec1.title': { en: 'Part 1: Registration Category', zh: '第一部分：報名類別' },
    'sec1.subtitle': { en: 'Please select your participation type', zh: '請選擇參加博覽會之報名類別' },
    'sec1.q1': { en: 'Activity Category', zh: '活動類別' },
    'sec1.opt1': { en: '【On-site Recruitment】 Companies recruiting students and Kinmen residents on-site at the job fair', zh: '【現場徵才】各企業單位至現場與本校學生、金門鄉親進行徵才面談。' },
    'sec1.opt2': { en: '【Resume Collection】 Resumes collected by the organizer and forwarded to employers', zh: '【代收履歷】各企業單位由本單位代為收受應徵者之履歷，由主辦單位彙整後轉交各單位。' },
    'sec1.opt3': { en: '【Public Welfare Promotion】 Government agencies, charities and other organizations promoting their services', zh: '【現場公益宣導】各公益單位至現場宣導、推廣公益服務或提供諮詢等。' },

    'sec2.title': { en: 'Part 2: On-site Recruitment — Basic Information', zh: '第二部分（現場徵才類）：單位基本資料' },
    'sec2.subtitle': { en: 'Please fill in your company details accurately', zh: '請正確填寫貴單位之基本資料' },
    'sec2b.title': { en: 'Part 3: Recruitment & Internship Details', zh: '第三部分（現場徵才類）：招募與實習資訊' },
    'sec2b.subtitle': { en: 'Specify internship history and target departments', zh: '填寫與本校之實習合作紀錄及目標徵才系所' },

    'sec3.title': { en: 'Part 2: Resume Collection — Basic Information', zh: '第二部分（代收履歷類）：單位基本資料' },
    'sec3.subtitle': { en: 'Please fill in your company details accurately', zh: '請正確填寫貴單位之基本資料' },

    'sec4.title': { en: 'Part 2: Public Welfare — Organization Information', zh: '第二部分（公益宣導類）：單位基本資料' },
    'sec4.subtitle': { en: 'Please fill in your organization details', zh: '請正確填寫貴單位之基本資料' },

    'sec5.title': { en: 'Part 4: Event Logistics', zh: '第四部分：活動行政庶務' },
    'sec5.subtitle': { en: 'Attendance, meals and parking requests', zh: '出席人員、午餐與停車資訊' },

    // ── Question Labels ──────────────────────────────────
    'q.isPrev': { en: 'Have you previously participated in NQU\'s Job Fair?', zh: '貴單位是否曾參加過金門大學校際及校園徵才博覽會？' },
    'q.companyName': { en: 'Company / Organization Full Name', zh: '公司/單位全名' },
    'q.boothName': { en: 'Booth Signboard Name', zh: '攤位看板名稱' },
    'q.logo': { en: 'Company / Organization Logo (JPG / PNG)', zh: '公司/單位 LOGO（圖檔：JPG/PNG）' },
    'q.logoHint': { en: 'Click to upload image file', zh: '點擊上傳圖片' },
    'q.intro': { en: 'Company / Organization Introduction', zh: '公司/單位簡介' },
    'q.introHint': { en: 'Recommended within 100 words', zh: '建議100字以內' },
    'q.ceoName': { en: 'Responsible Person Name', zh: '負責人姓名' },
    'q.taxId': { en: 'Business Registration Number (Unified Business No.)', zh: '統一編號' },
    'q.industry': { en: 'Industry Type', zh: '產業類型' },
    'q.mainProducts': { en: 'Main Products / Business Description', zh: '主要產品/業務說明' },
    'q.unitName': { en: 'Organization Full Name', zh: '單位全名' },
    'q.groupType': { en: 'Organization / Group Type', zh: '請選擇貴單位的團體類型' },
    'q.industry': { en: 'Industry Type', zh: '產業類別' },
    'q.taxId': { en: 'Business Registration Number (Tax ID)', zh: '統一編號' },
    'q.boothName': { en: 'Company Name on Booth Signboard', zh: '攤位招牌名稱（不超過 10 字）' },
    'q.estDate': { en: 'Establishment / Registration Approval Date', zh: '成立日期或准予立案日期' },
    'q.internship': { en: 'Has your unit previously cooperated with NQU departments for internships?', zh: '貴單位是否與本校系所進行過實習合作？（可複選）' },
    'q.targetDepts': { en: 'Which NQU departments are you looking to recruit graduates from? (Multiple select)', zh: '貴單位欲尋找本校哪些系所之畢業生？（可複選）' },
    'q.contactWindow': { en: 'Contact Person, Phone Number & Email', zh: '聯繫窗口姓名、聯繫方式（手機/市話）及 Email' },
    'q.mailingAddr': { en: 'Company / Organization Mailing Address', zh: '通訊地址' },
    'q.attendeeMain': { en: 'Main Responsible Person on the Day (Full Name / Job Title / Mobile)', zh: '博覽會當日出席人員－主要負責人（姓名/職稱/手機）' },
    'q.attendeeCount': { en: 'Estimated total number of attendees on the day (including the main person)', zh: '博覽會當日預計出席總人數（含主要負責人）' },
    'q.lunchNonVeg': { en: 'Number of Regular (Non-Vegetarian) Lunch Boxes needed', zh: '午餐需求：葷食便當數量' },
    'q.lunchVeg': { en: 'Number of Vegetarian Lunch Boxes needed', zh: '午餐需求：素食便當數量' },
    'q.lunchHint': { en: 'Total number of both lunch box types must not exceed 3', zh: '葷食與素食便當總數不得超過 3 個' },
    'q.raffle': { en: 'Raffle Prize Sponsorship from your company', zh: '是否願意提供抽獎獎品（請說明獎品內容，如不提供請填「無」）' },
    'q.raffleHint': { en: 'Please describe the item(s). Enter "None" if not providing any.', zh: '請填寫獎品名稱及數量。若不提供請填「無」。' },
    'q.parking': { en: 'Number of parking spaces required on the event day (license plate required for entry)', zh: '汽車停車位需求數量（當日提供車牌始可入內）' },
    'q.otherReqs': { en: 'Other Requirements or Remarks', zh: '其他需求說明' },
    'q.emailConfirm': { en: 'Acknowledge: Submit the Job Vacancy Form by email', zh: '請下載職缺資料表，填寫後以 Email 寄回主辦單位' },
    'q.emailConfirmHint': { en: 'After completing this registration form, please download the Job Vacancy Data Sheet from the website, fill it in, and email it to the organizing unit before the deadline.', zh: '完成報名後，請至活動網站下載「職缺資料表」，填寫完畢後以 Email 寄回主辦單位，逾期視同放棄。' },

    // ── Answer Options ────────────────────────────────────
    'opt.yes': { en: 'Yes', zh: '是' },
    'opt.no': { en: 'No', zh: '否' },
    'opt.notSure': { en: 'Not Sure', zh: '不太清楚' },
    'opt.selectOne': { en: '-- Please Select --', zh: '-- 請選擇 --' },
    'opt.attend1': { en: '1 person (minimum)', zh: '1 人（最少）' },
    'opt.attend2': { en: '2 people', zh: '2 人' },
    'opt.attend3': { en: '3 people (maximum)', zh: '3 人（最多）' },
    'opt.pAttend1': { en: '1 person', zh: '1 人' },
    'opt.pAttend2': { en: '2 people', zh: '2 人' },
    'opt.groupSocial': { en: 'Social Group (社會團體)', zh: '社會團體' },
    'opt.groupProf': { en: 'Professional Group (職業團體)', zh: '職業團體' },
    'opt.groupIntlOff': { en: 'International Office (國際辦事處)', zh: '國際辦事處' },
    'opt.groupIntlNGO': { en: 'International NGO (國際性民間團體)', zh: '國際性民間團體' },
    'opt.noProb': { en: 'Acknowledged — No problem 🆗', zh: '已確認，沒問題 🆗' },

    // ── Buttons ───────────────────────────────────────────
    'btn.submit': { en: 'Submit Registration', zh: '提交報名表' },
    'btn.update': { en: 'Update Registration', zh: '更新報名資料' },
    'btn.submitting': { en: 'Submitting...', zh: '提交中...' },
    'btn.cancel': { en: 'Cancel', zh: '取消' },

    // ── Error messages ────────────────────────────────────
    'err.selectCategory': { en: 'Please select a registration category first.', zh: '請先選擇報名類別。' },
    'err.general': { en: 'An error occurred. Please try again.', zh: '發生錯誤，請重試。' },
    'err.pwTooShort': { en: 'Password must be at least 6 characters', zh: '密碼至少6個字元' },

    // ── NQU Departments (Official 2026 Full Names) ────────
    'dep.none': { en: 'None (No internship cooperation)', zh: '無（未有合作）' },
    'dep.unlimited': { en: 'Unlimited — Open to graduates of all departments', zh: '不限系所（各系皆收）' },
    'dep.chinese': { en: 'Department of Chinese Literature', zh: '華語文學系' },
    'dep.english': { en: 'Department of Applied English', zh: '應用英語學系' },
    'dep.marine': { en: 'Department of Ocean and Border Management', zh: '海洋與邊境管理學系' },
    'dep.intl': { en: 'Department of International and Mainland China Affairs', zh: '國際暨大陸事務學系' },
    'dep.architecture': { en: 'Department of Architecture', zh: '建築學系' },
    'dep.urban': { en: 'Department of Urban Planning and Landscape Architecture', zh: '都市計畫與景觀學系' },
    'dep.civil': { en: 'Department of Civil Engineering and Engineering Management', zh: '土木與工程管理學系' },
    'dep.computer': { en: 'Department of Computer Science and Information Engineering', zh: '資訊工程學系' },
    'dep.electric': { en: 'Department of Electrical Engineering', zh: '電機工程學系' },
    'dep.food': { en: 'Department of Food Science', zh: '食品科學系' },
    'dep.business': { en: 'Department of Business Administration', zh: '企業管理學系' },
    'dep.tourism': { en: 'Department of Tourism Management', zh: '觀光管理學系' },
    'dep.sports': { en: 'Department of Sport and Recreation', zh: '運動與休閒學系' },
    'dep.industrial': { en: 'Department of Industrial Engineering and Management', zh: '工業工程與管理學系' },
    'dep.nursing': { en: 'Department of Nursing', zh: '護理學系' },
    'dep.longterm': { en: 'Department of Long-Term Care', zh: '長期照護學系' },
    'dep.social': { en: 'Department of Social Work', zh: '社會工作學系' },

    // ── Industry Categories (A-S, matching Google Form format) ──
    'ind.A': { en: 'A. Agriculture, Forestry, Fishing and Animal Husbandry', zh: 'A大類－農、林、漁、牧業' },
    'ind.B': { en: 'B. Mining and Quarrying', zh: 'B大類－礦業及土石採取業' },
    'ind.C': { en: 'C. Manufacturing', zh: 'C大類－製造業' },
    'ind.D': { en: 'D. Electricity and Gas Supply', zh: 'D大類－電力及燃氣供應業' },
    'ind.E': { en: 'E. Water Supply and Remediation Activities', zh: 'E大類－用水供應及污染整治業' },
    'ind.F': { en: 'F. Construction', zh: 'F大類－營建業' },
    'ind.G': { en: 'G. Wholesale and Retail Trade', zh: 'G大類－批發及零售業' },
    'ind.H': { en: 'H. Transportation and Storage', zh: 'H大類－運輸及倉儲業' },
    'ind.I': { en: 'I. Accommodation and Food and Beverage Service', zh: 'I大類－住宿及餐飲業' },
    'ind.J': { en: 'J. Publishing, Audiovisual Production, Broadcasting and ICT Services', zh: 'J大類－出版、影音製作、傳播及資通訊服務業' },
    'ind.K': { en: 'K. Financial and Insurance Activities', zh: 'K大類－金融及保險業' },
    'ind.L': { en: 'L. Real Estate Activities', zh: 'L大類－不動產業' },
    'ind.M': { en: 'M. Professional, Scientific and Technical Activities', zh: 'M大類－專業、科學及技術服務業' },
    'ind.N': { en: 'N. Support Service Activities', zh: 'N大類－支援服務業' },
    'ind.O': { en: 'O. Public Administration and Defence; Compulsory Social Security', zh: 'O大類－公共行政及國防；強制性社會安全' },
    'ind.P': { en: 'P. Education', zh: 'P大類－教育業' },
    'ind.Q': { en: 'Q. Human Health and Social Work Activities', zh: 'Q大類－醫療保健及社會工作服務業' },
    'ind.R': { en: 'R. Arts, Entertainment and Recreation', zh: 'R大類－藝術、娛樂及休閒服務業' },
    'ind.S': { en: 'S. Other Service Activities', zh: 'S大類－其他服務業' },

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
    'adm.statEmployers': { en: 'Employers', zh: '企業數' },
    'adm.searchPlace': { en: 'Search company, contact...', zh: '搜尋公司、聯絡人...' },
    'adm.all': { en: 'All', zh: '全部' },
    'adm.pending': { en: 'Pending', zh: '待審' },
    'adm.approved': { en: 'Approved', zh: '通過' },
    'adm.rejected': { en: 'Rejected', zh: '拒絕' },
    'adm.thLogo': { en: 'Logo', zh: '標誌' },
    'adm.thCompany': { en: 'Company', zh: '公司' },
    'adm.thCategory': { en: 'Category', zh: '類別' },
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
    'adm.analytics': { en: 'Analytics', zh: '數據分析' },
    'adm.analyticsTitle': { en: 'Analytics Overview', zh: '數據分析總覽' },
    'adm.settings': { en: 'Settings', zh: '系統設定' },
    'adm.settingsTitle': { en: 'System Settings', zh: '系統設定' },
    'adm.regStatus': { en: 'Registration Status', zh: '報名狀態' },
    'adm.regDeadline': { en: 'Registration Deadline', zh: '報名截止日期' },
    'adm.regStatusOpen': { en: 'Open (accepting registrations)', zh: '開放（接受報名中）' },
    'adm.regStatusClosed': { en: 'Closed (maintenance mode)', zh: '關閉（維護模式）' },
    'adm.saveConfig': { en: 'Save Settings', zh: '儲存設定' },
    'adm.settingsUpdated': { en: 'Settings saved!', zh: '設定已儲存！' },
    'adm.recentActivity': { en: 'Recent Activity', zh: '最近活動' },
    'adm.chartStatus': { en: 'Status Distribution', zh: '狀態分佈' },
    'adm.chartCategory': { en: 'Activity Category', zh: '活動類別分佈' },
    'adm.chartLogistics': { en: 'Logistics Overview', zh: '後勤概覽' },
    'adm.chartIndustry': { en: 'Top 5 Industries', zh: '前5大產業' },
    'adm.lunchBoxes': { en: 'Lunch Boxes', zh: '便當' },
    'adm.parkingSpaces': { en: 'Parking Spaces', zh: '停車位' },
    'adm.bulkApprove': { en: 'Bulk Approve', zh: '批次通過' },
    'adm.bulkReject': { en: 'Bulk Reject', zh: '批次拒絕' },
    'adm.selected': { en: 'selected', zh: '已選取' },
    'adm.bulkActionNote': { en: 'Bulk action', zh: '批次操作' },
    'adm.bulkSuccess': { en: 'Processed {n} submission(s)', zh: '已處理 {n} 筆報名' },
    'adm.logAdmin': { en: 'Admin', zh: '管理員' },
    'adm.logAction': { en: 'Action', zh: '動作' },
    'adm.logTarget': { en: 'Target', zh: '對象' },
    'adm.logDetails': { en: 'Details', zh: '詳情' },
    'adm.logTime': { en: 'Time', zh: '時間' },
    'adm.noActivity': { en: 'No activity yet', zh: '尚無活動記錄' },

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
    if (!entry) {
      console.warn(`[i18n] Missing translation key: "${key}"`);
      return key;
    }
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
    // Hook for page-specific logic after translation (e.g. dynamic numbering)
    if (typeof onI18nApplied === 'function') {
      onI18nApplied();
    }
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
   * Get all translations as a nested object for the current language
   */
  it() {
    const res = {};
    for (const key in this.translations) {
      const parts = key.split('.');
      let current = res;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === parts.length - 1) {
          current[p] = this.t(key);
        } else {
          current[p] = current[p] || {};
          current = current[p];
        }
      }
    }
    return res;
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
