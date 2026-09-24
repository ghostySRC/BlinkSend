# BlinkSend

Send files directly between two browsers: computer to computer, phone to computer, or computer to phone. The two devices join a room using an invite link or QR code, and the receiver accepts each file before transfer.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). To pair a phone, host BlinkSend at a public **HTTPS** address and open the displayed QR code on the phone. Browsers generally require a secure context for clipboard access and disk streaming, and a phone cannot access your computer's `localhost` address.

Set `PORT` to change the listening port. The same Node server serves the web app and the WebSocket signaling endpoint (`/signal`). A reverse proxy must forward WebSocket upgrades. The server keeps at most two connections per room and expires inactive rooms after 30 minutes. Its memory holds pairing messages, never file contents.

## How transfers work

- WebRTC data channels carry the file directly between browsers, encrypted in transit. The Node server only exchanges connection information.
- Both browser tabs must stay open and online throughout the transfer. Only one file is transferred at a time.
- Desktop browsers supporting `showSaveFilePicker` can stream received files to disk. Other browsers download the file after buffering it in memory and are limited to **200 MB** per file. This matters especially on phones and iOS.
- A public STUN server helps devices connect across networks. Some network combinations require a TURN relay. **This version has no relay**; those connections will fail rather than fall back to server transfer. Large file speeds vary with network upload, Wi-Fi, browser, and device performance.
- The invite link contains a random 128-bit room identifier. Anyone with the link can join, so treat it as private. No account or permanent server storage is used.

## Development

`public/` contains the browser app, `server.js` handles static files and pairing, and `test/` covers room signaling. Run `npm test` after changes.

## License

MIT. See [LICENSE](LICENSE).
