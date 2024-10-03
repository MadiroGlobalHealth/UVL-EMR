[![Build all configurations and deploy](https://github.com/MadiroGlobalHealth/UVL-EMR/actions/workflows/build-all.yml/badge.svg)](https://github.com/MadiroGlobalHealth/UVL-EMR/actions/workflows/build-all.yml)



<img width="1407" alt="Screenshot 2024-08-06 at 4 22 22 PM" src="https://github.com/user-attachments/assets/1e82f482-3289-4097-a020-61f2c1e37034">

This project is part of **Madiro's HealthTech Challenge 2024** connecting passionate people willing to engage in **Global Goods for Digital Health** with real-life needs and impactful opportunities. 

This repository contains a distribution of **OpenMRS 3** that will support UVL in its digitalization of clinical operations (patient registration, consultations, laboratory, pharmacy, reporting, billing, etc.). Implementing a Digital Public Good such as OpenMRS in a rural hospital in Burundi is key for improving patient care through better record-keeping and streamlined medical data management such as laboratory test results or drug prescriptions, ensuring that healthcare providers have accurate and up-to-date information. 

Additionally, it facilitates efficient tracking of public health trends and resource allocation, which is essential for addressing the unique healthcare challenges in rural settings. For example, the financial support from the government for child care and maternal care is conditional to digitalization - contributing to the long-term **viability and independence** of the hospital. 

### Users and teams
<img width="1167" alt="Screenshot 2024-08-06 at 4 44 07 PM" src="https://github.com/user-attachments/assets/6a96fa28-e012-4ee1-812f-d1a8c7f744a6">


## Quick Start using GitPod
You can run the project and contribute to it using GitPod in your browser or VSCode. This will allow you to easily run the project without installing dependencies on your local machine like Java SDK, Docker, etc.  

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/MadiroGlobalHealth/UVL-EMR/)

## Quick Start on localhost

### Prerequisites

1. Install or update [Git](https://git-scm.com/downloads)
2. Install or update [JAVA SDK](https://www.oracle.com/ca-en/java/technologies/downloads/) 
3. Install or update [Docker Compose](https://docs.docker.com/compose/install) (version ≥ 2.29)

### Clone and Install

Clone the repository locally
```bash
git clone https://github.com/MadiroGlobalHealth/UVL-EMR.git
```

Open the cloned folder
```bash
cd UVL-EMR
```
Add your GitHub credentials to `~/.m2/settings.xml` settings file. See [how to create a git github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
```xml
<servers>
  <server>
    <id>madiro-global-health-github-uvl-emr</id>
    <username>your_github_username</username>
    <password>your_github_token</password>
  </server>
</servers>
```

Build UVL distro/version of OpenMRS 3
```bash
./scripts/mvnw clean package
```

### Run and Open

Run UVL EMR (Mugamba polyclinic)
```bash
cd sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts
./start-demo.sh
```

Open **UVL EMR for end-users** (OpenMRS 3) in your browser (the installation can take a few minutes)
```bash
open http://localhost/
```

Open the **administration of UVL EMR** in your browser 
```bash
open http://localhost/openmrs/admin
```

Note that the default admin user is `admin` and the password is `Admin123`.

### Maven configuration
Sometimes, you might need to customize your Maven configuration file to build the project. 

On Mac, you can edit those settings using:
``vi ~/.m2/settings.xml``

Add the Maven Server config and API key in your Maven settings on your laptop:
```bash
  <servers>
    <server>
      <id>madiroglobalhealth-github-uvl-emr</id>
      <username>YOUR_GITHUB_USERNAME</username>
      <password>YOU_GITHUB_PASSWORD</password>
    </server>
  </servers>
```

## Configuration hierarchy and inheritance

#### Hierarchy overview
```
── pom.xml - Aggregator / Orchestrator
      └── /distro/pom.xml - UVL-wide Config
      └── /countries - Country-specific Config
            └── /burundi/pom.xl
      └── /sites - Site-specific Config
            └── /mugamba/pom.xl
```
## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please feel free to open an issue or submit a pull request.

## Acknowledgments

This project is made possible thanks to [OpenMRS](https://openmrs.org/), [OzoneHIS](https://www.ozone-his.com/), and [OpenConceptLab](https://openconceptlab.org/) communities. Special thanks to the contributors who have contributed to the development of these tools.

<div>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/OpenMRS_logo_2008.svg/1280px-OpenMRS_logo_2008.svg.png" height=60px>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://www.ozone-his.com/wp-content/uploads/2021/11/Ozone-Logo.png" height=60px>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://pbs.twimg.com/profile_images/1699787210458038272/dvtN516-_400x400.png" height=60px>
</div>

## Resources 

### OpenMRS resources

**Join the conversation**

[Slack](https://slack.openmrs.org/), [Calls](https://openmrs.atlassian.net/wiki/spaces/RES/pages/26278390), [Forum](https://talk.openmrs.org/), [Conferences](https://openmrs.atlassian.net/wiki/spaces/RES/pages/102694929/2024+Implementers+Conference), [JIRA](https://openmrs.atlassian.net/jira/dashboards/10000), [Wiki](https://openmrs.atlassian.net/wiki/spaces/projects/overview?homepageId=26935380)

**Learn more**

[OpenMRS Academy](https://openmrs.org/academy/), [Youtube](https://www.youtube.com/@OpenMRS) channel

**Code**

Official  [Github](https://github.com/openmrs)  repositories for OpenMRS

**Prerequisites**

[Git](https://git-scm.com/), [Docker Compose](https://docs.docker.com/compose/), [Maven](https://maven.apache.org/)

**Demo** to checkout and run locally [here](https://github.com/openmrs/openmrs-distro-referenceapplication)

### UVL Burundi Challenge resources 

[Slack Channel](https://join.slack.com/share/enQtNzUwNTI4NTczNzE3My01YzVhY2ZkZWNlNDQ5MzI1YjViYWEwZDYyMzg3ZGQyNGI0MWYwMGU4MmQwNThhMDVlMGE2NjMyNzdhY2IwZWRi) for all participants to discuss the project

[JIRA project](https://madiroglobalhealth.atlassian.net/jira/software/projects/UVL/boards/1/backlog)  to pick up and accomplish tasks

## Contact

For any questions, please contact [Michael Bontyes](https://github.com/michaelbontyes) or reach out on the [OpenMRS Slack](https://slack.openmrs.org/).

## Sign up for the challenge
Enrollment are **open until September 1st, 2024**:   
[https://forms.gle/R1gTWSYYw1WWAErm7](https://forms.gle/R1gTWSYYw1WWAErm7) 

### Sprint Check-in 
## [Join Us](https://meet.google.com/bsp-wsyk-pwu)
📅 **Every Monday and Thursday 3:30 PM TO 4:00 PM EAT | 7:30 AM TO 8:00 AM UTC**


### 🏆 Key Achievements and Contributors
We extend our heartfelt thanks to everyone who contributed to making these milestones possible! Below are the key goals achieved, along with the contributors who made them happen:

| 🎯 **Goal**                                  | **Date**          | **Contributors**                               | **Relevant Links**                                                                                                      |
|--------------------------------------------------|-------------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| 🎯Add the status badge             | 08/15/2024                 | @sherrif10                                             | [PR](https://github.com/MadiroGlobalHealth/UVL-EMR/pull/1) |
| 🎯Configure Locations             | 08/20/2024                 | @michaelbontyes                                             | [Issue 6](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/6) |
| 🎯Display "Billing" in the sidebar             | 08/30/2024                 | @dancinoman                                             | [Issue 14](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/14) |
| 🎯Cloud Architecture Overview             | 09/01/2024                 | @tendomart                                             | [Issue 17](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/17) |
| 🎯Modify the Patient ID generator             | 09/04/2024                 | @sherrif10                                             | [Issue 25](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/25) |
| 🎯Add guide on how to add uvl repository to maven setting             | 09/10/2024                 | @jnsereko                                           | [PR 27](https://github.com/MadiroGlobalHealth/UVL-EMR/pull/27) |
| 🎯Fix Error with FHIR Backend module             | 09/25/2024                 | @wodpachua                                             | [Issue 15](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/15) |
| 🎯Test Initializer to add billable services in billing module             | 09/25/2024                 | @wodpachua                                             | [Issue 12](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/12) |
| 🎯Table to show achievements             | 09/27/2024                 | @suubi-joshua                                             | [PR 33](https://github.com/MadiroGlobalHealth/UVL-EMR/pull/33) |
| -          | -                 | -                                              | -


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
