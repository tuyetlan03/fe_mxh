import moment from "moment-timezone"

const formatTime = (date) => {
    const now = moment.utc().tz(moment.tz.guess())
    const localDate = moment.tz(date, moment.tz.guess()).local()
    const duration = moment.duration(now.diff(localDate))

    if (duration.asMinutes() < 1) {
        // trường hợp cách nhau dưới 1 phut
        return `${Math.round(duration.asSeconds())} second ago`
    }
    else if (duration.asHours() < 1) {
        // trường hợp cách nhau dưới 1 giờ
        return `${Math.round(duration.asMinutes())} minute ago`
    } else if (duration.asDays() < 1) {
        // trường hợp cách nhau dưới 1 ngày
        return `${Math.round(duration.asHours())} hour ago`
    } else if (duration.asWeeks() < 1) {
        // trường hợp cách nhau duoi 1 thang
        return `${Math.round(duration.asDays())} day ago`
    } else if (duration.asMonths() < 1) {
        // trường hợp cách nhau duoi 1 thang
        return `${Math.round(duration.asWeeks())} week ago`
    } else if (duration.asYears() < 1) {
        // trường hợp cách nhau duoi 1 thang
        return `${Math.round(duration.asMonths())} month ago`
    } else {
        // trường hợp cách nhau theo năm
        return `${Math.round(duration.asYears())} year ago`
    }
}

export default formatTime