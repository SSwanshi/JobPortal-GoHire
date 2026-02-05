const { gql } = require('graphql-tag');

const typeDefs = gql`
  # User type represents the authenticated user
  type User {
    userId: String!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    gender: String!
    memberSince: String
    resumeId: String
    profileImageId: String
    collegeName: String
    skills: String
    about: String
    linkedinProfile: String
    githubProfile: String
    portfolioWebsite: String
    workExperience: String
    achievements: String
    twoFactorEnabled: Boolean
    createdAt: String
  }

  # Profile type with additional information
  type Profile {
    user: User!
    isPremium: Boolean!
    resumeName: String
    applicationHistory: [Application]
  }

  # Application type for job/internship applications
  type Application {
    type: String!
    title: String!
    company: String!
    appliedAt: String!
    status: String!
    applicationId: String!
  }

  # Auth response for login/signup
  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
    require2FA: Boolean
    email: String
  }

  # Input types for mutations
  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    gender: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    collegeName: String
    skills: String
    about: String
    linkedinProfile: String
    githubProfile: String
    portfolioWebsite: String
    workExperience: String
    achievements: String
  }

  input EducationInput {
    institution: String
    degree: String
    fieldOfStudy: String
    startYear: String
    endYear: String
    grade: String
  }

  input ExperienceInput {
    company: String
    position: String
    startDate: String
    endDate: String
    description: String
    current: Boolean
  }

  input ProjectInput {
    title: String
    description: String
    technologies: [String]
    link: String
    startDate: String
    endDate: String
  }

  # Queries
  type Query {
    # Get current authenticated user
    me: User!
    
    # Get full profile with application history
    getProfile: Profile!
    
    # Health check
    health: String!
  }

  # Mutations
  type Mutation {
    # Authentication mutations
    signup(input: SignupInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    
    # Profile mutations
    updateProfile(input: UpdateProfileInput!): User!
  }
`;

module.exports = typeDefs;
