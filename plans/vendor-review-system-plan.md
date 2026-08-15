# Vendor Review & Rating System - Implementation Plan

## Overview
Add systematic vendor review and rating capabilities to help couples track vendor satisfaction and make data-driven decisions.

## Requirements
- Multi-dimensional rating system (quality, professionalism, value, communication)
- Per-vendor review tracking with notes and timestamps
- Integration with existing vendor comparison and management
- Vietnamese/English i18n support
- CSV export for reviews

## Architecture

### Data Model Extensions
```typescript
interface VendorReview {
  id: number;
  vendorId: number;
  vendorName: string;  // Denormalized
  overallRating: number;  // 1-5 stars
  ratings: {
    quality: number;      // Service quality
    professionalism: number;  // Professional conduct
    value: number;         // Value for money
    communication: number;  // Responsiveness
  };
  notes: string;
  reviewDate: string;  // YYYY-MM-DD
  createdAt: string;  // ISO timestamp
}
```

### Files to Create
1. `src/components/vendor-reviews/vendor-review-form.tsx` - Add/edit review form
2. `src/components/vendor-reviews/vendor-review-list.tsx` - Display all reviews for a vendor
3. `src/components/vendor-reviews/vendor-review-summary.tsx` - Rating summary card
4. `src/components/vendor-reviews/vendor-rating-stars.tsx` - Star rating component
5. `src/components/vendor-reviews/export-reviews-button.tsx` - CSV export functionality

### Files to Modify
1. `src/types/wedding.ts` - Add VendorReview interface and reviews field to WeddingState
2. `src/hooks/use-wedding-store.ts` - Add review CRUD methods
3. `src/pages/vendor-comparison-page.tsx` - Integrate review summaries
4. `src/pages/vendor-page.tsx` - Add review management section
5. `src/lib/i18n.ts` - Add review-related translation keys
6. `src/data/nav-sections.ts` - Ensure routing covers new features

## Implementation Steps

1. **Update Types** - Add VendorReview interface and update WeddingState
2. **Store Methods** - Implement addReview, updateReview, deleteReview, getVendorReviews
3. **Star Rating Component** - Reusable 5-star rating input/display
4. **Review Form** - Multi-dimensional rating with notes
5. **Review List** - Show all reviews per vendor with edit/delete
6. **Review Summary** - Aggregate display with average ratings
7. **Integration** - Add to vendor comparison and individual vendor pages
8. **i18n Updates** - Add Vietnamese/English keys for all review UI
9. **Export Feature** - CSV export of all reviews with vendor data

## Success Criteria
- Can add reviews to any vendor
- Reviews persist in localStorage via wedding store
- Star ratings work interactively
- Vietnamese/English fully supported
- Export produces valid CSV
- No TypeScript errors
- Build passes cleanly

## Notes
- Reuses existing star rating patterns from astrology compatibility
- Follows component structure pattern from budget/gift pages
- Minimal state schema change (backward compatible)
