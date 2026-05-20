export type Language = 'ru' | 'en' | 'de';

export const translations = {
  ru: {
    // App
    appName: 'TaskMaster',
    appDescription: 'Ваш умный помощник для управления задачами',
    appDescriptionShort: 'Современный менеджер задач с голосовым вводом',
    
    // Auth
    login: 'Вход',
    signup: 'Регистрация',
    logout: 'Выйти',
    loginTitle: 'Войдите или создайте аккаунт для управления задачами',
    email: 'Email',
    password: 'Пароль',
    displayName: 'Имя',
    loginButton: 'Войти',
    signupButton: 'Зарегистрироваться',
    loginLoading: 'Вход...',
    signupLoading: 'Регистрация...',
    loginSuccess: 'Успешный вход!',
    loginSuccessDesc: 'Добро пожаловать обратно',
    signupSuccess: 'Регистрация успешна!',
    signupSuccessDesc: 'Добро пожаловать в TaskMaster',
    loginError: 'Ошибка входа',
    signupError: 'Ошибка регистрации',
    logoutSuccess: 'Вы вышли из аккаунта',
    
    // Navigation
    tasks: 'Задачи',
    calendar: 'Календарь',
    settings: 'Настройки',
    
    // Tasks
    addTask: 'Добавить задачу',
    newTask: 'Новая задача',
    editTask: 'Редактировать задачу',
    taskTitle: 'Название задачи',
    taskDescription: 'Описание',
    taskDescriptionPlaceholder: 'Дополнительные детали (опционально)',
    taskTitlePlaceholder: 'Что нужно сделать?',
    dueDate: 'Дата выполнения',
    reminderTime: 'Время напоминания',
    selectDate: 'Выберите дату',
    createTask: 'Создать задачу',
    updateTask: 'Обновить задачу',
    saving: 'Сохранение...',
    taskCreated: 'Задача создана',
    taskUpdated: 'Задача обновлена',
    taskDeleted: 'Задача удалена',
    voiceInput: 'Голосовой ввод',
    searchTasks: 'Поиск задач...',
    noTasksForDate: 'Нет задач на эту дату',
    
    // Task List
    active: 'Активные',
    completed: 'Выполненные',
    noActiveTasks: 'Нет активных задач',
    noCompletedTasks: 'Нет выполненных задач',
    loading: 'Загрузка...',
    
    // Settings
    notifications: 'Уведомления',
    notificationsDesc: 'Настройте напоминания о задачах',
    pushNotifications: 'Push-уведомления',
    pushNotificationsDesc: 'Получайте уведомления даже когда приложение закрыто',
    notificationsEnabled: 'Уведомления включены',
    notificationsEnabledDesc: 'Теперь вы будете получать напоминания о задачах',
    notificationsDenied: 'Уведомления заблокированы',
    notificationsDeniedDesc: 'Разрешите уведомления в настройках браузера',
    notificationsNotSupported: 'Уведомления не поддерживаются',
    testNotification: 'Уведомления работают!',
    blocked: 'Заблокировано',
    enabled: 'Включено',
    enable: 'Включить',
    
    // PWA
    installApp: 'Установить приложение',
    installAppDesc: 'Установите TaskMaster на ваше устройство для быстрого доступа',
    installPWA: 'Установка приложения',
    installPWAInstructions: 'Нажмите "Добавить на главный экран" в меню браузера',
    appInstalled: 'Приложение установлено',
    appInstalledDesc: 'TaskMaster добавлен на главный экран',
    installOnDevice: 'Установить на устройство',
    
    // Google Calendar
    googleCalendar: 'Google Календарь',
    googleCalendarDesc: 'Синхронизируйте задачи с Google Календарём',
    connectGoogleCalendar: 'Подключить Google Календарь',
    comingSoon: 'Скоро',
    googleCalendarComingSoon: 'Интеграция с Google Календарём скоро будет доступна',
    
    // Errors
    error: 'Ошибка',
    errorLoadTasks: 'Не удалось загрузить задачи',
    errorUpdateTask: 'Не удалось обновить задачу',
    errorDeleteTask: 'Не удалось удалить задачу',
    errorCreateTask: 'Не удалось создать задачу',
    errorVoiceNotSupported: 'Ваш браузер не поддерживает голосовой ввод',
    errorVoiceRecognition: 'Не удалось распознать речь',
    voiceNotSupported: 'Не поддерживается',
    reminderTitle: 'Напоминание о задаче',
    
    // Tooltips
    changeLanguage: 'Сменить язык',
    collapseWidget: 'Свернуть',
    expandWidget: 'Развернуть',
    logoutTooltip: 'Выйти',
  },
  en: {
    // App
    appName: 'TaskMaster',
    appDescription: 'Your smart task management assistant',
    appDescriptionShort: 'Modern task manager with voice input',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    loginTitle: 'Login or create an account to manage tasks',
    email: 'Email',
    password: 'Password',
    displayName: 'Name',
    loginButton: 'Login',
    signupButton: 'Sign Up',
    loginLoading: 'Logging in...',
    signupLoading: 'Signing up...',
    loginSuccess: 'Login successful!',
    loginSuccessDesc: 'Welcome back',
    signupSuccess: 'Registration successful!',
    signupSuccessDesc: 'Welcome to TaskMaster',
    loginError: 'Login error',
    signupError: 'Registration error',
    logoutSuccess: 'You have been logged out',
    
    // Navigation
    tasks: 'Tasks',
    calendar: 'Calendar',
    settings: 'Settings',
    
    // Tasks
    addTask: 'Add Task',
    newTask: 'New Task',
    editTask: 'Edit Task',
    taskTitle: 'Task Title',
    taskDescription: 'Description',
    taskDescriptionPlaceholder: 'Additional details (optional)',
    taskTitlePlaceholder: 'What needs to be done?',
    dueDate: 'Due Date',
    reminderTime: 'Reminder Time',
    selectDate: 'Select date',
    createTask: 'Create Task',
    updateTask: 'Update Task',
    saving: 'Saving...',
    taskCreated: 'Task created',
    taskUpdated: 'Task updated',
    taskDeleted: 'Task deleted',
    voiceInput: 'Voice Input',
    searchTasks: 'Search tasks...',
    noTasksForDate: 'No tasks for this date',
    
    // Task List
    active: 'Active',
    completed: 'Completed',
    noActiveTasks: 'No active tasks',
    noCompletedTasks: 'No completed tasks',
    loading: 'Loading...',
    
    // Settings
    notifications: 'Notifications',
    notificationsDesc: 'Configure task reminders',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Receive notifications even when the app is closed',
    notificationsEnabled: 'Notifications enabled',
    notificationsEnabledDesc: 'You will now receive task reminders',
    notificationsDenied: 'Notifications blocked',
    notificationsDeniedDesc: 'Allow notifications in browser settings',
    notificationsNotSupported: 'Notifications not supported',
    testNotification: 'Notifications are working!',
    blocked: 'Blocked',
    enabled: 'Enabled',
    enable: 'Enable',
    
    // PWA
    installApp: 'Install App',
    installAppDesc: 'Install TaskMaster on your device for quick access',
    installPWA: 'Install App',
    installPWAInstructions: 'Tap "Add to Home Screen" in your browser menu',
    appInstalled: 'App Installed',
    appInstalledDesc: 'TaskMaster has been added to your home screen',
    installOnDevice: 'Install on Device',
    
    // Google Calendar
    googleCalendar: 'Google Calendar',
    googleCalendarDesc: 'Sync your tasks with Google Calendar',
    connectGoogleCalendar: 'Connect Google Calendar',
    comingSoon: 'Coming Soon',
    googleCalendarComingSoon: 'Google Calendar integration coming soon',
    
    // Errors
    error: 'Error',
    errorLoadTasks: 'Failed to load tasks',
    errorUpdateTask: 'Failed to update task',
    errorDeleteTask: 'Failed to delete task',
    errorCreateTask: 'Failed to create task',
    errorVoiceNotSupported: 'Your browser does not support voice input',
    errorVoiceRecognition: 'Failed to recognize speech',
    voiceNotSupported: 'Not supported',
    reminderTitle: 'Task Reminder',
    
    // Tooltips
    changeLanguage: 'Change language',
    collapseWidget: 'Collapse',
    expandWidget: 'Expand',
    logoutTooltip: 'Logout',
  },
  de: {
    // App
    appName: 'TaskMaster',
    appDescription: 'Ihr intelligenter Aufgabenverwaltungsassistent',
    appDescriptionShort: 'Moderner Aufgabenmanager mit Spracheingabe',
    
    // Auth
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    loginTitle: 'Melden Sie sich an oder erstellen Sie ein Konto, um Aufgaben zu verwalten',
    email: 'E-Mail',
    password: 'Passwort',
    displayName: 'Name',
    loginButton: 'Anmelden',
    signupButton: 'Registrieren',
    loginLoading: 'Anmeldung läuft...',
    signupLoading: 'Registrierung läuft...',
    loginSuccess: 'Anmeldung erfolgreich!',
    loginSuccessDesc: 'Willkommen zurück',
    signupSuccess: 'Registrierung erfolgreich!',
    signupSuccessDesc: 'Willkommen bei TaskMaster',
    loginError: 'Anmeldefehler',
    signupError: 'Registrierungsfehler',
    logoutSuccess: 'Sie wurden abgemeldet',
    
    // Navigation
    tasks: 'Aufgaben',
    calendar: 'Kalender',
    settings: 'Einstellungen',
    
    // Tasks
    addTask: 'Aufgabe hinzufügen',
    newTask: 'Neue Aufgabe',
    editTask: 'Aufgabe bearbeiten',
    taskTitle: 'Aufgabentitel',
    taskDescription: 'Beschreibung',
    taskDescriptionPlaceholder: 'Zusätzliche Details (optional)',
    taskTitlePlaceholder: 'Was muss getan werden?',
    dueDate: 'Fälligkeitsdatum',
    reminderTime: 'Erinnerungszeit',
    selectDate: 'Datum auswählen',
    createTask: 'Aufgabe erstellen',
    updateTask: 'Aufgabe aktualisieren',
    saving: 'Speichern...',
    taskCreated: 'Aufgabe erstellt',
    taskUpdated: 'Aufgabe aktualisiert',
    taskDeleted: 'Aufgabe gelöscht',
    voiceInput: 'Spracheingabe',
    searchTasks: 'Aufgaben suchen...',
    noTasksForDate: 'Keine Aufgaben für dieses Datum',
    
    // Task List
    active: 'Aktiv',
    completed: 'Abgeschlossen',
    noActiveTasks: 'Keine aktiven Aufgaben',
    noCompletedTasks: 'Keine abgeschlossenen Aufgaben',
    loading: 'Laden...',
    
    // Settings
    notifications: 'Benachrichtigungen',
    notificationsDesc: 'Konfigurieren Sie Aufgabenerinnerungen',
    pushNotifications: 'Push-Benachrichtigungen',
    pushNotificationsDesc: 'Erhalten Sie Benachrichtigungen auch bei geschlossener App',
    notificationsEnabled: 'Benachrichtigungen aktiviert',
    notificationsEnabledDesc: 'Sie erhalten nun Aufgabenerinnerungen',
    notificationsDenied: 'Benachrichtigungen blockiert',
    notificationsDeniedDesc: 'Erlauben Sie Benachrichtigungen in den Browsereinstellungen',
    notificationsNotSupported: 'Benachrichtigungen nicht unterstützt',
    testNotification: 'Benachrichtigungen funktionieren!',
    blocked: 'Blockiert',
    enabled: 'Aktiviert',
    enable: 'Aktivieren',
    
    // PWA
    installApp: 'App installieren',
    installAppDesc: 'Installieren Sie TaskMaster auf Ihrem Gerät für schnellen Zugriff',
    installPWA: 'App installieren',
    installPWAInstructions: 'Tippen Sie auf "Zum Startbildschirm hinzufügen" im Browsermenü',
    appInstalled: 'App installiert',
    appInstalledDesc: 'TaskMaster wurde zum Startbildschirm hinzugefügt',
    installOnDevice: 'Auf Gerät installieren',
    
    // Google Calendar
    googleCalendar: 'Google Kalender',
    googleCalendarDesc: 'Synchronisieren Sie Ihre Aufgaben mit Google Kalender',
    connectGoogleCalendar: 'Google Kalender verbinden',
    comingSoon: 'Demnächst',
    googleCalendarComingSoon: 'Google Kalender-Integration kommt bald',
    
    // Errors
    error: 'Fehler',
    errorLoadTasks: 'Aufgaben konnten nicht geladen werden',
    errorUpdateTask: 'Aufgabe konnte nicht aktualisiert werden',
    errorDeleteTask: 'Aufgabe konnte nicht gelöscht werden',
    errorCreateTask: 'Aufgabe konnte nicht erstellt werden',
    errorVoiceNotSupported: 'Ihr Browser unterstützt keine Spracheingabe',
    errorVoiceRecognition: 'Sprache konnte nicht erkannt werden',
    voiceNotSupported: 'Nicht unterstützt',
    reminderTitle: 'Aufgabenerinnerung',
    
    // Tooltips
    changeLanguage: 'Sprache wechseln',
    collapseWidget: 'Einklappen',
    expandWidget: 'Ausklappen',
    logoutTooltip: 'Abmelden',
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations.ru): string => {
  return translations[lang][key] || translations.ru[key];
};
