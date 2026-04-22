'use client';

// Analytics is disabled. All functions are no-ops.

const noop = () => {};

export function useAnalytics() {
  return {
    trackEvent: noop,
    trackPropertyView: noop,
    trackContactSubmit: noop,
    trackFavoriteAdd: noop,
    trackFavoriteRemove: noop,
    trackSearch: noop,
    trackUserRegister: noop,
    trackUserLogin: noop,
    trackQuoteRequest: noop,
  };
}
