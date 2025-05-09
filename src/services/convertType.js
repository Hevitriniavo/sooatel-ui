export const convertType = (type) => {
    const names = {
        room: 'Chambre',
        table: 'Table'
    }
    return names[type]
}