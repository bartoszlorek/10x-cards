# API Endpoint Implementation Plan: Generate Flashcards Endpoint

## 1. Przegląd punktu końcowego

Punkt końcowy służy do inicjowania procesu generacji fiszek na podstawie dostarczonego tekstu. Jego zadaniem jest przekazanie dużego bloku tekstu do systemu AI, który generuje propozycje fiszek. Rezultatem jest rekord generacji wraz z listą propozycji fiszek, które użytkownik może zatwierdzić lub odrzucić.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/generations
- **Parametry:**
  - Brak parametrów zapytania
- **Request Body:**
  - JSON z jednym polem:
    - `text` (string) – wymagany, tekst o długości między 1000 a 10000 znaków
- **Walidacja:**
  - Sprawdzenie, czy `text` zawiera od 1000 do 10000 znaków

## 3. Wykorzystywane typy

- **Command Model:**
  - `GenerateFlashcardsCommand` (pole: `text` typu string)
- **DTO:**
  - `GenerationDTO` – reprezentuje rekord generacji (bez `user_id`)
  - `FlashcardProposalDTO` – reprezentuje pojedynczą propozycję fiszki (pola: `front`, `back`, `source`)
  - `GenerationResponseDTO` – struktura odpowiedzi zawierająca:
    - `generation`: GenerationDTO
    - `flashcards_proposals`: FlashcardProposalDTO[]

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - Kod statusu: 201 Created
  - Przykładowe ciało odpowiedzi:
    ```json
    {
      "generation": {
        /* pola GenerationDTO */
      },
      "flashcards_proposals": [{ "front": "Question from AI", "back": "Answer from AI", "source": "ai-full" }]
    }
    ```
- **Błędy:**
  - 400 Bad Request – dla błędów walidacji (np. tekst poza dozwolonym zakresem)
  - 401 Unauthorized – w przypadku braku lub niewłaściwego tokena autoryzacyjnego
  - 500 Internal Server Error – w razie problemów z zewnętrznym serwisem AI lub innych błędów backendowych

## 5. Przepływ danych

1. Odbiór żądania: Endpoint przyjmuje żądanie POST z polem `text` w ciele żądania.
2. Walidacja wejścia: Sprawdzenie długości tekstu oraz poprawności formatu przy użyciu Zod lub podobnego narzędzia walidacyjnego.
3. Wywołanie logiki biznesowej: Przekazanie tekstu do warstwy serwisowej (np. `generation.service`) odpowiedzialnej za komunikację z zewnętrznym serwisem AI (np. Openrouter.ai).
4. Interakcja z AI: Usługa AI generuje listę propozycji fiszek na podstawie otrzymanego tekstu.
5. Zapis w bazie danych: Utworzenie rekordu generacji w tabeli `generations` powiązanego z zalogowanym użytkownikiem. Propozycje fiszek nie są jeszcze trwałe i pojawią się dopiero po zatwierdzeniu.
6. Zwrócenie odpowiedzi: Endpoint zwraca rekord generacji oraz wygenerowane propozycje fiszek.

## 6. Względy bezpieczeństwa

- **Autoryzacja:**
  - Endpoint wymaga tokena Bearer, który jest weryfikowany przez Supabase Auth.
- **RLS:**
  - Użycie polityk RLS w tabelach `generations` (dostęp tylko dla właściciela zasobu).
- **Walidacja danych:**
  - Silna walidacja wejścia (np. długość tekstu) przy użyciu Zod.
- **Ograniczenie zasobów:**
  - Ustalanie limitu długości tekstu, aby zapobiegać przeciążeniu zasobów AI.

## 7. Obsługa błędów

- **Błędy walidacji:**
  - Zwracany kod 400 Bad Request wraz z opisem problemu.
- **Autoryzacja:**
  - Zwracany kod 401 Unauthorized, gdy token nie jest prawidłowy lub brakuje go.
- **Błędy zewnętrznego serwisu AI:**
  - Zwracany kod 500 Internal Server Error.
  - Szczegóły błędu logowane w tabeli `generation_error_logs` (uwzględniając kod błędu i komunikat).
- **Globalna obsługa wyjątków:**
  - Middleware odpowiedzialny za wychwytywanie nieobsłużonych wyjątków i zwracanie standardowego komunikatu błędu.

## 8. Rozważania dotyczące wydajności

- **Timeout dla wywołań ai:**
  - 60 sekund na czas oczekiwania, inaczej błąd timeout.
- **Optymalizacja zapytań:**
  - Zapewnienie indeksów na kolumnie `user_id` w tabeli `generations`.
- **Asynchroniczność:**
  - Wywołania do serwisu AI mogą być asynchroniczne, aby nie blokować głównej pętli przetwarzania.
- **Monitoring:**
  - Monitorowanie czasu odpowiedzi, aby szybko identyfikować potencjalne wąskie gardła.
- **Cache'owanie:**
  - Rozważenie cache'owania wyników, jeśli to ma sens biznesowy.

## 9. Etapy wdrożenia

1. **Walidacja wejścia:**
   - Stworzenie lub aktualizacja walidatora (np. za pomocą Zod) dla pola `text`.
2. **Warstwa serwisowa:**
   - Implementacja serwisu do obsługi logiki generacji fiszek, komunikacji z AI oraz logiki zapisu do bazy danych.
   - Na etapie dewelopmentu skorzystamy z mocków zamiast wywoływania serwisu AI.
3. **Implementacja endpointu:**
   - Utworzenie pliku API (np. w `src/pages/api/generations.ts`) zawierającego logikę odbioru żądania, autoryzacji oraz wywołania warstwy serwisowej.
4. **Integracja z Supabase:**
   - Upewnienie się, że endpoint poprawnie wykorzystuje Supabase Auth i polityki RLS.
5. **Obsługa błędów:**
   - Implementacja mechanizmów wychwytywania i logowania błędów, zarówno walidacyjnych, jak i pochodzących z serwisu AI.
6. **Testy:**
   - Przeprowadzenie testów jednostkowych i integracyjnych covering scenariusze sukcesu oraz błędów (np. błędna długość tekstu, błąd AI, nieautoryzowany dostęp).
7. **Optymalizacja:**
   - Monitorowanie wydajności i, jeśli konieczne, dalsza optymalizacja kodu oraz zapytań do bazy danych.
