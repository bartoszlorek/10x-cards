# REST API Plan

## 1. Resources

- **Users**: Represents application users (table: `users`). Contains user details including email, password hash, and timestamps. Managed mainly via Supabase Auth, but also supports account deletion.
- **Flashcards**: Represents both manually created and AI-generated flashcards (table: `flashcards`). Each flashcard includes fields `front`, `back`, `source` (with allowed values: 'ai-full', 'ai-edited', 'manual'), timestamps, and associations to a generation (if applicable) and a user.
- **Generations**: Represents records of AI flashcard generation requests (table: `generations`). Contains details such as the model used, counts of generated and accepted flashcards, source text metadata, generation duration and timestamps.
- **Generation Error Logs**: Captures any errors during flashcard generation (table: `generation_error_logs`). Contains error codes, messages, and relevant source text metadata.

## 2. Endpoints

### 2.1. Flashcard Endpoints

1. **List Flashcards**

   - **Method**: GET
   - **URL**: `/api/flashcards`
   - **Description**: Retrieves a paginated list of flashcards for the authenticated user.
   - **Query Parameters**:
     - `page`: number (optional, default: 1)
     - `limit`: number (optional, default: 20)
     - `sort`: field name (e.g., `created_at`)
     - `order`: `asc` or `desc`
     - `source`: string (optional) - Filter flashcards by their source (allowed values: "ai-full", "ai-edited", "manual")
     - `generation_id`: number (optional) - Filter flashcards by the associated generation record ID
   - **Response (JSON)**:
     ```json
     {
       "flashcards": [
         {
           "id": 1,
           "front": "Question text",
           "back": "Answer text",
           "source": "manual",
           "generation_id": 102, // null for source manual
           "created_at": "ISO8601 timestamp",
           "updated_at": "ISO8601 timestamp"
         }
       ],
       "pagination": { "page": 1, "limit": 20, "total": 50 }
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized

2. **Get Single Flashcard**

   - **Method**: GET
   - **URL**: `/api/flashcards/:id`
   - **Description**: Retrieves detailed information for a single flashcard specified by its ID for the authenticated user.
   - **Response (JSON)**:
     ```json
     {
       "id": 123,
       "front": "Question text",
       "back": "Answer text",
       "source": "manual",
       "generation_id": 101, // null for source manual
       "created_at": "ISO8601 timestamp",
       "updated_at": "ISO8601 timestamp"
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

3. **Create Flashcards**

   - **Method**: POST
   - **URL**: `/api/flashcards`
   - **Description**: Creates one or more flashcards in a single request. This endpoint supports both manually entered flashcards and AI-generated flashcards (full and edited).
   - **Request Payload (JSON)**:
     The endpoint accepts either a single flashcard object:
     ```json
     {
       "front": "Question text",
       "back": "Answer text",
       "source": "manual",
       "generation_id": 101 // null for source manual
     }
     ```
     or an array of flashcard objects:
     ```json
     {
       "flashcards": [
         {
           "front": "Question text",
           "back": "Answer text",
           "source": "manual",
           "generation_id": 101
         },
         {
           "front": "Another question text",
           "back": "Another answer text",
           "source": "ai-full",
           "generation_id": 102
         }
       ]
     }
     ```
   - **Response (JSON)**:
     For a single flashcard:
     ```json
     {
       "id": 123,
       "front": "Question text",
       "back": "Answer text",
       "source": "manual",
       "generation_id": 101,
       "created_at": "ISO8601 timestamp",
       "updated_at": "ISO8601 timestamp"
     }
     ```
     For multiple flashcards:
     ```json
     {
       "flashcards": [
         {
           "id": 123,
           "front": "Question text",
           "back": "Answer text",
           "source": "manual",
           "generation_id": 101,
           "created_at": "ISO8601 timestamp",
           "updated_at": "ISO8601 timestamp"
         },
         {
           "id": 124,
           "front": "Another question text",
           "back": "Another answer text",
           "source": "ai-full",
           "generation_id": 102,
           "created_at": "ISO8601 timestamp",
           "updated_at": "ISO8601 timestamp"
         }
       ]
     }
     ```
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request, 401 Unauthorized

4. **Update Flashcard**

   - **Method**: PUT
   - **URL**: `/api/flashcards/:id`
   - **Description**: Updates an existing flashcard. The `updated_at` timestamp is automatically updated on record modifications.
   - **Request Payload (JSON)**:
     ```json
     {
       "front": "Updated question text",
       "back": "Updated answer text",
       "source": "manual", // or the appropriate type if edited from AI
       "generation_id": 102 // null for source manual
     }
     ```
   - **Response (JSON)**:
     ```json
     {
       "id": 123,
       "front": "Updated question text",
       "back": "Updated answer text",
       "source": "manual",
       "created_at": "ISO8601 timestamp",
       "updated_at": "ISO8601 timestamp"
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

5. **Delete Flashcard**

   - **Method**: DELETE
   - **URL**: `/api/flashcards/:id`
   - **Description**: Deletes a flashcard after user confirmation.
   - **Response (JSON)**:
     ```json
     { "message": "Flashcard successfully deleted." }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

### 2.3. Generation Endpoints (AI Flashcard Generation)

1. **Generate Flashcards**

   - **Method**: POST
   - **URL**: `/api/generations`
   - **Description**: Initiates AI flashcard generation. Accepts a text input and returns a generation record with proposed flashcards.
   - **Request Payload (JSON)**:
     ```json
     {
       "text": "A long text content between 1000 and 10000 characters..."
     }
     ```
   - **Response (JSON)**:
     ```json
     {
       "generation": {
         "id": 456,
         "model": "model-name",
         "generated_count": 10,
         "accepted_unedited_count": null,
         "accepted_edited_count": null,
         "source_text_hash": "hashvalue",
         "source_text_length": 1500,
         "generation_duration": 2500,
         "created_at": "ISO8601 timestamp",
         "updated_at": "ISO8601 timestamp"
       },
       "flashcards_proposals": [
         { "front": "Question from AI", "back": "Answer from AI", "source": "ai-full" }
         // ... additional flashcards ...
       ]
     }
     ```
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request (e.g. if text length is out of bounds), 500 Internal Server Error (if AI service fails)

2. **List Generations**

   - **Method**: GET
   - **URL**: `/api/generations`
   - **Description**: Retrieves a list of flashcard generation records for the authenticated user.
   - **Query Parameters**:
     - `page`: number (optional)
     - `limit`: number (optional)
   - **Response (JSON)**:
     ```json
     {
       "generations": [
         {
           "id": 456,
           "model": "model-name",
           "generated_count": 10,
           "created_at": "ISO8601 timestamp"
         }
       ],
       "pagination": { "page": 1, "limit": 20, "total": 5 }
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized

3. **Get Generation Details**
   - **Method**: GET
   - **URL**: `/api/generations/:id`
   - **Description**: Retrieves detailed information about a specific generation, including associated flashcards.
   - **Response (JSON)**:
     ```json
     {
       "generation": {
         /* detailed generation record */
       },
       "flashcards": [
         /* related flashcards */
       ]
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

### 2.4. Generation Error Log Endpoints

1. **List Generation Error Logs**
   - **Method**: GET
   - **URL**: `/api/generation-error-logs`
   - **Description**: Retrieves a list of generation error logs for the authenticated user to review AI generation issues.
   - **Response (JSON)**:
     ```json
     {
       "error_logs": [
         {
           "id": 789,
           "model": "model-name",
           "error_code": "E123",
           "error_message": "Description of error",
           "created_at": "ISO8601 timestamp"
         }
       ]
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized

## 3. Authentication and Authorization

- All endpoints (except for registration and login) require authentication via a Bearer token. This token is provided by Supabase Auth or a JWT issuance mechanism integrated with it.
- The API enforces Row-Level Security (RLS) by matching the `user_id` on resources with the authenticated user's ID.
- Role-based access controls and rate limiting should be implemented at the gateway/API level to ensure security and performance.

## 4. Validation and Business Logic

- **Flashcards**:

  - Validate that `front` does not exceed 200 characters and `back` does not exceed 500 characters.
  - The `source` field must be one of: `ai-full`, `ai-edited`, or `manual`.
  - On updates, the `updated_at` is automatically maintained by the database trigger.

- **Generations**:

  - Ensure the input text length is between 1000 and 10000 characters.
  - Record metadata such as `source_text_hash`, `source_text_length`, and `generation_duration` post AI processing.
  - Capture counts for generated flashcards as well as counts for accepted flashcards (both edited and unedited).

- **Generation Error Logs**:

  - Log errors with clear codes and descriptive messages for any issues during AI flashcard generation.

- **Business Logic Mapping**:

  - The AI generation endpoint interfaces with an external LLM service. In case of failures, errors are logged in `generation_error_logs`.
  - User actions on flashcards proposal (approval, editing, rejection) update the `source` field accordingly.

- **General Error Handling & API Responses**:
  - Utilize standard HTTP status codes (200, 201, 400, 401, 404, 500) with clear error messages to assist in troubleshooting.
  - Input validations employ early return strategies with appropriate error details returned in the response payload.

---

_Assumptions_:

- The authentication mechanism leverages Supabase Auth, and account management endpoints are implemented as wrappers or extensions of the Supabase SDK.
- Rate limiting, input sanitization, and detailed error logging are managed by API gateway middleware and/or within individual endpoints.
