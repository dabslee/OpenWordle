# Enhanced Wordle Clone

A Django-based web application that simulates Wordle with enhanced features, including custom game presets, user accounts, and guest play support.

## Features

-   **Classic Wordle**: Play the standard 5-letter, 6-guess game.
-   **Game Presets**: Create and play custom Wordle variations with different word lengths, guess limits, and word banks.
-   **Daily Challenge**: For any given preset, a unique daily puzzle is generated that is the same for all users.
-   **User Accounts**:
    -   Sign up and log in to track your progress across devices.
    -   Pin your favorite game presets for quick access.
    -   Create and manage your own game presets.
-   **Guest Mode**: Play without an account! Progress is saved locally in your browser.

## Tech Stack

-   **Backend**: Python, Django 6.0
-   **Database**: SQLite (default)
-   **Frontend**: HTML5, CSS3, JavaScript (Vanilla)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Create a virtual environment (optional but recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```

6.  **Access the application:**
    Open your browser and navigate to `http://localhost:8000`.

## Testing

To run the automated tests:

```bash
python manage.py test
```
