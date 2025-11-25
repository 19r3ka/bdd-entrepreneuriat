import type { Business } from '@/types/business';

/**
 * Default initial values for a Business form.
 */
export const initialBusiness: Business = {
	id: '', // optional, empty until persisted
	entrepreneurId: '', // required UUID, empty until selected
	name: '', // required string
	location: {
		longitude: null, // required number, null until filled
		latitude: null, // required number, null until filled
	},
	contact: {
		email: '', // required string
		telephone: '', // required string
	},
	primaryBusinessArea: '', // required string
	secondaryBusinessArea: '', // optional string
	socialMedia: {
		linkedin: '',
		twitter: '',
		facebook: '',
		instagram: '',
	},
	registrationNumber: '', // optional string
	registrationDate: null, // optional date
	activityStartDate: null, // required date
	supportStartDate: null, // required date
	avatar: null, // optional, can be File or string later
};
