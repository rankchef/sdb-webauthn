# WebAuthn Demo

A simple project demonstrating how passwordless authentication works using **WebAuthn** and secure session cookies.

## Features

* **Passwordless Login:** Uses WebAuthn (Touch ID, Face ID, or security keys) instead of traditional passwords.
* **Phishing Protection:** Uses `rpID` domain binding to ensure credentials only work on the official site.
* **Session Management:** Uses HTTP-only cookies and backend middleware to keep users logged in.