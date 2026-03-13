# DAP Creatives — Setup Notes

## Contact Form Activation

Go to [web3forms.com](https://web3forms.com)

Enter `director@dapcreatives.co.za` and click **Create Access Key**

Check the inbox for the key (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

In `index.html`, find this line and replace `YOUR_WEB3FORMS_ACCESS_KEY` with the actual key:

```html
<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
```

Once that's done, every submission will land in `director@dapcreatives.co.za` with the sender's name, email, service, and message. The button also shows a spinner while sending, a green tick on success, and a red error state if it fails.
