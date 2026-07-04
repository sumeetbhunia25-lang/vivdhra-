# 🏺 VIVIDHRA Atelier AI Catalog Expansion Manual

Welcome to the **VIVIDHRA Atelier AI Catalog Expansion Manual**. This guide provides instructions for designers, admins, and developers on how to leverage the server-side **Gemini 3.5 Flash** AI image parsing tool to add new clothing designs to the storefront catalog, manage listings, and securely persist them via Git/GitHub.

---

## 🚀 How the AI Image-Parsing Tool Works

The VIVIDHRA administrative control dashboard includes a built-in **AI Scan Product Image** uploader that autocompletes catalog details:

1. **AI Image Analysis**: When you select or drag-and-drop a garment photo into the scanning zone, the frontend converts the image to base64 and securely proxies it to the Express backend (`/api/products/analyze`).
2. **Gemini 3.5 Flash Processing**: The backend leverages the modern `@google/genai` TypeScript SDK to send the image to Gemini. The model analyzes the fabric cuts, drapes, colors, materials, and overall aesthetic.
3. **Structured Schema Parsing**: Gemini returns a structured JSON response containing:
   - **Suggested Name** (e.g., *Wine Lace-Up Vest Top*, *Sanskrit Ribbed Tunic*)
   - **Recommended Category** (e.g., *dresses*, *co-ords*, *tops*, *trousers*, *blazers*, *vacation*)
   - **Detailed Subcategory** (e.g., *Structured Tops*, *Statement Tops*)
   - **Suggested Price** & **Compare-At Original Price**
   - **Luxury Editorial Description** matching VIVIDHRA's aesthetic tone
   - **Materials Composition** (e.g., *100% GOTS Organic Cotton Weave*)
   - **Care Instructions** & **Colors** & **Style Tags**
4. **Form Autocomplete**: The administrative panel automatically pre-fills the form fields with these suggestions, allowing the administrator to review, refine, and finalize the design.

---

## ✍️ Step-by-Step Catalog Expansion Guide

### Step 1: Access the Atelier Control Dashboard
1. Log in or switch your mock identity to **Admin** via the customer/admin switcher in the account portal.
2. Navigate to the **Atelier Control Dashboard** (located in the Admin view).
3. Click the **Garment CRUD** tab to open the catalog manager.

### Step 2: Upload and Scan a Garment
1. Locate the **AI Scan Product Image** dashed uploader.
2. Drag & drop a high-resolution garment photo, or click to upload one from your device.
3. Wait 3–4 seconds for VIVIDHRA AI to complete the image analysis.
4. The form will automatically pre-fill with premium suggested details!

### Step 3: Review and Publish
1. **Review** the autocompleted title, description, price, fabric, drapes, and size tags.
2. **Modify** any values to perfectly fit your inventory or pricing policies.
3. Click **Publish Garment Design** (or *Apply Garment Updates* if editing).
4. The new design is written directly to the server database and **goes live instantly on the storefront** without requiring a page rebuild!

---

## 💾 Saving & Synchronizing Your Catalog with GitHub

To ensure newly added products are preserved long-term and appear across all local machines, staging servers, and production instances, check your files into version control.

### How Product Data is Stored
* **Database Location**: `/data/vividhra_db.json` (relative to the project root directory)
* **Uploaded Images**: `/uploads/` (relative to the project root directory)

### Command Guide for GitHub Version Control
After adding or modifying products in the dashboard, run these standard terminal commands in your local project root:

```bash
# 1. Stage the database changes and any uploaded image assets
git add data/vividhra_db.json uploads/

# 2. Commit the new designs with a descriptive message
git commit -m "style: expand VIVIDHRA catalog with new AI-parsed garments"

# 3. Push securely to your live GitHub repository
git push origin main
```

*By checking in these files, you ensure the storefront is fully synchronized and running flawlessly on all devices and platforms!*
