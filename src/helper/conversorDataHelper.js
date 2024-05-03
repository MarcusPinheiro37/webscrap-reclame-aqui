export default function converteData(data){
    const [datePart, timePart] = data.split(' às ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    const dateObj = new Date(year, month - 1, day, hours -3, minutes);
    return dateObj;
}