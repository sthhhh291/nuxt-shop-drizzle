# Tailwind CSS & Nuxt UI Configuration Guide

## ✅ What's Configured

### **Tailwind CSS Setup:**
- ✅ **Nuxt UI Module** - Already installed (`@nuxt/ui` v4.0.1)
- ✅ **Tailwind CSS** - Comes built-in with Nuxt UI
- ✅ **Custom Tailwind Config** - `tailwind.config.ts` created with:
  - Custom color palette (primary, secondary)
  - Custom animations (fade-in, slide-up, bounce-subtle)
  - Inter font family
  - Extended content paths

### **CSS Configuration:**
- ✅ **Tailwind Directives** - Added to `app/assets/main.css`:
  ```css
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';  
  @import 'tailwindcss/utilities';
  ```
- ✅ **Existing Styles Preserved** - Your custom CSS remains intact

### **Nuxt Configuration:**
- ✅ **Color Mode** - Set to light preference
- ✅ **Module Registration** - `@nuxt/ui` in modules array
- ✅ **Development Server** - Running on http://localhost:3001

## 🎨 Available Components

### **1. TailwindCard Component** (`/app/components/TailwindCard.vue`)
A modern card component using Tailwind classes:

```vue
<!-- Basic Usage -->
<TailwindCard title="My Card" variant="default">
  <p>Content goes here</p>
</TailwindCard>

<!-- Advanced Usage -->
<TailwindCard 
  title="Advanced Card" 
  variant="elevated" 
  size="lg"
  :clickable="true"
  @click="handleClick"
>
  <template #actions>
    <UButton size="xs">Edit</UButton>
  </template>
  <p>Content</p>
  <template #footer>
    <span>Footer content</span>
  </template>
</TailwindCard>
```

**Available Props:**
- `variant`: 'default' | 'outlined' | 'elevated' | 'flat'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `clickable`: boolean
- `disabled`: boolean
- Custom classes for header, content, footer

### **2. Enhanced Button Component** (`/app/components/Button.vue`)
Updated with Tailwind styling:

```vue
<!-- Different Variants -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

<!-- With Icons -->
<Button icon="i-heroicons-plus-20-solid">Add Item</Button>
<Button trailing-icon="i-heroicons-arrow-right-20-solid">Continue</Button>

<!-- Different Sizes -->
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## 🚀 Nuxt UI Components Available

With `@nuxt/ui` installed, you have access to:

### **Form Components:**
- `<UInput>` - Text inputs
- `<UTextarea>` - Text areas
- `<USelect>` - Select dropdowns
- `<UForm>` - Form wrapper
- `<UFormGroup>` - Form field groups

### **Feedback Components:**
- `<UBadge>` - Status badges
- `<UAlert>` - Alert messages
- `<UNotification>` - Toast notifications

### **Navigation:**
- `<UButton>` - Buttons
- `<ULink>` - Links
- `<UDropdown>` - Dropdown menus

### **Data Display:**
- `<UCard>` - Cards
- `<UTable>` - Data tables
- `<UAvatar>` - User avatars

### **Layout:**
- `<UContainer>` - Content containers
- `<UDivider>` - Section dividers

### **Icons:**
- `<UIcon>` - Icon component
- Access to Heroicons by default
- Icon names: `i-heroicons-[icon-name]-[variant]`

## 📱 Demo Pages

### **1. Tailwind Demo** - `/tailwind-demo`
- Comprehensive showcase of TailwindCard component
- Integration examples with Nuxt UI components
- Form examples, stats cards, product cards
- Code snippets and usage examples

### **2. Original Card Demo** - `/card-demo`
- Original Card component examples
- Custom CSS implementation

## 🎯 Usage Examples

### **Tailwind Utility Classes:**
```vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">
      Welcome to Your Shop
    </h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TailwindCard 
        v-for="product in products" 
        :key="product.id"
        :title="product.name"
        variant="default"
        :clickable="true"
        @click="viewProduct(product)"
        class="hover:shadow-lg transition-shadow"
      >
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-green-600">
            {{ formatPrice(product.price) }}
          </span>
          <UBadge 
            :color="product.inStock ? 'success' : 'error'"
            variant="soft"
          >
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </UBadge>
        </div>
      </TailwindCard>
    </div>
  </div>
</template>
```

### **Responsive Design:**
```vue
<div class="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-5 
  gap-4 
  p-4
">
  <!-- Cards adapt to screen size -->
</div>
```

### **Custom Colors:**
```vue
<div class="bg-primary-500 text-white p-6 rounded-lg">
  <h2 class="text-secondary-100">Using custom colors</h2>
</div>
```

## 🔧 Customization

### **Extending Tailwind Config:**
Edit `tailwind.config.ts` to add:
- Custom colors
- Custom spacing
- Custom fonts
- Custom animations
- Additional utility classes

### **Component Styling:**
- Use Tailwind utility classes in templates
- Combine with scoped CSS for complex styles
- Leverage Nuxt UI component props for consistent theming

## 📝 Migration Tips

### **Converting Existing Components:**
1. Replace custom CSS with Tailwind utility classes
2. Use Nuxt UI components where appropriate
3. Maintain functionality while improving consistency
4. Test responsive behavior

### **Color Scheme:**
- Your existing green theme is preserved in custom colors
- Use `bg-emerald-*` classes for green elements
- Primary color scheme uses blue tones
- Secondary uses gray tones

## 🌐 Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Nuxt UI Docs**: https://ui.nuxt.com/
- **Heroicons**: https://heroicons.com/
- **Color Palette**: https://tailwindcss.com/docs/customizing-colors

Your shop application now has a complete design system with Tailwind CSS and Nuxt UI! 🎉