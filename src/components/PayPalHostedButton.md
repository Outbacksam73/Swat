# PayPalHostedButton

Small README and usage examples for the PayPalHostedButton React component.

## Purpose
This component safely loads the PayPal JS SDK on the client and renders a PayPal Hosted Button. It is safe to include in Next.js or CRA projects because it only touches `window` at runtime in the browser.

## File
src/components/PayPalHostedButton.jsx

## Environment variable
By default the component reads the public client id from:

- NEXT_PUBLIC_PAYPAL_CLIENT_ID

Set this in your environment for development and in your hosting dashboard (Netlify/Vercel) for production.

Example (.env.local):

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_public_client_id_here
```

> Note: This is a _public_ client id used by the browser. Do not put server-side secrets in client code.

## Props
- hostedButtonId (string) — required. Example: `NLQQ5LW3Q38T6`.
- clientId (string) — optional. If provided, overrides the environment variable.
- currency (string) — optional, default `USD`.
- className / style — forwarded to the container.
- onError (func) — optional callback for errors.

## Usage examples

### Next.js (recommended)
Use dynamic import to avoid SSR issues:

```js
import dynamic from 'next/dynamic';

const PayPalHostedButton = dynamic(() => import('../components/PayPalHostedButton'), { ssr: false });

export default function Page() {
  return <PayPalHostedButton hostedButtonId="NLQQ5LW3Q38T6" />;
}
```

Make sure you have NEXT_PUBLIC_PAYPAL_CLIENT_ID set in `.env.local` or your deploy environment.

### Create React App / plain React

```js
import PayPalHostedButton from './components/PayPalHostedButton';

function App(){
  return <PayPalHostedButton hostedButtonId="NLQQ5LW3Q38T6" />;
}
```

If you prefer CRA env var naming (`REACT_APP_PAYPAL_CLIENT_ID`), pass it explicitly:

```js
<PayPalHostedButton hostedButtonId="NLQQ5LW3Q38T6" clientId={process.env.REACT_APP_PAYPAL_CLIENT_ID} />
```

## Troubleshooting
- If the component logs "PayPal HostedButtons component not available" make sure the SDK loaded correctly and that the `components=hosted-buttons` query param is present.
- If using Next.js and you see an SSR/build error, ensure you imported the component dynamically with `ssr: false`.
- For Netlify/Vercel, set the environment variable in site/project settings and redeploy.

## License / Notes
This file is a small usage guide for the component committed in this branch. If you'd like an example page added to the repo or a spinner/loading UI while the SDK loads, I can add that too.
