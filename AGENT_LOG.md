# Agent Interaction Log

This document records the usage of AI tools throughout the development of the Careers Builder project, highlighting key prompts, refinements, and strategic learnings.

## 1. Project Initialization & Architecture

*   **Goal**: Define a scalable yet simple architecture for a dynamic careers page builder application.
*   **Initial Prompt**: "What is the best architecture for a dynamic careers page builder application?"
*   **AI Suggestion**: The AI initially suggested a microservices architecture with separate services for Auth, Jobs, and Companies, along with GraphQL.
*   **Refinement/Overrule**:
    *   **Decision**: Overruled microservices in favor of a **Monolithic** architecture using Next.js App Router and MongoDb database.
    *   **Reasoning**: Microservices introduce unnecessary complexity for an MVP. A monolith is easier to deploy, debug, and maintain for a small team. REST was chosen over GraphQL for simplicity.

## 2. Database Schema Design

*   **Goal**: Create flexible schemas for Companies and Jobs.
*   **Prompt**: "Create Mongoose schemas for a Company (with theme settings) and Jobs. Ensure jobs are linked to companies."
*   **AI Output**: Provided basic schemas with `ref` linking.
*   **Refinement**:
    *   **Indexes**: Manually requested the addition of compound indexes (`company_id` + `job_slug`) to ensure unique URLs per company.
    *   **Enums**: Refined the `work_policy`, `employment_type`, `experience_level`, `job_type` fields to use strict Enums for better data consistency.

## 3. Testing & Debugging

*   **Goal**: Ensure API reliability and fix test failures.
*   **Prompt**: "Implement testing frameworks for testing every type of API route and component."
*   **Challenge**: The initial tests failed due to `mongoose` and `bson` ESM import errors in the Jest environment.
*   **Refinement**:
    *   **Jest Setup**: Removed the implementation of `mongoose` and `bson` ESM import errors in the Jest environment will apply later.
    *   **Config Update**: Modified `jest.config.js` to include `transformIgnorePatterns` for specific node modules.
    *   **Mocking**: Switched to mocking `NextRequest` and database calls (`jest.mock('@/lib/db')`) to isolate logic and avoid actual DB connections during tests.

## 4. Code Generation for UI(Multiple steps.)

*   **Goal**: Generate the code for UI and api integration.
*   **Prompt**: Design a basic layout for the careers page.
*   **AI Output**: A basic layout for the careers page.
*   **Refinement**: As I had the basic structure, I then incrementally added the UI components and corrected any mistakes from the AI. AI helped a lot in the UI generation process, but it was not perfect.

## 5. Code Generation for API integration and Database Manipulation(Multiple steps.)

*   **Goal**: Generate the code for API integration and Database Manipulation.
*   **Prompt**: Generate the basic (for example) job creation and deletion API.
*   **AI Output**: A simple and good API for job creation and deletion.
*   **Refinement**: AI was good at generating simple CRUD operations I just had to correct the mistakes related to the fields in the schema. AI helped a lot in the API generation process, but it was not perfect.

## 6. Documentation Generation (Only Basic Structure)

*   **Goal**: Create comprehensive documentation structure.
*   **Prompt**: "Generate a README.md, Tech spec.md and AGENT_LOG.md files with the functionality of the application."
*   **AI Output**: A solid structural outline and technical descriptions.
*   **Refinement**: AI was good at generating the basic structure of the documentation. But had to add the details according to our project.

## 5. Key Learnings

*   **AI as a Starter, not a Finisher**: AI is excellent at generating boilerplate code (schemas, basic components) and test structures. However, complex business logic (like specific filtering rules) and architectural decisions (Monolith vs. Microservices) require human engineering judgment.
*   **Context is King**: Providing specific constraints (e.g., "MVP", "Next.js App Router") yields much better results than generic prompts.
*   **Iterative Refinement**: The best code came from an iterative process—accepting the AI's draft, identifying gaps, and prompting for specific improvements.
