# School of Computing &mdash; Year 4 Project Proposal Form

> Edit (then commit and push) this document to complete your proposal form.
> Make use of figures / diagrams where appropriate.
>
> Do not rename this file.

## SECTION A

|                     |                   |
|---------------------|-------------------|
|Project Title:       | ECHO Labs         |
|Student 1 Name:      | Fiona Tuite       |
|Student 1 ID:        | 16389251          |
|Student 2 Name:      | Munashe Lawrence Chifungo  |
|Student 2 ID:        | 16469764          |
|Project Supervisor:  | Monica Ward       |

> Ensure that the Supervisor formally agrees to supervise your project; this is only recognised once the
> Supervisor assigns herself/himself via the project Dashboard.
>
> Project proposals without an assigned
> Supervisor will not be accepted for presentation to the Approval Panel.

## SECTION B

> Guidance: This document is expected to be approximately 3 pages in length, but it can exceed this page limit.
> It is also permissible to carry forward content from this proposal to your later documents (e.g. functional
> specification) as appropriate.
>
> Your proposal must include *at least* the following sections.


### Introduction

> Describe the general area covered by the project.

Echo Labs is a Peer-to-Peer audio, video and chat web application that can be used for the sole purpose of connecting students, tutors and lecturers together in a lab like scenario.

### Outline

> Outline the proposed project.

### Background

> Where did the ideas come from?

Before the Covid-19 pandemic hit the world, our labs in DCU would be held in a large class of students, with tutors and lecturers giving face to face assistance to those in need. Once Covid-19 came along, A lab in that before setting was not do-able. This is how we came up with the idea of Echo labs. This web application creates a lab like scenario that resolves this issue by allowing all parties to interact as they did previously - but from home.


### Achievements

> What functions will the project provide? Who will the users be?

Echo Labs will have the following features:

**User Login**

User logs in via username and password - which will be linked to a database.

The 3 types of users are: **Student, Tutor and Lecturer.**

**User DashBoard**

Once logged in, users have a set of lab rooms on a user dashboard

Or a user may have a room code to use to access a specific lab.

**Within the Lab room:**

Students, tutors and lecturers will have an entire view of the active users within the room.

**User Permissions**

**Student -** will have basic permissions, which will allow them to:

* Request help from an admin
* Video or Audio call an admin
* Screen share an admin
* Messaging chat window enabled to chat to tutor/lecturer
* Ability to access a peer to peer code/text editor 

**Tutor/lecturers-** will have admin permissions which will allow:

* The ability to create rooms
* Video or audio call students
* Screenshare
* Messaging chat window enabled to chat to students
* Ability to access a peer to peer code/text editor


**Starting a Call**

A student will have an option to request help from an admin. Once requested, a symbol will appear in the lab room.

A tutor will accept this request and will be placed in a call with the student.

Once in a call, the student and tutor will be in a new private room together where they have the option to video call, screenshare, or edit code together via the peer to peer code/text editor.

Everyone within the lab room outside the call, will be able to see that the user and tutor are currently busy.


**Ended call**

Once a call has ended, both the user and tutor will be placed back into the lab room, and their user ids won't indicate that they are in a call anymore to the rest of the class.

**Broadcast messages**

Broadcast messages can be used by tutors/hosts that will send a direct call to everyone. This can be used for example in order to explain what’s going to happen in the lab, or that the lab may be ending/to ask questions.

**Ended lab session**

Once the host closes the lab session, the user will be brought back to their user dashboard. Any chat messages from a tutor during the lab session will be stored and can be accessed by the student to view again.


### Justification

> Why/when/where/how will it be useful?

Echo labs will be incredibly useful for all parties as it allows them to interact in a lab like scenario from an at home setting. This can be used during regular lab sessions, and will be extremely beneficial to be used in a time of unforeseeable circumstances.

### Programming language(s)

> List the proposed language(s) to be used.

React.js, Node.js, Firebase, Java, Javascript, CSS.

### Programming tools / Tech stack

> Describe the compiler, database, web server, etc., and any other software tools you plan to use.

* **NodeJS -** This will be used for web server implementation.
* **webRTC -** This will be used in order to create audio, video, and screen share sessions between the Student and the lecturer/tutor.
* **Firebase -**  This will be used for database implementation.
* **NodeJS libraries** - such as Socket.io.

### Hardware

> Describe any non-standard hardware components which will be required.

* Webcam for video chat.
* Microphone for audio chat.

### Learning Challenges

> List the main new things (technologies, languages, tools, etc) that you will have to learn.

* Web App Development.
* Firebase implementation.
* Front-end implementation using React.js
* Server implementation with Node.js
* Socket.io implementation.
* Configuration of audio, video and screen share using webRTC.
* Implementation of a peer to peer code/text editor within a web application.
* Implementation of a chat system.


### Breakdown of work

> Clearly identify who will undertake which parts of the project.
>
> It must be clear from the explanation of this breakdown of work both that each student is responsible for
> separate, clearly-defined tasks, and that those responsibilities substantially cover all of the work required
> for the project.

#### Munashe

> *Student 1 should complete this section.*

* Back-end implementation of login screen including the implementation of the database using Firebase. 
* Setting up different user admin permissions. 
* Back-end implementation of the user dashboard. 
* Peer to peer text editor and chat system implementation.
* Path configuration.


#### Fiona

> *Student 2 should complete this section.*

* The back-end server implementation using Node.js. 
* Front-end implementation of the login screen. 
* Front-end implementation of the user dashboards. 
* Path configuration
* Front-end and back-end implementation of the lab room. 
* Peer to Peer Audio, video and screen share implementation within a call. 





