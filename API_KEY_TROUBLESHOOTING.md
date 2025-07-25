# 🔧 API Key Validation Troubleshooting Guide

## 🚨 Issue: "Unable to validate API key. Please verify it is correct."

If you're getting this error even with a correct API key, here are the steps to resolve it:

## ✅ **Step 1: Verify API Key Format**

### **Correct Format:**
- Must start with `AIza`
- Should be at least 35 characters long
- Contains only letters, numbers, hyphens, and underscores
<<<<<<< HEAD
- Example: `AIzaSyDaGmWKa4JsXZ-HjGw7_SIta_MzCe8aTQs`
=======
- Example: `AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (replace X's with your actual key)
>>>>>>> b73e91fba34b27aabf20f3d73406c15ba40c9f57

### **Common Issues:**
- ❌ Extra spaces at beginning/end
- ❌ Missing characters when copying
- ❌ Wrong API key type (not Gemini)

## ✅ **Step 2: Check API Key Source**

### **Get Key from Correct Location:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" 
4. Copy the **entire** key (select all and copy)

### **Verify Key Type:**
- ✅ Should be for "Generative AI" or "Gemini"
- ❌ Not Google Maps, YouTube, or other Google APIs

## ✅ **Step 3: Enable Gemini API**

### **Check API Access:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Enabled APIs"
4. Look for "Generative Language API"
5. If not enabled, search for it and enable it

## ✅ **Step 4: Test API Key Manually**

### **Direct Test (Advanced Users):**
Open browser developer tools and run:

```javascript
const apiKey = "YOUR_API_KEY_HERE";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }]
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### **Expected Success Response:**
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

## ✅ **Step 5: Common Error Codes**

### **400 Bad Request**
- **Cause**: Invalid API key format or malformed request
- **Solution**: Check key format, ensure it starts with "AIza"

### **401 Unauthorized**
- **Cause**: API key is invalid or expired
- **Solution**: Generate a new API key

### **403 Forbidden**
- **Cause**: API not enabled or quota exceeded
- **Solution**: Enable Generative Language API, check quotas

### **429 Too Many Requests**
- **Cause**: Rate limit exceeded
- **Solution**: Wait a few minutes and try again

## ✅ **Step 6: Browser/Network Issues**

### **CORS Issues:**
- The app uses direct fetch to Google's API
- Should work in modern browsers
- If blocked, try a different browser

### **Firewall/Proxy:**
- Corporate firewalls might block Google APIs
- Try from a different network
- Check if `generativelanguage.googleapis.com` is accessible

### **Ad Blockers:**
- Some ad blockers block API requests
- Try disabling ad blockers temporarily

## ✅ **Step 7: Debug Mode**

### **Enable Debug Info:**
In development mode, you'll see debug information under the API key field:
- Key length
- Format validation
- Starts with "AIza" check

### **Browser Console:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for validation logs when testing
4. Check for any error messages

## 🔧 **Updated Validation Method**

The app now uses the **direct REST API** approach instead of the SDK:

### **What Changed:**
- ✅ Direct HTTP requests to Google's API
- ✅ Better error handling and status codes
- ✅ 10-second timeout to prevent hanging
- ✅ More specific error messages
- ✅ Format validation before API call

### **Benefits:**
- More reliable validation
- Clearer error messages
- Better debugging information
- Faster validation process

## 🆘 **Still Having Issues?**

### **Try These Steps:**

1. **Generate New API Key:**
   - Delete old key in Google AI Studio
   - Create a fresh new key
   - Copy it carefully

2. **Check Quotas:**
   - Go to Google AI Studio
   - Check your usage limits
   - Ensure you haven't exceeded free tier

3. **Different Browser:**
   - Try Chrome, Firefox, or Edge
   - Disable extensions temporarily
   - Use incognito/private mode

4. **Network Test:**
   - Try from different WiFi/network
   - Check if corporate firewall blocks Google APIs
   - Test on mobile hotspot

## 📞 **Getting Help**

### **What to Include:**
- Browser and version
- Error message (exact text)
- API key format (first 10 characters only)
- Network environment (home/office/mobile)
- Console error messages

### **Security Note:**
- ⚠️ **Never share your complete API key**
- Only share first 10 characters for format verification
- Regenerate key if accidentally shared

## ✅ **Success Indicators**

When validation works correctly, you should see:
- ✅ Green checkmark in validation button
- ✅ "API key validated successfully" message
- ✅ Green background in API key input field
- ✅ "Generate Projects with AI" button becomes enabled

---

**The updated validation system should resolve most API key issues! 🔑✨**
