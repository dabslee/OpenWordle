from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import GamePreset, Game, GameAttempt
from .forms import GamePresetForm, CustomUserCreationForm
from django.utils import timezone
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth import login

@login_required
def browse_presets(request):
    query = request.GET.get('q')
    presets = GamePreset.objects.all()
    if query:
        presets = presets.filter(Q(title__icontains=query) | Q(description__icontains=query))

    pinned_presets = request.user.pinned_presets.all()

    context = {
        'presets': presets,
        'pinned_presets': pinned_presets,
    }
    return render(request, 'game/browse.html', context)

@login_required
def create_preset(request):
    if request.method == 'POST':
        form = GamePresetForm(request.POST)
        if form.is_valid():
            preset = form.save(commit=False)
            preset.creator = request.user
            preset.save()
            request.user.pinned_presets.add(preset)
            return redirect('browse_presets')
    else:
        form = GamePresetForm()
    return render(request, 'game/preset_form.html', {'form': form, 'title': 'Create Preset'})

@login_required
def edit_preset(request, slug):
    preset = get_object_or_404(GamePreset, slug=slug)
    if preset.creator != request.user:
        return redirect('browse_presets')

    if request.method == 'POST':
        form = GamePresetForm(request.POST, instance=preset)
        if form.is_valid():
            form.save()
            return redirect('browse_presets')
    else:
        form = GamePresetForm(instance=preset)
    return render(request, 'game/preset_form.html', {'form': form, 'title': 'Edit Preset'})

@login_required
def delete_preset(request, slug):
    preset = get_object_or_404(GamePreset, slug=slug)
    if preset.creator == request.user:
        preset.delete()
    return redirect('browse_presets')

@login_required
def toggle_pin(request, slug):
    preset = get_object_or_404(GamePreset, slug=slug)
    if preset in request.user.pinned_presets.all():
        request.user.pinned_presets.remove(preset)
    else:
        request.user.pinned_presets.add(preset)
    return redirect('browse_presets')

@login_required
def play_game(request, slug=None):
    if slug is None:
        preset = get_object_or_404(GamePreset, slug='')
    else:
        preset = get_object_or_404(GamePreset, slug=slug)

    game = Game.get_or_create_daily_game(preset)

    attempt, created = GameAttempt.objects.get_or_create(
        user=request.user,
        game=game
    )

    if request.method == 'POST':
        guess = request.POST.get('guess', '').strip().upper()
        if len(guess) == preset.letter_count and len(attempt.guesses) < preset.max_guesses:
            valid_words = [w.strip().upper() for w in preset.word_bank.replace(',', ' ').split()]
            if guess in valid_words:
                guesses = attempt.guesses
                guesses.append(guess)
                attempt.guesses = guesses
                attempt.save()
            else:
                messages.error(request, "Not in word bank")

        if slug:
            return redirect('play_game', slug=slug)
        else:
            return redirect('play_game_default')

    is_solved = False
    if attempt.guesses and attempt.guesses[-1] == game.answer:
        is_solved = True

    is_failed = len(attempt.guesses) >= preset.max_guesses and not is_solved

    context = {
        'game': game,
        'preset': preset,
        'attempt': attempt,
        'guesses': attempt.guesses,
        'is_solved': is_solved,
        'is_failed': is_failed,
        'remaining_guesses': preset.max_guesses - len(attempt.guesses),
    }
    return render(request, 'game/game.html', context)

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('play_game_default')
    else:
        form = CustomUserCreationForm()
    return render(request, 'game/signup.html', {'form': form})
