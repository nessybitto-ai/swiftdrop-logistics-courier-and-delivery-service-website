# SwiftDrop Logistics   Courier and Delivery Service Website

## Overview
A modern, responsive courier and delivery service website for SwiftDrop Logistics featuring package tracking, service information, delivery booking capabilities, and comprehensive admin management system.

## Core Features

### Homepage
- Hero section with headline "Fast, Reliable & Nationwide Courier Delivery" and sub-text "Move your parcels anywhere with confidence"
- Prominent package tracking box with input field for tracking number and "Track Now" button
- Navigation menu with Home, About, Services, Track Parcel, Contact links (sticky top menu)
- Admin link in navigation (visible only when logged in as admin)
- Footer with social media icons for Facebook, Instagram, and WhatsApp

### About Us Page
- Company mission and values content
- Information about reliability, speed, and national coverage

### Services Page
- Five service categories with descriptions:
  - Same-Day Delivery
  - Interstate Delivery
  - Corporate Delivery
  - E-commerce Fulfillment
  - Document Dispatch

### Package Tracking
- Search functionality for tracking numbers
- Display of delivery stages:
  - Accepted
  - In Transit
  - Arrived at Facility
  - Out for Delivery
  - Delivered
- Real-time updates reflecting admin changes

### Contact/Booking Page
- Delivery request form with fields:
  - Sender information (name, phone, pickup address)
  - Receiver information (name, phone, delivery address)
  - Parcel details (description, weight)
- Embedded Google Map showing office location
- Contact information display (phone, WhatsApp, email)

### Admin Authentication System
- Internet Identity-based login for admin access
- Login/logout button for admin authentication
- Secure authentication flow with redirect handling

### Admin Dashboard
- Accessible only to authenticated admin users
- View all delivery requests submitted through booking form
- Generate tracking numbers for new delivery entries
- Manage deliveries interface with tracking status updates
- Update package tracking statuses using predefined stages (Accepted, In Transit, Arrived at Facility, Out for Delivery, Delivered)
- View all submitted customer testimonials
- Tracking Number Requests section/tab with:
  - Form to create new tracking number requests with sender name, receiver name, and parcel description fields
  - View all existing tracking number requests
  - Confirmation message upon successful submission
- Unauthorized access redirects to homepage with alert message

### Additional Features
- Customer testimonials section
- FAQ section covering delivery times, pricing, and parcel restrictions
- Live chat widget for customer support

## Backend Data Storage
- Package tracking information and delivery status updates
- Delivery requests submitted through the booking form
- Generated tracking numbers linked to delivery requests
- Customer testimonials
- FAQ content
- Admin principals list for authorization
- Tracking number requests with sender name, receiver name, and parcel description

## Backend Operations
- Store and retrieve package tracking data
- Process delivery booking requests
- Generate unique tracking numbers for delivery requests
- Create new tracking entries linked to delivery requests
- Manage testimonial submissions
- Serve FAQ content
- Authenticate admin users via Internet Identity
- Check admin authorization for protected operations
- Update tracking statuses (admin-only operation)
- Retrieve all delivery requests (admin-only operation)
- Retrieve all testimonials (admin-only operation)
- Link tracking numbers to existing delivery requests (admin-only operation)
- Create tracking number requests with sender name, receiver name, and parcel description (admin-only operation)
- Retrieve all tracking number requests (admin-only operation)

## Design Requirements
- Color scheme: Blue (#0055ff) and White
- Clean, bold typography
- Professional layout inspired by major courier services
- Fully responsive design for desktop, tablet, and mobile devices
- Content language: English
