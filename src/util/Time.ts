export default class Time {
    static getTimeStamp(date: Date): string {
        const formattedDate: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const formattedTime: string = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        return `${formattedDate} ${formattedTime}`;
    }
}