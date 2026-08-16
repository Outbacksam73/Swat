import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * PayPal Hosted Buttons React component
 *
 * This component reads the PayPal client id from the environment variable
 * NEXT_PUBLIC_PAYPAL_CLIENT_ID by default. You can also pass a clientId prop
 * to override the env var at runtime.
 *
 * Usage:
 * <PayPalHostedButton hostedButtonId="NLQQ5LW3Q38T6" />
 *
 * For Next.js: import dynamically with { ssr: false } to ensure no SSR.
 */

function loadPayPalSdk({ clientId, components = 'hosted-buttons', currency = 'USD' }) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'));

  const effectiveClientId = clientId || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) || '';
  if (!effectiveClientId) return Promise.reject(new Error('PayPal clientId missing. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID or pass clientId prop.'));

  const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
    effectiveClientId
  )}&components=${encodeURIComponent(components)}&currency=${encodeURIComponent(currency)}`;

  // Deterministic id so multiple components reuse the same script element
  const scriptId = `paypal-sdk-${effectiveClientId}`;

  const existing = document.getElementById(scriptId);
  if (existing) {
    if (window.paypal) return Promise.resolve(window.paypal);
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.paypal));
      existing.addEventListener('error', (e) => reject(e));
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.id = scriptId;
    s.src = src;
    s.async = true;
    s.addEventListener('load', () => resolve(window.paypal));
    s.addEventListener('error', (e) => reject(e));
    document.body.appendChild(s);
  });
}

export default function PayPalHostedButton({
  hostedButtonId,
  clientId,
  currency = 'USD',
  className,
  style,
  onError,
}) {
  const containerIdRef = useRef(`paypal-container-${Math.random().toString(36).slice(2, 9)}`);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!hostedButtonId) {
      const err = new Error('PayPal hostedButtonId is required');
      if (onError) onError(err);
      else console.warn(err);
      return;
    }

    if (typeof window === 'undefined') return;

    let mounted = true;

    loadPayPalSdk({ clientId, currency })
      .then((paypal) => {
        if (!mounted) return;
        if (!paypal || !paypal.HostedButtons) {
          const err = new Error('PayPal HostedButtons component not available on the loaded SDK.');
          if (onError) onError(err);
          else console.warn(err);
          return;
        }

        if (!renderedRef.current) {
          try {
            paypal.HostedButtons({ hostedButtonId }).render(`#${containerIdRef.current}`);
            renderedRef.current = true;
          } catch (e) {
            if (onError) onError(e);
            else console.warn('Failed to render PayPal HostedButtons', e);
          }
        }
      })
      .catch((e) => {
        if (onError) onError(e);
        else console.warn('Failed to load PayPal SDK', e);
      });

    return () => {
      mounted = false;
      const el = document.getElementById(containerIdRef.current);
      if (el) el.innerHTML = '';
      renderedRef.current = false;
    };
  }, [hostedButtonId, clientId, currency, onError]);

  return (
    <div>
      <div id={containerIdRef.current} className={className} style={style} />
    </div>
  );
}

PayPalHostedButton.propTypes = {
  hostedButtonId: PropTypes.string.isRequired,
  clientId: PropTypes.string,
  currency: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onError: PropTypes.func,
};
