// **Multi-Language Translations**
const translations: Record<string, Record<string, string>> = {
    "invalidDate": { "en-GB": "Invalid Date", "TH-th": "วันที่ไม่ถูกต้อง" },
    "minuteAgo": { "en-GB": "a minute ago", "TH-th": "1 นาทีที่แล้ว" },
    "minutesAgo": { "en-GB": "{value} minutes ago", "TH-th": "{value} นาทีที่แล้ว" },
    "hourAgo": { "en-GB": "an hour ago", "TH-th": "1 ชั่วโมงที่แล้ว" },
    "hoursAgo": { "en-GB": "{value} hours ago", "TH-th": "{value} ชั่วโมงที่แล้ว" },
    "yesterday": { "en-GB": "Yesterday", "TH-th": "เมื่อวาน" },
    "daysAgo": { "en-GB": "{value} days ago", "TH-th": "{value} วันที่แล้ว" },
    "inMinute": { "en-GB": "in a minute", "TH-th": "อีก 1 นาที" },
    "inMinutes": { "en-GB": "in {value} minutes", "TH-th": "อีก {value} นาที" },
    "inHour": { "en-GB": "in an hour", "TH-th": "อีก 1 ชั่วโมง" },
    "inHours": { "en-GB": "in {value} hours", "TH-th": "อีก {value} ชั่วโมง" },
    "tomorrow": { "en-GB": "Tomorrow", "TH-th": "พรุ่งนี้" },
    "inDays": { "en-GB": "in {value} days", "TH-th": "อีก {value} วัน" },
    "Now": { "en-GB": "Now", "TH-th": "ตอนนี้" },
};

export function DateFormatFullTime(date: string | number | Date, locale: string = "en-GB") {
    const inputDate = new Date(date);
    const now = new Date();

    // Ensure invalid dates return a correct response
    if (isNaN(inputDate.getTime())) {
        return translations["invalidDate"][locale] || translations["invalidDate"]["en-GB"];
    }

    const diffInSeconds = Math.floor((inputDate.getTime() - now.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let key: string;
    let value: number = 0;

    if (inputDate < now) {
        switch (true) {
            case diffInSeconds < 60 && diffInSeconds >= 0:
                key = "minuteAgo";
                value = diffInSeconds;
                break;
            case diffInMinutes < 60 && diffInMinutes > 0:
                key = "minutesAgo";
                value = diffInMinutes;
                break;
            case diffInHours === 1:
                key = "hourAgo";
                value = diffInHours;
                break;
            case diffInHours < 24 && diffInHours > 1:
                key = "hoursAgo";
                value = diffInHours;
                break;
            case diffInDays === 1:
                key = "yesterday";
                value = diffInDays;
                break;
            case diffInDays > 1 && diffInDays <= 7:
                key = "daysAgo";
                value = diffInDays;
                break;
            default:
                return inputDate.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                });
        }
    } else if (inputDate > now) {
        switch (true) {
            case diffInSeconds < 60 && diffInSeconds > 0:
                key = "inMinute";
                value = diffInSeconds;
                break;
            case diffInMinutes < 60 && diffInMinutes > 0:
                key = "inMinutes";
                value = diffInMinutes;
                break;
            case diffInHours === 1:
                key = "inHour";
                value = diffInHours;
                break;
            case diffInHours < 24 && diffInHours > 1:
                key = "inHours";
                value = diffInHours;
                break;
            case diffInDays === 1:
                key = "tomorrow";
                value = diffInDays;
                break;
            case diffInDays > 1 && diffInDays <= 7:
                key = "inDays";
                value = diffInDays;
                break;
            default:
                return inputDate.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                });
        }
    } else {
        return (translations["Now"][locale] || translations["Now"]["en-GB"]);
    }

    return translations[key][locale]?.replace("{value}", value.toString()) || translations[key]["en-GB"];
};

export function DateFormat(date: Date | string, format: string = "en-GB"): string {
    return new Date(date).toLocaleDateString(format, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function DateFormatLong(date: Date | string, format: string = "en-GB"): string {
    return new Date(date).toLocaleDateString(format, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function DateFormatTime(date: Date | string, format: string = "en-GB"): string {
    return new Date(date).toLocaleTimeString(format, {
        hour: "numeric",
        minute: "2-digit",
    });
}

export function DateFormatFull(date: Date | string, format: string = "en-GB"): string {
    return new Date(date).toLocaleString(format, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}