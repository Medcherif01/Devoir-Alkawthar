const { createClient } = require('@supabase/supabase-js');
const moment = require('moment');
const crypto = require('crypto');

// ============================================================================
// SUPABASE CLIENT
// ============================================================================
let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables.');
    }

    supabaseClient = createClient(url, key);
    return supabaseClient;
}

// ============================================================================
// AUTO-SETUP: Créer les tables si elles n'existent pas
// ============================================================================
async function ensureTablesExist() {
    const supabase = getSupabase();

    // On utilise rpc pour exécuter du SQL brut
    const setupSQL = `
        -- Table plans (planning des devoirs)
        CREATE TABLE IF NOT EXISTS plans (
            id BIGSERIAL PRIMARY KEY,
            "Jour" TEXT NOT NULL,
            "Classe" TEXT NOT NULL,
            "Matière" TEXT NOT NULL,
            "Enseignant" TEXT,
            "Devoirs" TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE("Jour", "Classe", "Matière")
        );

        -- Table evaluations
        CREATE TABLE IF NOT EXISTS evaluations (
            id BIGSERIAL PRIMARY KEY,
            date TEXT NOT NULL,
            "studentName" TEXT NOT NULL,
            class TEXT NOT NULL,
            subject TEXT NOT NULL,
            status TEXT,
            participation INTEGER,
            behavior INTEGER,
            comment TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(date, "studentName", class, subject)
        );

        -- Table daily_stars
        CREATE TABLE IF NOT EXISTS daily_stars (
            id BIGSERIAL PRIMARY KEY,
            date TEXT NOT NULL,
            "studentName" TEXT NOT NULL,
            "className" TEXT NOT NULL,
            "earnedStar" NUMERIC DEFAULT 0,
            "evaluationCount" INTEGER DEFAULT 0,
            "completionRate" NUMERIC DEFAULT 0,
            "avgParticipation" NUMERIC DEFAULT 0,
            "avgBehavior" NUMERIC DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(date, "studentName", "className")
        );

        -- Table students_of_the_week
        CREATE TABLE IF NOT EXISTS students_of_the_week (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            stars NUMERIC DEFAULT 0,
            "progressPercentage" NUMERIC DEFAULT 0,
            "progressComment" JSONB,
            "weekIdentifier" TEXT NOT NULL,
            "startDate" TEXT,
            "endDate" TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table photos_of_the_day
        CREATE TABLE IF NOT EXISTS photos_of_the_day (
            id BIGSERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            comment TEXT DEFAULT '',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table photos_celebration_2
        CREATE TABLE IF NOT EXISTS photos_celebration_2 (
            id BIGSERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            comment TEXT DEFAULT '',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table photos_celebration_3
        CREATE TABLE IF NOT EXISTS photos_celebration_3 (
            id BIGSERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            comment TEXT DEFAULT '',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table teacher_messages
        CREATE TABLE IF NOT EXISTS teacher_messages (
            id BIGSERIAL PRIMARY KEY,
            "teacherName" TEXT NOT NULL,
            "parentName" TEXT NOT NULL,
            "parentPhone" TEXT DEFAULT '',
            message TEXT NOT NULL,
            date TEXT,
            read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table teacher_replies
        CREATE TABLE IF NOT EXISTS teacher_replies (
            id BIGSERIAL PRIMARY KEY,
            "messageId" TEXT NOT NULL,
            "teacherName" TEXT NOT NULL,
            "parentPhone" TEXT NOT NULL,
            "replyText" TEXT NOT NULL,
            "readByParent" BOOLEAN DEFAULT FALSE,
            timestamp TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table parent_accounts
        CREATE TABLE IF NOT EXISTS parent_accounts (
            id BIGSERIAL PRIMARY KEY,
            "firstName" TEXT NOT NULL,
            "lastName" TEXT NOT NULL,
            phone TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            "lastLogin" TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    try {
        await supabase.rpc('exec_sql', { sql: setupSQL });
    } catch (e) {
        // Si la fonction rpc n'existe pas, on ignore (les tables sont peut-être déjà créées via le dashboard)
        console.log('[Setup] Tables auto-setup via rpc skipped (normal if already exists):', e.message);
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function readJsonBody(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    return await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
        });
        req.on('error', () => resolve({}));
    });
}

function convertArabicToLatin(str) {
    const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
    const latinNumerals = '0123456789';
    let result = String(str);
    for (let i = 0; i < arabicNumerals.length; i++) {
        result = result.replace(new RegExp(arabicNumerals[i], 'g'), latinNumerals[i]);
    }
    return result;
}

function parseUniversalDate(dateStr) {
    if (!dateStr) return null;
    dateStr = String(dateStr).trim();
    dateStr = convertArabicToLatin(dateStr);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const testDate = moment(dateStr, 'YYYY-MM-DD', true);
        if (testDate.isValid()) return dateStr;
    }

    const formats = [
        'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD',
        'DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY',
        'DD/MM/YY', 'DD-MM-YY', 'DD.MM.YY',
        'MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY',
        'MM/DD/YY', 'MM-DD-YY', 'MM.DD.YY',
        'DD MMMM YYYY', 'D MMMM YYYY',
        'DD MMM YYYY', 'D MMM YYYY',
        'MMMM DD, YYYY', 'MMM DD, YYYY',
        'DDMMYYYY', 'YYYYMMDD',
        moment.ISO_8601
    ];

    for (const format of formats) {
        let parsed = moment(dateStr, format, 'fr', true);
        if (parsed.isValid()) return parsed.format('YYYY-MM-DD');
        parsed = moment(dateStr, format, 'en', true);
        if (parsed.isValid()) return parsed.format('YYYY-MM-DD');
        parsed = moment(dateStr, format, true);
        if (parsed.isValid()) return parsed.format('YYYY-MM-DD');
    }

    const autoParsed = moment(dateStr);
    if (autoParsed.isValid() && autoParsed.year() > 2000 && autoParsed.year() < 2100) {
        return autoParsed.format('YYYY-MM-DD');
    }
    return null;
}

const calculateDailyStar = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return 0;
    const completedHomework = evaluations.filter(ev => ev.status === 'Fait').length;
    const partiallyCompleted = evaluations.filter(ev => ev.status === 'Partiellement Fait').length;
    const hasGoodParticipation = evaluations.every(ev => (ev.participation || 0) > 5);
    const hasGoodBehavior = evaluations.every(ev => (ev.behavior || 0) > 5);
    if (completedHomework === evaluations.length && hasGoodParticipation && hasGoodBehavior) return 1;
    const halfOrMore = (completedHomework + partiallyCompleted) >= (evaluations.length / 2);
    if (halfOrMore && hasGoodParticipation && hasGoodBehavior) return 0.5;
    return 0;
};

const calculateStarsLegacy = (evaluations) => {
    const evalsByDay = {};
    evaluations.forEach(ev => {
        if (!evalsByDay[ev.date]) evalsByDay[ev.date] = [];
        evalsByDay[ev.date].push(ev);
    });
    let stars = 0;
    for (const date in evalsByDay) {
        const dayEvals = evalsByDay[date];
        const completedHomework = dayEvals.filter(ev =>
            ev.status === 'Fait' || ev.status === 'Partiellement Fait'
        ).length;
        const completionRate = (completedHomework / dayEvals.length) * 100;
        const hasGoodCompletion = completionRate > 70;
        const goodBehavior = dayEvals.every(ev => (ev.behavior || 0) > 5);
        const goodParticipation = dayEvals.every(ev => (ev.participation || 0) > 5);
        if (hasGoodCompletion && goodBehavior && goodParticipation) stars++;
    }
    return stars;
};

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function convertGoogleDriveUrl(url) {
    if (!url) return url;
    const drivePattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(drivePattern);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
}

// ============================================================================
// API HANDLERS
// ============================================================================

// Handler: /api/evaluations
async function handleEvaluations(req, res) {
    const supabase = getSupabase();
    const { class: className, student: studentName, date: dateQuery, week } = req.query;

    if (req.method === 'POST') {
        if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
        const { evaluations } = req.body;
        if (!evaluations || evaluations.length === 0) {
            return res.status(200).json({ message: 'Aucune évaluation à enregistrer.' });
        }

        for (const ev of evaluations) {
            const { error } = await supabase
                .from('evaluations')
                .upsert({
                    date: ev.date,
                    studentName: ev.studentName,
                    class: ev.class,
                    subject: ev.subject,
                    status: ev.status,
                    participation: ev.participation,
                    behavior: ev.behavior,
                    comment: ev.comment
                }, { onConflict: 'date,studentName,class,subject' });

            if (error) console.error('[Supabase] upsert evaluation error:', error);
        }

        return res.status(200).json({ message: 'Évaluations enregistrées.' });
    }

    if (req.method === 'GET') {
        if (!className || !dateQuery) {
            return res.status(400).json({ error: 'Classe et date sont requises.' });
        }

        // Récupérer le planning
        const { data: planningEntries, error: planError } = await supabase
            .from('plans')
            .select('*')
            .eq('Classe', className)
            .eq('Jour', dateQuery);

        if (planError) console.error('[Supabase] plans query error:', planError);

        const homeworks = (planningEntries || [])
            .filter(entry => entry.Devoirs && entry.Devoirs.trim() !== '')
            .map(entry => ({
                subject: entry['Matière'],
                assignment: entry['Devoirs'],
                teacher: entry['Enseignant']
            }));

        // Récupérer les évaluations
        let evalQuery = supabase
            .from('evaluations')
            .select('*')
            .eq('class', className)
            .eq('date', dateQuery);

        if (studentName) evalQuery = evalQuery.eq('studentName', studentName);

        const { data: evaluations, error: evalError } = await evalQuery;
        if (evalError) console.error('[Supabase] evaluations query error:', evalError);

        let responseData = { homeworks, evaluations: evaluations || [] };

        if (week === 'true' && studentName) {
            const targetDate = moment.utc(dateQuery);
            const firstDayStr = targetDate.clone().startOf('isoWeek').format('YYYY-MM-DD');
            const lastDayStr = targetDate.clone().endOf('isoWeek').format('YYYY-MM-DD');

            const { data: weeklyEvaluations } = await supabase
                .from('evaluations')
                .select('*')
                .eq('studentName', studentName)
                .eq('class', className)
                .gte('date', firstDayStr)
                .lte('date', lastDayStr);

            responseData.weeklyEvaluations = weeklyEvaluations || [];
        }

        return res.status(200).json(responseData);
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/weekly-summary
async function handleWeeklySummary(req, res) {
    const supabase = getSupabase();

    const today = moment().startOf('day');
    const dayOfWeek = today.day();

    let targetWeekStart, targetWeekEnd;

    if (dayOfWeek === 0 || dayOfWeek === 1) {
        targetWeekStart = today.clone().subtract(7, 'days').day(0);
        targetWeekEnd = today.clone().subtract(7, 'days').day(4);
    } else {
        return res.status(200).json({ studentsOfWeek: [], showDisplay: false, message: 'Élève de la semaine affiché uniquement dimanche et lundi' });
    }

    const weekIdentifier = targetWeekStart.format('YYYY-[W]WW');
    const startStr = targetWeekStart.format('YYYY-MM-DD');
    const endStr = targetWeekEnd.format('YYYY-MM-DD');

    // Vérifier si déjà calculé
    const { data: existingStudentsOfWeek } = await supabase
        .from('students_of_the_week')
        .select('*')
        .eq('weekIdentifier', weekIdentifier);

    if (existingStudentsOfWeek && existingStudentsOfWeek.length > 0) {
        return res.status(200).json({
            studentsOfWeek: existingStudentsOfWeek,
            showDisplay: true,
            isLastWeek: true
        });
    }

    const { data: dailyStars } = await supabase
        .from('daily_stars')
        .select('*')
        .gte('date', startStr)
        .lte('date', endStr);

    const { data: allEvals } = await supabase
        .from('evaluations')
        .select('*')
        .gte('date', startStr)
        .lte('date', endStr);

    const studentsByClass = {};

    if (dailyStars && dailyStars.length > 0) {
        dailyStars.forEach(starRecord => {
            const classKey = starRecord.className;
            if (!studentsByClass[classKey]) studentsByClass[classKey] = {};
            if (!studentsByClass[classKey][starRecord.studentName]) {
                studentsByClass[classKey][starRecord.studentName] = { stars: 0, dailyRecords: [], progressPercentage: 0 };
            }
            if (starRecord.earnedStar) studentsByClass[classKey][starRecord.studentName].stars += Number(starRecord.earnedStar);
            studentsByClass[classKey][starRecord.studentName].dailyRecords.push(starRecord);
        });
    } else if (allEvals) {
        allEvals.forEach(ev => {
            const classKey = ev.class;
            if (!studentsByClass[classKey]) studentsByClass[classKey] = {};
            if (!studentsByClass[classKey][ev.studentName]) {
                studentsByClass[classKey][ev.studentName] = { evals: [], class: ev.class };
            }
            studentsByClass[classKey][ev.studentName].evals.push(ev);
        });
    }

    // Calculer progression
    for (const classKey in studentsByClass) {
        for (const studentName in studentsByClass[classKey]) {
            const studentData = studentsByClass[classKey][studentName];
            const studentEvals = (allEvals || []).filter(ev => ev.class === classKey && ev.studentName === studentName);
            let totalScore = 0, maxScore = 0;
            studentEvals.forEach(ev => {
                const dow = moment(ev.date).day();
                if (dow >= 0 && dow <= 4 && ev.status !== 'Absent') {
                    totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                    maxScore += 30;
                }
            });
            studentData.progressPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
            if (!studentData.stars && studentData.evals) {
                studentData.stars = calculateStarsLegacy(studentData.evals);
            }
        }
    }

    // Semaine précédente pour progression
    const prevStart = targetWeekStart.clone().subtract(7, 'days').format('YYYY-MM-DD');
    const prevEnd = targetWeekEnd.clone().subtract(7, 'days').format('YYYY-MM-DD');
    const { data: previousDailyStars } = await supabase
        .from('daily_stars')
        .select('*')
        .gte('date', prevStart)
        .lte('date', prevEnd);

    const previousWeekStars = {};
    (previousDailyStars || []).forEach(starRecord => {
        const key = `${starRecord.studentName}_${starRecord.className}`;
        if (!previousWeekStars[key]) previousWeekStars[key] = 0;
        previousWeekStars[key] += Number(starRecord.earnedStar || 0);
    });

    let topStudentOverall = null;
    let topStarsOverall = -1;

    for (const classKey in studentsByClass) {
        for (const studentName in studentsByClass[classKey]) {
            const studentData = studentsByClass[classKey][studentName];
            const stars = studentData.stars || 0;
            const progress = studentData.progressPercentage || 0;
            if (stars >= 3 && progress > 79) {
                if (stars > topStarsOverall) {
                    topStarsOverall = stars;
                    const previousStars = previousWeekStars[`${studentName}_${classKey}`] || 0;
                    let progressComment = { fr: 'Excellent', ar: 'ممتاز' };
                    if (stars > previousStars) progressComment = { fr: 'En amélioration', ar: 'في تحسن' };
                    else if (stars < previousStars) progressComment = { fr: 'En régression', ar: 'في تراجع' };

                    topStudentOverall = {
                        name: studentName,
                        class: classKey,
                        stars,
                        progressPercentage: progress,
                        progressComment,
                        weekIdentifier,
                        startDate: startStr,
                        endDate: endStr,
                        created_at: new Date().toISOString()
                    };
                }
            }
        }
    }

    const studentsOfWeek = topStudentOverall ? [topStudentOverall] : [];

    if (studentsOfWeek.length > 0) {
        await supabase.from('students_of_the_week').insert(studentsOfWeek);
    }

    res.status(200).json({ studentsOfWeek, showDisplay: true, isLastWeek: true });
}

// Handler: /api/daily-stars
async function handleDailyStars(req, res) {
    const supabase = getSupabase();

    if (req.method === 'GET') {
        const { studentName, className, date, week } = req.query;

        let query = supabase.from('daily_stars').select('*');
        if (studentName) query = query.eq('studentName', studentName);
        if (className) query = query.eq('className', className);
        if (date) query = query.eq('date', date);

        if (week) {
            const today = moment().startOf('day');
            const startOfWeek = today.clone().day(0).format('YYYY-MM-DD');
            const endOfWeek = today.clone().day(4).format('YYYY-MM-DD');
            query = query.gte('date', startOfWeek).lte('date', endOfWeek);
        }

        const { data: stars, error } = await query;
        if (error) console.error('[Supabase] daily_stars query error:', error);
        return res.status(200).json({ stars: stars || [] });

    } else if (req.method === 'POST') {
        if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
        const { date } = req.body;
        const targetDate = date || moment().format('YYYY-MM-DD');

        const { data: evaluations } = await supabase
            .from('evaluations')
            .select('*')
            .eq('date', targetDate);

        if (!evaluations || evaluations.length === 0) {
            return res.status(200).json({ message: 'No evaluations found for this date', date: targetDate });
        }

        const evalsByStudent = {};
        evaluations.forEach(ev => {
            const key = `${ev.studentName}_${ev.class}`;
            if (!evalsByStudent[key]) {
                evalsByStudent[key] = { studentName: ev.studentName, className: ev.class, evaluations: [] };
            }
            evalsByStudent[key].evaluations.push(ev);
        });

        const dailyStars = [];
        for (const key in evalsByStudent) {
            const studentData = evalsByStudent[key];
            const earnedStarValue = calculateDailyStar(studentData.evaluations);
            const starRecord = {
                date: targetDate,
                studentName: studentData.studentName,
                className: studentData.className,
                earnedStar: earnedStarValue,
                evaluationCount: studentData.evaluations.length,
                completionRate: studentData.evaluations.length > 0
                    ? Math.round((studentData.evaluations.filter(ev =>
                        ev.status === 'Fait' || ev.status === 'Partiellement Fait'
                      ).length / studentData.evaluations.length) * 100)
                    : 0,
                avgParticipation: studentData.evaluations.length > 0
                    ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.participation || 0), 0) / studentData.evaluations.length * 10) / 10
                    : 0,
                avgBehavior: studentData.evaluations.length > 0
                    ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.behavior || 0), 0) / studentData.evaluations.length * 10) / 10
                    : 0
            };

            await supabase.from('daily_stars').upsert(starRecord, { onConflict: 'date,studentName,className' });
            dailyStars.push(starRecord);
        }

        return res.status(200).json({
            message: `Processed ${dailyStars.length} student records for ${targetDate}`,
            date: targetDate,
            stars: dailyStars
        });

    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

// Handler: /api/photo-of-the-day
async function handlePhotoOfTheDay(req, res) {
    const supabase = getSupabase();

    if (req.method === 'POST') {
        if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
        let { imageUrl, comment } = req.body;
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }
        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }
        imageUrl = convertGoogleDriveUrl(imageUrl);
        await supabase.from('photos_of_the_day').insert({ url: imageUrl, comment: comment || '' });
        return res.status(200).json({ message: 'Photo ajoutée avec succès.', convertedUrl: imageUrl });
    }

    if (req.method === 'GET') {
        // Supprimer les photos de plus de 3 jours
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('photos_of_the_day').delete().lt('created_at', threeDaysAgo);

        const { data } = await supabase
            .from('photos_of_the_day')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        return res.status(200).json(data && data.length > 0 ? data[0] : {});
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/photo-2
async function handlePhoto2(req, res) {
    const supabase = getSupabase();

    if (req.method === 'POST') {
        if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
        let { imageUrl, comment } = req.body;
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }
        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }
        imageUrl = convertGoogleDriveUrl(imageUrl);
        await supabase.from('photos_celebration_2').insert({ url: imageUrl, comment: comment || 'Une autre belle réussite à célébrer !' });
        return res.status(200).json({ message: 'Photo de célébration 2 ajoutée avec succès.', convertedUrl: imageUrl });
    }

    if (req.method === 'GET') {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('photos_celebration_2').delete().lt('created_at', threeDaysAgo);
        const { data } = await supabase
            .from('photos_celebration_2')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        return res.status(200).json(data && data.length > 0 ? data[0] : {});
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/photo-3
async function handlePhoto3(req, res) {
    const supabase = getSupabase();

    if (req.method === 'POST') {
        if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
        let { imageUrl, comment } = req.body;
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }
        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }
        imageUrl = convertGoogleDriveUrl(imageUrl);
        await supabase.from('photos_celebration_3').insert({ url: imageUrl, comment: comment || 'Un accomplissement remarquable !' });
        return res.status(200).json({ message: 'Photo de célébration 3 ajoutée avec succès.', convertedUrl: imageUrl });
    }

    if (req.method === 'GET') {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('photos_celebration_3').delete().lt('created_at', threeDaysAgo);
        const { data } = await supabase
            .from('photos_celebration_3')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        return res.status(200).json(data && data.length > 0 ? data[0] : {});
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/upload-plan
async function handleUploadPlan(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const planData = req.body;

    if (!planData || planData.length === 0) {
        return res.status(400).json({ message: 'Aucune donnée à enregistrer.' });
    }

    const normalizedPlanData = planData.map(plan => {
        if (plan.Jour) {
            const normalizedDate = parseUniversalDate(plan.Jour);
            if (normalizedDate) {
                return { ...plan, Jour: normalizedDate };
            } else {
                console.warn(`⚠️ Date non parsable ignorée : "${plan.Jour}"`);
                return null;
            }
        }
        return plan;
    }).filter(Boolean);

    if (normalizedPlanData.length === 0) {
        return res.status(400).json({
            message: 'Aucune date valide trouvée dans les données.',
            tip: 'Formats supportés : YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, chiffres arabes, etc.'
        });
    }

    // Upsert par batch pour Supabase
    const { error } = await supabase
        .from('plans')
        .upsert(normalizedPlanData, { onConflict: 'Jour,Classe,Matière' });

    if (error) {
        console.error('[Supabase] upload-plan error:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement.', details: error.message });
    }

    const skipped = planData.length - normalizedPlanData.length;
    let message = `Planning mis à jour avec ${normalizedPlanData.length} enregistrements.`;
    if (skipped > 0) message += ` (${skipped} entrées avec dates invalides ignorées)`;

    return res.status(200).json({ message, normalized: normalizedPlanData.length, skipped });
}

// Handler: /api/initial-data
async function handleInitialData(req, res) {
    const supabase = getSupabase();
    const { data: planData, error } = await supabase.from('plans').select('*');
    if (error) console.error('[Supabase] initial-data error:', error);
    const plans = planData || [];
    const teachers = [...new Set(plans.map(item => item['Enseignant']).filter(Boolean))].sort();
    return res.status(200).json({ teachers, planData: plans });
}

// Handler: /api/send-message
async function handleSendMessage(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { teacherName, parentName, parentPhone, message, timestamp } = req.body;
    if (!teacherName || !parentName || !message) {
        return res.status(400).json({ error: 'Données incomplètes' });
    }
    await supabase.from('teacher_messages').insert({
        teacherName, parentName, parentPhone: parentPhone || '',
        message, date: timestamp || new Date().toISOString(), read: false
    });
    return res.status(200).json({ message: 'Message envoyé avec succès' });
}

// Handler: /api/get-messages
async function handleGetMessages(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    const { teacherName } = req.query;
    let query = supabase.from('teacher_messages').select('*').order('created_at', { ascending: false });
    if (teacherName && teacherName !== 'all') query = query.eq('teacherName', teacherName);
    const { data: messages } = await query;
    return res.status(200).json({ messages: messages || [] });
}

// Handler: /api/mark-messages-read
async function handleMarkMessagesRead(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { teacherName } = req.body;
    if (!teacherName) return res.status(400).json({ error: 'Nom d\'enseignant requis' });
    await supabase.from('teacher_messages').update({ read: true }).eq('teacherName', teacherName).eq('read', false);
    return res.status(200).json({ message: 'Messages marqués comme lus' });
}

// Handler: /api/unread-count
async function handleUnreadCount(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    const { teacherName } = req.query;
    if (!teacherName) return res.status(400).json({ error: 'Nom d\'enseignant requis' });
    const { count } = await supabase
        .from('teacher_messages')
        .select('*', { count: 'exact', head: true })
        .eq('teacherName', teacherName)
        .eq('read', false);
    return res.status(200).json({ count: count || 0 });
}

// Handler: /api/general-evaluations
async function handleGeneralEvaluations(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        const supabase = getSupabase();
        const eightWeeksAgo = moment().subtract(8, 'weeks').startOf('day').format('YYYY-MM-DD');

        const { data: evaluations, error } = await supabase
            .from('evaluations')
            .select('*')
            .gte('date', eightWeeksAgo);

        if (error) throw error;

        const studentEvaluations = {};
        (evaluations || []).forEach(ev => {
            const key = `${ev.class}|||${ev.studentName}`;
            if (!studentEvaluations[key]) {
                studentEvaluations[key] = {
                    classe: ev.class, student: ev.studentName,
                    behaviors: [], participations: [], statuses: [], bySubject: {}
                };
            }
            const sd = studentEvaluations[key];
            const subj = (ev.subject || '').trim();
            if (subj && !sd.bySubject[subj]) sd.bySubject[subj] = { behaviors: [], participations: [], statuses: [] };
            const bNum = parseInt(ev.behavior);
            const pNum = parseInt(ev.participation);
            if (!isNaN(bNum)) { sd.behaviors.push(bNum); if (subj) sd.bySubject[subj].behaviors.push(bNum); }
            if (!isNaN(pNum)) { sd.participations.push(pNum); if (subj) sd.bySubject[subj].participations.push(pNum); }
            if (ev.status) { sd.statuses.push(ev.status); if (subj) sd.bySubject[subj].statuses.push(ev.status); }
        });

        function calcScores(behaviors, participations, statuses, isPEI1) {
            const maxPB = isPEI1 ? 30 : 20;
            const avgB = behaviors.length > 0 ? behaviors.reduce((a, b) => a + b, 0) / behaviors.length : 0;
            const avgP = participations.length > 0 ? participations.reduce((a, b) => a + b, 0) / participations.length : 0;
            const rawPB = ((avgB + avgP) / 2) / 10 * maxPB;
            const participationBehaviorScore = Math.min(maxPB, parseFloat(rawPB.toFixed(2)));
            const total = statuses.length;
            const done = statuses.filter(s => s === 'Fait').length;
            const partial = statuses.filter(s => s === 'Partiellement Fait').length;
            const rate = total > 0 ? (done + partial * 0.5) / total : 0;
            const homeworkScore = Math.min(20, parseFloat((rate * 20).toFixed(2)));
            return { participationBehaviorScore, homeworkScore, maxPB, maxHW: 20 };
        }

        const results = Object.values(studentEvaluations).map(sd => {
            const isPEI1 = sd.classe === 'PEI1';
            const maxPB = isPEI1 ? 30 : 20;
            const global = calcScores(sd.behaviors, sd.participations, sd.statuses, isPEI1);
            const subjectScores = {};
            for (const [subj, data] of Object.entries(sd.bySubject)) {
                subjectScores[subj] = calcScores(data.behaviors, data.participations, data.statuses, isPEI1);
            }
            return {
                classe: sd.classe, student: sd.student, isPEI1, maxPB, maxHW: 20,
                participationBehaviorScore: global.participationBehaviorScore,
                homeworkScore: global.homeworkScore,
                totalScore: parseFloat((global.participationBehaviorScore + global.homeworkScore).toFixed(2)),
                totalMax: maxPB + 20, subjectScores
            };
        });

        return res.status(200).json(results);
    } catch (error) {
        console.error('[API] Erreur calcul évaluations générales:', error);
        return res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
}

// Handler: /api/parent-register
async function handleParentRegister(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { firstName, lastName, phone, password } = req.body;
    if (!firstName || !lastName || !phone || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const { data: existing } = await supabase.from('parent_accounts').select('id').eq('phone', phone).single();
    if (existing) return res.status(409).json({ error: 'Ce numéro de téléphone est déjà enregistré' });
    const hashedPassword = hashPassword(password);
    await supabase.from('parent_accounts').insert({ firstName, lastName, phone, password: hashedPassword });
    return res.status(201).json({ message: 'Compte créé avec succès', parent: { firstName, lastName, phone } });
}

// Handler: /api/parent-login
async function handleParentLogin(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Numéro de téléphone et mot de passe requis' });
    const hashedPassword = hashPassword(password);
    const { data: parent } = await supabase.from('parent_accounts').select('*').eq('phone', phone).eq('password', hashedPassword).single();
    if (!parent) return res.status(401).json({ error: 'Numéro de téléphone ou mot de passe incorrect' });
    await supabase.from('parent_accounts').update({ lastLogin: new Date().toISOString() }).eq('phone', phone);
    return res.status(200).json({
        message: 'Connexion réussie',
        parent: { firstName: parent.firstName, lastName: parent.lastName, phone: parent.phone }
    });
}

// Handler: /api/parent-messages
async function handleParentMessages(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Numéro de téléphone requis' });
    const { data: messages } = await supabase
        .from('teacher_messages')
        .select('*')
        .eq('parentPhone', phone)
        .order('created_at', { ascending: false });
    return res.status(200).json({ messages: messages || [] });
}

// Handler: /api/parent-unread-replies
async function handleParentUnreadReplies(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Numéro de téléphone requis' });
    const { count } = await supabase
        .from('teacher_replies')
        .select('*', { count: 'exact', head: true })
        .eq('parentPhone', phone)
        .eq('readByParent', false);
    return res.status(200).json({ unreadCount: count || 0 });
}

// Handler: /api/mark-replies-read
async function handleMarkRepliesRead(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Numéro de téléphone requis' });
    await supabase.from('teacher_replies').update({ readByParent: true }).eq('parentPhone', phone).eq('readByParent', false);
    return res.status(200).json({ message: 'Réponses marquées comme lues' });
}

// Handler: /api/send-reply
async function handleSendReply(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { messageId, teacherName, parentPhone, replyText } = req.body;
    if (!messageId || !teacherName || !parentPhone || !replyText) {
        return res.status(400).json({ error: 'Données incomplètes' });
    }
    await supabase.from('teacher_replies').insert({
        messageId, teacherName, parentPhone, replyText,
        readByParent: false, timestamp: new Date().toISOString()
    });
    return res.status(200).json({ message: 'Réponse envoyée avec succès' });
}

// Handler: /api/translate-text
async function handleTranslateText(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });
    if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'Texte et langue cible requis' });

    const translations = {
        'Fait': 'أنجز', 'Non Fait': 'لم ينجز', 'Partiellement Fait': 'أنجز جزئياً',
        'Absent': 'غائب', 'Excellent': 'ممتاز', 'Très bien': 'جيد جداً', 'Bien': 'جيد',
        'Moyen': 'متوسط', 'Faible': 'ضعيف', 'Bon travail': 'عمل جيد', 'Continue': 'واصل',
        'Bravo': 'أحسنت', 'Félicitations': 'تهانينا',
        'أنجز': 'Fait', 'لم ينجز': 'Non Fait', 'أنجز جزئياً': 'Partiellement Fait',
        'غائب': 'Absent', 'ممتاز': 'Excellent', 'جيد جداً': 'Très bien', 'جيد': 'Bien',
        'متوسط': 'Moyen', 'ضعيف': 'Faible', 'عمل جيد': 'Bon travail', 'واصل': 'Continue',
        'أحسنت': 'Bravo', 'تهانينا': 'Félicitations'
    };
    let translatedText = text;
    for (const [key, value] of Object.entries(translations)) {
        translatedText = translatedText.replace(new RegExp(key, 'gi'), value);
    }
    return res.status(200).json({ originalText: text, translatedText, targetLang });
}

// Handler: /api/get-conversation
async function handleGetConversation(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
    const supabase = getSupabase();
    const { messageId } = req.query;
    if (!messageId) return res.status(400).json({ error: 'ID du message requis' });

    const { data: message } = await supabase.from('teacher_messages').select('*').eq('id', messageId).single();
    if (!message) return res.status(404).json({ error: 'Message non trouvé' });

    const { data: replies } = await supabase
        .from('teacher_replies')
        .select('*')
        .eq('messageId', messageId)
        .order('created_at', { ascending: true });

    return res.status(200).json({ message, replies: replies || [] });
}

// ============================================================================
// MAIN ROUTER
// ============================================================================
module.exports = async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (!req.query) {
            req.query = Object.fromEntries(url.searchParams.entries());
        }

        if (pathname === '/api/evaluations' || pathname === '/api/evaluations/') {
            await handleEvaluations(req, res);
        } else if (pathname === '/api/weekly-summary' || pathname === '/api/weekly-summary/') {
            await handleWeeklySummary(req, res);
        } else if (pathname === '/api/daily-stars' || pathname === '/api/daily-stars/') {
            await handleDailyStars(req, res);
        } else if (pathname === '/api/photo-of-the-day' || pathname === '/api/photo-of-the-day/') {
            await handlePhotoOfTheDay(req, res);
        } else if (pathname === '/api/photo-2' || pathname === '/api/photo-2/') {
            await handlePhoto2(req, res);
        } else if (pathname === '/api/photo-3' || pathname === '/api/photo-3/') {
            await handlePhoto3(req, res);
        } else if (pathname === '/api/upload-plan' || pathname === '/api/upload-plan/') {
            await handleUploadPlan(req, res);
        } else if (pathname === '/api/initial-data' || pathname === '/api/initial-data/') {
            await handleInitialData(req, res);
        } else if (pathname === '/api/send-message' || pathname === '/api/send-message/') {
            await handleSendMessage(req, res);
        } else if (pathname === '/api/get-messages' || pathname === '/api/get-messages/') {
            await handleGetMessages(req, res);
        } else if (pathname === '/api/mark-messages-read' || pathname === '/api/mark-messages-read/') {
            await handleMarkMessagesRead(req, res);
        } else if (pathname === '/api/unread-count' || pathname === '/api/unread-count/') {
            await handleUnreadCount(req, res);
        } else if (pathname === '/api/general-evaluations' || pathname === '/api/general-evaluations/') {
            await handleGeneralEvaluations(req, res);
        } else if (pathname === '/api/parent-register' || pathname === '/api/parent-register/') {
            await handleParentRegister(req, res);
        } else if (pathname === '/api/parent-login' || pathname === '/api/parent-login/') {
            await handleParentLogin(req, res);
        } else if (pathname === '/api/parent-messages' || pathname === '/api/parent-messages/') {
            await handleParentMessages(req, res);
        } else if (pathname === '/api/parent-unread-replies' || pathname === '/api/parent-unread-replies/') {
            await handleParentUnreadReplies(req, res);
        } else if (pathname === '/api/mark-replies-read' || pathname === '/api/mark-replies-read/') {
            await handleMarkRepliesRead(req, res);
        } else if (pathname === '/api/send-reply' || pathname === '/api/send-reply/') {
            await handleSendReply(req, res);
        } else if (pathname === '/api/get-conversation' || pathname === '/api/get-conversation/') {
            await handleGetConversation(req, res);
        } else if (pathname === '/api/translate-text' || pathname === '/api/translate-text/') {
            await handleTranslateText(req, res);
        } else if (pathname === '/api' || pathname === '/api/') {
            res.status(200).json({
                message: 'API Devoirs2026 - Powered by Supabase',
                version: '3.0.0',
                endpoints: [
                    '/api/evaluations', '/api/weekly-summary', '/api/daily-stars',
                    '/api/photo-of-the-day', '/api/photo-2', '/api/photo-3',
                    '/api/upload-plan', '/api/initial-data', '/api/send-message',
                    '/api/get-messages', '/api/mark-messages-read', '/api/unread-count',
                    '/api/general-evaluations', '/api/parent-register', '/api/parent-login',
                    '/api/parent-messages', '/api/parent-unread-replies', '/api/mark-replies-read',
                    '/api/send-reply', '/api/get-conversation', '/api/translate-text'
                ]
            });
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }

    } catch (error) {
        console.error("[API] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
