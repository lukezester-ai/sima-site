/**
 * SIMA site UI languages: Bulgarian (default) + English.
 * Preference: localStorage "sima-lang" = "bg" | "en"
 */
(function () {
  const STORAGE_KEY = "sima-lang";

  const STRINGS = {
    bg: {
      meta_title: "SIMA | AI решения за модерно земеделие",
      meta_description:
        "SIMA внедрява AI технологии в земеделието: наблюдение на полета, анализи, автоматизация и управление на стопанства.",
      nav_aria: "Основна навигация",
      nav_solutions: "Решения",
      nav_modules: "Модули",
      nav_fw: "Field Watch",
      nav_portal: "Портал",
      nav_more: "Още",
      nav_contact: "Контакт",
      nav_advisor: "AI въпросник",
      nav_process: "Подход",
      nav_scale: "За кого",
      nav_privacy: "Поверителност",
      nav_terms: "Условия",
      brand_aria: "SIMA начало",
      social_aria: "Отваря профила на SIMA в LinkedIn",
      nav_cta: "Консултация",
      lang_aria: "Език на сайта",
      lang_bg: "БГ",
      lang_en: "EN",
      hero_eyebrow: "AI технологии за земеделие с ясен резултат",
      hero_h1: "Свобода, спокойствие и сигурност за всяко стопанство.",
      hero_copy:
        "SIMA помага на фермери и агрокомпании да разбират по-добре полетата, ресурсите и риска. От наблюдение на посевите до пълно управление на стопанството, изграждаме решения около реалния проблем, а не около готов шаблон.",
      hero_credit_html:
        '<strong>SIMA</strong> е марка и технологична линия на <strong>AgriNexus</strong> — студиото, което съчетава аграрен контекст, данни и изкуствен интелект в продукти, които носят яснота на терена и спокойствие в управлението.',
      hero_btn1: "Започнете разговор",
      hero_btn2: "Вижте възможностите",
      hero_visual_aria: "AI контролен панел за земеделие",
      insight_growth: "Индекс на растеж",
      insight_stress: "Риск от стрес",
      insight_rec: "Препоръка",
      insight_low: "нисък",
      insight_water: "поливане след 18:00",
      logo_strip_aria: "Фирмена идентичност",
      sol_eyebrow: "От наблюдение до управление",
      sol_h2: "AI там, където стопанството губи време, ресурс или сигурност.",
      sol1_h: "Наблюдение на полетата",
      sol1_p:
        "Сателитни данни, дронове и сензори превръщат полето в жива карта: растеж, влага, болести, вредители и зони с риск.",
      sol2_h: "Прогнози и ранни сигнали",
      sol2_p:
        "AI открива модели преди проблемът да стане скъп: засушаване, хранителен дефицит, болести, закъснение в операции или загуби.",
      sol3_h: "Оптимизация на ресурсите",
      sol3_p:
        "Поливане, торене, препарати, гориво и работно време се планират по-точно, с по-малко излишни разходи и по-добър контрол.",
      sol4_h: "Управление на стопанство",
      sol4_p:
        "Единна система за задачи, техника, хора, склад, разходи и отчети, която дава спокойна картина на ежедневието и сезона.",
      mod_eyebrow: "AI модулите на SIMA",
      mod_h2: "Започвате с един ясен проблем и надграждате до цялостна система.",
      mod1_h: "Наблюдение на полета",
      mod1_p: "Карта на посевите, сателитни индекси, зони с риск и ранни сигнали за промяна.",
      mod2_h: "Болести, климат и стрес",
      mod2_p: "Оценка на риск според време, почва, култура и история на полето.",
      mod3_h: "Вода, почва и торене",
      mod3_p: "Препоръки за поливане, хранене и ресурс там, където ефектът е най-голям.",
      mod4_h: "Прогноза за добив",
      mod4_p: "По-ясна картина за очакван резултат, отклонения и решения преди края на сезона.",
      mod5_h: "Операции и техника",
      mod5_p: "Задачи, хора, машини, склад и разходи в една управленска картина.",
      mod6_h: "AI асистент за решения",
      mod6_p: "Интелигентен помощник, който обяснява данните и предлага следваща практична стъпка.",
      fw_eyebrow: "Field Watch прототип",
      fw_h2: "От данни за полето до първа стратегия за действие.",
      fw_intro:
        "Тази демо версия показва как ще работи модулът: фермерът описва полето, добавя наличните данни и получава структурирана първа стратегия. В реална система анализът ще се свърже с избран LLM модел, сателитни индекси и проверка от екипа на SIMA.",
      fw_field: "Име на поле / парцел",
      fw_field_ph: "Например: Блок 12 - Север",
      fw_area: "Площ",
      fw_area_ph: "Например: 84 дка",
      fw_crop: "Култура",
      fw_concern: "Основно притеснение",
      fw_stage: "Етап на сезона",
      fw_files: "Налични данни",
      fw_files_hint: "Снимки, дрон кадри, граници на парцели, таблици или бележки.",
      fw_notes: "Кратко описание от фермера",
      fw_notes_ph:
        "Например: в северната част има пожълтяване, растежът изостава, последното поливане беше преди 8 дни...",
      fw_submit: "Изготви примерна стратегия",
      fw_card_tag: "SIMA Field Watch",
      fw_strategy_title: "Първа полева диагностика",
      fw_strategy_placeholder:
        "Попълнете данните вляво и модулът ще покаже примерна стратегия: какво да се провери, кои действия са приоритетни и какво да се наблюдава през следващите дни.",
      fw_hist_eyebrow: "История на полетата",
      fw_hist_h: "Последни доклади",
      fw_clear: "Изчисти",
      fw_empty_hist: "Все още няма запазени доклади. Създайте първи Field Watch анализ.",
      fw_rep_eyebrow: "Field Watch доклад",
      fw_rep_h: "Доклад за поле",
      fw_copy: "Копирай доклада",
      fw_print: "PDF / Печат",
      fw_art_state: "Състояние",
      fw_art_priority: "Приоритет",
      fw_art_actions: "Следващи действия",
      fw_art_monitor: "Наблюдение",
      fw_fb_eyebrow: "Обратна връзка",
      fw_fb_h: "Помогна ли тази препоръка?",
      fw_fb_rating: "Оценка",
      fw_fb_helped: "Препоръката помогна на терен",
      fw_fb_outcome: "Какво се случи реално?",
      fw_fb_outcome_ph:
        "Например: след проверка се установи уплътняване и проблемът беше само в северната зона...",
      fw_fb_corr: "Какво да запомни системата за следващ път?",
      fw_fb_corr_ph: "Например: при подобен симптом първо да се пита за последна обработка и валеж...",
      fw_fb_submit: "Запази обратна връзка",
      portal_eyebrow: "Моето стопанство",
      portal_h2: "Практичен портал за много фермери, полета и доклади.",
      portal_intro:
        "Това е първа версия на работното пространство след вход. Всеки фермер ще има собствено стопанство, списък с полета, история на Field Watch анализите и ясна връзка с екипа на SIMA.",
      auth_local: "Локален режим",
      auth_helper: "Влезте, за да пазите данните в backend.",
      auth_logged_helper: "Данните се пазят в backend база.",
      auth_invalid_email: "Въведете валиден имейл.",
      auth_password_short: "Паролата трябва да е поне 8 знака.",
      auth_register_ok: "Регистрацията успя. Влезли сте в портала.",
      auth_login_ok: "Успешен вход.",
      ph_name: "Име",
      ph_email: "Имейл",
      ph_pass: "Парола",
      btn_login: "Вход",
      btn_register: "Регистрация",
      btn_logout: "Изход",
      tab_dash: "Dashboard",
      tab_fields: "Полета",
      tab_reports: "Доклади",
      tab_tasks: "Задачи",
      tab_weather: "Метео",
      tab_knowledge: "Знания",
      tab_chat: "AI чат",
      tab_team: "SIMA екип",
      chat_eyebrow: "AI асистент",
      chat_h: "Чат за агро въпроси",
      chat_intro:
        "Задайте въпрос за поле, култура, риск или задача. Отговорите ползват вашите полета и базата знания.",
      chat_ph: "Например: Какво да проверя при пожълтяване на пшеница след валеж?",
      chat_send: "Изпрати",
      dash_eyebrow: "Общ преглед",
      dash_h: "Работно табло",
      metric_fields_lbl: "активни полета",
      metric_reports_lbl: "Field Watch доклади",
      metric_risks_lbl: "активни риска",
      brief_ai_h: "AI кратък преглед",
      fields_eyebrow: "Полета",
      fields_h: "Профили на парцели",
      ph_field_name: "Име на поле",
      ph_field_area: "Площ, напр. 84 дка",
      btn_add_field: "Добави поле",
      map_eyebrow: "Карта на полето",
      map_h: "Очертаване на граница",
      map_undo: "Назад",
      map_clear: "Изчисти",
      map_geojson: "GeoJSON",
      map_aria: "Интерактивна карта за очертаване на поле",
      map_helper:
        "Картата показва реална география (OpenStreetMap). Кликайте по полето, за да добавите върхове на границата — нужни са поне три. Приближаване и местене: контролите вдясно.",
      fp_eyebrow: "Профил на поле",
      fp_crop: "Култура",
      fp_area: "Площ",
      fp_reports: "Доклади",
      fp_tasks: "Отворени задачи",
      rep_eyebrow: "Доклади",
      rep_h: "История по стопанство",
      tasks_eyebrow: "Задачи",
      tasks_h: "Действия от докладите",
      wx_eyebrow: "Метео модул",
      wx_h: "Прогноза и работни прозорци",
      wx_ph: "Населено място, напр. Пловдив",
      wx_submit: "Провери времето",
      wx_empty: "Въведете място, за да видите прогноза, риск и препоръчани действия.",
      kn_eyebrow: "База знания",
      kn_h: "Източници за самообучение",
      kn_ph_title: "Заглавие",
      kn_ph_url: "URL за изтегляне, по желание",
      kn_ph_text: "Или поставете ръчно текст, агрономична бележка, наблюдение, правило...",
      kn_rag: "Индексирай за RAG (откъси в семантичното търсене за Field Watch)",
      kn_add: "Добави знание",
      team_eyebrow: "SIMA екип",
      team_h: "Опашка за преглед",
      promise_eyebrow: "Нашата роля",
      promise_h2: "Разплитаме възела заедно с вас.",
      promise_p:
        "Всеки фермер има различен проблем: липса на време, несигурни решения, разпилени данни, трудна координация или натиск върху разходите. Нашият екип влиза спокойно, слуша внимателно и изгражда практично AI решение, което работи с реалността на стопанството.",
      adv_eyebrow: "Къде да започнете",
      adv_h2: "Отговорете на 3 въпроса и вижте най-подходящия първи AI модул.",
      adv_fs1: "Какъв е мащабът на стопанството?",
      adv_fs2: "Къде усещате най-голямо напрежение?",
      adv_fs3: "Какъв резултат искате първо?",
      adv_sc_small: "Малко стопанство",
      adv_sc_med: "Средна ферма",
      adv_sc_large: "Голяма компания",
      adv_pn_fields: "Неясно състояние на полетата",
      adv_pn_res: "Разходи за вода, торене и препарати",
      adv_pn_ops: "Организация на хора, техника и задачи",
      adv_pn_risk: "Болести, климатичен риск и закъснели реакции",
      adv_gl_clarity: "Повече яснота и спокойствие",
      adv_gl_save: "По-малко излишни разходи",
      adv_gl_ctrl: "По-добър управленски контрол",
      adv_btn: "Искам такъв план",
      proc_eyebrow: "Как работим",
      proc_h2: "От първи разговор до внедрена система.",
      proc1_h: "Диагностика",
      proc1_p: "Изясняваме проблема, процесите, наличните данни и целите за сезона.",
      proc2_h: "AI план",
      proc2_p: "Избираме правилната комбинация от наблюдение, анализ, автоматизация и обучение.",
      proc3_h: "Внедряване",
      proc3_p: "Свързваме данни, техника и екип в работеща система с ясни сигнали и отчети.",
      proc4_h: "Подобряване",
      proc4_p:
        "Следим резултата, настройваме моделите и развиваме решението с растежа на стопанството.",
      scale_eyebrow: "За малки и големи",
      scale_h2: "Решение може да се намери за всеки мащаб.",
      scale_p:
        "Малкият фермер има нужда от яснота и спестено време. Голямата компания има нужда от контрол, интеграции и управленска картина. SIMA изгражда мост между земята, данните и решенията.",
      scale_s1_t: "Малки стопанства",
      scale_s1_d: "лесен старт, конкретен проблем, бърз ефект",
      scale_s2_t: "Средни ферми",
      scale_s2_d: "по-добро планиране, екипна координация, прогнозиране",
      scale_s3_t: "Големи компании",
      scale_s3_d: "интеграции, автоматизирани отчети, управление по данни",
      legal_eyebrow: "Правна информация",
      privacy_h2: "Политика за поверителност",
      privacy_p1_html:
        "<strong>Кой обработва данните.</strong> SIMA. <a href=\"mailto:info@agrinexus.eu\">info@agrinexus.eu</a>",
      privacy_p2_html:
        "<strong>Какви данни обработваме.</strong> При контактна форма: име, имейл и текст на съобщението. При регистрация и вход в портала: данни за акаунта, технически журнали и идентификатори за сесия, както и информация, която изрично въвеждате или качвате в профила си.",
      privacy_p3_html:
        "<strong>Защо ги използваме.</strong> За да отговорим на запитвания, да предоставим и подобрим услугите, да осигурим сигурност и законосъобразност на платформата. Маркетингови бисквитки не използваме по подразбиране; локалното съхранение в браузъра служи за работа на интерфейса (напр. запазени настройки при демо режим).",
      privacy_p4_html:
        "<strong>Срок и споделяне.</strong> Контактните съобщения съхраняваме само колкото е нужно за кореспонденцията. Не продаваме лични данни. Доставчици на хостинг или ИТ услуги могат да обработват данни от наше име при спазване на договор и закон.",
      privacy_p5_html:
        "<strong>Вашите права.</strong> Може да поискате достъп, корекция, изтриване, ограничаване или преносимост според приложимото право, както и да възразите срещу обработка при законово основание. Жалба можете да подадете и пред надзорен орган.",
      terms_h2: "Общи условия за ползване на сайта",
      terms_p1_html:
        "<strong>Предмет.</strong> Условията уреждат ползването на публичната част на сайта и наличните демонстрационни или клиентски функции на SIMA. С достъп или регистрация приемате тези правила.",
      terms_p2_html:
        "<strong>Съдържание и AI.</strong> Текстове, примери и препоръки от автоматизирани функции са с ориентационен характер. Решения за производство, препарати, техника и правни изисквания взимате вие заедно с вашите експерти; SIMA не носи отговорност за действия, базирани само на демо или генериран изход без професионална проверка.",
      terms_p3_html:
        "<strong>Достъп и промени.</strong> Функции, лимити и наличност могат да се променят без предизвестие. Запазваме си правото да ограничим или прекратим акаунти при злоупотреба, опити за неоторизиран достъп или натоварване, което застрашава стабилността на услугата.",
      terms_p4_html:
        "<strong>Запитвания и договори.</strong> Изпращането на контактна форма е покана за диалог, не поражда задължение за поръчка. Договорни отношения възникват само при отделно писмено или електронно споразумение между страните.",
      terms_p5_html:
        "<strong>Ограничение на отговорност.</strong> В максималната степен, позволена от закона, SIMA не отговаря за никакви косвени или последващи загуби, произтичащи от ползването или невъзможността за ползване на сайта.",
      contact_h2: "Нека започнем с проблема, който ви тежи най-много.",
      contact_p:
        "Опишете стопанството, процеса или решението, което търсите. Ще върнем ясен първи план: какво може да се измери, какво може да се автоматизира и откъде има смисъл да започнем.",
      lbl_contact_name: "Име",
      lbl_contact_email: "Имейл",
      lbl_contact_msg: "Какъв проблем искате да решим?",
      ph_contact_name: "Вашето име",
      ph_contact_email: "вашият@имейл.eu",
      ph_contact_msg: "Например: наблюдение на посеви, поливане, отчети, техника...",
      contact_submit: "Изпрати запитване",
      footer_nav_aria: "Връзки в долната част на страницата",
      footer_credit_html:
        '<strong>SIMA</strong> е бранд и разработка на <strong>AgriNexus</strong> — партньор по иновации в агросектора: от стратегия и архитектура на данни до изпълними AI модули, изградени около реалните сезони, екипи и рискове на стопанството.',
      cookie_aria: "Известие за бисквитки",
      cookie_text_html:
        'Ползваме само технически необходими механизми за сайта и при нужда локално съхранение в браузъра за демо и портала. С „Разбирам“ потвърждавате запознаването си с <a href="#privacy">политиката за поверителност</a>.',
      cookie_ok: "Разбирам",
      crop_wheat: "Пшеница",
      crop_corn: "Царевица",
      crop_sun: "Слънчоглед",
      crop_orchard: "Овощна градина",
      crop_veg: "Зеленчуци",
      concern_wg: "Слаб или неравномерен растеж",
      concern_ws: "Съмнение за воден стрес",
      concern_dis: "Съмнение за болест или вредители",
      concern_nut: "Съмнение за хранителен дефицит",
      concern_unk: "Не знам откъде идва проблемът",
      stage_early: "Начален растеж",
      stage_active: "Активна вегетация",
      stage_flow: "Цъфтеж / критичен период",
      stage_late: "Късен сезон",
      rating_5: "5 - много полезно",
      rating_4: "4 - полезно",
      rating_3: "3 - частично",
      rating_2: "2 - слабо",
      rating_1: "1 - не помогна",
      portal_crop_wheat: "Пшеница",
      portal_crop_corn: "Царевица",
      portal_crop_sun: "Слънчоглед",
      portal_crop_orchard: "Овощна градина",
      portal_crop_veg: "Зеленчуци",
    },
    en: {
      meta_title: "SIMA | AI solutions for modern agriculture",
      meta_description:
        "SIMA brings AI to farming: field monitoring, analytics, automation and farm operations.",
      nav_aria: "Main navigation",
      nav_solutions: "Solutions",
      nav_modules: "Modules",
      nav_fw: "Field Watch",
      nav_portal: "Portal",
      nav_more: "More",
      nav_contact: "Contact",
      nav_advisor: "AI advisor",
      nav_process: "Approach",
      nav_scale: "Who it's for",
      nav_privacy: "Privacy",
      nav_terms: "Terms",
      brand_aria: "SIMA home",
      social_aria: "Open SIMA on LinkedIn",
      nav_cta: "Talk to us",
      lang_aria: "Site language",
      lang_bg: "BG",
      lang_en: "EN",
      hero_eyebrow: "AI for agriculture with clear outcomes",
      hero_h1: "Freedom, calm and confidence for every farm.",
      hero_copy:
        "SIMA helps farmers and agribusinesses understand fields, resources and risk better—from crop monitoring to full farm operations—built around your real problem, not a fixed template.",
      hero_credit_html:
        '<strong>SIMA</strong> is a brand and product line engineered by <strong>AgriNexus</strong> — where agronomic context meets rigorous data design and AI, shipped as tools teams can trust when margins, weather and timing all speak at once.',
      hero_btn1: "Start a conversation",
      hero_btn2: "Explore capabilities",
      hero_visual_aria: "AI farm control preview",
      insight_growth: "Growth index",
      insight_stress: "Stress risk",
      insight_rec: "Recommendation",
      insight_low: "low",
      insight_water: "irrigate after 18:00",
      logo_strip_aria: "Brand identity",
      sol_eyebrow: "From monitoring to management",
      sol_h2: "AI where farms lose time, resources or confidence.",
      sol1_h: "Field monitoring",
      sol1_p:
        "Satellites, drones and sensors turn the field into a live map: growth, moisture, diseases, pests and risk zones.",
      sol2_h: "Forecasts and early signals",
      sol2_p:
        "AI spots patterns before problems get expensive: drought, nutrient gaps, diseases, delayed operations or losses.",
      sol3_h: "Resource optimisation",
      sol3_p:
        "Irrigation, fertiliser, crop protection, fuel and labour are planned more accurately with less waste.",
      sol4_h: "Farm management",
      sol4_p:
        "One system for tasks, machinery, people, inventory, costs and reporting—with a calmer daily picture.",
      mod_eyebrow: "SIMA AI modules",
      mod_h2: "Start from one clear problem and grow into a full system.",
      mod1_h: "Field monitoring",
      mod1_p: "Crop maps, satellite indices, risk zones and early change signals.",
      mod2_h: "Disease, climate and stress",
      mod2_p: "Risk scoring from weather, soil, crop and field history.",
      mod3_h: "Water, soil and nutrition",
      mod3_p: "Recommendations focused where impact is highest.",
      mod4_h: "Yield outlook",
      mod4_p: "Clearer expected outcome, deviations and decisions before season end.",
      mod5_h: "Operations and machinery",
      mod5_p: "Tasks, crews, machines, stock and costs in one operational view.",
      mod6_h: "Decision copilot",
      mod6_p: "An assistant that explains data and suggests the next practical step.",
      fw_eyebrow: "Field Watch prototype",
      fw_h2: "From field data to a first action strategy.",
      fw_intro:
        "This demo shows the module flow: describe the field, add available data and receive a structured first strategy. In production, analysis connects to your chosen LLM, satellite indices and SIMA team review.",
      fw_field: "Field / parcel name",
      fw_field_ph: "e.g. Block 12 — North",
      fw_area: "Area",
      fw_area_ph: "e.g. 84 ha or local units",
      fw_crop: "Crop",
      fw_concern: "Main concern",
      fw_stage: "Season stage",
      fw_files: "Available data",
      fw_files_hint: "Photos, drone frames, parcel boundaries, spreadsheets or notes.",
      fw_notes: "Short farmer notes",
      fw_notes_ph:
        "e.g. yellowing in the north, growth lagging, last irrigation 8 days ago...",
      fw_submit: "Generate sample strategy",
      fw_card_tag: "SIMA Field Watch",
      fw_strategy_title: "First field diagnosis",
      fw_strategy_placeholder:
        "Fill in the form on the left to see a sample strategy: what to verify, priority actions and what to watch over the next days.",
      fw_hist_eyebrow: "Field history",
      fw_hist_h: "Latest reports",
      fw_clear: "Clear",
      fw_empty_hist: "No saved reports yet. Create your first Field Watch analysis.",
      fw_rep_eyebrow: "Field Watch report",
      fw_rep_h: "Field report",
      fw_copy: "Copy report",
      fw_print: "PDF / Print",
      fw_art_state: "Condition",
      fw_art_priority: "Priority",
      fw_art_actions: "Next actions",
      fw_art_monitor: "Monitoring",
      fw_fb_eyebrow: "Feedback",
      fw_fb_h: "Was this recommendation helpful?",
      fw_fb_rating: "Rating",
      fw_fb_helped: "Helpful on the ground",
      fw_fb_outcome: "What happened in practice?",
      fw_fb_outcome_ph:
        "e.g. compaction found; issue only in the northern zone...",
      fw_fb_corr: "What should the system remember next time?",
      fw_fb_corr_ph:
        "e.g. for similar symptoms ask about last treatment and rainfall first...",
      fw_fb_submit: "Save feedback",
      portal_eyebrow: "My farm",
      portal_h2: "A practical portal for farmers, fields and reports.",
      portal_intro:
        "First version of the signed-in workspace: each farmer gets a farm profile, field list, Field Watch history and a clear line to the SIMA team.",
      auth_local: "Local mode",
      auth_helper: "Sign in to persist data on the backend.",
      auth_logged_helper: "Data is stored in the backend database.",
      auth_invalid_email: "Enter a valid email address.",
      auth_password_short: "Password must be at least 8 characters.",
      auth_register_ok: "Registration successful. You are signed in.",
      auth_login_ok: "Signed in successfully.",
      ph_name: "Name",
      ph_email: "Email",
      ph_pass: "Password",
      btn_login: "Sign in",
      btn_register: "Register",
      btn_logout: "Sign out",
      tab_dash: "Dashboard",
      tab_fields: "Fields",
      tab_reports: "Reports",
      tab_tasks: "Tasks",
      tab_weather: "Weather",
      tab_knowledge: "Knowledge",
      tab_chat: "AI chat",
      tab_team: "SIMA team",
      chat_eyebrow: "AI assistant",
      chat_h: "Agro Q&A chat",
      chat_intro:
        "Ask about a field, crop, risk, or task. Answers use your fields and knowledge base.",
      chat_ph: "e.g. What should I check if wheat turns yellow after rain?",
      chat_send: "Send",
      dash_eyebrow: "Overview",
      dash_h: "Dashboard",
      metric_fields_lbl: "active fields",
      metric_reports_lbl: "Field Watch reports",
      metric_risks_lbl: "active risks",
      brief_ai_h: "AI snapshot",
      fields_eyebrow: "Fields",
      fields_h: "Parcel profiles",
      ph_field_name: "Field name",
      ph_field_area: "Area, e.g. 84 ha",
      btn_add_field: "Add field",
      map_eyebrow: "Field map",
      map_h: "Draw boundary",
      map_undo: "Undo",
      map_clear: "Clear",
      map_geojson: "GeoJSON",
      map_aria: "Interactive map for field boundary",
      map_helper: "Click the map to place points. At least 3 points define a boundary.",
      fp_eyebrow: "Field profile",
      fp_crop: "Crop",
      fp_area: "Area",
      fp_reports: "Reports",
      fp_tasks: "Open tasks",
      rep_eyebrow: "Reports",
      rep_h: "Farm history",
      tasks_eyebrow: "Tasks",
      tasks_h: "Actions from reports",
      wx_eyebrow: "Weather",
      wx_h: "Forecast and work windows",
      wx_ph: "Location, e.g. Plovdiv",
      wx_submit: "Check weather",
      wx_empty: "Enter a location to see forecast, risk and suggested actions.",
      kn_eyebrow: "Knowledge base",
      kn_h: "Sources for learning",
      kn_ph_title: "Title",
      kn_ph_url: "Optional URL to fetch",
      kn_ph_text: "Or paste text: agronomy notes, observations, rules...",
      kn_rag: "Index for RAG (chunks for Field Watch semantic search)",
      kn_add: "Add knowledge",
      team_eyebrow: "SIMA team",
      team_h: "Review queue",
      promise_eyebrow: "Our role",
      promise_h2: "We untangle it with you.",
      promise_p:
        "Every farm is different—time pressure, uncertain calls, scattered data, coordination friction or cost pressure. We listen calmly and ship practical AI that fits real operations.",
      adv_eyebrow: "Where to start",
      adv_h2: "Answer 3 questions and see the best first AI module.",
      adv_fs1: "What scale is your operation?",
      adv_fs2: "Where do you feel the most tension?",
      adv_fs3: "What outcome do you want first?",
      adv_sc_small: "Small farm",
      adv_sc_med: "Medium farm",
      adv_sc_large: "Large enterprise",
      adv_pn_fields: "Unclear field condition",
      adv_pn_res: "Water, fertiliser and crop protection costs",
      adv_pn_ops: "People, machinery and task coordination",
      adv_pn_risk: "Disease, climate risk and late reactions",
      adv_gl_clarity: "More clarity and calm decisions",
      adv_gl_save: "Less wasted spend",
      adv_gl_ctrl: "Stronger management control",
      adv_btn: "I want this plan",
      proc_eyebrow: "How we work",
      proc_h2: "From first conversation to a live system.",
      proc1_h: "Discovery",
      proc1_p: "We clarify the problem, processes, data available and season goals.",
      proc2_h: "AI plan",
      proc2_p: "We choose the right mix of monitoring, analytics, automation and learning.",
      proc3_h: "Rollout",
      proc3_p: "We connect data, machinery and teams into signals and reporting.",
      proc4_h: "Improve",
      proc4_p: "We measure outcomes, tune models and grow the solution with your farm.",
      scale_eyebrow: "Small and large",
      scale_h2: "There is a path for every scale.",
      scale_p:
        "Small farms need clarity and time saved. Large organisations need control, integrations and executive visibility. SIMA bridges land, data and decisions.",
      scale_s1_t: "Small farms",
      scale_s1_d: "easy start, concrete problem, fast impact",
      scale_s2_t: "Mid-size farms",
      scale_s2_d: "better planning, team coordination, forecasting",
      scale_s3_t: "Large companies",
      scale_s3_d: "integrations, automated reporting, data-led management",
      legal_eyebrow: "Legal",
      privacy_h2: "Privacy policy",
      privacy_p1_html:
        '<strong>Who processes data.</strong> SIMA. <a href="mailto:info@agrinexus.eu">info@agrinexus.eu</a>',
      privacy_p2_html:
        "<strong>What we process.</strong> Contact form: name, email and message. Portal sign-in: account data, technical logs and session identifiers, plus information you upload.",
      privacy_p3_html:
        "<strong>Why.</strong> To respond to enquiries, provide and improve services, and keep the platform secure and lawful. We do not use marketing cookies by default; local browser storage supports UI features (e.g. demo mode).",
      privacy_p4_html:
        "<strong>Retention and sharing.</strong> We keep contact messages only as long as needed. We do not sell personal data. Hosting or IT vendors may process data on our behalf under contract and law.",
      privacy_p5_html:
        "<strong>Your rights.</strong> Access, rectification, erasure, restriction or portability where applicable, and objection where legally grounded. You may also lodge a complaint with a supervisory authority.",
      terms_h2: "Website terms of use",
      terms_p1_html:
        "<strong>Scope.</strong> These terms govern public pages and available demo or customer features. By browsing or registering you accept them.",
      terms_p2_html:
        "<strong>Content and AI.</strong> Automated outputs are indicative. Production, inputs, machinery and legal decisions remain yours with your advisers; SIMA is not liable for actions based solely on demo output without professional verification.",
      terms_p3_html:
        "<strong>Availability.</strong> Features and limits may change. We may restrict accounts for abuse, unauthorised access or instability risks.",
      terms_p4_html:
        "<strong>Enquiries and contracts.</strong> Contact forms invite dialogue only and do not create an order. Contracts require separate written or electronic agreement.",
      terms_p5_html:
        "<strong>Liability cap.</strong> To the maximum extent allowed by law, SIMA is not liable for indirect or consequential losses from using or being unable to use the site.",
      contact_h2: "Let’s start with the problem that weighs on you most.",
      contact_p:
        "Describe your farm, process or outcome you need. We’ll return a clear first plan: what to measure, what to automate and the best place to start.",
      lbl_contact_name: "Name",
      lbl_contact_email: "Email",
      lbl_contact_msg: "What problem should we solve?",
      ph_contact_name: "Your name",
      ph_contact_email: "your.email@domain.com",
      ph_contact_msg: "e.g. crop monitoring, irrigation, reporting, machinery...",
      contact_submit: "Send message",
      footer_nav_aria: "Footer links",
      footer_credit_html:
        '<strong>SIMA</strong> is a brand and platform initiative developed by <strong>AgriNexus</strong> — an innovation partner for agriculture: strategy, data architecture and AI modules shaped around real seasons, crews and field-level risk—not slide decks.',
      cookie_aria: "Cookie notice",
      cookie_text_html:
        'We use only technically necessary site mechanisms and, when needed, local browser storage for demo and portal features. “OK” means you acknowledge our <a href="#privacy">privacy policy</a>.',
      cookie_ok: "OK",
      crop_wheat: "Wheat",
      crop_corn: "Corn",
      crop_sun: "Sunflower",
      crop_orchard: "Orchard",
      crop_veg: "Vegetables",
      concern_wg: "Weak or uneven growth",
      concern_ws: "Possible water stress",
      concern_dis: "Possible disease or pests",
      concern_nut: "Possible nutrient deficiency",
      concern_unk: "I’m not sure what causes it",
      stage_early: "Early growth",
      stage_active: "Active vegetative growth",
      stage_flow: "Flowering / critical period",
      stage_late: "Late season",
      rating_5: "5 — very helpful",
      rating_4: "4 — helpful",
      rating_3: "3 — partly",
      rating_2: "2 — weak",
      rating_1: "1 — not helpful",
      portal_crop_wheat: "Wheat",
      portal_crop_corn: "Corn",
      portal_crop_sun: "Sunflower",
      portal_crop_orchard: "Orchard",
      portal_crop_veg: "Vegetables",
    },
  };

  /** Dynamic copy used from script.js — mirrors Bulgarian structures */
  const JS = {
    bg: {
      api_error: "API грешка.",
      chat_empty: "Задайте първия въпрос — асистентът отговаря на български.",
      chat_you: "Вие",
      chat_ai: "SIMA AI",
      chat_login_required: "Влезте в акаунт, за да ползвате AI чата.",
      chat_thinking: "Мисля…",
      chat_ready: "Готово",
      auth_logged_in: (name) => `Вход: ${name}`,
      rag_line: (total, emb, on) =>
        `RAG: ${total} фрагмента (${emb} с embeddings). ${
          on ? "Семантично извличане е активно." : "За embeddings подайте API ключ — виж .env.example и LLM-CONFIG.md."
        }`,
      rag_added: (n) => `Добавени са ${n} RAG фрагмента към индекса.`,
      local_need_text: "В локален режим добавете ръчен текст.",
      report_not_found: "Докладът не е намерен.",
      feedback_saved:
        "Обратната връзка е запазена и системата ще я използва при следващи анализи.",
      feedback_exists: "Този доклад вече има обратна връзка и е добавен към базата знания.",
      backend_clear_hist:
        "В backend режим докладите се пазят в базата. Изтриването ще се добави като отделно админ действие.",
      copy_done: "Копирано",
      copy_fallback: "Копирайте от доклада",
      copy_default: "Копирай доклада",
      geojson_need: "Очертайте поне три върха по картата, за да има GeoJSON граница (WGS84).",
      geojson_copied: "GeoJSON границата е копирана.",
      map_done: (n) =>
        `Очертано поле с ${n} върха (WGS84). Границата ще се запише към следващото добавено поле.`,
      map_need: (left) =>
        `Добавете още ${left} точки по картата за затворена граница (поне три върха).`,
      map_point_title: (i) => `Точка ${i}`,
      map_satellite: "Сателит",
      map_street: "Улици",
      map_terrain: "Терен",
      map_terrain_hint: "Сянка на релефа + 3D наклон (десен бутон + drag).",
      weatherLayerLabels: {
        precipitation: "Дъжд",
        clouds: "Облаци",
        temp: "Темп.",
        wind: "Вятър",
        pressure: "Налягане",
      },
      heroInsightScenarios: [
        {
          slots: [
            { label: "Култура · Блок 12", value: "Пшеница" },
            { label: "Индекс на растеж", value: "87% · стабилен" },
            { label: "Препоръка", value: "Поливане след 18:00" },
          ],
        },
        {
          slots: [
            { label: "Култура · Блок 7", value: "Слънчоглед" },
            { label: "Риск от стрес", value: "Нисък" },
            { label: "Прогноза", value: "Чисто 3 дни" },
          ],
        },
        {
          slots: [
            { label: "Култура · Блок 4", value: "Царевица" },
            { label: "Зона за внимание", value: "Северна страна" },
            { label: "Препоръка", value: "Оглед след валеж" },
          ],
        },
        {
          slots: [
            { label: "Култура · Блок 18", value: "Ябълки" },
            { label: "Риск от болест", value: "Среден" },
            { label: "Препоръка", value: "Готовност за обработка" },
          ],
        },
      ],
      contact_ok: "Благодарим — получихме запитването ви и ще се свържем скоро.",
      contact_fail: "Неуспешно изпращане. Опитайте отново.",
      weather_loading: "Зареждам метео данни...",
      unnamed_field: "Неназовано поле",
      area_unknown: "неуточнена площ",
      crop_generic: "култура",
      stage_fallback: "активна вегетация",
      processing: "Анализът се обработва",
      processing_p: "Качваме данните към backend и подготвяме Field Watch доклад.",
      analysis_fail: "Неуспешен анализ",
      llm_title: "LLM Field Watch анализ",
      demo_title: "Field Watch демо анализ",
      demo_mode_label: "демо fallback без LLM настройка",
      rag_mode_label: "откъса в подкана към модела",
      strategy_field: "Поле:",
      strategy_crop: "Култура:",
      strategy_stage: "Етап:",
      farmer_note: "Бележка от фермера:",
      tip_note: "Съвет:",
      tip_text: "Добавете кратко описание от терен, за да стане стратегията по-точна.",
      mode_label: "Режим:",
      rag_label_short: "RAG:",
      portal_brief_0: "Добавете първото поле, за да започне изграждането на история на стопанството.",
      portal_brief_1: "Полето е създадено. Следващата стъпка е първи Field Watch анализ и доклад.",
      portal_brief_n: (f, r) =>
        `Имате ${f} полета и ${r} доклада. Приоритетът е да се следят последните препоръки и да се добавя нов анализ при промяна на състоянието.`,
      empty_fields: "Няма добавени полета. Добавете първия парцел от формата по-горе.",
      empty_reports: "Все още няма Field Watch доклади.",
      empty_tasks:
        "Все още няма задачи. Те се създават автоматично от Field Watch докладите.",
      empty_team: "Няма нови заявки за екипа.",
      empty_knowledge: "Все още няма добавени знания. Добавете URL или ръчна бележка.",
      field_with_map: "Поле с карта",
      field_plain: "Поле",
      boundary_pts: (n) => `Граница: ${n} точки`,
      boundary_none: "Няма очертана граница още.",
      profile_btn: "Профил",
      rating_abbr: (n) => `Оценка: ${n}/5`,
      no_feedback_yet: "Няма обратна връзка още.",
      task_done: "Изпълнена",
      task_open: "Отворена",
      task_field: "Поле",
      task_mark_done: "Маркирай като изпълнена",
      task_reopen: "Върни като отворена",
      queue_wait: "Чака преглед",
      queue_note: (p) =>
        `${p} Следва SIMA консултант да потвърди анализа и да финализира стратегията.`,
      empty_field_reports: "Още няма доклади за това поле.",
      knowledge_default: "Знание",
      statusLabels: {
        draft: "Чернова",
        ai_analysis: "AI анализ",
        expert_review: "Чака експерт",
        confirmed: "Потвърден",
        sent: "Изпратен",
        verified: "Проверен",
      },
      cropLabels: {
        wheat: "пшеница",
        corn: "царевица",
        sunflower: "слънчоглед",
        orchard: "овощна градина",
        vegetables: "зеленчуци",
      },
      stageLabels: {
        early: "начален растеж",
        active: "активна вегетация",
        flowering: "критичен период",
        late: "късен сезон",
      },
      recommendations: {
        fields: {
          title: "Field Watch",
          tag: "Препоръчан старт",
          text:
            "Започнете с наблюдение на полетата. Това дава бърза яснота къде има риск, кои зони изискват внимание и какво може да се провери на място.",
        },
        resources: {
          title: "Water & Soil AI",
          tag: "Най-бърз ефект върху разходите",
          text:
            "Започнете с вода, почва и торене. Модулът помага да се намалят излишните операции и да се насочи ресурсът там, където носи реална стойност.",
        },
        operations: {
          title: "FarmOps",
          tag: "За повече контрол",
          text:
            "Започнете с управление на операции. Подреждаме задачи, техника, хора, склад и отчети, за да имате по-спокойна ежедневна картина.",
        },
        risk: {
          title: "Risk Radar",
          tag: "За по-ранни реакции",
          text:
            "Започнете с ранни сигнали за риск. AI следи климат, състояние на културата и потенциални проблеми, преди те да станат скъпи.",
        },
      },
      advisorNotes: {
        scale_small: "Подходящо е за лек старт без тежка промяна в работата.",
        scale_medium: "Може да се внедри поетапно и да свърже екипа около обща картина.",
        scale_large: "Подходящо е за интеграция с процеси, отчети и управленски контрол.",
        goal_clarity: "Фокусът е повече яснота и спокойствие в решенията.",
        goal_savings: "Фокусът е намаляване на излишните разходи и по-точно планиране.",
        goal_control: "Фокусът е по-добър контрол, проследимост и управленска видимост.",
      },
      weather_demo_summary:
        "Влезте в акаунт, за да се зареди реална прогноза от backend. Показана е демо прогноза.",
      weather_day_today: "Днес",
      weather_day_tmr: "Утре",
      weather_day_2: "След 2 дни",
      weather_rec: [
        "Подходящ прозорец за оглед: сутрин или след 18:00.",
        "При по-силен вятър избягвайте пръскане.",
        "Сравнете условията с последния Field Watch доклад.",
      ],
      weather_temp: "Темп.:",
      weather_rain: "Валеж:",
      weather_wind: "Вятър:",
      weather_demo_label: "Демо прогноза",
      weather_default_location: "Пловдив",
      report_header: "SIMA Field Watch доклад",
      report_field: "Поле:",
      report_area: "Площ:",
      report_crop: "Култура:",
      report_stage: "Етап:",
      report_date: "Дата:",
      report_state: "Състояние:",
      report_priority: "Приоритет:",
      report_actions_h: "Следващи действия:",
      report_monitor: "Наблюдение:",
      report_notes: "Бележка от фермера:",
      report_rag_line: (mode, snippets) =>
        `RAG: ${mode}, откъси в подкана: ${snippets}`,
      crop_default_capital: "Култура",
      strategy_extra_1:
        "Комбинирайте теренните данни със сателитен индекс и AI vision анализ.",
      strategy_extra_2:
        "Финализирайте кратък план: приоритетни зони, проверки на място и препоръчано действие.",
      local_report_state: (fieldName, area, stage, files) =>
        `${fieldName} (${area}) е в етап ${stage}. Качени файлове: ${files}. Анализът започва от данните на фермера и описаните теренни симптоми.`,
      feedback_kb_title: (fieldName) => `Проверен резултат: ${fieldName}`,
      feedback_kb_text: (rating, helped, outcome, correction) =>
        `Оценка ${rating}/5. Помогна: ${helped ? "да" : "не"}. Резултат: ${outcome}. Корекция: ${correction}`,
      contact_mail_subject: (name) =>
        `Запитване към SIMA от ${name || "посетител"}`,
      contact_mail_body: (name, email, message) =>
        `Име: ${name || "—"}\nИмейл: ${email || "—"}\n\nПроблем/цел:\n${message || "—"}`,
      concernStrategies: {},
    },
    en: {
      api_error: "API error.",
      chat_empty: "Ask your first question — the assistant replies in your language.",
      chat_you: "You",
      chat_ai: "SIMA AI",
      chat_login_required: "Sign in to use AI chat.",
      chat_thinking: "Thinking…",
      chat_ready: "Done",
      auth_logged_in: (name) => `Signed in: ${name}`,
      rag_line: (total, emb, on) =>
        `RAG: ${total} chunks (${emb} with embeddings). ${
          on ? "Semantic retrieval is on." : "Add an API key for embeddings — see .env.example and LLM-CONFIG.md."
        }`,
      rag_added: (n) => `Added ${n} RAG chunks to the index.`,
      local_need_text: "In local mode add manual text.",
      report_not_found: "Report not found.",
      feedback_saved: "Feedback saved; we’ll use it in future analyses.",
      feedback_exists: "This report already has feedback and was added to the knowledge base.",
      backend_clear_hist:
        "In backend mode reports live in the database. Bulk delete will be a separate admin action.",
      copy_done: "Copied",
      copy_fallback: "Copy manually from report",
      copy_default: "Copy report",
      geojson_need: "Draw at least three vertices on the map for a GeoJSON boundary (WGS84).",
      geojson_copied: "GeoJSON boundary copied.",
      map_done: (n) =>
        `Boundary with ${n} vertices (WGS84). It will attach to the next field you add.`,
      map_need: (left) =>
        `Add ${left} more map click(s) for a closed boundary (three vertices minimum).`,
      map_point_title: (i) => `Point ${i}`,
      map_satellite: "Satellite",
      map_street: "Streets",
      map_terrain: "Terrain",
      map_terrain_hint: "Hillshade + 3D pitch (right-click drag).",
      weatherLayerLabels: {
        precipitation: "Rain",
        clouds: "Clouds",
        temp: "Temp",
        wind: "Wind",
        pressure: "Pressure",
      },
      heroInsightScenarios: [
        {
          slots: [
            { label: "Crop · Block 12", value: "Winter wheat" },
            { label: "Growth index", value: "87% · stable" },
            { label: "Recommendation", value: "Irrigate after 6 PM" },
          ],
        },
        {
          slots: [
            { label: "Crop · Block 7", value: "Sunflower" },
            { label: "Stress risk", value: "Low" },
            { label: "Forecast", value: "Clear for 3 days" },
          ],
        },
        {
          slots: [
            { label: "Crop · Block 4", value: "Corn" },
            { label: "Watch zone", value: "Northern edge" },
            { label: "Recommendation", value: "Inspect after rain" },
          ],
        },
        {
          slots: [
            { label: "Crop · Block 18", value: "Apple orchard" },
            { label: "Disease risk", value: "Medium" },
            { label: "Recommendation", value: "Prep treatment crew" },
          ],
        },
      ],
      contact_ok: "Thank you — we received your message and will reply soon.",
      contact_fail: "Could not send. Please try again.",
      weather_loading: "Loading weather…",
      unnamed_field: "Unnamed field",
      area_unknown: "area TBD",
      crop_generic: "crop",
      stage_fallback: "active vegetative growth",
      processing: "Processing analysis",
      processing_p: "Uploading data and preparing your Field Watch report.",
      analysis_fail: "Analysis failed",
      llm_title: "LLM Field Watch analysis",
      demo_title: "Field Watch demo analysis",
      demo_mode_label: "demo fallback without LLM configuration",
      rag_mode_label: "snippet(s) in the model prompt",
      strategy_field: "Field:",
      strategy_crop: "Crop:",
      strategy_stage: "Stage:",
      farmer_note: "Farmer notes:",
      tip_note: "Tip:",
      tip_text: "Add short field notes to make the strategy more accurate.",
      mode_label: "Mode:",
      rag_label_short: "RAG:",
      portal_brief_0: "Add your first field to start building farm history.",
      portal_brief_1: "Field created. Next step: first Field Watch analysis and report.",
      portal_brief_n: (f, r) =>
        `You have ${f} field(s) and ${r} report(s). Follow latest recommendations and add a new analysis when conditions change.`,
      empty_fields: "No fields yet. Add the first parcel using the form above.",
      empty_reports: "No Field Watch reports yet.",
      empty_tasks: "No tasks yet. Tasks are created automatically from Field Watch reports.",
      empty_team: "No new requests for the team.",
      empty_knowledge: "No knowledge items yet. Add a URL or a manual note.",
      field_with_map: "Field with map",
      field_plain: "Field",
      boundary_pts: (n) => `Boundary: ${n} points`,
      boundary_none: "No boundary drawn yet.",
      profile_btn: "Profile",
      rating_abbr: (n) => `Rating: ${n}/5`,
      no_feedback_yet: "No feedback yet.",
      task_done: "Done",
      task_open: "Open",
      task_field: "Field",
      task_mark_done: "Mark done",
      task_reopen: "Reopen",
      queue_wait: "Awaiting review",
      queue_note: (p) =>
        `${p} A SIMA consultant will confirm the analysis and finalise the strategy.`,
      empty_field_reports: "No reports for this field yet.",
      knowledge_default: "Knowledge",
      statusLabels: {
        draft: "Draft",
        ai_analysis: "AI analysis",
        expert_review: "Awaiting expert",
        confirmed: "Confirmed",
        sent: "Sent",
        verified: "Verified",
      },
      cropLabels: {
        wheat: "wheat",
        corn: "corn",
        sunflower: "sunflower",
        orchard: "orchard",
        vegetables: "vegetables",
      },
      stageLabels: {
        early: "early growth",
        active: "active vegetative growth",
        flowering: "critical period",
        late: "late season",
      },
      recommendations: {
        fields: {
          title: "Field Watch",
          tag: "Recommended start",
          text:
            "Start with field monitoring. It quickly shows where risk is, which zones need attention and what to verify on the ground.",
        },
        resources: {
          title: "Water & Soil AI",
          tag: "Fastest impact on spend",
          text:
            "Start with water, soil and nutrition. Reduce unnecessary passes and put inputs where they pay off.",
        },
        operations: {
          title: "FarmOps",
          tag: "More operational control",
          text:
            "Start with operations: tasks, machinery, people, inventory and reporting for a calmer daily picture.",
        },
        risk: {
          title: "Risk Radar",
          tag: "Earlier reactions",
          text:
            "Start with early risk signals—climate, crop condition and issues before they become expensive.",
        },
      },
      advisorNotes: {
        scale_small: "Good for a light start without heavy process change.",
        scale_medium: "Can roll out in phases and align the team around one picture.",
        scale_large: "Fits integration with processes, reporting and governance.",
        goal_clarity: "Focus: clearer, calmer decisions.",
        goal_savings: "Focus: cutting waste and planning tighter.",
        goal_control: "Focus: control, traceability and visibility.",
      },
      weather_demo_summary:
        "Sign in to load a live forecast from the backend. Showing demo weather.",
      weather_day_today: "Today",
      weather_day_tmr: "Tomorrow",
      weather_day_2: "In 2 days",
      weather_rec: [
        "Good scouting window: morning or after 18:00.",
        "Avoid spraying in stronger wind.",
        "Compare conditions with your latest Field Watch report.",
      ],
      weather_temp: "Temp.:",
      weather_rain: "Rain:",
      weather_wind: "Wind:",
      weather_demo_label: "Demo forecast",
      weather_default_location: "Plovdiv",
      report_header: "SIMA Field Watch report",
      report_field: "Field:",
      report_area: "Area:",
      report_crop: "Crop:",
      report_stage: "Stage:",
      report_date: "Date:",
      report_state: "Condition:",
      report_priority: "Priority:",
      report_actions_h: "Next actions:",
      report_monitor: "Monitoring:",
      report_notes: "Farmer notes:",
      report_rag_line: (mode, snippets) =>
        `RAG: ${mode}, snippets in prompt: ${snippets}`,
      crop_default_capital: "Crop",
      strategy_extra_1:
        "Combine ground-truth data with satellite indices and AI vision analysis.",
      strategy_extra_2:
        "Finalize a short plan: priority zones, on-site checks and recommended action.",
      local_report_state: (fieldName, area, stage, files) =>
        `${fieldName} (${area}) is in stage ${stage}. Uploaded files: ${files}. Analysis starts from farm data and described field symptoms.`,
      feedback_kb_title: (fieldName) => `Verified outcome: ${fieldName}`,
      feedback_kb_text: (rating, helped, outcome, correction) =>
        `Rating ${rating}/5. Helped: ${helped ? "yes" : "no"}. Outcome: ${outcome}. Correction: ${correction}`,
      contact_mail_subject: (name) =>
        `SIMA inquiry from ${name || "visitor"}`,
      contact_mail_body: (name, email, message) =>
        `Name: ${name || "—"}\nEmail: ${email || "—"}\n\nGoal / issue:\n${message || "—"}`,
      concernStrategies: {},
    },
  };

  // Copy concern strategies from script defaults (Bulgarian) — EN versions inlined
  const concernBg = {
    "weak-growth": {
      title: "Стратегия при неравномерен растеж",
      priority: "Разграничете локален проблем от общ сезонен риск.",
      monitoring:
        "Следете дали слабите зони се разширяват през следващите 5-7 дни и сравнете със здравите участъци.",
      checks: [
        "Сравнете слабите зони със здравите участъци и маркирайте границите им.",
        "Проверете почвена структура, уплътняване, влага и следи от пропуски при сеитба.",
        "Направете оглед на място в 2-3 представителни точки от проблемната зона.",
      ],
    },
    "water-stress": {
      title: "Стратегия при воден стрес",
      priority: "Насочете водата точно, без излишен разход.",
      monitoring:
        "Проверявайте симптомите сутрин и привечер, и съпоставяйте с валежи, поливки и температури.",
      checks: [
        "Проверете влажността в проблемните зони и сравнете с нормално развиващите се участъци.",
        "Съпоставете последните поливки или валежи с видимите признаци на стрес.",
        "Приоритизирайте участъците, където стресът съвпада със слаб растеж.",
      ],
    },
    disease: {
      title: "Стратегия при риск от болест или вредители",
      priority: "Потвърдете риска рано, преди да се вземе решение за третиране.",
      monitoring:
        "Следете границата между здрава и засегната зона и дали петната се разширяват след влажни дни.",
      checks: [
        "Направете близки снимки на листа, стъбла и границата между здрава и засегната зона.",
        "Проверете дали проблемът се разпространява петнисто, линейно или равномерно.",
        "Съберете информация за последни обработки и метеорологични условия.",
      ],
    },
    nutrition: {
      title: "Стратегия при хранителен дефицит",
      priority: "Избягвайте торене на сляпо и насочете правилния ресурс.",
      monitoring:
        "Следете дали симптомите следват релеф, почвен тип или предишна обработка.",
      checks: [
        "Проверете дали пожълтяването или слабият растеж следват релеф, почвен тип или предишна обработка.",
        "Сравнете симптомите в различни части на растението и в различни възрасти на листата.",
        "Обмислете почвена или листна проба от проблемната и контролна зона.",
      ],
    },
    unknown: {
      title: "Стратегия при неясен проблем",
      priority: "Първо подредете картината, после изберете точната намеса.",
      monitoring:
        "Следете дали проблемът се влошава след валеж, жега, обработка или конкретна операция.",
      checks: [
        "Съберете общи снимки от високо и близки снимки от проблемните участъци.",
        "Опишете кога е забелязан проблемът и дали се влошава.",
        "Разделете полето на зони: нормална, съмнителна и силно засегната.",
      ],
    },
  };

  const concernEn = {
    "weak-growth": {
      title: "Strategy for uneven growth",
      priority: "Separate a local issue from broader seasonal risk.",
      monitoring:
        "Watch whether weak patches expand over the next 5–7 days vs healthy areas.",
      checks: [
        "Compare weak vs healthy zones and mark boundaries.",
        "Check soil structure, compaction, moisture and sowing skips.",
        "Scout 2–3 representative spots in the affected zone.",
      ],
    },
    "water-stress": {
      title: "Strategy for water stress",
      priority: "Target irrigation precisely and avoid wasted water.",
      monitoring:
        "Check symptoms morning/evening vs rainfall, irrigation and temperatures.",
      checks: [
        "Compare moisture in stressed vs normally developing areas.",
        "Match recent irrigation/rain with visible stress signs.",
        "Prioritise patches where stress overlaps with weak growth.",
      ],
    },
    disease: {
      title: "Strategy for disease or pest risk",
      priority: "Confirm risk early before treatment decisions.",
      monitoring:
        "Track the boundary between healthy and affected tissue after humid days.",
      checks: [
        "Take close photos of leaves/stems and the healthy/affected boundary.",
        "Note whether spread is patchy, linear or uniform.",
        "Record recent applications and weather conditions.",
      ],
    },
    nutrition: {
      title: "Strategy for nutrient deficiency",
      priority: "Avoid blind fertilisation—target the right input.",
      monitoring:
        "See whether symptoms follow topography, soil type or prior operations.",
      checks: [
        "Check if yellowing or weak growth follows slope, soil type or prior passes.",
        "Compare symptoms by plant part and leaf age.",
        "Consider soil or tissue sampling from affected vs control zones.",
      ],
    },
    unknown: {
      title: "Strategy when the cause is unclear",
      priority: "Clarify the picture first, then choose intervention.",
      monitoring:
        "Track whether it worsens after rain, heat, a pass or a specific operation.",
      checks: [
        "Collect wide shots plus close-ups from problem areas.",
        "Note when symptoms started and whether they worsen.",
        "Split the field into normal, suspect and strongly affected zones.",
      ],
    },
  };

  JS.bg.concernStrategies = concernBg;
  JS.en.concernStrategies = concernEn;

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "bg";
  }

  function normalizeLang(lang) {
    return lang === "en" ? "en" : "bg";
  }

  function setLang(lang) {
    const next = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    window.dispatchEvent(new CustomEvent("sima-lang-change", { detail: next }));
  }

  function t(key) {
    const lang = getLang();
    const val = STRINGS[lang]?.[key];
    if (val != null) return val;
    return STRINGS.bg[key] ?? "";
  }

  function apply(lang) {
    const L = STRINGS[normalizeLang(lang)];
    document.documentElement.lang = normalizeLang(lang);
    document.documentElement.setAttribute("data-lang", normalizeLang(lang));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || L[key] == null) return;
      if (el.getAttribute("data-i18n-html") === "1") el.innerHTML = L[key];
      else el.textContent = L[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && L[key] != null) el.placeholder = L[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key && L[key] != null) el.setAttribute("aria-label", L[key]);
    });

    document.querySelectorAll("option[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && L[key] != null) el.textContent = L[key];
    });

    const titleEl = document.querySelector("title");
    if (titleEl && L.meta_title) titleEl.textContent = L.meta_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && L.meta_description) metaDesc.setAttribute("content", L.meta_description);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("is-active", normalizeLang(btn.dataset.lang) === normalizeLang(lang));
      btn.setAttribute("aria-pressed", btn.classList.contains("is-active") ? "true" : "false");
    });
  }

  function bindLangButtons() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang || "bg"));
    });
  }

  function bootI18n() {
    apply(getLang());
    bindLangButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootI18n);
  } else {
    bootI18n();
  }

  window.SIMA_I18N = { STRINGS, JS, getLang, setLang, apply, t };
})();
