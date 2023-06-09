export function isBlank(str) {
	return str == null || str.trim() === ''
}

export function isNotBlank(str) {
	return !isBlank(str)
}

export function removeAllAccents(str) {
	if (typeof str === 'string') {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	}
	return str
}