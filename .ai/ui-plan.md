# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Interfejs użytkownika dla 10x-cards składa się z kilku głównych widoków, które łączą się w spójną strukturę dostosowaną do potrzeb użytkownika. System zapewnia możliwość autoryzacji, generowania fiszek przez AI, zarządzania i edycji fiszek, przeglądania profilu użytkownika oraz udziału w sesji powtórkowej opartych na algorytmie spaced repetition. Projekt korzysta z Astro, React, Tailwind i komponentów Shadcn/ui, zapewniając responsywność oraz dostępność na różnych urządzeniach.

## 2. Lista widoków

### 2.1. Ekran autoryzacji

- Ścieżka: `/login` lub `/auth`
- Główny cel: Umożliwienie logowania i rejestracji użytkowników.
- Kluczowe informacje do wyświetlenia: Formularz logowania (email, hasło), komunikaty błędów, możliwość przejścia do rejestracji.
- Kluczowe komponenty widoku: Formularz logowania, formularz rejestracyjny, alerty błędów.
- UX, dostępność i bezpieczeństwo: Intuicyjny interfejs, walidacja pól formularza z komunikatami błędów, obsługa stanów ładowania, zabezpieczenia przed nieautoryzowanym dostępem.

### 2.2. Widok generowania fiszek

- Ścieżka: `/generate`
- Główny cel: Umożliwienie użytkownikowi generowania fiszek przy użyciu AI poprzez wprowadzenie tekstu.
- Kluczowe informacje do wyświetlenia: Pole tekstowe do wprowadzenia tekstu (od 1000 do 10 000 znaków), przycisk generowania, lista propozycji fiszek z opcjami zatwierdzania, edycji inline i odrzucania.
- Kluczowe komponenty widoku: TextArea, przycisk generowania, lista propozycji, przyciski akcji (akceptacja, edycja, odrzucenie), widok ładowania (skeleton), komunikaty błędów inline.
- UX, dostępność i bezpieczeństwo: Responsywny layout, natychmiastowa informacja o błędach (np. nieprawidłowa długość tekstu), wsparcie dla edycji inline bez utraty płynności interakcji, zabezpieczenia przed spamem.

### 2.3. Widok listy fiszek (zarządzanie fiszkami)

- Ścieżka: `/flashcards`
- Główny cel: Prezentacja listy zapisanych fiszek oraz umożliwienie edycji i usuwania za pomocą modala lub inline.
- Kluczowe informacje do wyświetlenia: Lista wszystkich fiszek użytkownika, opcje edycji inline (modal z możliwością zatwierdzenia zmian), przyciski do usuwania fiszek.
- Kluczowe komponenty widoku: Lista fiszek, modal edycji, przyciski do usuwania, alerty błędów.
- UX, dostępność i bezpieczeństwo: Jasna prezentacja danych, potwierdzenia operacji usunięcia, walidacja zmian, responsywny design.

### 2.4. Panel użytkownika

- Ścieżka: `/profile`
- Główny cel: Zarządzanie kontem użytkownika i wyświetlanie danych profilu.
- Kluczowe informacje do wyświetlenia: Dane osobowe, opcje edycji profilu, opcja wylogowania, informacja o statusie konta.
- Kluczowe komponenty widoku: Formularz edycji profilu, przyciski akcji, sekcja informacji.
- UX, dostępność i bezpieczeństwo: Intuicyjny interfejs, ochrona danych osobowych, responsywność, jasne komunikaty.

### 2.5. Ekran sesji powtórkowych

- Ścieżka: `/study`
- Główny cel: Umożliwienie użytkownikowi nauki fiszek przy użyciu algorytmu spaced repetition.
- Kluczowe informacje do wyświetlenia: Wyświetlanie kolejnych fiszek, prezentacja przodu fiszki z możliwością odsłonięcia tyłu, mechanizm oceny przyswojenia.
- Kluczowe komponenty widoku: Komponent wyświetlania fiszek, przyciski oceny, sekcja informacyjna o postępach, mechanizm sterujący sesją.
- UX, dostępność i bezpieczeństwo: Płynny interfejs dostosowujący się do działania użytkownika, jasne wskazówki, łatwa nawigacja między fiszkami, komunikaty o błędach.

## 3. Mapa podróży użytkownika

1. Użytkownik trafia na ekran autoryzacji (`/login`/`/auth`) i przeprowadza logowanie lub rejestrację.
2. Po pomyślnym zalogowaniu następuje automatyczne przekierowanie do widoku generowania fiszek (`/generate`).
3. Użytkownik wprowadza tekst do generowania fiszek i klika przycisk inicjujący proces generacji.
4. System prezentuje listę propozycji fiszek, gdzie użytkownik może:
   - Akceptować fiszki,
   - Edytować fiszki inline,
   - Odrzucać niepotrzebne propozycje.
5. Po weryfikacji i zaakceptowaniu propozycji, użytkownik zapisuje fiszki, które trafiają do bazy danych.
6. Użytkownik przechodzi do widoku listy fiszek (`/flashcards`), aby przeglądać, edytować lub usuwać zapisane fiszki.
7. Opcjonalnie, użytkownik odwiedza panel użytkownika (`/profile`) w celu zarządzania danymi konta lub wylogowania.
8. Użytkownik przechodzi do sesji powtórkowych (`/study`), gdzie rozpoczyna naukę fiszek w trybie spaced repetition.

## 4. Układ i struktura nawigacji

- Główna nawigacja (np. pasek nawigacyjny) jest widoczna na wszystkich autoryzowanych widokach i zawiera linki do:
  - Widoku generowania fiszek (`/generate`),
  - Widoku listy fiszek (`/flashcards`),
  - Ekranu sesji powtórkowych (`/study`),
  - Panelu użytkownika (`/profile`).
- Dla mniejszych ekranów zastosowany zostanie responsywny układ (np. hamburger menu).
- Nawigacja wykorzystuje React Router do dynamicznego przełączania widoków oraz Context API do zarządzania stanem aplikacji.
- Elementy nawigacyjne są projektowane z myślą o dostępności, zapewniając odpowiedni kontrast i wsparcie dla obsługi klawiaturą.

## 5. Kluczowe komponenty

- Formularz logowania i rejestracji: Umożliwia wprowadzanie danych oraz walidację wejścia.
- Komponent TextArea: Umożliwia wprowadzenie tekstu dla funkcji generowania fiszek.
- Lista fiszek: Prezentuje zapisane fiszki z opcjami edycji inline i usuwania.
- Modal edycji: Umożliwia edycję fiszek inline z mechanizmem zatwierdzania zmian.
- Pasek nawigacji: Dostarcza spójną nawigację między widokami, widoczny na wszystkich autoryzowanych stronach.
- Komponent alertów: Wyświetla komunikaty błędów i sukcesu inline, zapewniając natychmiastową informację zwrotną.
- Komponent prezentacji fiszek: Stosowany w ekranie sesji powtórkowych, umożliwia prezentację fiszek w trybie spaced repetition z mechanizmem oceny przyswojenia.
