<!-- Structure created by Stefan-->
* Einleitung
* Beschreibung des zu entwickelnden Produkts 
	* Grundlegende Funktionen der App 
	* Stakeholder
* Produktspezifikation
	* Functional non/functional Anforderungen 
	* Use Cases MisUse caces (Mit Verweiß auf zugehörige Sicherheitsanforderung)
* Technische Anforderungen 
	* {server usw.}
* Architektur
	* Umgebung
	* Nutzungs-Szenarien in BPMN
	* Component View
	* UML-Klassendiragramm
* Threat modeling
* Security Requirements
	* Stakeholder
	* Quelle
	* Beschreibung
	* Functional/NonFunctional
	* Sicherheitsanforderungen
	* Fit Kreterium
	* Zugriffkontrollmatrix (Berechtigungskonzept auf Methodenbasis)
	
* Design
* Review
* Code Review
* Security Testing 
* Deployment Handbuch

-->
# Deployment
Deployment process phases
- Release
  
  The release includes all the operations to prepare a system for assembly
and transfer to the customer site
- Install
  
  The install is the initial insertion of software into a new or existing system at
the customer site
- Activate
  
  Activation is a process of starting up the executable components of software
- Adapt
  
  The adaptation activity is a process to modify a software system that has
been previously installed
- Update
  
  The update process replaces an earlier version of all or part of a software
system with a newer release
## Installation

## Configuration
#### Ports

- `22` SSH
- `80` HTTP
- `443` HTTPS

#### Betriebsystem Benutzer innerhalb des Docker Container

- `root` mit allen rechten
- `buddy` für SSH zugriff
- `www-app` für den Application Server
- `mysql` für den MySQL Server


#### Datenbank
- `mongodb` zur Konfiguration mit allen Rechten, aber nur von Local aus ereichbar
- `app` für die Anwendung

#### Nutzer in der Anwendung
- `admin` Konto für den Administrator
- `user1` Nutzerkonto

Secure configuration
* Running software with minimal privileges
* User identity and role definition - who is in charge?
* Least privilege for database access
* File system security
* Use OS security services (loggin, access control,...)

Secure by default
* Configure the system in such a way that security is in place first
(in contrast to „everything works immediately“)
* Tip: use „installation switches“ that change configuration from
test / installation to secure mode

<!---Copied by Paulus-->
Security duties of the release manager
* Release Manager responsibilities during deployment should enforce quality and
security aspects
* Secure software installation in the production environment
* Remove debugging information, remove default user, remove backdoors, remove
install scripts
* Source code review, vulnerability scanning / penetration testing in production
environment
* Risk assessments due to software change requests, deployment and packaging,
new development tasks
* Manage dependencies to enterprise security management
* Certification and accreditation, setup of security incident handling, personal
security training
* Awareness training for end user and operating personal, security policy, security
guidelines
* Assure sufficient documentation
* Risk assessment, system security plan, operation manual, data classification,
handling guidelines, security assessment report, security configuration checklists

Secure transfer
* Secure transfer of software from developer to target environment
* Security issues with mobile code loaded over the internet
* Java Applets, Java Script, ActiveX, DCOM, Zero Touch Deployment, Java
Web Start
* Guarantee the integrity of the delivered software
* Fingerprint, Digital Signature, Trusted issuer, Handling of Dependencies,
Source code Escrow
* Provisioning for Disaster recovery
* Package install with checkpoints and roll back function
* Security influences decision on Push or Pull Delivery of software
* Pull
* Manual from CD / DVD, intranet code server, internet download server,
jump start / web start
* Push
* e.g. Microsoft SMS, IBM Tivoli, MSI Packaging

Software activation
* Integrate application into ITIL processes
* Asset management
* Configuration management
* Incident management
* Security management
* Perform test cases in real production environment
* Populate user database, incl. roles
* Perform security checks before Go-Live
* Penetration tests, security checklist walk-through
* Initialize key management

Software adaptation and update
* Plan and communicate fallback strategies if a crash occurs
during a software update or adaption
* Design and activate a mechanism for detection of installed
software components and version
* Design and activate a mechanism for the timely user
notification and deployment of security patches (see also
Security Response)


# Response
