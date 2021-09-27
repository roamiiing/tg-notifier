# tg-notifier

This is a Vercel serverless function that sends a message to a given
telegram channel.

## Usage

Send a `POST` request to `URL/api/notify` with the following body:

```jsonc
{
  "secret": "Your secret key here",
  "success": true, // (or false)
  "sender": "The sender",
  "message": "The message",
  "meta": {
    "Some key": "Some metadata",
    "Some another key": "Some more metadata"
  }
}
```

This will result in such message send to your channel:

> ✅ Success: The sender
> 
> The message
> 
> Details:
> 
> Some key: Some metadata
> 
> Some another key: Some more metadata

## Configuration

The following environmental variables are required:

```
TG_BOT_TOKEN=Your bot token
TG_CHANNEL=Your channel id
SECRET_KEY=Your arbitrary secret key
```
