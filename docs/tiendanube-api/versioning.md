---
title: Versioning
source: https://tiendanube.github.io/api-documentation/versioning
version: 2025-03
---

# Versioning

We use Date-Based versioning four our stable releases of the API.

To ensure stability and maintain a reliable API for our users, we will introduce a new approach to feature management:

- Unstable Version: New features will be introduced in the unstable versions before they are officially released. This allows for testing and feedback before committing changes to stable versions.

- Stable Versions: A stable version is a release that has undergone sufficient testing and validation to be considered reliable for production use. It does not receive experimental changes and is only updated with bug fixes, security patches, and necessary maintenance updates.
We will follow an annual plan for stable releases, coordinating with all teams, and ensuring that a thoroughly tested version is available at least once a year, allowing users to plan their updates accordingly.

## Date-Based Versioning (e.g., YYYY-MM)

Date-based versioning uses the year and month (e.g., `2025-01`) to define the version. This approach provides temporal context and allows for more frequent updates without the constraints of fixed numbering.

#### Key Features:

- **Format**: `YYYY-MM`, where `YYYY` represents the year, and `MM` represents the month.

- **Granularity**: Allows finer granularity for updates and improvements.

##### Example:

- **2025-01**: January 2025 version.

- **2025-06**: June 2025 version, indicating updates since January.

#### Benefits of Date-Based Versioning

- **Clear Evolution Path**: Users can easily determine when changes were introduced.

- **Encourages Incremental Updates**: Simplifies rolling out frequent improvements.

- **Improved Planning**: Aligns API versions with organizational release cycles.

- **Backward Compatibility Clarity**: Clearly communicates the age and relevance of an API version.