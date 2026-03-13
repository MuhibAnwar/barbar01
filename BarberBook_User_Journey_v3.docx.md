**BarberBooking.com**

**User Journey & System Documentation**

Two-Panel Barber Booking Application

| 👤  Customer Panel Browse · Book · Confirm | ✂️  Barber Panel Login · View · Manage |
| :---: | :---: |

| FEATURES |
| :---: |

BarberBook is built with a focused set of features designed to make the booking experience seamless for customers and effortless for barbers.

**Customer-Facing Features**

| 📋  Multi-Step Booking Form Guided two-section form — barber, service, time slot, then personal details. | 💈  Barber Selection Browse all barbers with names and specialties before booking. |
| :---- | :---- |
| **✂️  Service Menu** Choose services (Haircut, Shave, Beard Trim, Color) with duration and price. | **🕐  Real-Time Availability** Only open slots shown; booked slots auto-hidden to prevent double-booking. |
| **💬  Customer Comment Field** Optional note for the barber e.g. 'scissors only, no machine'. | **✅  Booking Confirmation** On-screen confirmation with full appointment summary after submit. |

**Barber-Facing Features**

| 🔑  Barber ID Login Secure login using a unique Barber ID — fast access for shop-floor use. | 📊  Bookings Dashboard Table Clean table: customer name, service, date, time — sorted by soonest first. |
| :---- | :---- |
| **📂  Customer Detail Slider** Click any row to open an animated slide panel with full customer info. | **🔄  Real-Time Table Updates** Bookings table refreshes automatically via Supabase Realtime. |

**System-Wide Features**

| 🛡️  Slot Conflict Prevention System blocks already-booked slots in real time — no overlaps possible. | 📱  Responsive Design Both panels work smoothly on mobile, tablet, and desktop. |
| :---- | :---- |
| **⚡  Instant Data Sync** Supabase Realtime — bookings appear in barber dashboard without page reload. | **🔒  Row-Level Security** RLS policies ensure barbers only see their own bookings. |

| PANEL 1 — CUSTOMER JOURNEY |
| :---: |

**Step-by-Step Flow**

| 1 | Landing Page — Discover Booking Customer sees the main navigation and a prominent 'Book Now' button. |
| :---: | :---- |

▼

| 2 | Click Booking Option The multi-step booking form loads with a progress indicator. |
| :---: | :---- |

▼

| 3 | Select a Barber List/grid of barbers shown. Customer picks their preferred one. |
| :---: | :---- |

▼

| 4 | Select a Service Service menu appears with duration and price for each option. |
| :---: | :---- |

▼

| 5 | View Available Time Slots Real-time availability fetched from Supabase. Taken slots grayed out. |
| :---: | :---- |

▼

| 6 | Personal Details Form Customer fills in Full Name, Phone Number, and optional Comment. |
| :---: | :---- |

▼

| 7 | Confirm & Submit Booking Data saved to Supabase. Confirmation shown. Barber dashboard updates instantly. |
| :---: | :---- |

| PANEL 2 — BARBER JOURNEY |
| :---: |

**Step-by-Step Flow**

| 1 | Barber Login Screen Barber enters unique Barber ID. Authenticated via Supabase, redirected to dashboard. |
| :---: | :---- |

▼

| 2 | Booking Management Table All bookings shown: Name, Service, Date, Time. Sorted by soonest. Updates in real time. |
| :---: | :---- |

▼

| 3 | Click on a Booking Row Barber clicks any row. Slide-in detail panel animates in from the right. |
| :---: | :---- |

▼

| 4 | Customer Detail Slider Full details: Name, Phone, Service, Date, Time, Comment. Close to return to table. |
| :---: | :---- |

| DATABASE — SUPABASE SCHEMA |
| :---: |

BarberBook uses Supabase as its backend-as-a-service — providing PostgreSQL, authentication, Realtime subscriptions, and Row-Level Security via a simple JavaScript SDK.

| 🗄️  Supabase Stack Database: PostgreSQL   |   Auth: Supabase Auth   |   Realtime: Supabase Realtime Channels   |   Storage: Supabase Storage   |   Security: Row-Level Security (RLS) |
| :---- |

**Table 1: barbers**

| Column | Type | Constraints | Description |
| ----- | ----- | ----- | ----- |
| id | uuid | PRIMARY KEY, default: gen\_random\_uuid() | Unique barber identifier |
| name | text | NOT NULL | Full name of the barber |
| specialty | text |  | e.g. Fades, Classic Cuts, Beard Work |
| barber\_code | text | UNIQUE, NOT NULL | Login ID entered by barber |
| photo\_url | text |  | Optional profile image URL |
| created\_at | timestamptz | default: now() | Row creation timestamp |

