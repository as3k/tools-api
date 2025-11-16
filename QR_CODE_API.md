# QR Code API Documentation

Generate QR codes for various data types including URLs, WiFi credentials, contact cards, and more.

## Endpoint

```
POST /api/qr
```

## Common Parameters

All QR types support these optional parameters:

- `rounded` - Generate QR with rounded corners (default: `false`)
- `logo` - Add logo placeholder with high error correction (default: `false`)
- `size` - QR code size in pixels (default: `1024`)

## QR Code Types

### 1. URL (Default)

Generate QR codes for web URLs with optional UTM tracking parameters.

**Parameters:**
- `url` - The URL to encode (required)
- `source` - UTM source parameter (optional)
- `medium` - UTM medium parameter (optional)

**Examples:**
```bash
# Basic URL
curl -X POST "http://localhost:3000/api/qr?url=https://example.com"

# With UTM tracking
curl -X POST "http://localhost:3000/api/qr?url=https://example.com&source=campaign&medium=print"

# With rounded corners
curl -X POST "http://localhost:3000/api/qr?url=https://example.com&rounded=true"
```

---

### 2. WiFi

Generate QR codes for WiFi network credentials. Scanning will automatically connect to the network.

**Parameters:**
- `type=wifi` - Set QR type to WiFi
- `ssid` - Network name (required)
- `password` - Network password (optional for open networks)
- `security` - Security type: `WPA`, `WEP`, or `nopass` (default: `WPA`)
- `hidden` - Whether network is hidden (default: `false`)

**Examples:**
```bash
# WPA network
curl -X POST "http://localhost:3000/api/qr?type=wifi&ssid=MyNetwork&password=SecurePass123&security=WPA"

# Open network (no password)
curl -X POST "http://localhost:3000/api/qr?type=wifi&ssid=OpenWiFi&security=nopass"

# Hidden network
curl -X POST "http://localhost:3000/api/qr?type=wifi&ssid=HiddenNet&password=secret&hidden=true"
```

---

### 3. vCard (Contact Card)

Generate QR codes with contact information in vCard 3.0 format.

**Parameters:**
- `type=vcard` - Set QR type to vCard
- `name` - Full name (required)
- `email` - Email address (optional)
- `phone` - Phone number (optional)
- `company` - Company/organization name (optional)
- `title` - Job title (optional)
- `url` - Website URL (optional)
- `address` - Physical address (optional)

**Examples:**
```bash
# Basic contact
curl -X POST "http://localhost:3000/api/qr?type=vcard&name=John%20Doe&email=john@example.com&phone=%2B1234567890"

# Full contact details
curl -X POST "http://localhost:3000/api/qr?type=vcard&name=Jane%20Smith&email=jane@company.com&phone=%2B1234567890&company=Acme%20Inc&title=CEO&url=https://acme.com"
```

---

### 4. Email

Generate QR codes that open an email client with pre-filled fields.

**Parameters:**
- `type=email` - Set QR type to email
- `to` - Recipient email address (required)
- `subject` - Email subject line (optional)
- `body` - Email body content (optional)

**Examples:**
```bash
# Simple email
curl -X POST "http://localhost:3000/api/qr?type=email&to=hello@example.com"

# With subject and body
curl -X POST "http://localhost:3000/api/qr?type=email&to=support@company.com&subject=Support%20Request&body=I%20need%20help%20with..."
```

---

### 5. SMS

Generate QR codes that open SMS app with pre-filled message.

**Parameters:**
- `type=sms` - Set QR type to SMS
- `phone` - Phone number (required)
- `message` - Pre-filled message text (optional)

**Examples:**
```bash
# SMS with number only
curl -X POST "http://localhost:3000/api/qr?type=sms&phone=%2B1234567890"

# SMS with pre-filled message
curl -X POST "http://localhost:3000/api/qr?type=sms&phone=%2B1234567890&message=Hello%20from%20QR%20code!"
```

---

### 6. Phone

Generate QR codes for direct phone calling.

**Parameters:**
- `type=phone` - Set QR type to phone
- `number` - Phone number to call (required)

**Examples:**
```bash
# Phone call
curl -X POST "http://localhost:3000/api/qr?type=phone&number=%2B1234567890"
```

---

### 7. Text

Generate QR codes containing plain text.

**Parameters:**
- `type=text` - Set QR type to text
- `content` - Text content to encode (required)

**Examples:**
```bash
# Plain text
curl -X POST "http://localhost:3000/api/qr?type=text&content=Hello%2C%20World!"

# Multi-line text
curl -X POST "http://localhost:3000/api/qr?type=text&content=Line%201%0ALine%202%0ALine%203"
```

---

## Using with POST Body

All parameters can also be sent as JSON in the request body:

```bash
curl -X POST http://localhost:3000/api/qr \
  -H "Content-Type: application/json" \
  -d '{
    "type": "wifi",
    "ssid": "MyNetwork",
    "password": "SecurePass123",
    "security": "WPA",
    "rounded": true,
    "size": 512
  }'
```

## Response

**Success (200):**
- Content-Type: `image/png`
- Returns PNG image of the QR code

**Error (400/500):**
- Content-Type: `application/json`
- Returns JSON with error message:
```json
{
  "error": "Error message here"
}
```

## Testing

Open `test-qr-types.html` in a browser to test all QR code types interactively.

## Notes

- All QR codes are generated as PNG images
- Default size is 1024x1024 pixels
- URL-encode special characters in query parameters
- The `rounded` parameter uses `qr-code-styling` library for smoother corners
- The `logo` parameter increases error correction to level H (30% tolerance)
- WiFi QR codes follow the standard WIFI: format compatible with iOS and Android
- vCard format is version 3.0, widely compatible with all devices
