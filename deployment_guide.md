# Deployment Guide: Gupta Dental Care

Since your website is built with HTML, CSS, and Javascript (static site), you can host it for free on several high-performance platforms. **Cloudinary will work perfectly** on these platforms because it handles all the heavy lifting in the cloud.

Here are the top 3 recommended ways to deploy:

---

## 1. Netlify (Easiest - Drag & Drop)
This is the fastest way to get your site online in under 60 seconds.
1.  Go to [Netlify.com](https://www.netlify.com/) and sign up for a free account.
2.  Once logged in, go to the **Sites** tab.
3.  Find the area that says **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"**.
4.  Drag your entire project folder (`Gupta-Dental-Care-main`) into that box.
5.  Wait a few seconds, and Netlify will give you a live URL (e.g., `gupta-dental.netlify.app`).

---

## 2. Vercel Deployment (Recommended) - Step by Step

Vercel is the best platform for performance. Here is exactly how to do it:

### Option A: Using the Vercel Dashboard (No Coding)
1.  **GitHub Upload**: If you haven't yet, upload your code to a GitHub repository.
2.  **Login**: Go to [Vercel.com](https://vercel.com/) and login with your GitHub account.
3.  **Import**: Click **"Add New"** > **"Project"**.
4.  **Select Repo**: Select your `Gupta-Dental-Care` repository.
5.  **Deploy**: Deep keep everything as default and click **"Deploy"**.

### Option B: Using the Vercel CLI (From your Computer)
1.  **Install**: Open your terminal and run: `npm i -g vercel`
2.  **Login**: Run: `vercel login` (Follow the browser instructions).
3.  **Deploy**: Run: `vercel` inside your project folder.
4.  **Settings**:
    *   *Set up and deploy?* Yes
    *   *Which scope?* (Your name)
    *   *Link to existing project?* No
    *   *What's the project's name?* `gupta-dental`
    *   *Which directory?* `./`
    *   *Want to modify settings?* No
5.  **Go Live**: Run `vercel --prod` to get your final live URL.

---

## 2.1 वर्सेल (Vercel) पर कैसे डिप्लॉय करें (Hindi Guide)

1.  **GitHub पर डालें**: सबसे पहले अपने कोड को GitHub पर अपलोड करें।
2.  **Vercel लॉगिन**: [Vercel.com](https://vercel.com/) पर जाएं और अपने GitHub अकाउंट से लॉगिन करें।
3.  **प्रोजेक्ट जोड़ें**: **"Add New"** बटन दबाएं और **"Project"** चुनें।
4.  **रिपोजिटरी चुनें**: अपनी `Gupta-Dental-Care` वाली रिपोजिटरी को सिलेक्ट करें।
5.  **डिप्लॉय (Deploy)**: बिना कोई सेटिंग बदले **"Deploy"** बटन पर क्लिक करें।
6.  आपका वेबसाइट 1 मिनट में लाइव हो जाएगा!

---

## 3. GitHub Pages (Best for Version Control)
If you already have your code on GitHub, this is a great free choice.
1.  Go to your GitHub repository **Settings**.
2.  Click **Pages** on the left sidebar.
3.  Under **Build and deployment**, select "Deploy from a branch".
4.  Select your `main` branch and the root folder `/`.
5.  Click **Save**. Your site will be live at `yourusername.github.io/yourproject`.

---

## 4. Why this works with Cloudinary
*   **Static but Dynamic**: Even though your hosting is "static", Cloudinary provides a "backend as a service". 
*   **Browser-Direct Uploads**: Your `admin.js` sends images directly to Cloudinary from the user's browser.
*   **CORS Friendly**: Cloudinary supports CORS (Cross-Origin Resource Sharing), so your site can safely communicate with it from any URL.

> [!IMPORTANT]
> **A Note on Security:**
> Since you are using "Unsigned Uploads", anyone who finds your `uploadPreset` and `cloudName` in your Javascript code could technicaly upload images to your Cloudinary account. 
> To prevent abuse, you can go to your **Cloudinary Security Settings** and add your live website URL to the **"Allowed hostnames for unsigned uploads"** list once you have deployed.

---

## 5. Clean URL Structure

Pages use folder-based URLs (no `.html` in the address bar):

| Page | URL |
|------|-----|
| Home | `/` |
| Booking | `/booking/` |
| Symptom Checker | `/symptoms/` |
| Gallery | `/gallery/` |
| Admin Login | `/login/` |

Old `.html` links (e.g. `booking.html`) automatically redirect to the clean URLs.

Clinic photos are stored in `assets/clinic-photos/`. Replace `assets/images/doctor.jpg` with a real portrait of Dr. Gupta when available.