**Table 2: services**

| Column | Type | Constraints | Description |
| ----- | ----- | ----- | ----- |
| id | uuid | PRIMARY KEY, default: gen\_random\_uuid() | Unique service ID |
| name | text | NOT NULL | Service name e.g. Haircut, Shave, Beard Trim |
| duration\_mins | int | NOT NULL | Duration of the service in minutes |
| price | numeric(8,2) | NOT NULL | Price in local currency |
| created\_at | timestamptz | default: now() | Row creation timestamp |

**Table 3: bookings  ← Core Table**

| Column | Type | Constraints | Description |
| ----- | ----- | ----- | ----- |
| id | uuid | PRIMARY KEY, default: gen\_random\_uuid() | Unique booking ID |
| barber\_id | uuid | NOT NULL, FK → barbers.id | Which barber this booking belongs to |
| service\_id | uuid | NOT NULL, FK → services.id | Service selected by customer |
| customer\_name | text | NOT NULL | Full name of the customer |
| customer\_phone | text | NOT NULL | Customer contact phone number |
| appointment\_time | timestamptz | NOT NULL | Date and time of the appointment |
| comment | text |  | Optional note from customer to barber |
| status | text | default: 'pending' | pending | confirmed | cancelled |
| created\_at | timestamptz | default: now() | When the booking was created |

**Table 4: availability\_slots**

| Column | Type | Constraints | Description |
| ----- | ----- | ----- | ----- |
| id | uuid | PRIMARY KEY, default: gen\_random\_uuid() | Unique slot ID |
| barber\_id | uuid | NOT NULL, FK → barbers.id | Barber this slot belongs to |
| slot\_time | timestamptz | NOT NULL | Start time of the available slot |
| is\_booked | boolean | default: false | True when a booking occupies this slot |
| created\_at | timestamptz | default: now() | Row creation timestamp |

**Supabase Realtime — Booking Sync**

When a customer submits a booking, an INSERT fires on the bookings table. The barber panel subscribes to Supabase Realtime for their barber\_id and the dashboard updates instantly via WebSocket — no page reload required.

| // Barber panel — Supabase Realtime subscription supabase   .channel('barber-bookings')   .on('postgres\_changes', {     event: 'INSERT',  schema: 'public',     table: 'bookings',     filter: \`barber\_id=eq.${barberId}\`   }, (payload) \=\> updateDashboard(payload.new))   .subscribe() |
| :---- |

| SECURITY MEASURES |
| :---: |

BarberBook follows a defence-in-depth security model. Multiple overlapping layers protect customer data, barber accounts, and booking integrity — from the database layer up to the frontend.

**1\. Row-Level Security (RLS) — Database Layer**

Every table in Supabase has RLS enabled. Policies are defined per operation (SELECT, INSERT, UPDATE, DELETE) to ensure each actor can only touch data they own.

**RLS Policies — bookings table**

| Policy Name | Operation | Who | Rule / Using Clause |
| :---- | :---- | :---- | :---- |
| customer\_insert | **INSERT** | Anonymous | Allow anyone to insert a booking (public booking form) |
| barber\_select\_own | **SELECT** | Barber (authenticated) | barber\_id \= auth.uid() — barber sees only their bookings |
| barber\_update\_own | **UPDATE** | Barber (authenticated) | barber\_id \= auth.uid() — barber can update only their own |
| admin\_full\_access | **ALL** | Service Role | Service role key bypasses RLS for admin operations |

| \-- Enable RLS on bookings ALTER TABLE bookings ENABLE ROW LEVEL SECURITY; \-- Barbers can only SELECT their own bookings CREATE POLICY barber\_select\_own ON bookings   FOR SELECT USING (barber\_id \= auth.uid()); \-- Anyone (anonymous) can INSERT a booking CREATE POLICY customer\_insert ON bookings   FOR INSERT WITH CHECK (true); |
| :---- |

**2\. Authentication & Session Security**

| 🔑 | Barber ID Authentication via Supabase Auth Barbers sign in using their unique barber\_code mapped to a Supabase Auth account. JWT tokens are issued by Supabase on successful login and automatically attached to every API request. Tokens expire after 1 hour and are refreshed silently in the background. |
| :---: | :---- |

