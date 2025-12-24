from django import template
from game.utils import wordle_colorize as utils_wordle_colorize

register = template.Library()

@register.filter
def wordle_colorize(guess, answer):
    return utils_wordle_colorize(guess, answer)

@register.filter
def times(number):
    try:
        return range(int(number))
    except (ValueError, TypeError):
        return []
