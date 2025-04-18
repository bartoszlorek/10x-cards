# API Endpoint Implementation Plan: Create Flashcards

## 1. Przegląd punktu końcowego

Endpoint `/api/flashcards` (POST) służy do tworzenia jednej lub wielu fiszek w ramach jednego żądania. Endpoint obsługuje zarówno ręcznie wprowadzane fiszki, jak i fiszki wygenerowane przez AI (zarówno bez zmian, jak i po edycji). Po pomyślnym utworzeniu, endpoint zwraca utworzone fiszki wraz z ich identyfikatorami i znacznikami czasu.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards`
- **Parametry:**
  - Brak parametrów zapytania
- **Request Body:**
  - Format JSON
  - Dwa możliwe formaty:
    1. Pojedyncza fiszka:
       ```json
       {
         "front": "Question text",
         "back": "Answer text",
         "source": "manual",
         "generation_id": 101
       }
       ```
    2. Tablica fiszek:
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

## 3. Wykorzystywane typy

- **Command Models:**
  - `FlashcardCreateCommand` - model używany do tworzenia pojedynczej fiszki
  - `BulkFlashcardCreateCommand` - model używany do tworzenia wielu fiszek
- **DTOs:**
  - `FlashcardDTO` - reprezentacja fiszki w odpowiedzi
- **Schema Walidacji:**
  - Zod schema do walidacji pojedynczej fiszki oraz tablicy fiszek

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - Kod statusu: 201 Created
  - Format odpowiedzi:
    1. Dla pojedynczej fiszki:
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
    2. Dla wielu fiszek:
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
- **Błędy:**
  - 400 Bad Request - nieprawidłowe dane wejściowe (np. zbyt długie pola, nieprawidłowy format)
  - 401 Unauthorized - brak autoryzacji
  - 404 Not Found - nieprawidłowy identyfikator generation_id

## 5. Przepływ danych

1. **Odbiór żądania**: Endpoint odbiera żądanie POST i normalizuje dane wejściowe do wspólnego formatu (tablica fiszek).
2. **Walidacja**: Dane wejściowe są walidowane za pomocą Zod, sprawdzając:
   - Poprawność pól (`front`, `back`, `source`, opcjonalnie `generation_id`)
   - Długość tekstu (`front` maksymalnie 200 znaków, `back` maksymalnie 500 znaków)
   - Poprawność wartości `source` (jedna z wartości: 'ai-full', 'ai-edited', 'manual')
   - Istnienie powiązanego rekordu generacji (jeśli podano `generation_id`)
3. **Przetwarzanie**: Po walidacji, dane są przekazywane do serwisu obsługującego fiszki.
4. **Dostęp do bazy danych**: Serwis używa klienta Supabase do wstawienia nowych rekordów do tabeli `flashcards`.
5. **Generowanie odpowiedzi**: Po pomyślnym dodaniu, pobierane są utworzone rekordy i zwracane jako odpowiedź.

## 6. Względy bezpieczeństwa

1. **Uwierzytelnianie**: Wszystkie żądania muszą zawierać token uwierzytelniający (Bearer token).
2. **Autoryzacja**: Implementacja Row Level Security (RLS) zapewnia, że użytkownik może dodawać fiszki tylko do własnego konta.
3. **Walidacja danych wejściowych**: Dokładna walidacja wszystkich pól wejściowych za pomocą Zod przed wykonaniem operacji na bazie danych.
4. **Sanityzacja danych**: Zapobieganie atakom XSS poprzez właściwą sanityzację pól tekstowych.
5. **Weryfikacja generacji**: Sprawdzanie, czy `generation_id` należy do zalogowanego użytkownika.

## 7. Obsługa błędów

1. **Nieprawidłowe dane wejściowe**:
   - Nieprawidłowy format pól - zwracane szczegółowe komunikaty o błędach walidacji (400 Bad Request)
   - Przekroczenie dopuszczalnej długości pól - komunikat o przekroczeniu limitu znaków (400 Bad Request)
   - Nieprawidłowa wartość `source` - komunikat o dozwolonych wartościach (400 Bad Request)
2. **Niepowodzenie uwierzytelniania**:
   - Brak tokenu - komunikat o wymaganym uwierzytelnieniu (401 Unauthorized)
   - Nieprawidłowy token - komunikat o nieprawidłowym tokenie (401 Unauthorized)
3. **Niepowodzenie autoryzacji**:
   - Próba dodania fiszki do nieistniejącej generacji (404 Not Found)
   - Próba dodania fiszki do generacji należącej do innego użytkownika (404 Not Found lub 403 Forbidden)
4. **Błędy bazy danych**:
   - Konflikt unikalności - informacja o konflikcie (409 Conflict)
   - Inne błędy bazy danych - ogólny komunikat o błędzie serwera (500 Internal Server Error)

## 8. Rozważania dotyczące wydajności

1. **Transakcje bazy danych**: Użycie transakcji przy dodawaniu wielu fiszek, aby zapewnić atomowość operacji.
2. **Indeksowanie**: Tabela `flashcards` ma już indeksy na kolumnach `user_id` i `generation_id`, co przyspiesza operacje.
3. **Obsługa dużych pakietów danych**: Ustalenie rozsądnego limitu ilości fiszek, które można dodać w jednym żądaniu (np. 100).
4. **Efektywne zapytania**: Optymalizacja zapytań do bazy danych, aby zminimalizować ilość operacji.

## 9. Etapy wdrożenia

1. Utworzenie pliku endpointu:

   - Stwórz nowy plik API (np. src/pages/api/flashcards.ts) w projekcie opartym na Astro.
   - Ustaw eksport właściwości (prerender = false) by umożliwić dynamiczne przetwarzanie.
   - Zaimportuj wymagane moduły, takie jak biblioteka Zod do walidacji, typ APIRoute oraz serwis FlashcardService.

2. Projektowanie walidacji danych wejściowych:

   - Zaplanuj strukturę walidatora przy użyciu biblioteki Zod. Określ wymogi dla pojedynczej fiszki:
     - Pole "front" musi być ciągiem znaków o maksymalnej długości 200.
     - Pole "back" musi być ciągiem znaków o maksymalnej długości 500.
     - Pole "source" powinno przyjmować jedną z określonych wartości (np. "ai-full", "ai-edited", "manual").
     - Opcjonalne pole "generation_id" powinno przyjmować wartość liczbową lub null.
   - Zaprojektuj dodatkowy schemat walidacji umożliwiający obsługę zbioru danych (tablica fiszek) lub pojedynczego obiektu.

3. Opracowanie serwisu fiszek:

   - W osobnym module (np. src/lib/services/flashcard.service.ts) zaplanuj implementację serwisu:
     - Metoda tworząca pojedynczą fiszkę – wstawienie rekordu do tabeli z automatycznym powiązaniem identyfikatora użytkownika.
     - Metoda obsługująca tworzenie wielu fiszek jednocześnie z wykorzystaniem transakcji bazy danych.
     - Metoda weryfikująca, czy przekazany identyfikator generation_id należy do zalogowanego użytkownika, co jest niezbędne do zachowania poprawności danych.

4. Implementacja logiki w handlerze POST:

   - Zaimplementuj endpoint POST, który:
     - Sprawdza, czy żądanie pochodzi od uwierzytelnionego użytkownika i w razie braku sesji zwraca komunikat 401 Unauthorized.
     - Parsuje treść żądania i waliduje go na podstawie uprzednio zaprojektowanego schematu.
     - Normalizuje dane wejściowe – zawsze przekształcając je do formatu tablicy fiszek, niezależnie czy żądanie zawiera pojedynczy obiekt czy zbiór.
     - Dla każdej fiszki, która zawiera generation_id, wykonuje proces weryfikacji, aby upewnić się, że identyfikator generacji jest poprawny i należy do użytkownika.
     - Przekazuje zweryfikowane dane do serwisu fiszek, odbiera wynik operacji i przygotowuje odpowiedź JSON (z kodem 201 w przypadku sukcesu).

5. Weryfikacja poprawności działania poprzez testy:

   - Przygotuj testy jednostkowe, które sprawdzą poprawność walidacji danych wejściowych.
   - Zorganizuj testy integracyjne, aby upewnić się, że endpoint poprawnie komunikuje się z bazą danych oraz że serwis fiszek działa zgodnie z oczekiwaniami.
   - Testy powinny symulować różne scenariusze: zarówno pojedyncze żądania, jak i operacje zbiorcze, a także przypadki błędów (np. niepoprawny format danych, błędna autoryzacja, nieprawidłowy generation_id).

6. Aktualizacja dokumentacji API:

   - Uaktualnij dokumentację, opisując nowe możliwości endpointu.
   - Dodaj przykłady zapytań i odpowiedzi, a także szczegółową specyfikację możliwych błędów (np. 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).
   - Dokumentacja powinna ułatwić przyszłe wdrożenia oraz integrację z innymi systemami.

7. Finalna weryfikacja i wdrożenie:
   - Po zakończeniu implementacji oraz testów przekaż zmiany do zespołu recenzentów lub przeprowadź code review.
   - Zaplanuj wdrożenie na środowisko produkcyjne, upewniając się, że wszelkie zmiany są zgodne z obowiązującymi standardami bezpieczeństwa oraz wydajności.
   - Monitoruj działanie nowego endpointu i w razie potrzeby przygotuj strategię rollbacku.