| 🚫 | No Customer Accounts Required Customers submit bookings as anonymous users. No account, password, or personal login is required — reducing the attack surface and eliminating credential theft risk on the customer side. |
| :---: | :---- |

| 🍪 | Secure Session Storage Auth tokens are stored in Supabase's managed session (httpOnly cookies or secure localStorage depending on config). Sessions are invalidated on logout. Barbers should log out after each shift on shared devices. |
| :---: | :---- |

**3\. API Key Management**

| Key Type | Exposure | Usage & Restrictions |
| :---- | :---- | :---- |
| **anon (public) key** | Frontend (safe) | Used in the browser. Safe because RLS policies enforce access control regardless of key exposure. |
| **service\_role key** | Server only (secret) | Bypasses RLS. Must NEVER be exposed to the frontend. Used only in server-side admin scripts. |

**4\. Input Validation & Sanitization**

| ✔️ | Frontend Form Validation All booking form fields are validated before submission: Name (min 2 chars, no script tags), Phone (numeric pattern match), Time slot (must be a valid future time from the allowed list). Prevents garbage data from reaching the database. |
| :---: | :---- |

| 🔏 | Database Constraints as Second Layer NOT NULL, UNIQUE, and FK constraints in PostgreSQL enforce data integrity at the database level — even if frontend validation is bypassed. appointment\_time must be timestamptz; barber\_id must reference a real barbers row. |
| :---: | :---- |

| 🚧 | SQL Injection Prevention All database queries use Supabase's parameterized query builder (PostgREST under the hood). Raw SQL is never constructed from user input. This eliminates SQL injection as an attack vector entirely. |
| :---: | :---- |

**5\. Data Privacy & Minimization**

| 📵 | Minimal PII Collection Only the data strictly needed for a booking is collected: name and phone number. No email, no address, no payment info. Less data collected \= less exposure in the event of a breach. |
| :---: | :---- |

| 👁️ | Barber Data Isolation Each barber can only query their own bookings via RLS. Barber A cannot view, modify, or enumerate Barber B's customer data — even if they share the same Supabase project. |
| :---: | :---- |

| 🔐 | HTTPS Everywhere All communication between the client and Supabase is over HTTPS/TLS. Supabase enforces this by default — no HTTP fallback is permitted. Data in transit is always encrypted. |
| :---: | :---- |

**6\. Realtime Channel Security**

Supabase Realtime channels are secured with the same JWT-based authentication as the REST API. A barber cannot subscribe to another barber's channel — the server validates the JWT and the barber\_id filter before broadcasting any event.

| // Barber is authenticated — JWT is verified server-side // filter ensures only THIS barber's events are broadcast supabase.channel('my-bookings')   .on('postgres\_changes', {     event: '\*',  schema: 'public',  table: 'bookings',     filter: \`barber\_id=eq.${auth.uid()}\`   // server-enforced   }, handleNewBooking)   .subscribe() |
| :---- |

**Security Layers Summary**

| Security Layer | Status | Mechanism |
| :---- | ----- | :---- |
| **Row-Level Security (RLS)** | **ENABLED** | Supabase PostgreSQL policies per table and operation |
| **JWT Authentication** | **ENABLED** | Supabase Auth — 1hr expiry, silent refresh |
| **HTTPS / TLS Encryption** | **ENFORCED** | All traffic encrypted in transit by Supabase |
| **SQL Injection Prevention** | **PROTECTED** | Parameterized queries via PostgREST / Supabase SDK |
| **Frontend Input Validation** | **ENABLED** | Pattern matching \+ required field checks pre-submit |
| **Barber Data Isolation** | **ENFORCED** | auth.uid() filter in all SELECT/UPDATE policies |
| **Service Role Key Exposure** | **PREVENTED** | Secret key never sent to client / browser |
| **Realtime Channel Auth** | **VERIFIED** | JWT validated before broadcast; barber\_id filter applied |
| **Minimal PII Collection** | **APPLIED** | Only name \+ phone collected — no email, no payment |
| **Double-Booking Prevention** | **ENFORCED** | is\_booked flag on availability\_slots \+ slot validation |

BarberBook — User Journey & System Documentation

Powered by Supabase \+ PostgreSQL  |  Defence-in-Depth Security Model

TIME Ka kuch karna hoga   
Notification   
Land with qr code and save it to home  
Wo bhi ye nhi karsakrtre time per   
System ko manage karle gay  
Han ye karle gay