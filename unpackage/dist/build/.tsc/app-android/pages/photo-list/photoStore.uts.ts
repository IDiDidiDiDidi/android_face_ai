export type FacePhotoRecord = {
	id: string
	createdAt: number
	imagePath: string
	imageBase64: string
	matched: boolean
	faceName: string
	faceScore: number
}

const PHOTO_STORAGE_KEY = 'face_search_photo_records'

function toFacePhotoRecord(item: UTSJSONObject): FacePhotoRecord {
	return {
		id: item.getString('id') ?? '',
		createdAt: item.getNumber('createdAt') ?? 0,
		imagePath: item.getString('imagePath') ?? '',
		imageBase64: item.getString('imageBase64') ?? '',
		matched: item.getBoolean('matched') ?? false,
		faceName: item.getString('faceName') ?? '',
		faceScore: item.getNumber('faceScore') ?? 0,
	} as FacePhotoRecord
}

function parsePhotoRecords(raw: string): FacePhotoRecord[] {
	if (raw.length == 0) {
		return [] as FacePhotoRecord[]
	}
	try {
		const parsed = JSON.parse(raw)
		if (parsed == null || !Array.isArray(parsed)) {
			return [] as FacePhotoRecord[]
		}

		const records = [] as FacePhotoRecord[]
		for (const item of parsed) {
			if (item instanceof UTSJSONObject) {
				records.push(toFacePhotoRecord(item))
			}
		}
		return records
	} catch (e) {
		console.error('parsePhotoRecords failed', e)
		return [] as FacePhotoRecord[]
	}
}

export function getAllFacePhotoRecords(): FacePhotoRecord[] {
	const raw = uni.getStorageSync(PHOTO_STORAGE_KEY)
	if (typeof raw == 'string') {
		return parsePhotoRecords(raw)
	}
	return [] as FacePhotoRecord[]
}

export function saveFacePhotoRecord(
	imagePath: string,
	imageBase64: string,
	matched: boolean,
	faceName: string,
	faceScore: number
): void {
	if (imagePath.length == 0 && imageBase64.length == 0) {
		return
	}

	const records = getAllFacePhotoRecords()
	records.unshift({
		id: `${Date.now()}_${Math.random()}`,
		createdAt: Date.now(),
		imagePath,
		imageBase64,
		matched,
		faceName,
		faceScore,
	} as FacePhotoRecord)

	uni.setStorageSync(PHOTO_STORAGE_KEY, JSON.stringify(records))
}
