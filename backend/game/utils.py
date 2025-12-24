def wordle_colorize(guess, answer):
    result = []
    answer_letters = list(answer)
    guess_letters = list(guess)

    # First pass: find Greens
    states = ['absent'] * len(guess)
    for i, letter in enumerate(guess_letters):
        if i < len(answer_letters) and letter == answer_letters[i]:
            states[i] = 'correct'
            answer_letters[i] = None # Consumed

    # Second pass: find Yellows
    for i, letter in enumerate(guess_letters):
        if states[i] == 'absent': # Only check if not already green
            if letter in answer_letters:
                states[i] = 'present'
                answer_letters[answer_letters.index(letter)] = None # Consumed one instance

    return zip(guess, states)
