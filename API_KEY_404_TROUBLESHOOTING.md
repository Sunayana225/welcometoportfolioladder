# 🔧 API Key 404 Error Troubleshooting Guide

## 🚨 Problem: "API validation failed (404). Please verify your API key."

If you're getting a 404 error even with a correct API key, the issue is most likely that the **Generative Language API is not enabled** in your Google Cloud project.

## ✅ Step-by-Step Fix

### **1. Enable the Generative Language API**

This is the most common cause of 404 errors:

1. **Go to Google Cloud Console:**
   👉 https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

2. **Sign in** with the same Google account you used to create the API key

3. **Select the correct project** (very important!)
   - Look at the project dropdown at the top
   - Make sure it's the same project where you created your API key

4. **Click "Enable"** button for the Generative Language API

5. **Wait 2-3 minutes** for the API to be fully activated

6. **Try validating your API key again**

### **2. Verify Your API Key Source**

Make sure you got your API key from the correct place:

1. **Go to Google AI Studio:**
   👉 https://makersuite.google.com/app/apikey

2. **Check your existing keys** or create a new one

3. **Copy the complete key** (starts with "AIza")

4. **Make sure there are no extra spaces** when pasting

### **3. Test Your Setup Manually**

You can test your API key directly using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      { "parts": [ { "text": "Say hello" } ] }
    ]
  }' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

**Replace `YOUR_API_KEY` with your actual key.**

**Expected Success Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Hello! How can I help you today?"
          }
        ]
      }
    }
  ]
}
```

**If you get 404:** The API is not enabled
**If you get 403:** API key issues or quota problems
**If you get 400:** Request format issues

### **4. Common Mistakes**

❌ **Wrong Project:** API key created in one project, API enabled in another
❌ **API Not Enabled:** Most common cause of 404 errors
❌ **Wrong Endpoint:** Using old API versions or incorrect URLs
❌ **Billing Issues:** Some Google Cloud features require billing enabled
❌ **Regional Restrictions:** API might not be available in your region

### **5. Detailed Debugging Steps**

1. **Check Project Consistency:**
   - Note the project ID when creating your API key
   - Ensure you enable the API in the SAME project

2. **Verify API Status:**
   - Go to: https://console.cloud.google.com/apis/dashboard
   - Look for "Generative Language API" in enabled APIs
   - If not there, it's not enabled

3. **Check Billing (if required):**
   - Some Google Cloud features require billing
   - Go to: https://console.cloud.google.com/billing
   - Ensure billing is set up for your project

4. **Regional Availability:**
   - Gemini API might not be available in all regions
   - Try creating a new project in a different region

### **6. Alternative Solutions**

If you continue having issues:

1. **Create a New Project:**
   - Go to: https://console.cloud.google.com/
   - Create a new project
   - Enable the Generative Language API
   - Create a new API key

2. **Use a Different Google Account:**
   - Some accounts might have restrictions
   - Try with a personal Gmail account

3. **Wait and Retry:**
   - Sometimes there are temporary issues
   - Wait 30 minutes and try again

## 🔍 Debug Information

The Portfolio Maker now includes detailed debug information:

1. **Click "Debug Information"** in the API validation section
2. **Check the API Test Result** for detailed error messages
3. **Look for specific error codes:**
   - **404:** API not enabled
   - **403:** Permission/quota issues
   - **400:** Request format problems
   - **401:** Invalid API key

## 📞 Still Having Issues?

### **Check These Common Solutions:**

1. **Clear Browser Cache:** Sometimes cached requests cause issues
2. **Try Incognito Mode:** Eliminates browser extension interference
3. **Different Network:** Try from a different internet connection
4. **VPN Issues:** Some VPNs might block Google APIs

### **Verify Your Setup:**

1. **API Key Format:** Should start with "AIza" and be ~39 characters
2. **Project Billing:** Enable billing if required
3. **API Quotas:** Check if you've exceeded free tier limits
4. **Account Permissions:** Ensure your Google account has proper access

## ✅ Success Checklist

Before contacting support, ensure:

- ✅ Generative Language API is enabled in Google Cloud Console
- ✅ API key is from the correct project
- ✅ API key starts with "AIza" and is complete
- ✅ No extra spaces in the API key
- ✅ Billing is enabled (if required)
- ✅ You're using the same Google account for both API key and Cloud Console
- ✅ You've waited a few minutes after enabling the API

## 🎯 Quick Fix Summary

**Most 404 errors are fixed by:**

1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click "Enable"
3. Wait 2-3 minutes
4. Try again

**If that doesn't work:**

1. Create a new Google Cloud project
2. Enable the API in the new project
3. Create a new API key in the new project
4. Use the new API key

---

## 📧 Contact Information

If you've tried all these steps and still have issues:

1. **Check the debug information** in the Portfolio Maker
2. **Note the exact error message** and status code
3. **Verify you've completed all steps** in this guide
4. **Try the manual curl test** to isolate the issue

**The 404 error is almost always an API enablement issue - following these steps should resolve it! 🎉**
