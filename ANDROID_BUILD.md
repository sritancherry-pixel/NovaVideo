# NovaVideo AI — Android APK build

## 1. Configure the backend
The APK must call a publicly reachable NovaVideo backend. Open `public/config.js` and set:

```js
window.NOVAVIDEO_API_BASE = "https://YOUR-BACKEND-DOMAIN";
```

Do **not** put your Gemini/Veo API key in the Android app.

## 2. Install dependencies

```bash
npm install
```

## 3. Add Android project

```bash
npx cap add android
npx cap sync android
```

## 4. Build a debug APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be at:

`android/app/build/outputs/apk/debug/app-debug.apk`

## 5. Install on an Android phone

Enable developer options/USB debugging, connect the phone, then:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or copy the APK to the phone and open it.

## Important
This project contains the Android wrapper and the existing Veo backend. A production APK still needs the backend deployed on a public HTTPS server. The Google Gemini/Veo API key must remain on that backend.
