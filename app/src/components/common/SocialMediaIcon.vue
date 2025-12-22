<template>
  <a
    :href="url"
    :aria-label="ariaLabel"
    class="p-button p-button-text p-button-rounded flex items-center gap-2"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span
      class="inline-flex items-center justify-center"
      :style="{ width: '1.25rem', height: '1.25rem' }"
    >
      <component :is="iconComponent" class="w-5 h-5" />
    </span>
    <span class="text-sm">{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SocialIcon = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'tiktok';

const props = defineProps<{
  icon: SocialIcon;
  url: string;
  label?: string; // Optional custom label; defaults to icon name capitalized
}>();

const defaultLabelMap: Record<SocialIcon, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

const label = computed(() => props.label ?? defaultLabelMap[props.icon]);
const ariaLabel = computed(() => `${label.value} Profile`);

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'linkedin':
      return LinkedInIcon;
    case 'twitter':
      return TwitterIcon;
    case 'facebook':
      return FacebookIcon;
    case 'instagram':
      return InstagramIcon;
    case 'tiktok':
      return TikTokIcon;
    default:
      return LinkedInIcon;
  }
});

/**
 * Inline SVG icons. You can replace these with PrimeIcons (pi pi-*) or an icon library if preferred.
 */
const LinkedInIcon = {
  name: 'LinkedInIcon',
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433A2.062 2.062 0 113.274 5.37a2.064 2.064 0 012.063 2.064zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>`,
};

const TwitterIcon = {
  name: 'TwitterIcon',
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996A4.107 4.107 0 0011.85 8.035a11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>`,
};

const FacebookIcon = {
  name: 'FacebookIcon',
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333c0-.955.192-1.333 1.115-1.333H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>`,
};

const InstagramIcon = {
  name: 'InstagramIcon',
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465A4.902 4.902 0 014.962 18.2a4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm4.5-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>`,
};

const TikTokIcon = {
  name: 'TikTokIcon',
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.98-6.42-2.98-2.09-2.68-2.3-6.27-1.02-9.51.52-1.36 1.34-2.58 2.4-3.55 1.09-1.01 2.37-1.73 3.8-2.12.16-.04.33-.06.5-.07.02 2.82.01 5.63-.01 8.45-.08 1.33-.56 2.63-1.35 3.69-1.02 1.35-2.73 2.12-4.43 1.96-1.57-.14-3.03-.9-4.1-2.04-1.05-1.12-1.6-2.57-1.6-4.13-.01-1.57.56-3.12 1.56-4.27 1.09-1.25 2.65-2.03 4.3-2.02.1-.01.21-.01.31-.01v-4.11c-2.18.23-4.26 1.02-5.99 2.27-1.92 1.39-3.26 3.42-3.8 5.72-.59 2.55-.42 5.33.51 7.75 1.59 4.24 5.36 7.15 9.94 7.25 4.57.1 8.95-2.22 11.22-6.02.69-1.15 1.16-2.41 1.39-3.73.07-.4.12-.81.16-1.21.08-1.07.11-2.14.11-3.21.01-3.2-.01-6.4.01-9.6.01-.09.02-.18.04-.27z"/></svg>`,
};
</script>

<style scoped>
/* Subtle hover emphasis */
a:hover .w-5,
a:focus .w-5 {
  filter: brightness(1.1);
}
</style>
