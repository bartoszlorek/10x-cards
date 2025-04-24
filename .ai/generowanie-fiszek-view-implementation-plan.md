# Plan implementacji widoku generowanie fiszek

## 1. Przegląd

Widok generowania fiszek umożliwia użytkownikowi wprowadzenie długiego tekstu (od 1000 do 10 000 znaków) w celu wygenerowania propozycji flashcards przez AI. Użytkownik ma możliwość przeglądania, zatwierdzania, edytowania i odrzucania propozycji fiszek. Widok wspiera walidację danych wejściowych, komunikaty błędów oraz stany ładowania.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/generate`.

## 3. Struktura komponentów

- **GenerateFlashcardsPage**: Główny kontener widoku.
  - **TextInputArea**: Pole tekstowe do wprowadzenia tekstu.
  - **GenerateButton**: Przycisk inicjujący proces generacji.
  - **FlashcardsProposalList**: Lista wyświetlająca propozycje fiszek.
    - **FlashcardProposalItem**: Pojedynczy element listy z akcjami (zatwierdź, edytuj, odrzuć).
  - **LoadingSkeleton**: Komponent wyświetlający stan ładowania.
  - **ErrorMessage**: Komponent wyświetlający komunikaty błędów.
  - **BulkSaveButton**: Przycisk umożliwiający zbiorczy zapis fiszek.

## 4. Szczegóły komponentów

### GenerateFlashcardsPage

- **Opis**: Główny komponent strony obsługujący logikę formularza i integrację z API.
- **Elementy**: Formularz z `TextInputArea`, `GenerateButton`, a także sekcja na wyniki generacji i komunikaty błędów.
- **Obsługiwane zdarzenia**:
  - Submit formularza, który inicjuje wywołanie API.
  - Aktualizacja stanu tekstu.
- **Walidacja**: Sprawdzenie, czy wprowadzony tekst mieści się w przedziale 1000-10 000 znaków.
- **Typy**: Użycie `GenerateFlashcardsCommand` jako dane wejściowe; odpowiedzi typu `GenerationResponseDTO`.
- **Propsy**: Brak (komponent stronowy).

### TextInputArea

- **Opis**: Pole tekstowe przeznaczone do wprowadzania długiego tekstu.
- **Elementy**: `<textarea>`.
- **Obsługiwane zdarzenia**:
  - `onChange` – aktualizacja stanu tekstu.
- **Walidacja**: Sprawdzenie minimalnej i maksymalnej liczby znaków.
- **Typy**: Lokalny stan typu `string`.
- **Propsy**: `value` (string), `onChange` (callback zmieniający wartość).

### GenerateButton

- **Opis**: Przycisk wysyłający dane do API.
- **Elementy**: `<button>` z etykietą, np. "Generuj".
- **Obsługiwane zdarzenia**:
  - `onClick` – inicjacja procesu generacji.
- **Walidacja**: Przycisk aktywny tylko gdy walidacja tekstu jest pozytywna.
- **Typy**: Brak dodatkowych typów.
- **Propsy**: `disabled` (boolean), `onClick` (callback), `label` (string).

### FlashcardsProposalList

- **Opis**: Lista wyświetlająca propozycje fiszek zwrócone przez API.
- **Elementy**: Lista `<ul>`/`<li>` lub zestaw komponentów karty.
- **Obsługiwane zdarzenia**: Przekazywanie akcji do poszczególnych elementów listy.
- **Walidacja**: Brak dedykowanej walidacji.
- **Typy**: Tablica obiektów typu `FlashcardProposalDTO`.
- **Propsy**: `proposals` – tablica propozycji.

### FlashcardProposalItem

- **Opis**: Element reprezentujący pojedynczą propozycję fiszki.
- **Elementy**: Przyciski akcji: zatwierdź, edytuj, odrzuć.
- **Obsługiwane zdarzenia**:
  - `onAccept` – zatwierdzenie propozycji.
  - `onEdit` – edycja treści fiszki.
  - `onReject` – odrzucenie propozycji.
- **Walidacja**: Walidacja edytowanych treści, jeśli dotyczy.
- **Typy**: Obiekt typu `FlashcardProposalDTO`.
- **Propsy**: `proposal` (obiekt), `onAccept`, `onEdit`, `onReject` (wszystkie callbacki).

### LoadingSkeleton

- **Opis**: Komponent wizualizujący stan ładowania podczas komunikacji z API.
- **Elementy**: Placeholdery lub animacje wskazujące ładowanie.
- **Obsługiwane zdarzenia**: Brak.
- **Walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**: `isLoading` (boolean).

### ErrorMessage

- **Opis**: Komponent do wyświetlania komunikatów o błędach.
- **Elementy**: Elementy tekstowe wyświetlające błąd.
- **Obsługiwane zdarzenia**: Brak.
- **Walidacja**: Brak.
- **Typy**: Komponent przyjmujący komunikat jako `string`.
- **Propsy**: `message` (string).

## 5. Typy

- **GenerateFlashcardsCommand**: { text: string } – dane wejściowe do API.
- **GenerationResponseDTO**: Zawiera:
  - `generation`: obiekt typu GenerationDTO.
  - `flashcards_proposals`: tablica obiektów `FlashcardProposalDTO`.
- **FlashcardProposalDTO**: { front: string, back: string, source: string }.
- **BulkFlashcardCreateCommand**: Obiekt zawierający pole `flashcards`, będące tablicą obiektów walidowanych według `singleFlashcardSchema`.

## 6. Zarządzanie stanem

- Użycie hooka `useState` do zarządzania stanem:
  - `text`: string – wartość wprowadzona przez użytkownika.
  - `loading`: boolean – stan ładowania przy wywołaniu API.
  - `error`: string | null – komunikat błędu.
  - `proposals`: FlashcardProposalDTO[] – lista zwróconych propozycji.
- Utworzenie customowego hooka (np. `useGenerateFlashcards`) do obsługi logiki wywołania API i aktualizacji stanu.

## 7. Integracja API

- Wywołanie endpointa `/api/generations` metodą POST przy wykorzystaniu typu `GenerateFlashcardsCommand`.
- Wysyłanie żądania z JSON-em zawierającym pole `text`.
- Otrzymywanie odpowiedzi w formacie `GenerationResponseDTO`.
- Obsługa kodów statusu:
  - 201 – sukces; wyświetlenie propozycji fiszek.
  - 400 – błąd walidacji; wyświetlenie komunikatu o błędnych danych.
  - 500 – błąd serwera; wyświetlenie ogólnego komunikatu o błędzie.
- Dla zbiorczego zapisu fiszek, wysyłane jest żądanie POST do `/api/flashcards` z ciałem zgodnym z typem `BulkFlashcardCreateCommand`.

## 8. Interakcje użytkownika

- Użytkownik wprowadza tekst do pola `TextInputArea`.
- Po naciśnięciu `GenerateButton` następuje walidacja danych i wywołanie API.
- W trakcie oczekiwania wyświetlany jest `LoadingSkeleton`.
- Po otrzymaniu odpowiedzi, `FlashcardsProposalList` prezentuje propozycje fiszek.
- Użytkownik może:
  - Zatwierdzić propozycję (akcja `onAccept`).
  - Edytować propozycję inline (akcja `onEdit`).
  - Odrzucić propozycję (akcja `onReject`).
- W przypadku błędów, `ErrorMessage` wyświetla odpowiedni komunikat.

## 9. Warunki i walidacja

- Tekst wprowadzony przez użytkownika musi mieścić się w zakresie 1000-10 000 znaków.
- `GenerateButton` aktywowany jest tylko, gdy walidacja tekstu jest pomyślna.
- Dodatkowa walidacja po stronie API (endpoint sprawdza długość tekstu).

## 10. Obsługa błędów

- Wyświetlanie komunikatów błędów za pomocą komponentu `ErrorMessage`:
  - Błędy walidacji (np. zły format danych, tekst zbyt krótki/długi).
  - Błędy sieciowe lub serwerowe (status 500).
- Zapobieganie wielokrotnym wysyłkom formularza przy wystąpieniu błędów.

## 11. Kroki implementacji

1. Utworzenie pliku strony: `src/pages/generate.astro` i powiązanego komponentu `GenerateFlashcardsPage`.
2. Implementacja komponentu `TextInputArea` z odpowiednią walidacją tekstu.
3. Implementacja komponentu `GenerateButton` z warunkiem aktywacji w oparciu o walidację.
4. Stworzenie customowego hooka `useGenerateFlashcards` do obsługi wywołania API i aktualizacji stanu.
5. Integracja z API: wysyłanie żądania POST do `/api/generations` z wykorzystaniem klasy `GenerateFlashcardsCommand` i obsługa odpowiedzi `GenerationResponseDTO`.
6. Implementacja komponentu `FlashcardsProposalList` wraz z `FlashcardProposalItem` do obsługi akcji zatwierdzania, edycji i odrzucania.
7. Dodanie komponentów `LoadingSkeleton` oraz `ErrorMessage` do obsługi stanu ładowania i błędów.
8. Testowanie walidacji danych wejściowych oraz poprawności integracji z API.
9. Korekta UX i optymalizacja wydajności interfejsu.
10. Implementacja komponentu `BulkSaveButton`. Po kliknięciu przycisku następuje zebranie danych fiszek do zapisu i wysłanie żądania POST do endpointu `/api/flashcards` z ciałem zgodnym z typem `BulkFlashcardCreateCommand`. Następnie odbywa się obsługa odpowiedzi oraz ewentualnych błędów.
