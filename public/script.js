document.addEventListener('DOMContentLoaded', () => {
    let currentDate = moment();
    let teacherPlanData = [];
    let currentTeacherContext = {
        teacherName: null,
        weekHomeworks: null
    }; 

    const studentData = {
        PEI1: [ { name: "Faysal", photo: "https://lh3.googleusercontent.com/d/1IB6BKROX3TRxaIIHVVVWbB7-Ii-V8VrC", birthday: "4/2014" }, { name: "Bilal", photo: "https://lh3.googleusercontent.com/d/1B0QUZJhpSad5Fs3qRTugUe4oyTlUDEVu", birthday: "2/2015" }, { name: "Jad", photo: "https://lh3.googleusercontent.com/d/1VLvrWjeJwaClf4pSaLiwjnS79N-HrsFr", birthday: "8/2014" }, { name: "Manaf", photo: "https://lh3.googleusercontent.com/d/1h46Tqtqcp5tNqdY62wV6pyZFYknCEMWY", birthday: "8/2014" } ],
        PEI2: [ { name: "Ahmed", photo: "https://lh3.googleusercontent.com/d/1cDF-yegSB2tqsWac0AoNttbi8qAALYT1", birthday: "9/2013" }, { name: "Yasser", photo: "https://lh3.googleusercontent.com/d/1DthaZcLUhfkkxbvaTr4o4XJENIM6ZNsz", birthday: "8/2013" }, { name: "Eyad", photo: "https://lh3.googleusercontent.com/d/1HGyWS4cC1jWWD25Ah3WcT_eIbUHqFzJ1", birthday: "4/2013" }, { name: "Ali", photo: "https://lh3.googleusercontent.com/d/18QAEYQWVI2HgQf9Kl_8eJ91cjE-Rjg40", birthday: "4/2013" } ],
        PEI3: [ { name: "Seifeddine", photo: "https://lh3.googleusercontent.com/d/1tWdPSbtCAsTMB86WzDgqh3Xw01ahm9s6", birthday: "1/2012" }, { name: "Mohamed", photo: "https://lh3.googleusercontent.com/d/1lB8ObGOvQDVT6FITL2y7C5TYmAGyggFn", birthday: "11/2011" }, { name: "Wajih", photo: "https://lh3.googleusercontent.com/d/1MH6M05mQamOHevmDffVFNpSFNnxqbxs3", birthday: "6/2012" }, { name: "Ahmad", photo: "https://lh3.googleusercontent.com/d/1zU-jBuAbYjHanzank9C1BAd00skS1Y5J", birthday: "2/2012" }, { name: "Adam", photo: "https://lh3.googleusercontent.com/d/15I9p6VSnn1yVmPxRRbGsUkM-fsBKYOWF", birthday: "12/2012" } ],
        PEI4: [ { name: "Mohamed Younes", photo: "https://lh3.googleusercontent.com/d/1ok8M9EOY71ScKuaW0mHfKUErjKZ4wbe1", birthday: "11/2011" }, { name: "Mohamed Amine", photo: "https://lh3.googleusercontent.com/d/1UrBw6guz0oBTUy8COGeewIs3XAK773bR", birthday: "12/2012" }, { name: "Samir", photo: "https://lh3.googleusercontent.com/d/1NdaCH8CU0DJFHXw4D0lItP-QnCswl23b", birthday: "12/2012" }, { name: "Abdulrahman", photo: "https://lh3.googleusercontent.com/d/1yCTO5StU2tnPY0BEynnWzUveljMIUcLE", birthday: "4/2012" }, { name: "Youssef", photo: "https://lh3.googleusercontent.com/d/1Bygg5-PYrjjMOZdI5hAe16eZ8ltn772e", birthday: "11/2011" } ],
        DP2: [ { name: "Habib", photo: "https://lh3.googleusercontent.com/d/13u4y6JIyCBVQ_9PCwYhh837byyK9g8pF", birthday: "10/2008" }, { name: "Salah", photo: "https://lh3.googleusercontent.com/d/1IG8S_i6jD8O6C2QD_nwLxrG932QgIVXu", birthday: "7/2008" } ]
    };
    
    // DONNÉES DES ENSEIGNANTS - Défini avant toute utilisation
    const teachersContactData = {
        'Abas': { 
            photo: 'https://lh3.googleusercontent.com/d/1zMazqEUqMEE92NUG1Lh_MUcm8MmXZPDt',
            subjects: ['Langues et Littératures'],
            username: 'Abas',
            password: 'Abas'
        },
        'Zine': { 
            photo: 'https://lh3.googleusercontent.com/d/1rWvRuwuk3H0xFDSyjLKbMxDSeuyHvknw',
            subjects: ['Science', 'Biologie'],
            username: 'Zine',
            password: 'Zine'
        },
        'Tonga': { 
            photo: 'https://lh3.googleusercontent.com/d/1j4D9SPnMTPvtTOt1gzjHBy5uA-sl_qh4',
            subjects: ['Physique-Chimie', 'Design', 'SES', 'Maths'],
            username: 'Tonga',
            password: 'Tonga'
        },
        'Sylvano': { 
            photo: 'https://lh3.googleusercontent.com/d/1JD_ojrBGLYfX2q-SgEw2W9H4AxDagaQl',
            subjects: ['Maths', 'Physique-Chimie'],
            username: 'Sylvano',
            password: 'Sylvano'
        },
        'Saeed': { 
            photo: 'https://lh3.googleusercontent.com/d/1c8ERLl7HjPQ3J9FcwfWdhgZwDE2Mnd07',
            subjects: ['Arabe'],
            username: 'Saeed',
            password: 'Saeed'
        },
        'Majed': { 
            photo: 'https://lh3.googleusercontent.com/d/18XVdbTXR7o2us4c2CA8_kwsjWeTtb-mT',
            subjects: ['Islamique'],
            username: 'Majed',
            password: 'Majed'
        },
        'Kamel': { 
            photo: 'https://lh3.googleusercontent.com/d/1jT3WJBugZUy5wDgmU00_THVD8hZ-5M24',
            subjects: ['Anglais'],
            username: 'Kamel',
            password: 'Kamel'
        },
        'Youssouf': { 
            photo: 'https://lh3.googleusercontent.com/d/1Z9CCqVaICs4EePq8NwdqbpD54f8LPkhb',
            subjects: ['Individus et Sociétés'],
            username: 'Youssouf',
            password: 'Youssouf'
        },
        'Mohamed Cherif': { 
            photo: 'https://lh3.googleusercontent.com/d/1hK0nUo30IxhYA6NuZ8CPxRA6K1Ge6pD6',
            subjects: ['Coordinateur'],
            username: 'Mohamed Cherif',
            password: 'Mohamed Cherif'
        },
        'Jaber': { 
            photo: 'https://lh3.googleusercontent.com/d/1IWFNGE6CkFzAOtlHJqDsFhKcobb8Q0S_',
            subjects: ['KSA'],
            username: 'Jaber',
            password: 'Jaber'
        }
    };
    
    const translations = {
        fr: { portalTitle: "Portail de Suivi des Devoirs", parentSpace: "Espace Parent", teacherSpace: "Espace Enseignant", backButton: "Retour", teacherLoginTitle: "Accès Enseignant", usernamePlaceholder: "Nom d'utilisateur", passwordPlaceholder: "Mot de passe", loginButton: "Connexion", loginError: "Nom d'utilisateur ou mot de passe incorrect.", classSelectionTitle: "1. Choisissez une classe", studentSelectionTitle: "2. Choisissez votre enfant", studentDashboardTitle: "Tableau de bord de", overallWeeklyProgress: "Progression générale", previousDay: "Jour Précédent", nextDay: "Jour Suivant", homeworkFor: "Devoirs du", loading: "Chargement...", noHomeworkForDay: "Aucun devoir pour ce jour.", fetchError: "Erreur de chargement des données.", studentOfTheWeek: "Élève de la semaine", teacherDashboardTitle: "Tableau de Bord Enseignant", updateSchedule: "Mettre à jour le planning", uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour", selectClassPrompt: "Veuillez sélectionner tous les filtres.", evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation", evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer", noHomeworkForSubject: "Pas de devoirs pour cette matière aujourd'hui.", teacherSelectTitle: "1. Choisissez votre nom", homeworkToEvaluate: "3. Choisissez un devoir à évaluer", weekSelectionTitle: "2. Choisissez une semaine", studentEvaluationTitle: "4. Évaluez les élèves", birthdayModalTitle: "Vérification", birthdayPrompt: "Veuillez choisir le mois et l'année de naissance de votre enfant :", birthdayError: "Date incorrecte. Veuillez réessayer.", cancelButton: "Annuler", confirmButton: "Confirmer", status_vide: "Vide", status_fait: "Fait", status_non_fait: "Non Fait", status_partiellement_fait: "Partiellement Fait", status_absent: "Absent", sotwTitle: "⭐ Élève de la semaine ⭐", sotwLastWeekTitle: "⭐ Élève de la semaine dernière ⭐", sotwMessage: "Félicitations pour tes excellents efforts !", potdTitle: "🎉 Félicitations ! 🎉", potdMessage: "Un projet ou un succès à célébrer !", adminPhotoTitle: "Ajouter une Photo de Félicitations", monthPlaceholder: "Mois", yearPlaceholder: "Année", weekLabel: "Semaine" },
        ar: { portalTitle: "بوابة متابعة الواجبات", parentSpace: "فضاء الولي", teacherSpace: "فضاء المربي", backButton: "رجوع", teacherLoginTitle: "دخول المربي", usernamePlaceholder: "اسم المستخدم", passwordPlaceholder: "كلمة المرور", loginButton: "دخول", loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.", classSelectionTitle: "1. اختر قسماً", studentSelectionTitle: "2. اختر ابنك", studentDashboardTitle: "لوحة متابعة", overallWeeklyProgress: "التقدم العام", previousDay: "اليوم السابق", nextDay: "اليوم التالي", homeworkFor: "واجبات يوم", loading: "جار التحميل...", noHomeworkForDay: "لا توجد واجبات لهذا اليوم.", fetchError: "خطأ في تحميل البيانات.", studentOfTheWeek: "تلميذ الأسبوع", teacherDashboardTitle: "لوحة تحكم المربي", updateSchedule: "تحديث الجدول", uploadButton: "تحميل وتحديث", homeworkForDay: "واجبات اليوم", selectClassPrompt: "الرجاء اختيار كل المحددات.", evalTableHeaderStudent: "التلميذ", evalTableHeaderStatus: "الحالة", evalTableHeaderParticipation: "المشاركة", evalTableHeaderBehavior: "السلوك", evalTableHeaderComment: "ملاحظة", saveButton: "تسجيل", noHomeworkForSubject: "لا توجد واجبات لهذه المادة اليوم.", teacherSelectTitle: "1. اختر اسمك", homeworkToEvaluate: "3. اختر واجباً لتقييمه", weekSelectionTitle: "2. اختر أسبوعاً", studentEvaluationTitle: "4. قيّم التلاميذ", birthdayModalTitle: "تحقق", birthdayPrompt: "الرجاء اختيار شهر وسنة ميلاد طفلك :", birthdayError: "تاريخ غير صحيح. الرجاء المحاولة مرة أخرى.", cancelButton: "إلغاء", confirmButton: "تأكيد", status_vide: "لم يحضر الواجب", status_fait: "أنجز", status_non_fait: "لم ينجز", status_partiellement_fait: "أنجز جزئياً", status_absent: "غائب", sotwTitle: "⭐ تلميذ الأسبوع ⭐", sotwLastWeekTitle: "⭐ تلميذ الأسبوع الماضي ⭐", sotwMessage: "تهانينا على مجهوداتك الممتازة!", potdTitle: "🎉 تهانينا! 🎉", potdMessage: "مشروع أو نجاح للاحتفال به!", adminPhotoTitle: "إضافة صورة تهنئة", monthPlaceholder: "الشهر", yearPlaceholder: "السنة", weekLabel: "الأسبوع" }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        moment.locale(lang);
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.dataset.translatePlaceholder;
            if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
        });
        const studentDashboardView = document.getElementById('student-dashboard-view');
        if (studentDashboardView.style.display === 'block') {
            const className = studentDashboardView.dataset.className;
            const studentName = studentDashboardView.dataset.studentName;
            if (className && studentName) {
                loadStudentDashboard(className, studentName, currentDate);
            }
        }
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        if (teacherDashboardView.style.display === 'block') {
            const activeTeacher = document.querySelector('.teacher-icon-card.active');
            if (activeTeacher) {
                displayWeekSelector(activeTeacher.dataset.teacherName);
            }
        }
    };
    document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));

    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const goToParentBtn = document.getElementById('go-to-parent');
    const goToTeacherBtn = document.getElementById('go-to-teacher');
    const backButtons = document.querySelectorAll('.back-button');
    const showView = (viewId) => { homeView.style.display = 'none'; views.forEach(v => v.style.display = 'none'); document.getElementById(viewId).style.display = 'block'; };
    const goHome = () => { homeView.style.display = 'block'; views.forEach(v => v.style.display = 'none'); displayHomePageExtras(); };
    goToParentBtn.addEventListener('click', () => { populateClassButtons(); showView('parent-selection-view'); });
    goToTeacherBtn.addEventListener('click', () => {
        // Vérifier si l'utilisateur est déjà connecté
        const savedLogin = checkSavedLogin();
        if (savedLogin) {
            // Auto-login avec les credentials sauvegardés
            if (savedLogin.isAdmin) {
                setupTeacherDashboard(true, null);
                addLogoutButton();
                showView('teacher-dashboard-view');
            } else if (savedLogin.isTeacher) {
                setupTeacherDashboard(false, null);
                addLogoutButton();
                showView('teacher-dashboard-view');
            } else if (savedLogin.teacherName) {
                setupTeacherDashboard(false, savedLogin.teacherName);
                addLogoutButton();
                showView('teacher-dashboard-view');
            }
        } else {
            showView('teacher-login-view');
        }
    });
    backButtons.forEach(btn => btn.addEventListener('click', goHome));
    
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const checkSavedLogin = () => {
        const savedUser = localStorage.getItem('devoirs_username');
        const savedPass = localStorage.getItem('devoirs_password');
        
        if (savedUser && savedPass) {
            const isAdmin = (savedUser === 'Mohamed86' && savedPass === 'Mohamed86');
            const isTeacher = (savedUser === 'Alkawthar@!!!' && savedPass === 'Alkawthar@!!!');
            
            // Vérifier si c'est un enseignant individuel
            let teacherName = null;
            for (const [name, data] of Object.entries(teachersContactData)) {
                if (data.username === savedUser && data.password === savedPass) {
                    teacherName = name;
                    break;
                }
            }
            
            if (isAdmin || isTeacher || teacherName) {
                return { isAdmin, isTeacher, teacherName, savedUser };
            }
        }
        return null;
    };
    
    // Ajouter un bouton de déconnexion dans le dashboard enseignant
    const addLogoutButton = () => {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const header = teacherDashboardView.querySelector('header');
        
        // Vérifier si le bouton n'existe pas déjà
        if (!header.querySelector('.logout-button')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-button';
            logoutBtn.textContent = '🚪 Déconnexion';
            logoutBtn.style.cssText = 'position: absolute; right: 20px; top: 20px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;';
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('devoirs_username');
                localStorage.removeItem('devoirs_password');
                goHome();
            });
            header.appendChild(logoutBtn);
        }
    };
    
    // Vérifier la connexion au chargement de la page
    const savedLogin = checkSavedLogin();
    
    document.getElementById('teacher-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const isAdmin = (user === 'Mohamed86' && pass === 'Mohamed86');
        const isTeacher = (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!');
        
        // Vérifier si c'est un enseignant individuel
        let teacherName = null;
        for (const [name, data] of Object.entries(teachersContactData)) {
            if (data.username === user && data.password === pass) {
                teacherName = name;
                break;
            }
        }
        
        if (isAdmin) {
            // Enregistrer dans localStorage
            localStorage.setItem('devoirs_username', user);
            localStorage.setItem('devoirs_password', pass);
            setupTeacherDashboard(true, null);
            addLogoutButton();
            showView('teacher-dashboard-view');
        } else if (isTeacher) {
            // Enregistrer dans localStorage
            localStorage.setItem('devoirs_username', user);
            localStorage.setItem('devoirs_password', pass);
            setupTeacherDashboard(false, null);
            addLogoutButton();
            showView('teacher-dashboard-view');
        } else if (teacherName) {
            // Enseignant individuel
            localStorage.setItem('devoirs_username', user);
            localStorage.setItem('devoirs_password', pass);
            setupTeacherDashboard(false, teacherName);
            addLogoutButton();
            showView('teacher-dashboard-view');
        } else {
            document.getElementById('login-error').textContent = translations[document.documentElement.lang].loginError;
        }
    });

    function populateClassButtons() {
        const container = document.getElementById('class-buttons-container');
        const studentGrid = document.getElementById('student-grid-container');
        const studentTitle = document.getElementById('student-selection-title');
        container.innerHTML = ''; studentGrid.innerHTML = ''; studentTitle.style.display = 'none';
        Object.keys(studentData).forEach(className => {
            const button = document.createElement('button');
            button.className = 'class-button';
            button.textContent = className;
            button.dataset.className = className;
            button.addEventListener('click', (e) => {
                container.querySelectorAll('.class-button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                displayStudentGrid(className);
            });
            container.appendChild(button);
        });
    }

    function displayStudentGrid(className) {
        const gridContainer = document.getElementById('student-grid-container');
        const studentTitle = document.getElementById('student-selection-title');
        gridContainer.innerHTML = ''; studentTitle.style.display = 'block';
        const students = studentData[className];
        if (!students) return;
        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `<img src="${student.photo}" alt="Photo de ${student.name}"><p>${student.name}</p>`;
            card.addEventListener('click', () => {
                currentDate = moment();
                loadStudentDashboard(className, student.name, currentDate);
                showView('student-dashboard-view');
            });
            gridContainer.appendChild(card);
        });
    }

    async function setupTeacherDashboard(isAdmin = false, specificTeacherName = null) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const adminUploadSection = document.getElementById('admin-upload-section');
        const adminPhotoSection = document.getElementById('admin-photo-section');
        const adminPhoto2Section = document.getElementById('admin-photo2-section');
        const adminPhoto3Section = document.getElementById('admin-photo3-section');
        const teacherIconsContainer = document.getElementById('teacher-icons-container');
        const teacherSelectTitle = teacherDashboardView.querySelector('[data-translate="teacherSelectTitle"]');
        const messagesContainer = document.getElementById('teacher-messages-container');
        
        adminUploadSection.style.display = isAdmin ? 'block' : 'none';
        adminPhotoSection.style.display = isAdmin ? 'block' : 'none';
        adminPhoto2Section.style.display = isAdmin ? 'block' : 'none';
        adminPhoto3Section.style.display = isAdmin ? 'block' : 'none';
        
        if (isAdmin) {
            const excelFileInput = teacherDashboardView.querySelector('#excel-file-input');
            const uploadExcelBtn = teacherDashboardView.querySelector('#upload-excel-btn');
            const submitPhotoBtn = document.getElementById('submit-photo-btn');
            const submitPhoto2Btn = document.getElementById('submit-photo2-btn');
            const submitPhoto3Btn = document.getElementById('submit-photo3-btn');
            uploadExcelBtn.addEventListener('click', () => handleFileUpload(excelFileInput));
            submitPhotoBtn.addEventListener('click', handleSubmitPhoto);
            submitPhoto2Btn.addEventListener('click', handleSubmitPhoto2);
            submitPhoto3Btn.addEventListener('click', handleSubmitPhoto3);
        }
        
        try {
            if (teacherPlanData.length === 0) {
                const response = await fetch('/api/initial-data');
                if (!response.ok) throw new Error('Impossible de charger les listes.');
                const initialData = await response.json();
                teacherPlanData = initialData.planData;
            }
            
            // Si un enseignant sp\u00e9cifique est connect\u00e9
            if (specificTeacherName) {
                teacherIconsContainer.style.display = 'none';
                teacherSelectTitle.style.display = 'none';
                
                // Afficher bo\u00eete de r\u00e9ception
                if (messagesContainer) {
                    messagesContainer.style.display = 'block';
                    loadTeacherMessages(specificTeacherName);
                }
                
                // Afficher directement les devoirs de cet enseignant
                displayWeekSelector(specificTeacherName);
            } else {
                // Mode admin ou enseignant g\u00e9n\u00e9ral
                const allTeachers = [...new Set(teacherPlanData.map(item => item.Enseignant).filter(Boolean))].sort();
                populateTeacherIcons(allTeachers);
                teacherIconsContainer.style.display = 'flex';
                teacherSelectTitle.style.display = 'block';
                if (messagesContainer) messagesContainer.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
            teacherDashboardView.querySelector('#homework-cards-container').innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}.</p>`;
        }
    }
    
    function populateTeacherIcons(teachers) {
        const iconsContainer = document.getElementById('teacher-icons-container');
        iconsContainer.innerHTML = '';
        const avatars = {
            'Abas': 'https://lh3.googleusercontent.com/d/1zMazqEUqMEE92NUG1Lh_MUcm8MmXZPDt',
            'Zine': 'https://lh3.googleusercontent.com/d/1rWvRuwuk3H0xFDSyjLKbMxDSeuyHvknw',
            'Tonga': 'https://lh3.googleusercontent.com/d/1j4D9SPnMTPvtTOt1gzjHBy5uA-sl_qh4',
            'Sylvano': 'https://lh3.googleusercontent.com/d/1JD_ojrBGLYfX2q-SgEw2W9H4AxDagaQl',
            'Morched': 'https://lh3.googleusercontent.com/d/1Bq4yI247Lc3G0d9U7fG33W11Q1lxk8nt',
            'Saeed': 'https://lh3.googleusercontent.com/d/1c8ERLl7HjPQ3J9FcwfWdhgZwDE2Mnd07',
            'Majed': 'https://lh3.googleusercontent.com/d/18XVdbTXR7o2us4c2CA8_kwsjWeTtb-mT',
            'Kamel': 'https://lh3.googleusercontent.com/d/1jT3WJBugZUy5wDgmU00_THVD8hZ-5M24',
            'Youssouf': 'https://lh3.googleusercontent.com/d/1Z9CCqVaICs4EePq8NwdqbpD54f8LPkhb',
            'Mohamed Cherif': 'https://lh3.googleusercontent.com/d/1hK0nUo30IxhYA6NuZ8CPxRA6K1Ge6pD6',
            'Jaber': 'https://lh3.googleusercontent.com/d/1IWFNGE6CkFzAOtlHJqDsFhKcobb8Q0S_'
        };
        (teachers || []).forEach(teacherName => {
            const card = document.createElement('div');
            card.className = 'teacher-icon-card';
            card.dataset.teacherName = teacherName;
            const avatar = avatars[teacherName];
            const iconHtml = avatar
                ? `<img src="${avatar}" alt="${teacherName}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">`
                : `<svg width=\"40\" height=\"40\" viewBox=\"0 0 24 24\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z\"/></svg>`;
            card.innerHTML = `<div class="teacher-icon">${iconHtml}</div><p>${teacherName}</p>`;
            card.addEventListener('click', () => {
                iconsContainer.querySelectorAll('.teacher-icon-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                displayWeekSelector(teacherName);
            });
            iconsContainer.appendChild(card);
        });
    }

    function displayWeekSelector(teacherName) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const weekContainer = teacherDashboardView.querySelector('#week-buttons-container');
        const weekTitle = teacherDashboardView.querySelector('#week-selection-title');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');
        weekContainer.innerHTML = '';
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'none';
        weekTitle.style.display = 'block';
        
        const homeworks = teacherPlanData.filter(item => {
            if (!item.Enseignant || item.Enseignant !== teacherName || !item.Devoirs || !item.Jour || item.Jour === 'Invalid date') {
                return false;
            }
            const dayOfWeek = moment.utc(item.Jour, 'YYYY-MM-DD').day();
            return dayOfWeek >= 0 && dayOfWeek <= 4;
        });

        if (homeworks.length === 0) {
            weekContainer.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForDay}</p>`;
            return;
        }

        const homeworksByWeek = {};
        const weekAnchor = moment.utc('2025-09-28').startOf('day'); 

        homeworks.forEach(hw => {
            const hwDate = moment.utc(hw.Jour, 'YYYY-MM-DD');
            
            // --- CORRECTION CLÉ ---
            // Force le début de la semaine au dimanche (jour 0) pour être indépendant de la langue
            const startOfWeekForHw = hwDate.clone().day(0); 
            
            const weekDiff = startOfWeekForHw.diff(weekAnchor, 'weeks');
            const weekNumber = 5 + weekDiff;
            const weekKey = `Semaine ${weekNumber}`;

            if (!homeworksByWeek[weekKey]) {
                homeworksByWeek[weekKey] = {
                    homeworks: [],
                    startDate: startOfWeekForHw
                };
            }
            homeworksByWeek[weekKey].homeworks.push(hw);
        });

        const sortedWeekKeys = Object.keys(homeworksByWeek).sort((a, b) => {
            return homeworksByWeek[b].startDate.diff(homeworksByWeek[a].startDate);
        });
        
        sortedWeekKeys.forEach(weekKey => {
            const weekData = homeworksByWeek[weekKey];
            const button = document.createElement('button');
            button.className = 'week-button';
            const startOfWeek = weekData.startDate.clone().locale(document.documentElement.lang);
            const endOfWeek = startOfWeek.clone().add(4, 'days');
            
            const weekNumberFromName = weekKey.split(' ')[1];
            button.textContent = `${translations[document.documentElement.lang].weekLabel} ${weekNumberFromName} (${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM')})`;
            
            button.addEventListener('click', (e) => {
                weekContainer.querySelectorAll('.week-button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                displayClassSelector(teacherName, weekData.homeworks);
            });
            weekContainer.appendChild(button);
        });
    }
    
    function displayClassSelector(teacherName, weekHomeworks) {
        // Sauvegarder le contexte pour navigation
        currentTeacherContext.teacherName = teacherName;
        currentTeacherContext.weekHomeworks = weekHomeworks;
        
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');
        
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'block';
        
        // Bouton de retour vers les semaines
        const backButton = document.createElement('button');
        backButton.className = 'back-to-weeks-btn';
        backButton.textContent = 'Retour aux semaines';
        backButton.addEventListener('click', () => displayWeekSelector(teacherName));
        cardsContainer.appendChild(backButton);
        
        const titleEl = document.createElement('h2');
        titleEl.textContent = '3. Choisissez une classe';
        titleEl.style.cssText = 'text-align: center; margin: 20px 0; color: var(--primary-dark);';
        cardsContainer.appendChild(titleEl);
        
        // Extraire les classes uniques
        const classes = [...new Set(weekHomeworks.map(hw => hw.Classe))].sort();
        
        if (classes.length === 0) {
            cardsContainer.innerHTML = '<p>Aucune classe trouvée pour cette semaine</p>';
            return;
        }
        
        // Créer un bouton pour chaque classe
        const classButtonsContainer = document.createElement('div');
        classButtonsContainer.className = 'class-buttons-selection';
        classButtonsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin: 20px 0;';
        
        classes.forEach(className => {
            const classButton = document.createElement('button');
            classButton.className = 'class-selection-button';
            classButton.textContent = className;
            classButton.style.cssText = 'padding: 15px 30px; font-size: 1.1rem; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);';
            
            classButton.addEventListener('mouseenter', () => {
                classButton.style.transform = 'translateY(-3px)';
                classButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            });
            
            classButton.addEventListener('mouseleave', () => {
                classButton.style.transform = 'translateY(0)';
                classButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            });
            
            classButton.addEventListener('click', () => {
                // Filtrer les devoirs pour cette classe
                const classHomeworks = weekHomeworks.filter(hw => hw.Classe === className);
                displayHomeworkCards(teacherName, classHomeworks, className);
            });
            
            classButtonsContainer.appendChild(classButton);
        });
        
        cardsContainer.appendChild(classButtonsContainer);
    }
    
    async function displayHomeworkCards(teacherName, weekHomeworks, selectedClass = null) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'block';
        
        // Bouton de retour vers les classes
        const backButton = document.createElement('button');
        backButton.className = 'back-to-classes-btn';
        backButton.textContent = 'Retour aux classes';
        backButton.addEventListener('click', () => {
            if (currentTeacherContext.teacherName && currentTeacherContext.weekHomeworks) {
                displayClassSelector(currentTeacherContext.teacherName, currentTeacherContext.weekHomeworks);
            }
        });
        cardsContainer.appendChild(backButton);
        
        const titleEl = document.createElement('h2');
        titleEl.textContent = selectedClass ? `4. Devoirs de ${selectedClass}` : '3. Choisissez un devoir à évaluer';
        titleEl.style.cssText = 'text-align: center; margin: 20px 0; color: var(--primary-dark);';
        cardsContainer.appendChild(titleEl);
        
        const allDates = [...new Set(weekHomeworks.map(hw => hw.Jour))];
        const allClassNames = [...new Set(weekHomeworks.map(hw => hw.Classe))];
        let allEvaluations = [];
        try {
            const promises = allClassNames.flatMap(className => 
                allDates.map(date => fetch(`/api/evaluations?class=${className}&date=${date}`).then(res => res.json()))
            );
            const results = await Promise.all(promises);
            allEvaluations = results.flatMap(result => result.evaluations);
        } catch (error) { console.error("Erreur de pré-chargement:", error); }
        
        // Trier par date
        weekHomeworks.sort((a, b) => new Date(a.Jour) - new Date(b.Jour));
        
        // Afficher les devoirs sous forme de cartes
        weekHomeworks.forEach(hw => {
            const isEvaluated = allEvaluations.some(ev => ev.date === hw.Jour && ev.class === hw.Classe && ev.subject === hw.Matière);
            const card = document.createElement('div');
            card.className = `homework-card ${isEvaluated ? 'evaluated' : ''}`;
            card.innerHTML = `<h4>${hw.Matière}</h4><p><strong>🗓️ Date:</strong> <span>${moment(hw.Jour).locale(document.documentElement.lang).format('dddd D MMMM')}</span></p>`;
            card.addEventListener('click', () => {
                cardsContainer.querySelectorAll('.homework-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                renderEvaluationTable(hw.Classe, hw.Jour, hw.Matière, hw.Devoirs);
            });
            cardsContainer.appendChild(card);
        });
    }
    
    async function renderEvaluationTable(className, date, subject, assignment) {
        const evaluationSection = document.getElementById('teacher-evaluation-section');
        const tableContainer = document.getElementById('teacher-table-container');
        evaluationSection.style.display = 'block';
        tableContainer.innerHTML = `<p>${translations[document.documentElement.lang].loading}</p>`;
        evaluationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
            const response = await fetch(`/api/evaluations?class=${className}&date=${date}`);
            if (!response.ok) throw new Error('Erreur de chargement des données');
            const data = await response.json();
            const students = (studentData[className.split(' ')[0]] || []).map(s => s.name);
            let tableHTML = `<p class="homework-reminder"><strong>Devoir :</strong> ${assignment}</p>`;
            tableHTML += `<table class="teacher-evaluation-table"><thead><tr><th>${translations[document.documentElement.lang].evalTableHeaderStudent}</th><th>${translations[document.documentElement.lang].evalTableHeaderStatus}</th><th>${translations[document.documentElement.lang].evalTableHeaderParticipation}</th><th>${translations[document.documentElement.lang].evalTableHeaderBehavior}</th><th>${translations[document.documentElement.lang].evalTableHeaderComment}</th></tr></thead><tbody>`;
            for (const student of students) {
                const existingEval = data.evaluations.find(ev => ev.studentName === student && ev.subject === subject) || {};
                const currentLang = document.documentElement.lang;
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option value="" ${!existingEval.status ? 'selected' : ''}>${translations[currentLang].status_vide}</option><option value="Fait" ${existingEval.status === 'Fait' ? 'selected' : ''}>${translations[currentLang].status_fait}</option><option value="Non Fait" ${existingEval.status === 'Non Fait' ? 'selected' : ''}>${translations[currentLang].status_non_fait}</option><option value="Partiellement Fait" ${existingEval.status === 'Partiellement Fait' ? 'selected' : ''}>${translations[currentLang].status_partiellement_fait}</option><option value="Absent" ${existingEval.status === 'Absent' ? 'selected' : ''}>${translations[currentLang].status_absent}</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
            }
            tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;" data-class="${className}" data-date="${date}" data-subject="${subject}">${translations[document.documentElement.lang].saveButton}</button>`;
            tableContainer.innerHTML = tableHTML;
            tableContainer.querySelector('#submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
        } catch (error) {
            console.error("Erreur:", error);
            tableContainer.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`;
        }
    }
    
    async function submitTeacherEvaluations(event) {
        const button = event.currentTarget;
        const className = button.dataset.class;
        const date = button.dataset.date;
        const subject = button.dataset.subject;
        const evaluations = Array.from(document.querySelectorAll('#teacher-table-container tbody tr')).map(row => ({
            studentName: row.dataset.student, class: className, date: date, subject: subject, status: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10), behavior: parseInt(row.querySelector('.behavior-input').value, 10),
            comment: row.querySelector('.comment-input').value,
        }));
        try {
            const response = await fetch('/api/evaluations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ evaluations }) });
            if (!response.ok) throw new Error(`Erreur d'enregistrement`);
            alert("Évaluations enregistrées !");
            const activeTeacherCard = document.querySelector('.teacher-icon-card.active');
            if (activeTeacherCard) {
                displayWeekSelector(activeTeacherCard.dataset.teacherName);
            }
        } catch (error) { 
            console.error("Erreur:", error); alert("Une erreur est survenue."); 
        }
    }
    
    async function handleFileUpload(excelFileInput) {
        const uploadStatus = document.getElementById('upload-status');
        const file = excelFileInput.files[0];
        if (!file) { uploadStatus.textContent = "Veuillez choisir un fichier."; uploadStatus.className = 'error'; return; }
        uploadStatus.textContent = "Lecture du fichier en cours..."; uploadStatus.className = '';
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonPlan = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const formattedPlan = formatPlanData(jsonPlan);
                if (formattedPlan.length === 0) throw new Error("Aucune donnée valide trouvée.");
                uploadStatus.textContent = `Fichier lu. ${formattedPlan.length} devoirs trouvés. Envoi en cours...`;
                const response = await fetch('/api/upload-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formattedPlan) });
                if (!response.ok) { const errorResult = await response.json(); throw new Error(`Erreur du serveur (statut ${response.status}). ${errorResult.message || ''}`); }
                const result = await response.json();
                uploadStatus.textContent = result.message;
                uploadStatus.className = 'success';
                teacherPlanData = [];
                await setupTeacherDashboard(true);
            } catch (error) {
                console.error("Erreur d'upload:", error);
                uploadStatus.textContent = `Erreur : ${error.message}.`;
                uploadStatus.className = 'error';
            }
        };
        reader.readAsArrayBuffer(file);
    }
    
    function parseFrenchDate(dateString) {
        let cleanString = String(dateString).toLowerCase().trim();
        const arabicMap = { 'يناير': 'january', 'فبراير': 'february', 'مارس': 'march', 'أبريل': 'april', 'ماي': 'may', 'يونيو': 'june', 'يوليو': 'july', 'أغسطس': 'august', 'سبتمبر': 'september', 'أكتوبر': 'october', 'نوفمبر': 'november', 'ديسمبر': 'december', 'الأحد': 'sunday', 'الاثنين': 'monday', 'الثلاثاء': 'tuesday', 'الأربعاء': 'wednesday', 'الخميس': 'thursday', 'الجمعة': 'friday', 'السبت': 'saturday', 'موافق': '', 'ل': '' };
        for (const [key, value] of Object.entries(arabicMap)) {
            cleanString = cleanString.replace(new RegExp(key, 'g'), value);
        }
        cleanString = cleanString.replace(/\s+/g, ' ').trim();
        moment.locale('fr');
        const formats = ["dddd D MMMM YYYY", "D-M-YYYY", "D MMMM YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
        const momentDate = moment(cleanString, formats, 'fr', true);
        return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : 'Invalid date';
    }
    
    function formatPlanData(jsonPlan) {
        if (!jsonPlan || jsonPlan.length < 2) throw new Error("Fichier Excel vide ou invalide.");
        const headers = jsonPlan[0].map(h => typeof h === 'string' ? h.trim() : h);
        const dataRows = jsonPlan.slice(1);
        ["Enseignant", "Jour", "Classe", "Matière", "Devoirs"].forEach(header => {
            if (!headers.includes(header)) throw new Error(`Colonne manquante : "${header}"`);
        });
        return dataRows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => { rowData[header] = row[index]; });
            let dateValue = rowData.Jour;
            let formattedDate = 'Invalid date';
            if (typeof dateValue === 'number') {
                const date = moment('1899-12-30').add(dateValue, 'days');
                formattedDate = date.format('YYYY-MM-DD');
            } else if (typeof dateValue === 'string') {
                formattedDate = parseFrenchDate(dateValue);
            }
            rowData.Jour = formattedDate;
            return rowData;
        }).filter(row => row.Devoirs && row.Jour && row.Jour !== 'Invalid date');
    }
    
    document.getElementById('prev-day-btn').addEventListener('click', () => { 
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const className = studentDashboardView.dataset.className;
        const studentName = studentDashboardView.dataset.studentName;
        if (className && studentName) {
            currentDate.subtract(1, 'days');
            if (currentDate.day() === 6) {
                currentDate.subtract(1, 'days');
            }
            if (currentDate.day() === 5) {
                currentDate.subtract(1, 'days');
            }
            loadStudentDashboard(className, studentName, currentDate); 
        }
    });

    document.getElementById('next-day-btn').addEventListener('click', () => { 
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const className = studentDashboardView.dataset.className;
        const studentName = studentDashboardView.dataset.studentName;
        if (className && studentName) {
            currentDate.add(1, 'days');
            if (currentDate.day() === 5) {
                currentDate.add(2, 'days');
            }
            if (currentDate.day() === 6) {
                currentDate.add(1, 'days');
            }
            loadStudentDashboard(className, studentName, currentDate); 
        }
    });
    
    async function loadStudentDashboard(className, studentName, date) {
        const studentDashboardView = document.getElementById('student-dashboard-view');
        studentDashboardView.dataset.className = className;
        studentDashboardView.dataset.studentName = studentName;
        const currentLang = document.documentElement.lang;
        const studentPhotoElement = studentDashboardView.querySelector('.student-photo');
        const studentNameHeader = studentDashboardView.querySelector('#student-name-header');
        const homeworkDateElement = studentDashboardView.querySelector('#homework-date');
        const homeworkGrid = studentDashboardView.querySelector('#homework-grid');
        studentNameHeader.textContent = `${translations[currentLang].studentDashboardTitle} ${studentName}`;
        homeworkDateElement.textContent = `${translations[currentLang].homeworkFor} ${date.clone().locale(currentLang).format('dddd D MMMM YYYY')}`;
        homeworkGrid.innerHTML = `<p>${translations[currentLang].loading}</p>`;
        const student = (studentData[className] || []).find(s => s.name === studentName);
        if (student) {
            studentPhotoElement.src = student.photo;
            studentPhotoElement.alt = `Photo de ${studentName}`;
        }
        try {
            // Si vendredi (5) ou samedi (6), utiliser les devoirs de jeudi (4)
            let queryDate = date.clone();
            const dayOfWeek = queryDate.day();
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                // Trouver le jeudi précédent
                const daysToSubtract = dayOfWeek === 5 ? 1 : 2;
                queryDate = queryDate.subtract(daysToSubtract, 'days');
                
                // Mettre à jour l'affichage pour indiquer qu'on montre les devoirs de jeudi
                const thursdayText = currentLang === 'ar' ? 'واجبات الخميس' : 'Devoirs du jeudi';
                homeworkDateElement.textContent = `${thursdayText} ${queryDate.clone().locale(currentLang).format('D MMMM YYYY')}`;
            }
            
            const dateQuery = queryDate.locale('en').format('YYYY-MM-DD');
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
            const data = await response.json();
            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.studentName === studentName && ev.subject === hw.subject) || {};
                    const getStatusClass = (status) => {
                        if (!status || status === 'Vide') return '';
                        return status.toLowerCase().replace(/ /g, '-');
                    };
                    const statusClass = getStatusClass(dailyEval.status);
                    
                    const statusKey = (dailyEval.status || 'vide').toLowerCase().replace(/ /g, '_');
                    let statusText = translations[currentLang]['status_' + statusKey] || dailyEval.status || '';

                    if (statusKey === 'vide') {
                        statusText = '';
                    }

                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    
                    const commentText = dailyEval.comment || "...";
                    const translateBtnText = currentLang === 'ar' ? '🌐 ترجمة' : '🌐 Traduire';
                    
                    card.innerHTML = `<h3>
                                        <span>${hw.subject}</span>
                                        <div class="status-container">
                                            <span class="status-text ${statusClass}">${statusText}</span>
                                            <span class="status-lamp ${statusClass}"></span>
                                        </div>
                                      </h3>
                                      <div class="content">
                                        <div class="assignment">${hw.assignment}</div>
                                        <div class="comment-box" id="comment-${hw.subject.replace(/\s+/g, '-')}" data-original="${commentText}">${commentText}</div>
                                        ${commentText !== "..." ? `<button class="translate-btn" onclick="translateComment('comment-${hw.subject.replace(/\s+/g, '-')}', '${currentLang === 'ar' ? 'fr' : 'ar'}')" style="margin-top: 8px; padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">${translateBtnText}</button>` : ''}
                                        <div class="scores">
                                            <div><span>${translations[currentLang].evalTableHeaderBehavior}</span><span>${dailyEval.behavior ?? '-'}</span></div>
                                            <div><span>${translations[currentLang].evalTableHeaderParticipation}</span><span>${dailyEval.participation ?? '-'}</span></div>
                                        </div>
                                      </div>`;
                    homeworkGrid.appendChild(card);
                });
            } else {
                homeworkGrid.innerHTML = `<p>${translations[currentLang].noHomeworkForDay}</p>`;
            }
            updateWeeklyStats(data.weeklyEvaluations || []);
            
            // Afficher les évaluations générales
            displayGeneralEvaluations(className, studentName);
        } catch (error) { 
            console.error("Erreur:", error);
            homeworkGrid.innerHTML = `<p class="error-message">${translations[currentLang].fetchError}</p>`; 
        }
    }
    
    async function updateWeeklyStats(weeklyEvals) {
        // First try to get stars from the persistent daily stars system
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const className = studentDashboardView.dataset.className;
        const studentName = studentDashboardView.dataset.studentName;
        
        let stars = 0;
        
        try {
            const response = await fetch(`/api/daily-stars?studentName=${encodeURIComponent(studentName)}&className=${encodeURIComponent(className)}&week=true`);
            if (response.ok) {
                const data = await response.json();
                if (data.stars && data.stars.length > 0) {
                    // Use persistent daily star records
                    stars = data.stars.filter(record => record.earnedStar).length;
                } else {
                    // Fallback to legacy calculation with enhanced criteria
                    stars = calculateStarsLegacy(weeklyEvals || []);
                }
            } else {
                // Fallback to legacy calculation
                stars = calculateStarsLegacy(weeklyEvals || []);
            }
        } catch (error) {
            console.error("Error fetching daily stars:", error);
            // Fallback to legacy calculation
            stars = calculateStarsLegacy(weeklyEvals || []);
        }
        
        // Update star display
        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="star ${i < stars ? 'filled' : ''}">&#9733;</span>`).join('');
        
        // Update "student of the week" banner
        const studentOfWeekBanner = document.getElementById('student-of-week-banner');
        if (stars >= 4) { 
            studentOfWeekBanner.classList.add('active'); 
        } else { 
            studentOfWeekBanner.classList.remove('active'); 
        }
        
        // Calculate overall weekly progress
        let totalScore = 0;
        let maxScore = 0;
        (weeklyEvals || []).forEach(ev => {
            const dayOfWeek = moment(ev.date).day();
            if (dayOfWeek >= 0 && dayOfWeek <= 4) {
                if (ev.status !== 'Absent') {
                    totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                    maxScore += 30;
                }
            }
        });
        
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const progressBar = document.getElementById('overall-progress-bar');
        progressBar.style.width = `${percentage}%`;
        progressBar.classList.remove('red', 'orange', 'green');
        if (percentage < 45) {
            progressBar.classList.add('red');
        } else if (percentage <= 60) {
            progressBar.classList.add('orange');
        } else {
            progressBar.classList.add('green');
        }
        document.getElementById('overall-progress-text').textContent = `${percentage}%`;
        // daily progress note under stars
        const noteEl = document.getElementById('daily-progress-note');
        const lang = document.documentElement.lang;
        if (noteEl) {
            // Calculer le pourcentage du jour ACTUEL affiché (currentDate)
            const currentDayStr = currentDate.format('YYYY-MM-DD');
            let currentTotal = 0, currentMax = 0;
            (weeklyEvals || []).forEach(ev => {
                if (ev.date === currentDayStr) {
                    const d = moment(ev.date).day();
                    if (d >= 0 && d <= 4 && ev.status !== 'Absent') {
                        currentTotal += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                        currentMax += 30;
                    }
                }
            });
            const currentDayPct = currentMax > 0 ? Math.round((currentTotal / currentMax) * 100) : 0;
            
            // Calculer le pourcentage du jour PRÉCÉDENT (par rapport à currentDate)
            let prevTotal = 0, prevMax = 0;
            const prevDayStr = currentDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            (weeklyEvals || []).forEach(ev => {
                if (ev.date === prevDayStr) {
                    const d = moment(ev.date).day();
                    if (d >= 0 && d <= 4 && ev.status !== 'Absent') {
                        prevTotal += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                        prevMax += 30;
                    }
                }
            });
            const previousPct = prevMax > 0 ? Math.round((prevTotal / prevMax) * 100) : null;

            // NOUVELLE LOGIQUE selon les critères du client :
            // 1. Excellent (ممتاز) : ≥80% ET ≥3 étoiles
            // 2. En amélioration (في تحسن) : >50% ET augmentation par rapport au jour précédent
            // 3. En régression (في تراجع) : <50% OU diminution du pourcentage
            
            let label = '';
            
            // Critère 1 : Excellent - 80% ou plus ET 3 étoiles au moins
            if (currentDayPct >= 80 && stars >= 3) {
                label = lang === 'ar' ? 'ممتاز' : 'Excellent';
            }
            // Critère 2 : En amélioration - Plus de 50% ET augmentation par rapport au jour précédent
            else if (currentDayPct > 50 && previousPct !== null && currentDayPct > previousPct) {
                label = lang === 'ar' ? 'في تحسن' : 'En amélioration';
            }
            // Critère 3 : En régression - Moins de 50% OU diminution du pourcentage
            else if (currentDayPct < 50 || (previousPct !== null && currentDayPct < previousPct)) {
                label = lang === 'ar' ? 'في تراجع' : 'En régression';
            }
            // Par défaut : Si aucune condition n'est remplie
            else {
                label = lang === 'ar' ? 'ممتاز' : 'Excellent';
            }
            
            noteEl.textContent = label;
            noteEl.style.display = 'block'; // Assurer qu'il est toujours visible
        }
    }
    
    // Legacy star calculation function (fallback)
    function calculateStarsLegacy(weeklyEvals) {
        const dailyScores = {};
        (weeklyEvals || []).forEach(ev => {
            const dayOfWeek = moment(ev.date).day();
            if (dayOfWeek >= 0 && dayOfWeek <= 4) {
                const dayKey = ev.date;
                if (!dailyScores[dayKey]) { 
                    dailyScores[dayKey] = { 
                        evaluations: [], 
                        participationSum: 0, 
                        behaviorSum: 0, 
                        count: 0, 
                        hasHomework: true 
                    }; 
                }
                dailyScores[dayKey].evaluations.push(ev);
                dailyScores[dayKey].participationSum += ev.participation || 0;
                dailyScores[dayKey].behaviorSum += ev.behavior || 0;
                dailyScores[dayKey].count++;
            }
        });
        
        let stars = 0;
        Object.values(dailyScores).forEach(day => {
            if (day.hasHomework && day.count > 0) {
                // Enhanced criteria: >70% completion + participation>5 + behavior>5
                const completedHomework = day.evaluations.filter(ev => 
                    ev.status === 'Fait' || ev.status === 'Partiellement Fait'
                ).length;
                const completionRate = (completedHomework / day.count) * 100;
                
                const hasGoodCompletion = completionRate > 70;
                const avgParticipation = day.participationSum / day.count;
                const avgBehavior = day.behaviorSum / day.count;
                
                if (hasGoodCompletion && avgParticipation > 5 && avgBehavior > 5) { 
                    stars++; 
                }
            }
        });
        
        return stars;
    }

    async function displayHomePageExtras() {
        displayStudentOfTheWeek();
        displayPhotoOfTheDay();
        displayPhoto2();
        displayPhoto3();
    }
    
    async function handleSubmitPhoto() {
        const photoUrlInput = document.getElementById('photo-url-input');
        const commentInput = document.getElementById('photo-comment-input');
        const photoStatus = document.getElementById('photo-status');
        const imageUrl = photoUrlInput.value.trim();
        const comment = commentInput.value.trim();

        if (!imageUrl) {
            photoStatus.textContent = 'Veuillez coller un lien.';
            photoStatus.className = 'error';
            return;
        }
        photoStatus.textContent = 'Enregistrement...';
        photoStatus.className = '';
        try {
            const response = await fetch('/api/photo-of-the-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'username': 'Mohamed86', 'password': 'Mohamed86' },
                body: JSON.stringify({ imageUrl, comment })
            });
            if (!response.ok) throw new Error('Échec de la mise à jour');
            photoStatus.textContent = 'Photo enregistrée !';
            photoStatus.className = 'success';
            photoUrlInput.value = '';
            commentInput.value = '';
            displayPhotoOfTheDay();
        } catch (error) {
            console.error("Erreur d'enregistrement:", error);
            photoStatus.textContent = 'Une erreur est survenue.';
            photoStatus.className = 'error';
        }
    }

    async function handleSubmitPhoto2() {
        const photoUrlInput = document.getElementById('photo2-url-input');
        const commentInput = document.getElementById('photo2-comment-input');
        const photoStatus = document.getElementById('photo2-status');
        const imageUrl = photoUrlInput.value.trim();
        const comment = commentInput.value.trim();

        if (!imageUrl) {
            photoStatus.textContent = 'Veuillez coller un lien.';
            photoStatus.className = 'error';
            return;
        }
        photoStatus.textContent = 'Enregistrement...';
        photoStatus.className = '';
        try {
            const response = await fetch('/api/photo-2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'username': 'Mohamed86', 'password': 'Mohamed86' },
                body: JSON.stringify({ imageUrl, comment })
            });
            if (!response.ok) throw new Error('Échec de la mise à jour');
            photoStatus.textContent = 'Photo de célébration 2 enregistrée !';
            photoStatus.className = 'success';
            photoUrlInput.value = '';
            commentInput.value = '';
            displayPhoto2();
        } catch (error) {
            console.error("Erreur d'enregistrement:", error);
            photoStatus.textContent = 'Une erreur est survenue.';
            photoStatus.className = 'error';
        }
    }

    async function handleSubmitPhoto3() {
        const photoUrlInput = document.getElementById('photo3-url-input');
        const commentInput = document.getElementById('photo3-comment-input');
        const photoStatus = document.getElementById('photo3-status');
        const imageUrl = photoUrlInput.value.trim();
        const comment = commentInput.value.trim();

        if (!imageUrl) {
            photoStatus.textContent = 'Veuillez coller un lien.';
            photoStatus.className = 'error';
            return;
        }
        photoStatus.textContent = 'Enregistrement...';
        photoStatus.className = '';
        try {
            const response = await fetch('/api/photo-3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'username': 'Mohamed86', 'password': 'Mohamed86' },
                body: JSON.stringify({ imageUrl, comment })
            });
            if (!response.ok) throw new Error('Échec de la mise à jour');
            photoStatus.textContent = 'Photo de célébration 3 enregistrée !';
            photoStatus.className = 'success';
            photoUrlInput.value = '';
            commentInput.value = '';
            displayPhoto3();
        } catch (error) {
            console.error("Erreur d'enregistrement:", error);
            photoStatus.textContent = 'Une erreur est survenue.';
            photoStatus.className = 'error';
        }
    }

    async function displayStudentOfTheWeek() {
        try {
            const response = await fetch('/api/weekly-summary');
            if (!response.ok) return;
            const data = await response.json();
            const sotwShowcase = document.getElementById('sotw-showcase');
            
            // Clear existing content
            sotwShowcase.innerHTML = '';
            
            // Vérifier si on doit afficher (seulement le dimanche)
            if (!data.showDisplay || !data.studentsOfWeek || data.studentsOfWeek.length === 0) {
                sotwShowcase.style.display = 'none';
                return;
            }
            
            // Create title - "Élève de la semaine dernière" si c'est dimanche
            const title = document.createElement('h2');
            title.className = 'sotw-title';
            title.setAttribute('data-translate', 'sotwLastWeekTitle');
            const currentLang = document.documentElement.lang;
            if (currentLang === 'ar') {
                title.textContent = '⭐ تلميذ الأسبوع الماضي ⭐';
            } else {
                title.textContent = '⭐ Élève de la semaine dernière ⭐';
            }
            sotwShowcase.appendChild(title);
            
            // Create container for all students
            const studentsContainer = document.createElement('div');
            studentsContainer.style.display = 'grid';
            studentsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
            studentsContainer.style.gap = '20px';
            studentsContainer.style.marginTop = '15px';
            
            data.studentsOfWeek.forEach(sotw => {
                const classKey = sotw.class.split(' ')[0];
                const studentInfo = (studentData[classKey] || []).find(s => s.name === sotw.name);
                
                if (studentInfo) {
                    const studentCard = document.createElement('div');
                    studentCard.className = 'sotw-info';
                    
                    // Photo
                    const photo = document.createElement('img');
                    photo.src = studentInfo.photo;
                    photo.alt = sotw.name;
                    photo.className = 'sotw-photo';
                    
                    // Name
                    const name = document.createElement('h3');
                    name.className = 'sotw-name';
                    name.textContent = sotw.name;
                    
                    // Stars display - Afficher le nombre réel d'étoiles gagnées (avec demi-étoiles)
                    const starsDiv = document.createElement('div');
                    starsDiv.className = 'sotw-stars';
                    const starCount = sotw.stars || 0;
                    const fullStars = Math.floor(starCount);
                    const hasHalfStar = (starCount % 1) >= 0.5;
                    
                    let starsHTML = '';
                    for (let i = 0; i < fullStars; i++) {
                        starsHTML += `<span class="star filled">&#9733;</span>`;
                    }
                    if (hasHalfStar) {
                        starsHTML += `<span class="star half-filled">&#9733;</span>`;
                    }
                    starsDiv.innerHTML = starsHTML;
                    
                    // Star count text
                    const starCountText = document.createElement('div');
                    starCountText.className = 'sotw-star-count';
                    starCountText.textContent = `${starCount} ${starCount > 1 ? 'étoiles' : 'étoile'}`;
                    
                    // Progress comment (NEW: showing improvement/regression/excellent)
                    const progressCommentDiv = document.createElement('div');
                    progressCommentDiv.className = 'sotw-progress-comment';
                    if (sotw.progressComment) {
                        progressCommentDiv.textContent = currentLang === 'ar' 
                            ? sotw.progressComment.ar 
                            : sotw.progressComment.fr;
                    }
                    
                    // Progress percentage
                    const progressDiv = document.createElement('div');
                    progressDiv.className = 'sotw-progress';
                    progressDiv.textContent = `${sotw.progressPercentage}%`;
                    
                    // Class
                    const classDiv = document.createElement('div');
                    classDiv.className = 'sotw-class';
                    classDiv.textContent = sotw.class;
                    
                    studentCard.appendChild(photo);
                    studentCard.appendChild(name);
                    studentCard.appendChild(starsDiv);
                    studentCard.appendChild(starCountText);
                    studentCard.appendChild(progressCommentDiv);
                    studentCard.appendChild(progressDiv);
                    studentCard.appendChild(classDiv);
                    
                    studentsContainer.appendChild(studentCard);
                }
            });
            
            sotwShowcase.appendChild(studentsContainer);
            sotwShowcase.style.display = 'block';
        } catch (error) { 
            console.error("Erreur:", error); 
            document.getElementById('sotw-showcase').style.display = 'none';
        }
    }
    
    async function displayPhotoOfTheDay() {
        try {
            const response = await fetch('/api/photo-of-the-day');
            if (!response.ok) return;
            const data = await response.json();
            const potdShowcase = document.getElementById('potd-showcase');
            if (data && data.url) {
                document.getElementById('potd-image').src = data.url;
                const messageElement = document.getElementById('potd-message');
                if (data.comment) {
                    messageElement.textContent = data.comment;
                } else {
                    messageElement.textContent = translations[document.documentElement.lang].potdMessage || "Projet ou succès à célébrer !";
                }
                potdShowcase.style.display = 'block';
                const row = document.getElementById('photos-row');
                if (row) row.style.display = 'grid';
            } else {
                potdShowcase.style.display = 'none';
            }
        } catch (error) { console.error("Erreur:", error); }
    }

    async function displayPhoto2() {
        try {
            const response = await fetch('/api/photo-2');
            if (!response.ok) return;
            const data = await response.json();
            const photo2Showcase = document.getElementById('photo2-showcase');
            if (data && data.url) {
                document.getElementById('photo2-image').src = data.url;
                const messageElement = document.getElementById('photo2-message');
                if (data.comment) {
                    messageElement.textContent = data.comment;
                } else {
                    messageElement.textContent = "Une autre belle réussite à célébrer !";
                }
                photo2Showcase.style.display = 'block';
                const row = document.getElementById('photos-row');
                if (row) row.style.display = 'grid';
            } else {
                photo2Showcase.style.display = 'none';
            }
        } catch (error) { console.error("Erreur:", error); }
    }

    async function displayPhoto3() {
        try {
            const response = await fetch('/api/photo-3');
            if (!response.ok) return;
            const data = await response.json();
            const photo3Showcase = document.getElementById('photo3-showcase');
            if (data && data.url) {
                document.getElementById('photo3-image').src = data.url;
                const messageElement = document.getElementById('photo3-message');
                if (data.comment) {
                    messageElement.textContent = data.comment;
                } else {
                    messageElement.textContent = "Un accomplissement remarquable !";
                }
                photo3Showcase.style.display = 'block';
                const row = document.getElementById('photos-row');
                if (row) row.style.display = 'grid';
            } else {
                photo3Showcase.style.display = 'none';
            }
        } catch (error) { console.error("Erreur:", error); }
    }

    // ============================================================================
    // PARENT ACCOUNT SYSTEM
    // ============================================================================
    
    // Vérifier si un parent est connecté
    function getLoggedParent() {
        const parentData = localStorage.getItem('logged_parent');
        if (parentData) {
            try {
                return JSON.parse(parentData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    
    // Sauvegarder le parent connecté
    function saveLoggedParent(parentInfo) {
        localStorage.setItem('logged_parent', JSON.stringify(parentInfo));
        
        // Vérifier si on doit ouvrir la modal de contact après connexion
        const pendingContact = sessionStorage.getItem('pending_teacher_contact');
        if (pendingContact) {
            try {
                const { teacherName, teacherData } = JSON.parse(pendingContact);
                sessionStorage.removeItem('pending_teacher_contact');
                setTimeout(() => {
                    openContactModal(teacherName, teacherData);
                }, 500);
            } catch (e) {
                console.error('Erreur:', e);
            }
        }
    }
    
    // Déconnecter le parent
    function logoutParent() {
        localStorage.removeItem('logged_parent');
    }
    
    // Afficher la modal d'authentification parent
    function showParentAuthModal(mode = 'login') {
        const modal = document.getElementById('parent-auth-modal');
        const loginForm = document.getElementById('parent-login-form');
        const registerForm = document.getElementById('parent-register-form');
        const title = document.getElementById('auth-modal-title');
        
        if (mode === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            title.textContent = translations[document.documentElement.lang].parentLoginTitle || 'Connexion Parent';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            title.textContent = translations[document.documentElement.lang].registerTitle || 'Créer un compte';
        }
        
        modal.style.display = 'flex';
    }
    
    // Fermer la modal d'authentification
    document.querySelector('.close-modal-auth')?.addEventListener('click', () => {
        document.getElementById('parent-auth-modal').style.display = 'none';
    });
    
    // Basculer entre login et register
    document.getElementById('show-register-form')?.addEventListener('click', (e) => {
        e.preventDefault();
        showParentAuthModal('register');
    });
    
    document.getElementById('show-login-form')?.addEventListener('click', (e) => {
        e.preventDefault();
        showParentAuthModal('login');
    });
    
    // Formulaire de connexion parent
    document.getElementById('parent-login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        const statusEl = document.getElementById('login-status');
        
        statusEl.textContent = 'Connexion...';
        statusEl.className = '';
        
        try {
            const response = await fetch('/api/parent-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur de connexion');
            }
            
            // Sauvegarder les infos du parent
            saveLoggedParent(data.parent);
            
            statusEl.textContent = '✅ Connexion réussie !';
            statusEl.className = 'success';
            
            setTimeout(() => {
                document.getElementById('parent-auth-modal').style.display = 'none';
                statusEl.textContent = '';
                document.getElementById('parent-login-form').reset();
            }, 1500);
            
        } catch (error) {
            console.error('Erreur:', error);
            statusEl.textContent = '❌ ' + error.message;
            statusEl.className = 'error';
        }
    });
    
    // Formulaire d'inscription parent
    document.getElementById('parent-register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('register-firstname').value;
        const lastName = document.getElementById('register-lastname').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;
        const statusEl = document.getElementById('register-status');
        
        // Vérifier que les mots de passe correspondent
        if (password !== confirmPassword) {
            statusEl.textContent = '❌ Les mots de passe ne correspondent pas';
            statusEl.className = 'error';
            return;
        }
        
        statusEl.textContent = 'Création du compte...';
        statusEl.className = '';
        
        try {
            const response = await fetch('/api/parent-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, phone, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création du compte');
            }
            
            statusEl.textContent = '✅ Compte créé avec succès ! Connexion...';
            statusEl.className = 'success';
            
            // Sauvegarder automatiquement le parent
            saveLoggedParent(data.parent);
            
            setTimeout(() => {
                document.getElementById('parent-auth-modal').style.display = 'none';
                statusEl.textContent = '';
                document.getElementById('parent-register-form').reset();
            }, 2000);
            
        } catch (error) {
            console.error('Erreur:', error);
            statusEl.textContent = '❌ ' + error.message;
            statusEl.className = 'error';
        }
    });
    
    // ============================================================================
    // TEACHER CONTACT SYSTEM
    // ============================================================================
    
    // Populate teachers contact grid
    function populateTeachersContact() {
        const grid = document.getElementById('teachers-contact-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (const [name, data] of Object.entries(teachersContactData)) {
            const card = document.createElement('div');
            card.className = 'teacher-contact-card';
            card.innerHTML = `
                <img src="${data.photo}" alt="${name}" class="teacher-contact-photo">
                <h3 class="teacher-contact-name">${name}</h3>
                <p class="teacher-contact-subjects">${data.subjects.join(', ')}</p>
                <div class="teacher-contact-icon">✉️</div>
            `;
            card.addEventListener('click', () => openContactModal(name, data));
            grid.appendChild(card);
        }
    }
    
    // Open contact modal
    function openContactModal(teacherName, teacherData) {
        // Vérifier si un parent est connecté
        const loggedParent = getLoggedParent();
        
        if (!loggedParent) {
            // Si pas connecté, afficher la modal d'authentification
            showParentAuthModal('login');
            
            // Sauvegarder les infos de l'enseignant pour ouvrir la modal après connexion
            sessionStorage.setItem('pending_teacher_contact', JSON.stringify({
                teacherName,
                teacherData
            }));
            
            return;
        }
        
        // Afficher les infos du parent connecté
        document.getElementById('logged-parent-name').textContent = `${loggedParent.firstName} ${loggedParent.lastName}`;
        document.getElementById('logged-parent-phone').textContent = loggedParent.phone;
        
        const modal = document.getElementById('contact-teacher-modal');
        document.getElementById('modal-teacher-photo').src = teacherData.photo;
        document.getElementById('modal-teacher-name').textContent = teacherName;
        document.getElementById('modal-teacher-subjects').textContent = teacherData.subjects.join(', ');
        document.getElementById('contact-teacher-form').dataset.teacherName = teacherName;
        modal.style.display = 'flex';
    }
    
    // Close modal
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('contact-teacher-modal').style.display = 'none';
        document.getElementById('contact-teacher-form').reset();
        document.getElementById('message-status').textContent = '';
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('contact-teacher-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('contact-teacher-form').reset();
            document.getElementById('message-status').textContent = '';
        }
    });
    
    // Handle contact form submission
    document.getElementById('contact-teacher-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const teacherName = form.dataset.teacherName;
        const messageContent = document.getElementById('message-content').value;
        const statusEl = document.getElementById('message-status');
        
        // Récupérer les infos du parent connecté
        const loggedParent = getLoggedParent();
        if (!loggedParent) {
            statusEl.textContent = '❌ Vous devez être connecté pour envoyer un message';
            statusEl.className = 'error';
            return;
        }
        
        const parentName = `${loggedParent.firstName} ${loggedParent.lastName}`;
        const parentPhone = loggedParent.phone;
        
        statusEl.textContent = 'Envoi en cours...';
        statusEl.className = '';
        
        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherName,
                    parentName,
                    parentPhone,
                    message: messageContent,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) throw new Error('Échec de l\'envoi');
            
            statusEl.textContent = '✅ Message envoyé avec succès !';
            statusEl.className = 'success';
            form.reset();
            
            setTimeout(() => {
                document.getElementById('contact-teacher-modal').style.display = 'none';
                statusEl.textContent = '';
            }, 2000);
            
        } catch (error) {
            console.error('Erreur:', error);
            statusEl.textContent = '❌ Erreur lors de l\'envoi. Réessayez.';
            statusEl.className = 'error';
        }
    });
    
    // View messages button (for teachers)
    document.getElementById('view-messages-btn')?.addEventListener('click', () => {
        loadTeacherMessages();
        showView('teacher-messages-view');
    });
    
    // Load teacher messages
    async function loadTeacherMessages() {
        const savedLogin = checkSavedLogin();
        if (!savedLogin) return;
        
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '<p>Chargement des messages...</p>';
        
        try {
            // Get teacher name from active card or saved login
            const activeTeacherCard = document.querySelector('.teacher-icon-card.active');
            const teacherName = activeTeacherCard ? activeTeacherCard.dataset.teacherName : null;
            
            const response = await fetch(`/api/get-messages?teacherName=${encodeURIComponent(teacherName || 'all')}`);
            if (!response.ok) throw new Error('Erreur de chargement');
            
            const data = await response.json();
            
            if (data.messages.length === 0) {
                messagesContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">Aucun message pour le moment.</p>';
                return;
            }
            
            messagesContainer.innerHTML = '';
            data.messages.forEach(msg => {
                const card = document.createElement('div');
                card.className = `message-card ${msg.read ? '' : 'unread'}`;
                card.innerHTML = `
                    <div class="message-header">
                        <span class="message-from">De: ${msg.parentName}</span>
                        <span class="message-date">${new Date(msg.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                    <div class="message-content">${msg.message}</div>
                `;
                messagesContainer.appendChild(card);
            });
            
            // Mark messages as read
            if (!savedLogin.isAdmin) {
                await fetch('/api/mark-messages-read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teacherName })
                });
                updateUnreadCount(0);
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            messagesContainer.innerHTML = '<p class="error-message">Erreur de chargement des messages.</p>';
        }
    }
    
    // Update unread message count
    async function updateUnreadCount(teacherName) {
        if (!teacherName) return;
        
        try {
            const response = await fetch(`/api/unread-count?teacherName=${encodeURIComponent(teacherName)}`);
            if (!response.ok) return;
            
            const data = await response.json();
            const badge = document.getElementById('unread-count');
            const messagesBtn = document.getElementById('view-messages-btn');
            
            if (data.count > 0) {
                badge.textContent = data.count;
                badge.style.display = 'flex';
                messagesBtn.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
    
    // Vérifier les notifications parent
    async function checkParentNotifications() {
        const loggedParent = getLoggedParent();
        if (!loggedParent) {
            document.getElementById('parent-notification-badge').style.display = 'none';
            return;
        }
        
        try {
            const response = await fetch(`/api/parent-unread-replies?phone=${encodeURIComponent(loggedParent.phone)}`);
            if (!response.ok) return;
            
            const data = await response.json();
            const badge = document.getElementById('parent-notification-badge');
            const countEl = document.getElementById('parent-unread-count');
            
            if (data.unreadCount > 0) {
                countEl.textContent = data.unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur vérification notifications:', error);
        }
    }
    
    // Afficher l'historique des messages parent
    async function showParentMessagesHistory() {
        const loggedParent = getLoggedParent();
        if (!loggedParent) return;
        
        const historyDiv = document.getElementById('parent-messages-history');
        const listDiv = document.getElementById('parent-messages-list');
        
        listDiv.innerHTML = '<p>Chargement...</p>';
        historyDiv.style.display = 'block';
        
        try {
            const response = await fetch(`/api/parent-messages?phone=${encodeURIComponent(loggedParent.phone)}`);
            if (!response.ok) throw new Error('Erreur de chargement');
            
            const data = await response.json();
            
            if (data.messages.length === 0) {
                listDiv.innerHTML = '<p style="text-align: center; color: #6b7280;">Aucun message pour le moment</p>';
                return;
            }
            
            listDiv.innerHTML = '';
            
            // Charger les messages avec leurs réponses
            for (const msg of data.messages) {
                const card = document.createElement('div');
                card.style.cssText = 'padding: 15px; margin: 10px 0; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;';
                
                // Charger les réponses pour ce message
                let repliesHtml = '';
                try {
                    const convResponse = await fetch(`/api/get-conversation?messageId=${msg._id}`);
                    if (convResponse.ok) {
                        const convData = await convResponse.json();
                        if (convData.replies && convData.replies.length > 0) {
                            repliesHtml = `
                                <div style="margin-top: 15px; padding-left: 20px; border-left: 3px solid #10b981;">
                                    ${convData.replies.map(reply => `
                                        <div style="background: #ecfdf5; padding: 12px; border-radius: 8px; margin-top: 10px;">
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                                <strong style="color: #059669;">🧑‍🏫 ${reply.teacherName}</strong>
                                                <span style="font-size: 0.85em; color: #6b7280;">${new Date(reply.timestamp).toLocaleString('fr-FR')}</span>
                                            </div>
                                            <div style="color: #065f46;">${reply.replyText}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            `;
                        }
                    }
                } catch (e) {
                    console.error('Erreur chargement réponses:', e);
                }
                
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong>À: ${msg.teacherName}</strong>
                        <span style="font-size: 0.9em; color: #6b7280;">${new Date(msg.date).toLocaleString('fr-FR')}</span>
                    </div>
                    <p style="margin: 0; color: #374151;">${msg.message}</p>
                    ${repliesHtml}
                `;
                listDiv.appendChild(card);
            }
            
            // Marquer comme lues
            await fetch('/api/mark-replies-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: loggedParent.phone })
            });
            
            checkParentNotifications();
            
        } catch (error) {
            console.error('Erreur:', error);
            listDiv.innerHTML = '<p class="error-message">Erreur de chargement des messages</p>';
        }
    }
    
    // Événements pour les notifications
    document.getElementById('parent-notification-badge')?.addEventListener('click', showParentMessagesHistory);
    document.getElementById('close-messages-history')?.addEventListener('click', () => {
        document.getElementById('parent-messages-history').style.display = 'none';
    });
    
    // Populate teachers contact when parent view is shown
    goToParentBtn.addEventListener('click', () => {
        populateTeachersContact();
        checkParentNotifications();
        
        // Vérifier les notifications régulièrement (toutes les 30 secondes)
        setInterval(checkParentNotifications, 30000);
    });
    
    // Update translations for teacher contact and parent accounts
    translations.fr = {
        ...translations.fr,
        contactTeachersTitle: '📧 Contacter les Enseignants',
        sendMessageTitle: 'Envoyer un message',
        parentNameLabel: 'Votre nom (père/mère de quel élève) :',
        messageLabel: 'Votre message :',
        sendButton: 'Envoyer',
        messagesButton: 'Messages',
        teacherMessagesTitle: 'Mes Messages',
        parentLoginTitle: 'Connexion Parent',
        registerTitle: 'Créer un compte',
        firstNameLabel: 'Prénom',
        lastNameLabel: 'Nom',
        phoneLabel: 'Numéro de téléphone',
        confirmPasswordLabel: 'Confirmer le mot de passe',
        registerButton: 'Créer mon compte',
        noAccountYet: 'Pas encore de compte ?',
        alreadyHaveAccount: 'Déjà un compte ?'
    };
    
    translations.ar = {
        ...translations.ar,
        contactTeachersTitle: '📧 التواصل مع المربين',
        sendMessageTitle: 'إرسال رسالة',
        parentNameLabel: 'اسمك (أب/أم أي تلميذ) :',
        messageLabel: 'رسالتك :',
        sendButton: 'إرسال',
        messagesButton: 'الرسائل',
        teacherMessagesTitle: 'رسائلي',
        parentLoginTitle: 'دخول الولي',
        registerTitle: 'إنشاء حساب',
        firstNameLabel: 'الاسم الأول',
        lastNameLabel: 'اسم العائلة',
        phoneLabel: 'رقم الهاتف',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        registerButton: 'إنشاء حسابي',
        noAccountYet: 'ليس لديك حساب بعد؟',
        alreadyHaveAccount: 'لديك حساب بالفعل؟'
    };

    // ============================================================================
    // GESTION DE LA BOÎTE DE RÉCEPTION POUR ENSEIGNANTS
    // ============================================================================
    
    async function loadTeacherMessages(teacherName) {
        const messagesContainer = document.getElementById('teacher-messages-container');
        if (!messagesContainer) return;
        
        try {
            const response = await fetch(`/api/get-messages?teacherName=${encodeURIComponent(teacherName)}`);
            if (!response.ok) throw new Error('Erreur de chargement des messages');
            
            const data = await response.json();
            const messages = Array.isArray(data) ? data : [];
            
            messagesContainer.innerHTML = `
                <div class="teacher-messages-section">
                    <h2>📬 ${translations[document.documentElement.lang].teacherMessagesTitle}</h2>
                    <div class="messages-list">
                        ${messages.length === 0 
                            ? '<p style="text-align:center;padding:20px;color:#666;">Aucun message pour le moment</p>' 
                            : messages.map(msg => `
                                <div class="message-card ${msg.read ? 'read' : 'unread'}" data-message-id="${msg._id}">
                                    <div class="message-header">
                                        <strong>${msg.parentName}</strong>
                                        <span class="message-date">${new Date(msg.date).toLocaleString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'fr-FR')}</span>
                                    </div>
                                    <div class="message-content">${msg.message}</div>
                                    <button class="reply-button" onclick="openReplyModal('${msg._id}', '${msg.parentName}', '${msg.parentPhone}', '${teacherName}')" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                                        💬 ${document.documentElement.lang === 'ar' ? 'الرد' : 'Répondre'}
                                    </button>
                                    <div class="replies-section" id="replies-${msg._id}" style="margin-top: 15px; padding-left: 20px; border-left: 3px solid #667eea;"></div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            `;
            
            // Charger les réponses pour chaque message
            messages.forEach(async (msg) => {
                await loadRepliesForMessage(msg._id);
            });
            
            // Marquer les messages comme lus
            if (messages.some(m => !m.read)) {
                await fetch('/api/mark-messages-read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teacherName })
                });
            }
        } catch (error) {
            console.error('Erreur chargement messages:', error);
            messagesContainer.innerHTML = '<p style="color:red;">Erreur de chargement des messages</p>';
        }
    }
    
    // ============================================================================
    // SYSTÈME DE TRADUCTION AUTOMATIQUE
    // ============================================================================
    
    window.translateComment = async function(commentId, targetLang) {
        const commentEl = document.getElementById(commentId);
        if (!commentEl) return;
        
        const originalText = commentEl.dataset.original;
        const currentText = commentEl.textContent;
        const btn = commentEl.nextElementSibling;
        
        // Si déjà traduit, revenir au texte original
        if (commentEl.dataset.translated === 'true') {
            commentEl.textContent = originalText;
            commentEl.dataset.translated = 'false';
            if (btn) btn.textContent = document.documentElement.lang === 'ar' ? '🌐 ترجمة' : '🌐 Traduire';
            return;
        }
        
        try {
            if (btn) btn.textContent = '⏳...';
            
            const response = await fetch('/api/translate-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: currentText, targetLang })
            });
            
            if (!response.ok) throw new Error('Erreur de traduction');
            
            const data = await response.json();
            commentEl.textContent = data.translatedText;
            commentEl.dataset.translated = 'true';
            
            if (btn) btn.textContent = document.documentElement.lang === 'ar' ? '↩️ الأصل' : '↩️ Original';
            
        } catch (error) {
            console.error('Erreur traduction:', error);
            if (btn) btn.textContent = '❌ Erreur';
        }
    };
    
    // ============================================================================
    // SYSTÈME DE RÉPONSES (CHAT BIDIRECTIONNEL)
    // ============================================================================
    
    // Fonction globale pour ouvrir la modal de réponse
    window.openReplyModal = function(messageId, parentName, parentPhone, teacherName) {
        const modal = document.createElement('div');
        modal.id = 'reply-modal-temp';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;';
        
        const lang = document.documentElement.lang;
        const replyTitle = lang === 'ar' ? 'الرد على' : 'Répondre à';
        const replyPlaceholder = lang === 'ar' ? 'اكتب ردك هنا...' : 'Écrivez votre réponse ici...';
        const sendBtn = lang === 'ar' ? 'إرسال' : 'Envoyer';
        const cancelBtn = lang === 'ar' ? 'إلغاء' : 'Annuler';
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <h2 style="margin: 0 0 20px 0; color: #667eea;">${replyTitle} ${parentName}</h2>
                <textarea id="reply-text-input" placeholder="${replyPlaceholder}" style="width: 100%; min-height: 150px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical;"></textarea>
                <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                    <button onclick="closeReplyModal()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">${cancelBtn}</button>
                    <button onclick="sendReply('${messageId}', '${teacherName}', '${parentPhone}')" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">${sendBtn}</button>
                </div>
                <p id="reply-status" style="margin-top: 15px; text-align: center;"></p>
            </div>
        `;
        
        document.body.appendChild(modal);
    };
    
    window.closeReplyModal = function() {
        const modal = document.getElementById('reply-modal-temp');
        if (modal) modal.remove();
    };
    
    window.sendReply = async function(messageId, teacherName, parentPhone) {
        const replyText = document.getElementById('reply-text-input').value.trim();
        const statusEl = document.getElementById('reply-status');
        
        if (!replyText) {
            statusEl.textContent = document.documentElement.lang === 'ar' ? 'الرجاء كتابة رد' : 'Veuillez écrire une réponse';
            statusEl.style.color = 'red';
            return;
        }
        
        statusEl.textContent = document.documentElement.lang === 'ar' ? 'جار الإرسال...' : 'Envoi en cours...';
        statusEl.style.color = '#667eea';
        
        try {
            const response = await fetch('/api/send-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId,
                    teacherName,
                    parentPhone,
                    replyText
                })
            });
            
            if (!response.ok) throw new Error('Erreur d\'envoi');
            
            statusEl.textContent = document.documentElement.lang === 'ar' ? '✅ تم إرسال الرد بنجاح!' : '✅ Réponse envoyée avec succès !';
            statusEl.style.color = 'green';
            
            setTimeout(() => {
                closeReplyModal();
                loadRepliesForMessage(messageId);
            }, 1500);
            
        } catch (error) {
            console.error('Erreur:', error);
            statusEl.textContent = document.documentElement.lang === 'ar' ? '❌ حدث خطأ' : '❌ Une erreur est survenue';
            statusEl.style.color = 'red';
        }
    };
    
    async function loadRepliesForMessage(messageId) {
        try {
            const response = await fetch(`/api/get-conversation?messageId=${messageId}`);
            if (!response.ok) return;
            
            const data = await response.json();
            const repliesContainer = document.getElementById(`replies-${messageId}`);
            
            if (!repliesContainer || !data.replies || data.replies.length === 0) return;
            
            const lang = document.documentElement.lang;
            repliesContainer.innerHTML = data.replies.map(reply => `
                <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="color: #667eea;">🧑‍🏫 ${reply.teacherName}</strong>
                        <span style="font-size: 0.85em; color: #6b7280;">${new Date(reply.timestamp).toLocaleString(lang === 'ar' ? 'ar-SA' : 'fr-FR')}</span>
                    </div>
                    <div style="color: #374151;">${reply.replyText}</div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Erreur chargement réponses:', error);
        }
    }
    
    // ============================================================================
    // SYSTÈME D'ÉVALUATION GÉNÉRALE AUTOMATIQUE
    // ============================================================================
    
    async function calculateGeneralEvaluations() {
        try {
            const response = await fetch('/api/general-evaluations');
            if (!response.ok) throw new Error('Erreur calcul évaluations');
            
            const evaluations = await response.json();
            return evaluations;
        } catch (error) {
            console.error('Erreur calcul évaluations générales:', error);
            return null;
        }
    }
    
    // Afficher les évaluations générales dans le dashboard parent
    async function displayGeneralEvaluations(className, studentName) {
        const evaluationsContainer = document.getElementById('general-evaluations-container');
        if (!evaluationsContainer) return;
        
        try {
            const evaluations = await calculateGeneralEvaluations();
            if (!evaluations) return;
            
            const studentEval = evaluations.find(e => e.classe === className && e.student === studentName);
            if (!studentEval) return;
            
            const isPEI1 = className === 'PEI1';
            const behaviorMax = isPEI1 ? 30 : 20;
            
            evaluationsContainer.innerHTML = `
                <div class="general-eval-card">
                    <h3>📊 Évaluation Générale (8 dernières semaines)</h3>
                    <div class="eval-row">
                        <span class="eval-label">Comportement & Participation :</span>
                        <span class="eval-score">${studentEval.behaviorScore.toFixed(1)}/${behaviorMax}</span>
                        <div class="eval-bar">
                            <div class="eval-fill" style="width: ${(studentEval.behaviorScore / behaviorMax * 100).toFixed(1)}%;"></div>
                        </div>
                    </div>
                    <div class="eval-row">
                        <span class="eval-label">Faisabilité des Devoirs :</span>
                        <span class="eval-score">${studentEval.homeworkScore.toFixed(1)}/20</span>
                        <div class="eval-bar">
                            <div class="eval-fill" style="width: ${(studentEval.homeworkScore / 20 * 100).toFixed(1)}%;"></div>
                        </div>
                    </div>
                    <div class="eval-total">
                        <strong>Total : ${(studentEval.behaviorScore + studentEval.homeworkScore).toFixed(1)}/${behaviorMax + 20}</strong>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erreur affichage évaluations:', error);
        }
    }

    displayHomePageExtras();
    setLanguage('fr');
});
