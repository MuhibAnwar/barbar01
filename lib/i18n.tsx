"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ─── Translation map ──────────────────────────────────────────────────────────

const translations = {
  en: {
    // General
    appName: "BarberBook",
    language: "Language",
    english: "English",
    urdu: "اردو",
    back: "BACK",
    continue: "CONTINUE",
    retry: "RETRY",

    // Step indicator
    stepLabel: "Step",
    stepOf: "of",
    stepBarber: "Barber",
    stepService: "Service",
    stepTime: "Time",
    stepDetails: "Details",

    // Landing page
    bookInSeconds: "Book in seconds",
    tagline: "Your Barber, Your Time.",
    taglineDesc:
      "Skip the call. Pick your barber, choose a service, and lock in your slot — done.",
    bookNow: "Book Now",
    barberLoginLink: "Barber Login",
    scanBookDone: "Scan · Book · Done",
    noBarberSelected: "No barber selected",

    // BarberSelect
    loadingBarbers: "Loading barbers...",
    chooseYourBarber: "Choose Your Barber",
    selectWhoToBook: "Select who you'd like to book with.",
    unableToLoadBarbers:
      "Unable to load barbers. Please check your connection and try again.",

    // ServiceSelect
    loadingServices: "Loading services...",
    selectService: "Select Service",
    whatAreYouComingFor: "What are you coming in for?",
    unableToLoadServices:
      "Unable to load services. Please check your connection and try again.",

    // TimeSlotPicker
    loadingSlots: "Loading slots...",
    pickATime: "Pick a Time",
    availableSlotsDesc: "Available slots for your selected barber.",
    noAvailableSlots: "No available slots. Check back soon.",
    unableToLoadSlots:
      "Unable to load time slots. Please check your connection and try again.",
    noSlotsAvailable: "No slots available for this barber",

    // CustomerForm
    yourDetails: "Your Details",
    almostDone: "Almost done — just need your info.",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    commentOptional: "Comment (optional)",
    namePlaceholder: "e.g. Mohammed Raza",
    phonePlaceholder: "e.g. 9876543210",
    commentPlaceholder: "Any special requests or notes...",
    confirmBooking: "CONFIRM BOOKING",
    bookingSuccess: "Your appointment has been booked successfully!",
    bookingError: "Something went wrong. Please try again.",
    nameError: "Name must be at least 2 characters.",
    phoneError: "Enter a valid phone number (digits only).",
    slotAlreadyBooked:
      "Sorry, this slot was just booked. Please go back and choose another.",
    required: "This field is required",
    invalidPhone: "Please enter a valid phone number",

    // BookingConfirmation
    bookingConfirmedTitle: "Booking Confirmed",
    barberLabel: "Barber",
    serviceLabel: "Service",
    dateLabel: "Date",
    timeLabel: "Time",
    nameLabel: "Name",
    phoneLabel: "Phone",
    noteLabel: "Note",
    statusLabel: "Status",
    confirmedStatus: "CONFIRMED",
    bookAnother: "BOOK ANOTHER APPOINTMENT",

    // Barber login
    barberLogin: "Barber Login",
    enterBarberCodeDesc: "Enter your barber code to access your dashboard.",
    barberIdLabel: "Barber ID",
    barberIdInputPlaceholder: "e.g. BARBER001",
    enterDashboard: "ENTER DASHBOARD",
    barberCodesHint: "Barber codes: BARBER001, BARBER002",
    pleaseEnterBarberId: "Please enter your Barber ID.",
    barberIdNotFound: "Barber ID not found. Please check and try again.",
    unableToConnect: "Unable to connect. Please try again.",

    // Dashboard
    yourBookings: "Bookings",
    todayBadge: "today",
    allFilter: "ALL",
    todayFilter: "TODAY",
    loadingBookings: "Loading bookings...",
    logout: "LOGOUT",

    // BookingsTable
    customerHeader: "Customer",
    serviceHeader: "Service",
    dateHeader: "Date",
    timeHeader: "Time",
    statusHeader: "Status",
    noBookings: "No bookings yet.",

    // CustomerSlider
    bookingDetail: "Booking Detail",
    customerLabel: "Customer",
    phoneDetail: "Phone",
    serviceDetail: "Service",
    appointmentDetail: "Appointment",
    noteDetail: "Note",
    updateStatus: "Update Status",
    close: "CLOSE",
    statusPending: "PENDING",
    statusConfirmed: "CONFIRMED",
    statusCancelled: "CANCELLED",

    // PWA
    offlineBanner: "You are offline — showing last synced data.",
    backOnline: "You are back online.",
    addToHomeScreen: "Add to Home Screen",
    installBodyIos:
      "Install BarberBook on your iPhone for fast, one-tap access — no App Store needed.",
    installBodyAndroid:
      "Install BarberBook on your device for fast, one-tap access — works offline too.",
    notNow: "NOT NOW",
    installApp: "INSTALL APP",
    maybeLater: "Maybe later",
    tapShare: "Tap the Share button",
    tapAddToHomeScreen: 'Scroll down and tap "Add to Home Screen"',
    tapAdd: 'Tap "Add" to confirm',
    installPrompt: "Install BarberBook — Add to Home Screen",
    dismiss: "Dismiss",
  },

  ur: {
    // General
    appName: "باربر بک",
    language: "زبان",
    english: "English",
    urdu: "اردو",
    back: "واپس",
    continue: "جاری رکھیں",
    retry: "دوبارہ کوشش",

    // Step indicator
    stepLabel: "مرحلہ",
    stepOf: "از",
    stepBarber: "باربر",
    stepService: "سروس",
    stepTime: "وقت",
    stepDetails: "تفصیلات",

    // Landing page
    bookInSeconds: "سیکنڈوں میں بک کریں",
    tagline: "آپ کا باربر، آپ کا وقت۔",
    taglineDesc:
      "فون کال چھوڑیں۔ باربر چنیں، سروس منتخب کریں، وقت مقرر کریں — ہو گیا۔",
    bookNow: "ابھی بک کریں",
    barberLoginLink: "باربر لاگ ان",
    scanBookDone: "اسکین · بک · ہو گیا",
    noBarberSelected: "کوئی باربر منتخب نہیں",

    // BarberSelect
    loadingBarbers: "باربرز لوڈ ہو رہے ہیں...",
    chooseYourBarber: "اپنا باربر چنیں",
    selectWhoToBook: "جس کے ساتھ بک کرنا ہو، منتخب کریں۔",
    unableToLoadBarbers: "باربرز لوڈ نہیں ہو سکے۔ اپنا کنیکشن چیک کریں۔",

    // ServiceSelect
    loadingServices: "سروسز لوڈ ہو رہی ہیں...",
    selectService: "سروس منتخب کریں",
    whatAreYouComingFor: "آپ کس چیز کے لیے آ رہے ہیں؟",
    unableToLoadServices: "سروسز لوڈ نہیں ہو سکیں۔ اپنا کنیکشن چیک کریں۔",

    // TimeSlotPicker
    loadingSlots: "وقت لوڈ ہو رہا ہے...",
    pickATime: "وقت منتخب کریں",
    availableSlotsDesc: "آپ کے منتخب باربر کے لیے دستیاب وقت۔",
    noAvailableSlots: "کوئی دستیاب وقت نہیں۔ جلد دوبارہ چیک کریں۔",
    unableToLoadSlots: "وقت لوڈ نہیں ہو سکا۔ اپنا کنیکشن چیک کریں۔",
    noSlotsAvailable: "اس باربر کے لیے کوئی وقت دستیاب نہیں",

    // CustomerForm
    yourDetails: "آپ کی تفصیلات",
    almostDone: "تقریباً مکمل — بس آپ کی معلومات درکار ہیں۔",
    fullName: "پورا نام",
    phoneNumber: "فون نمبر",
    commentOptional: "نوٹ (اختیاری)",
    namePlaceholder: "اپنا پورا نام لکھیں",
    phonePlaceholder: "مثلاً 9876543210",
    commentPlaceholder: "کوئی خاص فرمائش یا نوٹ...",
    confirmBooking: "بکنگ کنفرم کریں",
    bookingSuccess: "آپ کی اپوائنٹمنٹ کامیابی سے بک ہو گئی!",
    bookingError: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔",
    nameError: "نام کم از کم 2 حروف کا ہونا چاہیے۔",
    phoneError: "درست فون نمبر درج کریں (صرف ہندسے)۔",
    slotAlreadyBooked:
      "معذرت، یہ وقت ابھی بک ہو گیا۔ واپس جا کر دوسرا وقت منتخب کریں۔",
    required: "یہ فیلڈ ضروری ہے",
    invalidPhone: "براہ کرم درست فون نمبر درج کریں",

    // BookingConfirmation
    bookingConfirmedTitle: "بکنگ تصدیق شدہ",
    barberLabel: "باربر",
    serviceLabel: "سروس",
    dateLabel: "تاریخ",
    timeLabel: "وقت",
    nameLabel: "نام",
    phoneLabel: "فون",
    noteLabel: "نوٹ",
    statusLabel: "حیثیت",
    confirmedStatus: "تصدیق شدہ",
    bookAnother: "ایک اور اپوائنٹمنٹ بک کریں",

    // Barber login
    barberLogin: "باربر لاگ ان",
    enterBarberCodeDesc: "اپنا باربر کوڈ درج کریں تاکہ ڈیش بورڈ تک رسائی ہو۔",
    barberIdLabel: "باربر آئی ڈی",
    barberIdInputPlaceholder: "مثلاً BARBER001",
    enterDashboard: "ڈیش بورڈ میں داخل ہوں",
    barberCodesHint: "باربر کوڈز: BARBER001, BARBER002",
    pleaseEnterBarberId: "براہ کرم اپنا باربر آئی ڈی درج کریں۔",
    barberIdNotFound: "باربر آئی ڈی نہیں ملا۔ دوبارہ چیک کریں۔",
    unableToConnect: "کنیکشن نہیں ہو سکا۔ دوبارہ کوشش کریں۔",

    // Dashboard
    yourBookings: "بکنگز",
    todayBadge: "آج",
    allFilter: "سب",
    todayFilter: "آج",
    loadingBookings: "بکنگز لوڈ ہو رہی ہیں...",
    logout: "لاگ آؤٹ",

    // BookingsTable
    customerHeader: "کسٹمر",
    serviceHeader: "سروس",
    dateHeader: "تاریخ",
    timeHeader: "وقت",
    statusHeader: "حیثیت",
    noBookings: "ابھی کوئی بکنگ نہیں۔",

    // CustomerSlider
    bookingDetail: "بکنگ کی تفصیل",
    customerLabel: "کسٹمر",
    phoneDetail: "فون",
    serviceDetail: "سروس",
    appointmentDetail: "اپوائنٹمنٹ",
    noteDetail: "نوٹ",
    updateStatus: "حیثیت اپ ڈیٹ کریں",
    close: "بند کریں",
    statusPending: "زیر التواء",
    statusConfirmed: "تصدیق شدہ",
    statusCancelled: "منسوخ",

    // PWA
    offlineBanner: "آپ آف لائن ہیں — آخری سنک شدہ ڈیٹا دکھایا جا رہا ہے۔",
    backOnline: "آپ دوبارہ آن لائن ہیں۔",
    addToHomeScreen: "ہوم اسکرین پر شامل کریں",
    installBodyIos:
      "باربر بک اپنے آئی فون پر انسٹال کریں — ایک ٹچ میں تیز رسائی، ایپ اسٹور کی ضرورت نہیں۔",
    installBodyAndroid:
      "باربر بک اپنے ڈیوائس پر انسٹال کریں — آف لائن بھی کام کرتا ہے۔",
    notNow: "ابھی نہیں",
    installApp: "ایپ انسٹال کریں",
    maybeLater: "شاید بعد میں",
    tapShare: "شیئر بٹن دبائیں",
    tapAddToHomeScreen: '"ہوم اسکرین پر شامل کریں" کو ٹیپ کریں',
    tapAdd: '"شامل کریں" دبائیں',
    installPrompt: "باربر بک انسٹال کریں — ہوم اسکرین پر شامل کریں",
    dismiss: "بند کریں",
  },
} as const;

export type Lang = "en" | "ur";
export type TranslationKey = keyof typeof translations.en;

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey | string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key as string,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const stored = localStorage.getItem("barberbook_lang") as Lang | null;
    const resolved: Lang = stored === "ur" ? "ur" : "en";
    setLangState(resolved);
    applyDirLang(resolved);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("barberbook_lang", newLang);
    applyDirLang(newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const langMap = translations[lang] as Record<string, string>;
      const enMap = translations.en as Record<string, string>;
      return langMap?.[key] ?? enMap?.[key] ?? key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

function applyDirLang(lang: Lang) {
  document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
  return useContext(I18nContext);
}
