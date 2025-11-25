import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import LocationCard from '@/components/common/LocationCard.vue';

describe('LocationCard.vue', () => {
  it('renders with default title when no title is provided', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
      },
    });

    // Should use the default translation for location
    expect(wrapper.text()).toContain('Location');
  });

  it('renders with custom title when provided', () => {
    const customTitle = 'Business Location';
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        title: customTitle,
        address: '123 Main St',
      },
    });

    expect(wrapper.text()).toContain(customTitle);
  });

  it('displays address correctly', () => {
    const address = '123 Main St, New York, NY 10001';
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address,
      },
    });

    expect(wrapper.text()).toContain(address);
  });

  it('shows "Not Available" when address is empty', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '',
      },
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('renders map preview with default image when no map image is provided', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
      },
    });

    // Should render a map div with default placeholder image
    const mapDiv = wrapper.find('.w-full.h-10rem');
    expect(mapDiv.exists()).toBe(true);
    
    // Check for default placeholder
    expect(mapDiv.attributes('style')).toContain('via.placeholder.com');
  });

  it('renders map preview with provided image', () => {
    const mapImage = 'https://maps.example.com/image.jpg';
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
        mapImage,
      },
    });

    const mapDiv = wrapper.find('.w-full.h-10rem');
    expect(mapDiv.attributes('style')).toContain(mapImage);
  });

  it('has correct CSS classes and structure', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
        mapImage: 'https://example.com/map.jpg',
      },
    });

    // Check for PrimeVue card classes
    expect(wrapper.classes()).toContain('shadow-2');
    expect(wrapper.classes()).toContain('mb-4');
    
    // Check for grid layout
    expect(wrapper.find('.grid').exists()).toBe(true);
    
    // Check for map div classes
    const mapDiv = wrapper.find('.w-full.h-10rem');
    expect(mapDiv.classes()).toContain('border-round');
    expect(mapDiv.classes()).toContain('bg-cover');
    expect(mapDiv.classes()).toContain('bg-center');
  });

  it('renders location icon', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
      },
    });

    // Check for the location icon
    expect(wrapper.find('.pi-map-marker').exists()).toBe(true);
    expect(wrapper.find('.pi-map-marker').classes()).toContain('text-xl');
    expect(wrapper.find('.pi-map-marker').classes()).toContain('text-500');
  });

  it('has proper accessibility attributes', () => {
    const title = 'Location Card';
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        title,
        address: '123 Main St',
      },
    });

    // Check for aria-label on the card
    expect(wrapper.attributes('aria-label')).toBe(title);
    
    // Check for aria-label on the map
    expect(wrapper.find('.w-full.h-10rem').attributes('aria-label')).toBe('Map Preview');
  });

  it('has responsive grid layout', () => {
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address: '123 Main St',
        mapImage: 'https://example.com/map.jpg',
      },
    });

    // Check for responsive column classes
    const addressCol = wrapper.find('.col-12.md\\:col-6');
    expect(addressCol.exists()).toBe(true);
    
    const mapCol = wrapper.findAll('.col-12.md\\:col-6')[1];  // Second one
    expect(mapCol.exists()).toBe(true);
  });

  it('renders address with proper typography classes', () => {
    const address = '123 Main St';
    const wrapper = mountWithGlobalComponents(LocationCard, {
      props: {
        address,
      },
    });

    const addressText = wrapper.find('p.text-lg');
    expect(addressText.exists()).toBe(true);
    expect(addressText.classes()).toContain('text-900');
    expect(addressText.classes()).toContain('line-height-3');
    expect(addressText.text()).toBe(address);
  });
});