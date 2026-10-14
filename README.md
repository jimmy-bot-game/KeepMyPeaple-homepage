# Keep My People homepage

Public site for the Keep My People Android app. It is a separate repository from the Flutter app.

The pages describe only features that exist in the app: mutual-consent group location, chat, meetup posts, saved places, alerts, SOS, history, and Premium. The iOS app is marked as in development. There is no review carousel and no extra product tier.

## Pages

| Path | Use |
| --- | --- |
| `/` | Product overview and plans |
| `/how-to/` | Setup and daily use |
| `/privacy/` | Privacy Policy |
| `/terms/` | Terms of Use |
| `/location/` | Location Services Terms |
| `/delete-account/` | Account deletion steps for Google Play |

Suggested Play Console URLs, after GitHub Pages is enabled:

- Privacy policy: `https://jimmy-bot-game.github.io/KeepMyPeaple-homepage/privacy/`
- Account deletion: `https://jimmy-bot-game.github.io/KeepMyPeaple-homepage/delete-account/`

## Local preview

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.
