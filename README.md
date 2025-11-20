# SensorEvolve - Main Landing Page

This is the main GitHub Pages site for SensorEvolve, hosting our app support resources and AdMob verification.

## Live Site

**Main Landing:** https://sensorevolve.github.io

## Purpose

1. **App-ads.txt Verification** - Hosts `app-ads.txt` for Google AdMob verification across all our apps
2. **Landing Page** - Central hub linking to all app support sites
3. **Project Pages** - Organizes support sites as subdirectories

## Structure

```
sensorevolve.github.io (this repository)
├── app-ads.txt          # AdMob verification for all apps
├── index.html           # Main landing page
└── README.md            # This file

Project Pages (separate repositories):
├── /arc_helper_support  # Arc Helper app support site
└── /[future-apps]       # Future app support sites
```

## Apps

### Arc Helper
**Support Site:** https://sensorevolve.github.io/arc_helper_support
**App Store:** https://apps.apple.com/app/arc-helper/id6738267827

Companion app for Arc Raiders featuring:
- Weapons database (30+ weapons)
- Enemy bestiary (15 ARC types)
- Interactive maps with zoom
- Skills system (45 skills)
- Quest tracker (63 quests)
- Crafting guides

## Adding New Apps

To add a new app support site:

1. Create a new repository with your app name (e.g., `new_app_support`)
2. Add your support site content
3. Enable GitHub Pages: Settings → Pages → Source: main branch
4. Your site will be available at: `https://sensorevolve.github.io/new_app_support`
5. Update `index.html` in this repository to add a link to the new app

## AdMob Publisher IDs

The `app-ads.txt` file contains publisher IDs for:
- Arc Helper: `pub-8324308267022547`

To add more apps, add new lines to `app-ads.txt`:
```
google.com, pub-YOUR-NEW-PUBLISHER-ID, DIRECT, f08c47fec0942fa0
```

## License

Each app and support site has its own licensing.

## Contact

For support inquiries, visit the individual app support pages.

---

© 2025 SensorEvolve