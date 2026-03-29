# Admin GraphQL API Documentation

## Overview

GraphQL endpoint for admin service is available at:
```
POST http://localhost:9000/graphql
```

GraphQL IDE (Apollo Sandbox) is available at:
```
GET http://localhost:9000/graphql
```

---

## Batch Query (Main Feature)

Retrieve all applicants, recruiters, and companies in a single request:

### Query
```graphql
query GetAllData {
  batchQuery {
    applicants {
      id
      firstName
      lastName
      email
      companyName
      appliedAt
    }
    recruiters {
      id
      firstName
      lastName
      email
      createdAt
    }
    companies {
      id
      companyName
      website
      location
      verified
    }
    totalApplicants
    totalRecruiters
    totalCompanies
  }
}
```

### Response
```json
{
  "data": {
    "batchQuery": {
      "applicants": [
        {
          "id": "507f1f77bcf86cd799439011",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "companyName": "Tech Corp",
          "appliedAt": "2026-03-29T10:30:00.000Z"
        }
      ],
      "recruiters": [
        {
          "id": "507f1f77bcf86cd799439012",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com",
          "createdAt": "2026-03-28T15:00:00.000Z"
        }
      ],
      "companies": [
        {
          "id": "507f1f77bcf86cd799439013",
          "companyName": "Tech Corp",
          "website": "https://techcorp.com",
          "location": "New York",
          "verified": true
        }
      ],
      "totalApplicants": 150,
      "totalRecruiters": 45,
      "totalCompanies": 30
    }
  }
}
```

---

## Individual Queries

### Get All Applicants
```graphql
query {
  applicants {
    id
    firstName
    lastName
    email
    companyName
    appliedAt
  }
}
```

### Get Applicant by ID
```graphql
query {
  applicant(id: "507f1f77bcf86cd799439011") {
    id
    firstName
    lastName
    email
    companyName
    appliedAt
    resumeId
  }
}
```

### Get All Recruiters
```graphql
query {
  recruiters {
    id
    firstName
    lastName
    email
    createdAt
  }
}
```

### Get Recruiter by ID
```graphql
query {
  recruiter(id: "507f1f77bcf86cd799439012") {
    id
    firstName
    lastName
    email
    createdAt
  }
}
```

### Get All Companies
```graphql
query {
  companies {
    id
    companyName
    website
    location
    logoId
    verified
    createdAt
    updatedAt
  }
}
```

### Get Companies by Verification Status
```graphql
query {
  companiesByVerificationStatus(verified: true) {
    id
    companyName
    verified
    website
    location
  }
}
```

### Get Company by ID
```graphql
query {
  company(id: "507f1f77bcf86cd799439013") {
    id
    companyName
    website
    location
    verified
    proofDocumentId
    createdAt
  }
}
```

### Get Admin Statistics
```graphql
query {
  stats {
    totalApplicants
    totalRecruiters
    totalCompanies
    verifiedCompanies
    unverifiedCompanies
  }
}
```

---

## Mutations

### Verify Company
```graphql
mutation {
  verifyCompany(id: "507f1f77bcf86cd799439013") {
    success
    message
    data {
      id
      companyName
      verified
    }
  }
}
```

### Delete Company
```graphql
mutation {
  deleteCompany(id: "507f1f77bcf86cd799439013") {
    success
    message
  }
}
```

### Delete Applicant
```graphql
mutation {
  deleteApplicant(id: "507f1f77bcf86cd799439011") {
    success
    message
  }
}
```

### Delete Recruiter
```graphql
mutation {
  deleteRecruiter(id: "507f1f77bcf86cd799439012") {
    success
    message
  }
}
```

---

## Usage Examples

### Using cURL
```bash
curl -X POST http://localhost:9000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { batchQuery { applicants { id firstName email } recruiters { id firstName email } companies { id companyName verified } totalApplicants totalRecruiters totalCompanies } }"
  }'
```

### Using Fetch API (JavaScript)
```javascript
const query = `
  query GetAllData {
    batchQuery {
      applicants { id firstName lastName email }
      recruiters { id firstName lastName email }
      companies { id companyName verified }
      totalApplicants
      totalRecruiters
      totalCompanies
    }
  }
`;

fetch('http://localhost:9000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Apollo Client (React)
```javascript
import { useQuery, gql } from '@apollo/client';

const BATCH_QUERY = gql`
  query GetAllData {
    batchQuery {
      applicants { id firstName lastName email }
      recruiters { id firstName lastName email }
      companies { id companyName verified }
      totalApplicants
      totalRecruiters
      totalCompanies
    }
  }
`;

export function AdminDashboard() {
  const { loading, error, data } = useQuery(BATCH_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { applicants, recruiters, companies } = data.batchQuery;
  
  return (
    <div>
      <h2>Admin Stats</h2>
      <p>Total Applicants: {data.batchQuery.totalApplicants}</p>
      <p>Total Recruiters: {data.batchQuery.totalRecruiters}</p>
      <p>Total Companies: {data.batchQuery.totalCompanies}</p>
    </div>
  );
}
```

---

## Type Definitions

### Applicant
```graphql
type Applicant {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  companyName: String!
  resumeId: String
  appliedAt: String!
}
```

### Recruiter
```graphql
type Recruiter {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  createdAt: String!
}
```

### Company
```graphql
type Company {
  id: ID!
  companyName: String!
  website: String
  location: String
  logoId: String
  verified: Boolean!
  proofDocumentId: String
  createdAt: String!
  updatedAt: String!
}
```

### BatchQueryResult
```graphql
type BatchQueryResult {
  applicants: [Applicant!]!
  recruiters: [Recruiter!]!
  companies: [Company!]!
  totalApplicants: Int!
  totalRecruiters: Int!
  totalCompanies: Int!
}
```

### AdminStats
```graphql
type AdminStats {
  totalApplicants: Int!
  totalRecruiters: Int!
  totalCompanies: Int!
  verifiedCompanies: Int!
  unverifiedCompanies: Int!
}
```

---

## Benefits of GraphQL Over REST

### Before (REST - Multiple Requests):
```javascript
// Request 1
const applicants = await fetch('/api/applicants').then(r => r.json());

// Request 2
const recruiters = await fetch('/api/recruiters').then(r => r.json());

// Request 3
const companies = await fetch('/api/companies').then(r => r.json());
```

### After (GraphQL - Single Request):
```javascript
const { applicants, recruiters, companies } = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: BATCH_QUERY })
}).then(r => r.json()).then(d => d.data.batchQuery);
```

**Benefits:**
- ✅ Single network request instead of 3
- ✅ No over-fetching (request only needed fields)
- ✅ Faster frontend experience
- ✅ Better for mobile/low-bandwidth
- ✅ Reduced server load

---

## Error Handling

GraphQL errors are structured as:
```json
{
  "errors": [
    {
      "message": "Invalid applicant ID",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

---

## Testing with Apollo Sandbox

1. Open `http://localhost:9000/graphql` in your browser
2. Try the batch query example provided above
3. Use the built-in documentation explorer (left sidebar)
4. Test mutations using the interface

---

## Next Steps

- Consider adding authentication middleware to GraphQL
- Add pagination to handle large datasets
- Implement caching strategies
- Add subscription support for real-time updates
