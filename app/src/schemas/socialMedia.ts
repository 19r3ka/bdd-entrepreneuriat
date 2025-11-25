import { z } from 'zod';
import i18n from '@/i18n';

const t = i18n.global.t;

// export const SocialMediaSchema = z.object({
// 	linkedin: optionalString(z.url({ message: t('validation.url') })),
// 	twitter: optionalString(z.url({ message: t('validation.url') })),
// 	facebook: optionalString(z.url({ message: t('validation.url') })),
// 	tiktok: optionalString(z.url({ message: t('validation.url') })),
// 	instagram: optionalString(z.url({ message: t('validation.url') })),
// });

export const SocialMediaSchema = z.object({
	linkedin: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
	twitter: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
	facebook: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
	tiktok: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
	instagram: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
	website: z
		.url({ message: t('validation.url') })
		.optional()
		.catch(''),
});
