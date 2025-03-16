export default function getKeywords(string) {
    const keywords = string
        .replace("/", "")
        .replace('"', " ")
        .replace("'", " ")
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z ]/g, '')
        .toLowerCase()
        .split(' ')
        .filter(item => item.length > 0);
    return (keywords);
}