import type { BusinessArea } from '@/types/businessArea';

/**
 * ISIC Rev.4 business area sections.
 */
export const businessAreaOptions: BusinessArea[] = [
	{ name: 'Agriculture, forestry and fishing', code: 'A' },
	{ name: 'Mining and quarrying', code: 'B' },
	{ name: 'Manufacturing', code: 'C' },
	{ name: 'Electricity, gas, steam and air conditioning supply', code: 'D' },
	{
		name: 'Water supply; sewerage, waste management and remediation activities',
		code: 'E',
	},
	{ name: 'Construction', code: 'F' },
	{
		name: 'Wholesale and retail trade; repair of motor vehicles and motorcycles',
		code: 'G',
	},
	{ name: 'Transportation and storage', code: 'H' },
	{ name: 'Accommodation and food service activities', code: 'I' },
	{ name: 'Information and communication', code: 'J' },
	{ name: 'Financial and insurance activities', code: 'K' },
	{ name: 'Real estate activities', code: 'L' },
	{ name: 'Professional, scientific and technical activities', code: 'M' },
	{ name: 'Administrative and support service activities', code: 'N' },
	{
		name: 'Public administration and defence; compulsory social security',
		code: 'O',
	},
	{ name: 'Education', code: 'P' },
	{ name: 'Human health and social work activities', code: 'Q' },
	{ name: 'Arts, entertainment and recreation', code: 'R' },
	{ name: 'Other service activities', code: 'S' },
	{
		name: 'Activities of extraterritorial organisations and bodies',
		code: 'T',
	},
	{
		name: 'Activities of households as employers; undifferentiated goods- and services-producing activities of households for own use',
		code: 'U',
	},
];
