# Vrindavan CMS Development Guide

## Architecture Overview

This is a React-based CMS for managing e-commerce content (categories, products, banners, portfolios, testimonials). The app follows a centralized layout pattern where all authenticated pages use `<Layout view={<Component />} />` wrapper from `src/Layout/index.jsx`.

### Key Architectural Patterns

**Route Structure**: All routes in `src/App.js` follow the pattern:
```jsx
{ path: "/categories/new", component: <Layout view={<CategoryForm />} /> }
```

**Context-Based State Management**: 
- `NotificationContext` provides global notifications via `setNotificationState({ type: "success|error", message: "...", show: true })`
- `WindowWidthContext` provides responsive mobile detection (`isMobile` boolean)

**Form Handling**: All forms use `react-hook-form` with consistent patterns:
- `useForm()` for basic forms
- `Controller` component for custom inputs (Switch, MarkDownInput, ColorPicker)
- Form submission always includes loading states and error handling via NotificationContext

## Critical Development Workflows

**Environment Variables Required**:
```
REACT_APP_API=<backend_api_url>
REACT_APP_CLOUDINARY_NAME=<cloudinary_cloud_name>
REACT_APP_CLOUDINARY_API_KEY=<cloudinary_api_key>
REACT_APP_CLOUDINARY_SECRET=<cloudinary_api_secret>
REACT_APP_CLOUDINARY_PRESET=<cloudinary_upload_preset>
```

**Development Commands**:
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project-Specific Conventions

**Image Management**: All image uploads use Cloudinary with specific folder structure:
```javascript
// For categories: folder: `categories/${data.slug}/`
// For testimonials: folder: `testimonials/${data.slug}/cover/` (cover images)
// For testimonials: folder: `testimonials/${data.slug}/` (gallery images)
```

**Slug Generation**: Consistently generated from titles: `data.slug = data.title.toLowerCase().replace(/ /g, "-")`

**Image Display**: Use `getImageUrl(publicId, isMobile)` from `src/utils.js` for responsive Cloudinary images. Mobile version automatically scales to 400px width.

**Authentication Flow**: 
- Token stored in `localStorage.getItem("token")`
- Automatic redirect to `/login` if no token
- Axios interceptors handle 401 responses globally

**Services Pattern**: All API calls in `src/services.js` return Promises with consistent error handling:
```javascript
export const functionName = (data) => {
  return new Promise((resolve, reject) => {
    instance.method(endpoint, data)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
```

## Component Patterns

**Form Components**: 
- Always import `NotificationContext` and `WindowWidthContext` from `../../Layout`
- Use `Breadcrumb` component for navigation context
- Include `LoaderSvg` in submit buttons with loading states
- Error handling pattern: `setNotificationState({ type: "error", message: err.response?.data?.error?.message || err.message, show: true })`

**List Components**: Use consistent card-based layouts with delete confirmations via `ConfirmDialog` component

**File Uploads**: 
- Multiple image handling with preview and removal functionality
- Use `URL.createObjectURL()` for previews, always call `URL.revokeObjectURL()` on cleanup
- Differential upload logic: only upload new files, preserve existing images by comparing arrays

## Integration Points

**Cloudinary Integration**: 
- Upload via `uploadToCloudinary(formData)` 
- Delete via `removeFromCloudinary(public_ids_array)`
- Images organized by content type and slug-based folders

**Backend Communication**: All API endpoints use JWT authentication via `x-access-token` header

**Styling**: TailwindCSS with HeadlessUI components (Switch, Dialog, Disclosure). Custom classes in `src/utils.js` `classNames()` helper.

## Current Development Status

Based on `README.md` TODO list:
- Bulk price change UI partially implemented (`src/Pages/Categories/BulkChange.jsx`)
- Testimonials feature implemented but routes show "Coming soon..." placeholder
- Missing: Orders & Payments, User management, Category-wise banners

When implementing new features, follow the established patterns in existing components like `TestimonialForm.jsx` or `CategoryForm.jsx` for consistency.
